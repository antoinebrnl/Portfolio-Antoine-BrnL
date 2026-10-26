import assert from 'node:assert/strict';
import test from 'node:test';
import { authoritativeZone, dnsName, ownsName, planDnsChanges, requiredRecords } from './lib/domain-dns.mjs';
import { prepareDomain, readDomainOperation } from './lib/domain-provisioning.mjs';

const domain = 'antoine-brnl.com';
const record = (type, value, action = 'ADD', name = domain) => ({ domainName: name, type, rdata: value, requiredAction: action });
const rrset = (type, values, name = domain) => ({ name: dnsName(name), type, ttl: 600, rrdatas: values });

test('DNS ownership matches exact names and children, never lookalike domains', () => {
  assert(ownsName('_acme-challenge.antoine-brnl.com.', domain));
  assert(ownsName(domain, domain));
  assert(!ownsName('not-antoine-brnl.com', domain));
  assert(!ownsName('antoine-brnl.com.evil.test', domain));
});
test('only a public zone matching the actual nameserver delegation may be changed', () => {
  const zone = { name: 'portfolio', dnsName: domain + '.', nameServers: ['ns1.example.', 'ns2.example.'], visibility: 'public' };
  assert.equal(authoritativeZone([zone], domain, ['NS2.EXAMPLE', 'ns1.example']).name, 'portfolio');
  assert.throws(() => authoritativeZone([zone], domain, ['other.example']), /correspondent pas/);
  assert.throws(() => authoritativeZone([{ ...zone, visibility: 'private' }], domain, zone.nameServers), /Aucune zone/);
});
test('website migration preserves SPF, other TXT and all mail routing', () => {
  const existing = [rrset('A', ['192.0.2.1']), rrset('TXT', ['"v=spf1 include:example.test ~all"']), rrset('MX', ['10 mail.example.'])];
  const change = planDnsChanges(existing, [record('A', '192.0.2.1', 'REMOVE'), record('A', '192.0.2.2'), record('TXT', 'hosting-site=portfolio')], [domain]);
  assert.deepEqual(change.deletions.map(item => item.type).sort(), ['A', 'TXT']);
  assert.deepEqual(change.additions.find(item => item.type === 'TXT').rrdatas, ['"hosting-site=portfolio"', '"v=spf1 include:example.test ~all"']);
  assert.equal(change.additions.find(item => item.type === 'A').ttl, 600);
  assert.deepEqual(existing[1].rrdatas, ['"v=spf1 include:example.test ~all"']);
  assert(!change.additions.some(item => item.type === 'MX'));
});
test('repeating an applied plan produces no DNS transaction', () => {
  assert.deepEqual(planDnsChanges([rrset('TXT', ['"hosting-site=portfolio"'])], [record('TXT', 'hosting-site=portfolio')], [domain]), { additions: [], deletions: [] });
});
test('mail TXT and subordinate mail host addresses cannot be changed by a web plan', () => {
  assert.throws(() => planDnsChanges([rrset('TXT', ['"v=spf1 ~all"'])], [record('TXT', 'v=spf1 ~all', 'REMOVE')], [domain]), /messagerie/);
  assert.throws(() => planDnsChanges([], [record('TXT', 'unexpected', 'ADD', '_dmarc.' + domain)], [domain]), /messagerie/);
  assert.throws(() => planDnsChanges([], [record('A', '192.0.2.3', 'ADD', 'mail.' + domain)], [domain]), /hors périmètre/);
});
test('out-of-scope names, mail changes and complex routing fail before a transaction', () => {
  assert.throws(() => planDnsChanges([], [record('A', '192.0.2.2', 'ADD', 'other.test')], [domain]), /hors périmètre/);
  assert.throws(() => planDnsChanges([], [record('MX', '10 mail.example.', 'REMOVE')], [domain]), /hors périmètre/);
  assert.throws(() => planDnsChanges([{ ...rrset('A', ['192.0.2.1']), routingPolicy: {} }], [record('A', '192.0.2.2')], [domain]), /routage/);
});
test('unexplained website addresses and CNAME conflicts require review', () => {
  assert.throws(() => planDnsChanges([rrset('A', ['192.0.2.1'])], [record('A', '192.0.2.2')], [domain]), /pas couvertes/);
  assert.throws(() => planDnsChanges([rrset('TXT', ['"verification=keep"'])], [record('CNAME', 'site.web.app')], [domain]), /conflit/);
  assert.throws(() => planDnsChanges([rrset('CNAME', ['old.example.'])], [record('A', '192.0.2.2')], [domain]), /conflit/);
});
test('both ownership and HTTPS challenge instructions are included and deduplicated', () => {
  const ownership = record('TXT', 'hosting-site=portfolio');
  const challenge = record('TXT', 'certificate-proof', 'ADD', '_acme-challenge.' + domain);
  const data = { requiredDnsUpdates: { desired: [{ records: [ownership] }], discovered: [{ records: [ownership] }] }, cert: { verification: { dns: { desired: [{ records: [challenge] }] } } } };
  assert.equal(requiredRecords(data).length, 2);
  assert.equal(planDnsChanges([], requiredRecords(data), [domain]).additions.length, 2);
});

