const fs = require('fs');
const path = require('path');
const mlScores = require('../public/data/ml-scores.json');

const names = {};
const allNpis = [
  ...(mlScores.topProviders || []).map(p => p.npi),
  ...(mlScores.smallProviderFlags || []).map(p => p.npi)
];

const uniqueNpis = [...new Set(allNpis)];

for (const npi of uniqueNpis) {
  const filePath = path.join(__dirname, '..', 'public', 'data', 'providers', npi + '.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (data.name) names[npi] = data.name;
    } catch {}
  }
}

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'data', 'ml-provider-names.json'),
  JSON.stringify(names, null, 2)
);
console.log('Wrote', Object.keys(names).length, 'names out of', uniqueNpis.length, 'unique NPIs');
