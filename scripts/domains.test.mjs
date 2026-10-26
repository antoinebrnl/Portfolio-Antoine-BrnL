import assert from 'node:assert/strict';
import test from 'node:test';
import { authoritativeZone, dnsName, ownsName, planDnsChanges, requiredRecords } from './lib/domain-dns.mjs';

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
