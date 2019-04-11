#!/usr/bin/env node
const csv = require('csvtojson');
const fs = require('fs');
async function main() {
  const data = await csv().fromFile('data.csv');
  let candidates = {};
  let provinces = {};
  let results = [];
  data.forEach((d, candidateId) => {
    let candidateIdFix = candidateId + 1;
    candidates[candidateIdFix] = d.candidates;
    delete d.candidates;
    Object.keys(d).forEach((p, provId) => {
      let provIdFix = provId + 1;
      provinces[provIdFix] = p;
      results.push({
        provId: provIdFix,
        candidateId: candidateIdFix,
        votes: Number(d[p].replace(/,/g, ''))
      });
    });
  });

  const candidatesObjs = Object.keys(candidates).map(index => {
    return {
      id: index,
      name: candidates[index]
    };
  });

  const provincesObjs = Object.keys(provinces).map(index => {
    return {
      id: index,
      name: provinces[index]
    };
  });

  fs.writeFile('candidates.json', JSON.stringify(candidatesObjs), error => {
    console.log(error);
  });
  fs.writeFile('provinces.json', JSON.stringify(provincesObjs), error => {
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