const domainPath = '/projects/project-test/sites/portfolio/customDomains/antoine-brnl.com';
const pending = { name: domainPath.slice(1) + '/operations/create-domain', done: false, metadata: { hostState: 'HOST_UNHOSTED', ownershipState: 'OWNERSHIP_MISSING', certState: 'CERT_PREPARING', quickSetupUpdates: { desired: [{ records: [record('TXT', 'hosting-site=portfolio')] }] } } };
const missing = () => { throw Object.assign(new Error('not found'), { status: 404 }); };

test('pending domain creation exposes DNS instructions without waiting for HTTPS completion', async () => {
  let creates = 0;
  const client = { get: async () => missing() };
  const result = await prepareDomain(client, domainPath, {
    create: async () => { creates++; return pending; },
    pause: async () => { throw new Error('Must not wait when DNS instructions are available'); },
  });
  assert.equal(creates, 1);
  assert.equal(result._operationPending, true);
  assert.equal(requiredRecords(result)[0].rdata, 'hosting-site=portfolio');
});
test('a resumed command reuses the existing creation instead of submitting it again', async () => {
  const client = { get: async path => path.endsWith('/operations') ? { body: { operations: [pending] } } : missing() };
  const result = await prepareDomain(client, domainPath, { create: async () => { throw new Error('Duplicate creation'); } });
  assert.equal(result._operation, pending.name);
  assert.equal(requiredRecords(result).length, 1);
});
test('a preparing domain without DNS instructions returns pending rather than aborting other domains', async () => {
  const operation = { ...pending, metadata: { certState: 'CERT_PREPARING' } };
  const client = { get: async path => path === domainPath ? missing() : { body: operation } };
  const result = await readDomainOperation(client, domainPath, operation, { attempts: 2, pause: async () => {} });
  assert.equal(result._operationPending, true);
  assert.equal(requiredRecords(result).length, 0);
});
test('operation metadata also provides the zero-downtime HTTPS challenge', async () => {
  const operation = { ...pending, metadata: { ...pending.metadata, liveMigrationSteps: [{ certVerification: { dns: { desired: [{ records: [record('TXT', 'proof', 'ADD', '_acme-challenge.' + domain)] }] } } }] } };
  const result = await readDomainOperation({ get: async () => missing() }, domainPath, operation);
  assert.equal(requiredRecords(result).length, 2);
});
test('Google provisioning failures and denied access remain actual errors', async () => {
  await assert.rejects(readDomainOperation({ get: async () => missing() }, domainPath, { done: true, error: { message: 'Access denied' } }), /Access denied/);
  await assert.rejects(prepareDomain({ get: async () => { throw Object.assign(new Error('Permission denied'), { status: 403 }); } }, domainPath, { readOnly: true }), /Permission denied/);
});
