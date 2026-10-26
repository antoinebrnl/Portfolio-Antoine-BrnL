import { createRequire } from "node:module";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resolver } from "node:dns/promises";
import { authoritativeZone, dnsName, ownsName, planDnsChanges, requiredRecords } from "./lib/domain-dns.mjs";
import { domainIsActive, prepareDomain, readDomainOperation } from './lib/domain-provisioning.mjs';

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('pnpm run domaines [--apply | --status] [--dns-project ID] [--domain NOM]\nSans option : ajoute les domaines à Firebase et affiche le plan DNS.\n--apply : applique le plan dans les zones Cloud DNS déjà déléguées.\n--status : consulte seulement les états DNS et HTTPS.');
  process.exit(0);
}
const apply = args.includes('--apply');
const statusOnly = args.includes('--status');
let dnsProject;
let onlyDomain;
for (let i = 0; i < args.length; i++) {
  if (['--apply', '--status'].includes(args[i])) continue;
  if (args[i] === '--dns-project' && args[i + 1] && /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(args[i + 1])) dnsProject = args[++i];
  else if (args[i] === '--domain' && args[i + 1]) onlyDomain = args[++i];
  else throw new Error(`Option non reconnue : ${args[i]}. Utilise --help.`);
}
if (apply && statusOnly) throw new Error('--apply et --status sont exclusifs.');

const project = JSON.parse(await readFile(join(root, '.firebaserc'), 'utf8')).projects.default;
const site = JSON.parse(await readFile(join(root, 'firebase.json'), 'utf8')).hosting.site;
const configuration = JSON.parse(await readFile(join(root, 'hosting-domains.json'), 'utf8'));
const domains = configuration.domains.filter(item => !onlyDomain || item.domain === onlyDomain);
if (!domains.length) throw new Error('Le domaine demandé ne fait pas partie de hosting-domains.json.');
dnsProject ??= project;
const parent = `/projects/${project}/sites/${site}`;
const require = createRequire(import.meta.url);
// Version pinned in package.json. Reuse Firebase's local OAuth/ADC authentication.
const { selectAccount, setActiveAccount } = require('firebase-tools/lib/auth');
const { requireAuth } = require('firebase-tools/lib/requireAuth');
const { Client } = require('firebase-tools/lib/apiv2');
function projectClient(urlPrefix, apiVersion, quotaProject) {
  const client = new Client({ urlPrefix, apiVersion, auth: true });
  const options = extra => ({ ...extra, ignoreQuotaProject: true, headers: { 'x-goog-user-project': quotaProject } });
  return {
    get: (path, extra) => client.get(path, options(extra)),
    post: (path, body, extra) => client.post(path, body, options(extra)),
    patch: (path, body, extra) => client.patch(path, body, options(extra)),
  };
}
const hosting = projectClient('https://firebasehosting.googleapis.com', 'v1beta1', project);
const dns = projectClient('https://dns.googleapis.com', 'dns/v1', dnsProject);
const billing = projectClient('https://cloudbilling.googleapis.com', 'v1', project);
const resolver = new Resolver({ timeout: 4000, tries: 1 });
const report = { project, site, dnsProject, generatedAt: new Date().toISOString(), domains: [], plans: [], warnings: [] };

function apiError(error) {
  return error.context?.body?.error?.message ?? error.original?.context?.body?.error?.message ?? error.message;
}
async function listAll(client, path, field) {
  const all = [];
  let pageToken = '';
  do {
    const body = (await client.get(path, { queryParams: { pageToken } })).body;
    all.push(...(body[field] ?? []));
    pageToken = body.nextPageToken ?? '';
  } while (pageToken);
  return all;
}

