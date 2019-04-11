#!/usr/bin/env node
const csv = require('csvtojson');
const fs = require('fs');
const { map } = require('p-iteration');

async function main() {
  const provinces = await csv().fromFile('provinces.csv');
  let candidates = [];
  let results = [];
  await map(provinces, async province => {
    const res = await csv().fromFile(`data/${province.id}-${province.name}.csv`);
    console.log(`Reading  .... ${province.id}-${province.name}.csv`);
    res.forEach(item => {
      candidates.push({
        id: item['Candidate ID'],
        name: item['Candidate Name']
      });
      results.push({
        provId: Number(province.id),
        candidateId: item['Candidate ID'],
        votes: Number(item.Votes)
      });
    });
  });
  fs.writeFile('candidates.json', JSON.stringify(candidates), error => {
    console.log(error);
  });
  fs.writeFile('results.json', JSON.stringify(results.sort(compare)), error => {
    console.log(error);
  });
}
main();

function compare(a, b) {
  if (a.provId < b.provId) return -1;
  if (a.provId > b.provId) return 1;
  return 0;
}
