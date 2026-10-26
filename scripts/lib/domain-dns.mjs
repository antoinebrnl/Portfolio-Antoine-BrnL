const allowedTypes = new Set(["A", "AAAA", "CNAME", "TXT", "CAA"]);
export const dnsName = value => value.toLowerCase().replace(/\.$/, "") + ".";
export const ownsName = (name, domain) => dnsName(name) === dnsName(domain) || dnsName(name).endsWith("." + dnsName(domain));

export function dnsValue(type, value) {
  if (type === "TXT") {
    if (value.startsWith('"')) return value;
    return JSON.stringify(value);
  }
  return type === "CNAME" ? dnsName(value) : value;
}

/** All values come from Hosting, including optional DNS certificate challenges. */
export function requiredRecords(domain) {
  const updates = [domain.requiredDnsUpdates, domain.cert?.verification?.dns, ...(domain._operationDnsUpdates ?? [])];
  const records = updates.flatMap(update => [
    ...(update?.desired ?? []), ...(update?.discovered ?? []),
  ]).flatMap(set => set.records ?? []);
  return [...new Map(records.map(record => [JSON.stringify(record), record])).values()];
}

export function authoritativeZone(zones, domain, nameservers) {
  const candidates = zones.filter(zone => zone.visibility !== "private" && ownsName(domain, zone.dnsName))
    .sort((a, b) => b.dnsName.length - a.dnsName.length);
  const zone = candidates[0];
  if (!zone) throw new Error(`Aucune zone publique Cloud DNS pour ${domain} dans ce projet.`);
  const actual = [...new Set(nameservers.map(dnsName))].sort();
  const expected = [...new Set((zone.nameServers ?? []).map(dnsName))].sort();
  if (!actual.length || JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Les serveurs DNS publics de ${domain} ne correspondent pas à la zone Cloud DNS ${zone.name}.`);
  }
  return zone;
}

/** Change only Hosting's explicit instructions, merging TXT records and preserving mail. */
export function planDnsChanges(existing, instructions, domains) {
  const key = record => `${dnsName(record.name ?? record.domainName)} ${record.type}`;
  const originals = new Map(existing.map(record => [key(record), record]));
  const pending = new Map();
  for (const instruction of instructions) {
    if (!['ADD', 'REMOVE'].includes(instruction.requiredAction)) continue;
    const name = dnsName(instruction.domainName);
    if (!domains.some(domain => ownsName(name, domain)) || !allowedTypes.has(instruction.type)) {
      throw new Error(`Instruction DNS hors périmètre : ${name} ${instruction.type}.`);
    }
    if (['A', 'AAAA', 'CAA'].includes(instruction.type) && !domains.some(domain => dnsName(domain) === name)) {
      throw new Error(`Instruction DNS hors périmètre du site Web : ${name}.`);
    }
    if (instruction.type === 'TXT' && (/_(?:domainkey|dmarc|mta-sts|smtp)\./i.test(name) || /v=(?:spf1|DKIM1|DMARC1|STSv1|TLSRPTv1|BIMI1)/i.test(instruction.rdata))) {
      throw new Error(`Instruction touchant la messagerie : ${name}. Aucun changement envoyé.`);
    }
    const id = key(instruction);
    const original = originals.get(id);
    if (original?.routingPolicy) throw new Error(`La règle de routage de ${id} nécessite une vérification manuelle.`);
    if (!pending.has(id)) pending.set(id, { name, type: instruction.type, ttl: original?.ttl ?? 300, values: new Set((original?.rrdatas ?? []).map(value => dnsValue(instruction.type, value))) });
  }
  // Remove first so an instruction order cannot accidentally drop a required value.
  for (const action of ['REMOVE', 'ADD']) {
    for (const instruction of instructions.filter(record => record.requiredAction === action)) {
      const record = pending.get(key(instruction));
      const value = dnsValue(instruction.type, instruction.rdata);
      if (action === 'ADD') record.values.add(value);
      else record.values.delete(value);
    }
  }
  const change = { additions: [], deletions: [] };
  const final = new Map(existing.map(record => [key(record), record]));
  for (const [id, record] of pending) {
    const before = originals.get(id);
    const after = { name: record.name, type: record.type, ttl: record.ttl, rrdatas: [...record.values].sort() };
    if (['A', 'AAAA'].includes(record.type) && instructions.some(item => key(item) === id && item.requiredAction === 'ADD')) {
      const permitted = new Set(instructions.filter(item => key(item) === id && item.requiredAction !== 'REMOVE').map(item => dnsValue(item.type, item.rdata)));
      if (after.rrdatas.some(value => !permitted.has(value))) {
        throw new Error(`Des adresses existantes de ${id} ne sont pas couvertes par les instructions Firebase. Aucun changement envoyé.`);
      }
    }
    if (JSON.stringify([...(before?.rrdatas ?? [])].sort()) === JSON.stringify(after.rrdatas)) continue;
    if (before) change.deletions.push({ name: before.name, type: before.type, ttl: before.ttl, rrdatas: before.rrdatas });
    if (after.rrdatas.length) { change.additions.push(after); final.set(id, after); }
    else final.delete(id);
  }
  for (const record of change.additions) {
    const atName = [...final.values()].filter(item => dnsName(item.name) === record.name);
    if (atName.some(item => item.type === 'CNAME') && atName.some(item => item.type !== 'CNAME')) {
      throw new Error(`Le CNAME ${record.name} entre en conflit avec un autre enregistrement. Aucun changement envoyé.`);
    }
  }
  return change;
}