try {
  const options = { project, projectRoot: root, nonInteractive: true };
  const account = selectAccount(undefined, root);
  if (account) setActiveAccount(options, account);
  await requireAuth(options);
  console.log(`Projet : ${project} | Site : ${site}${account ? ` | Compte : ${account.user.email}` : ''}`);
  await hosting.get(parent);
  try {
    const result = (await billing.get(`/projects/${project}/billingInfo`)).body;
    report.billingEnabled = result.billingEnabled;
    console.log(`Facturation Google Cloud du projet : ${result.billingEnabled ? 'activée' : 'désactivée'}. Les crédits et leur éligibilité restent à vérifier dans Facturation.`);
  } catch (error) {
    console.log(`Informations de facturation non accessibles : ${apiError(error)}. Aucun changement de facturation effectué.`);
  }
  for (const item of domains) {
    const path = `${parent}/customDomains/${encodeURIComponent(item.domain)}`;
    let resource = await prepareDomain(hosting, path, {
      readOnly: statusOnly,
      create: async () => {
        console.log(`Ajout de ${item.domain}${item.redirectTarget ? ` → ${item.redirectTarget}` : ''}…`);
        return (await hosting.post(`${parent}/customDomains`, {
          certPreference: 'GROUPED', ...(item.redirectTarget ? { redirectTarget: item.redirectTarget } : {}),
        }, { queryParams: { customDomainId: item.domain } })).body;
      },
    });
    if (!resource) { console.log(`${item.domain} : pas encore ajouté à Firebase.`); continue; }
    if (resource._operationPending) console.log(`${item.domain} : demande déjà enregistrée chez Google, DNS et HTTPS en préparation.`);
    if (resource.deleteTime) throw new Error(`${item.domain} est en cours de suppression chez Firebase. Vérifie son état avant de continuer.`);
    if ((resource.redirectTarget ?? '') !== (item.redirectTarget ?? '')) {
      console.log(`Redirection prévue pour ${item.domain} : ${item.redirectTarget || 'aucune'}.`);
      if (apply && !resource._operationPending) {
        const operation = (await hosting.patch(path, { name: resource.name, redirectTarget: item.redirectTarget ?? '' }, { queryParams: { updateMask: 'redirectTarget' } })).body;
        resource = await readDomainOperation(hosting, path, operation);
      }
    }
    const records = requiredRecords(resource);
    const connected = domainIsActive(resource);
    if (!records.length && !connected) report.warnings.push(`${item.domain} : Firebase prépare encore les instructions DNS ou le certificat. Relance la commande dans quelques minutes.`);
    report.domains.push({ domain: item.domain, hostState: resource.hostState, ownershipState: resource.ownershipState, certificate: resource.cert?.state, operation: resource._operation, operationPending: resource._operationPending, records, issues: [...(resource.issues ?? []), ...(resource.cert?.issues ?? [])].map(issue => issue.message) });
    console.log(`\n${item.domain} : DNS ${resource.hostState}, propriété ${resource.ownershipState}, HTTPS ${resource.cert?.state ?? 'en préparation'}`);
    console.table(records.filter(record => (record.requiredAction ?? 'NONE') !== 'NONE').map(record => ({ action: record.requiredAction, type: record.type, nom: record.domainName, valeur: record.rdata })));
    for (const issue of [...(resource.issues ?? []), ...(resource.cert?.issues ?? [])]) console.log(`Google : ${issue.message}`);
  }

  if (!statusOnly) {
    let zones = [];
    try { zones = await listAll(dns, `/projects/${dnsProject}/managedZones`, 'managedZones'); }
    catch (error) {
      report.warnings.push(`Cloud DNS inaccessible dans ${dnsProject} : ${apiError(error)}. Pour modifier ses zones, le compte doit notamment disposer du rôle Administrateur DNS (roles/dns.admin). Si les zones sont dans un autre projet, utilise --dns-project ID.`);
    }
    // Prepare and validate every zone before sending the first DNS transaction.
    for (const item of report.domains) {
      try {
        const candidates = zones.filter(zone => zone.visibility !== 'private' && ownsName(item.domain, zone.dnsName)).sort((a,b) => b.dnsName.length - a.dnsName.length);
        const lookup = candidates[0]?.dnsName ?? item.domain;
        const nameservers = await resolver.resolveNs(lookup);
        item.nameservers = nameservers;
        console.log(`Serveurs DNS publics de ${item.domain} : ${nameservers.join(', ')}`);
        const zone = authoritativeZone(zones, item.domain, nameservers);
        const existing = await listAll(dns, `/projects/${dnsProject}/managedZones/${zone.name}/rrsets`, 'rrsets');
        const change = planDnsChanges(existing, item.records, [item.domain]);
        report.plans.push({ domain: item.domain, zone: zone.name, nameservers: nameservers.map(dnsName), change });
        console.log(`\nZone autoritaire vérifiée : ${zone.name} (${item.domain}).`);
        console.table(['deletions', 'additions'].flatMap(action => change[action].map(record => ({ action: action === 'additions' ? 'AJOUT' : 'REMPLACEMENT/RETRAIT', type: record.type, nom: record.name, valeurs: record.rrdatas.join(' | ') }))));
      } catch (error) { report.warnings.push(`${item.domain} : ${apiError(error)}`); }
    }
    if (apply && report.warnings.length) {
      console.log('\nAucun changement DNS envoyé : le plan complet ne peut pas encore être validé.');
      process.exitCode = 1;
    } else if (apply) {
      for (const plan of report.plans) {
        if (!plan.change.additions.length && !plan.change.deletions.length) continue;
        const result = (await dns.post(`/projects/${dnsProject}/managedZones/${plan.zone}/changes`, plan.change)).body;
        console.log(`DNS envoyés pour ${plan.domain}, transaction ${result.id} (${result.status}).`);
      }
      console.log('\nLes DNS et certificats peuvent encore être en propagation. Vérifie ensuite : pnpm run domaines --status');
    } else if (report.warnings.length) console.log('\nAucun DNS modifié. Le plan reste incomplet : les points ci-dessous doivent être résolus.');
    else console.log('\nAucun DNS modifié. Pour appliquer ce plan : pnpm run domaines --apply');
  }
  for (const warning of report.warnings) console.log(`À vérifier : ${warning}`);
  if (report.warnings.length) process.exitCode = 1;
} catch (error) {
  console.error(`Raccordement interrompu : ${apiError(error)}`);
  if (error.status === 401 || /authenticate|firebase login|UNAUTHENTICATED|invalid_grant/i.test(apiError(error))) {
    console.error('Connexion Firebase : pnpm exec firebase login.');
  } else console.error('Relance pnpm run domaines pour reprendre les domaines déjà enregistrés. Le rapport est conservé dans .cache/firebase-domains-plan.json.');
  process.exitCode = 1;
} finally {
  const folder = join(root, '.cache');
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, 'firebase-domains-plan.json'), JSON.stringify(report, null, 2) + '\n');
}
