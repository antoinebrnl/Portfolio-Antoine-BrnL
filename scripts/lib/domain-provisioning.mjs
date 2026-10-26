import { requiredRecords } from './domain-dns.mjs';

export const domainIsActive = resource => resource?.hostState === 'HOST_ACTIVE' && resource.ownershipState === 'OWNERSHIP_ACTIVE' && ['CERT_ACTIVE', 'CERT_EXPIRING_SOON'].includes(resource.cert?.state);

function domainSnapshot(path, resource, operation) {
  if (operation?.error) throw new Error(operation.error.message);
  if (!resource && !operation) return null;
  const metadata = operation?.metadata ?? {};
  const actual = resource ?? operation?.response ?? {};
  return {
    ...actual,
    name: actual.name ?? path.replace(/^\//, ''),
    hostState: actual.hostState ?? metadata.hostState,
    ownershipState: actual.ownershipState ?? metadata.ownershipState,
    cert: { ...actual.cert, state: actual.cert?.state ?? metadata.certState },
    issues: [...(actual.issues ?? []), ...(metadata.issues ?? [])],
    _operation: operation?.name,
    _operationPending: Boolean(operation && !operation.done),
    // Hosting can expose the DNS instructions before the create operation ends.
    _operationDnsUpdates: [metadata.quickSetupUpdates, ...(metadata.liveMigrationSteps ?? []).flatMap(step => [step.dnsUpdates, step.certVerification?.dns])].filter(Boolean),
  };
}

async function getDomain(client, path) {
  try { return (await client.get(path)).body; }
  catch (error) { if (error.status === 404) return null; throw error; }
}

async function pendingOperation(client, path) {
  let pageToken = '';
  do {
    let body;
    try { body = (await client.get(`${path}/operations`, { queryParams: { pageToken } })).body; }
    catch (error) { if (error.status === 404) return null; throw error; }
    const pending = (body.operations ?? []).find(operation => !operation.done);
    if (pending) return pending;
    pageToken = body.nextPageToken ?? '';
  } while (pageToken);
  return null;
}

/** Wait briefly for instructions/resource visibility, never for DNS/HTTPS completion. */
export async function readDomainOperation(client, path, operation, { pause = ms => new Promise(done => setTimeout(done, ms)), attempts = 3 } = {}) {
  let resource;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const immediate = domainSnapshot(path, resource, operation);
    if (operation?.error) throw new Error(operation.error.message);
    resource = await getDomain(client, path);
    const snapshot = domainSnapshot(path, resource, operation);
    if (resource || requiredRecords(snapshot ?? {}).length || requiredRecords(immediate ?? {}).length || operation?.done) return snapshot;
    if (attempt + 1 < attempts) {
      await pause(1000);
      if (operation?.name) operation = (await client.get(`/${operation.name}`)).body;
    }
  }
  return domainSnapshot(path, resource, operation);
}

export async function prepareDomain(client, path, { readOnly = false, create, ...waiting } = {}) {
  const resource = await getDomain(client, path);
  if (domainIsActive(resource)) return resource;
  let operation;
  try { operation = await pendingOperation(client, path); }
  catch (error) {
    if (!(error.status === 403 && resource && requiredRecords(resource).length)) throw error;
  }
  if (resource) return domainSnapshot(path, resource, operation);
  if (!operation && !readOnly) {
    try { operation = await create(); }
    catch (error) {
      if (error.status !== 409) throw error;
      // A previous invocation may already have submitted the same creation.
      const existing = await getDomain(client, path);
      operation = await pendingOperation(client, path);
      if (existing) return domainSnapshot(path, existing, operation);
      if (!operation) throw error;
    }
  }
  return operation ? readDomainOperation(client, path, operation, waiting) : null;
}
