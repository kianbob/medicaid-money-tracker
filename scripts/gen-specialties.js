const fs = require('fs');
const path = require('path');

const providersDir = path.join(__dirname, '..', 'public', 'data', 'providers');
const outDir = path.join(__dirname, '..', 'public', 'data', 'specialties');

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const files = fs.readdirSync(providersDir).filter(f => f.endsWith('.json'));
console.log(`Reading ${files.length} provider files...`);

const bySpecialty = {};

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(providersDir, file), 'utf-8'));
    const spec = data.specialty || 'Unknown';
    if (!bySpecialty[spec]) bySpecialty[spec] = [];
    bySpecialty[spec].push({
      npi: data.npi,
      name: data.name,
      state: data.state,
      totalPaid: data.totalPaid || 0,
      totalClaims: data.totalClaims || 0,
      totalBeneficiaries: data.totalBeneficiaries || 0,
    });
  } catch (e) {
    console.error(`Error reading ${file}: ${e.message}`);
  }
}

const specialties = Object.entries(bySpecialty).map(([name, providers]) => {
  providers.sort((a, b) => b.totalPaid - a.totalPaid);
  const totalPaid = providers.reduce((s, p) => s + p.totalPaid, 0);
  return {
    slug: slugify(name),
    name,
    providerCount: providers.length,
    totalPaid,
    topProviders: providers.slice(0, 10).map(p => ({
      npi: p.npi, name: p.name, state: p.state, totalPaid: p.totalPaid,
    })),
    _allProviders: providers,
  };
}).sort((a, b) => b.totalPaid - a.totalPaid);

// Write index
const index = specialties.map(({ _allProviders, ...rest }) => rest);
fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'data', 'specialties.json'),
  JSON.stringify(index, null, 2)
);
console.log(`Wrote specialties.json with ${index.length} specialties`);

// Write individual files
fs.mkdirSync(outDir, { recursive: true });
for (const spec of specialties) {
  const detail = spec._allProviders.slice(0, 100).map(p => ({
    npi: p.npi, name: p.name, state: p.state,
    totalPaid: p.totalPaid, totalClaims: p.totalClaims,
    totalBeneficiaries: p.totalBeneficiaries,
  }));
  fs.writeFileSync(
    path.join(outDir, `${spec.slug}.json`),
    JSON.stringify({ slug: spec.slug, name: spec.name, providerCount: spec.providerCount, totalPaid: spec.totalPaid, providers: detail }, null, 2)
  );
}
console.log(`Wrote ${specialties.length} individual specialty files`);
