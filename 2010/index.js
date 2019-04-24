#!/usr/bin/env node
const csv = require('csvtojson');
const fs = require('fs');
const { map } = require('p-iteration');

async function main() {
  const candidates = await csv().fromFile('candidates.csv');
  const candidatesNew = JSON.parse(fs.readFileSync('candidates.json', 'utf8'));

  const results = candidates.map(candidate => {
    const obj = candidatesNew.find(item => {
      return item.candidate_id === candidate.id
    })
    if (obj) {
      candidate.name_dari = candidate.name;
      candidate.name = obj.name

      candidate.ballotNumber = obj.ballot_order;
      delete candidate.ballotOrder;
      candidate.gender = obj.gender == 'Male' ? 'M' : 'F';
      candidate.party = obj.party_affiliation == 'Independent' ? 'independent' : 'Political party';
      candidate.incumbent = obj.incumbent == 'Yes' ? "1" : "0";
      candidate.electedPreliminary = obj.leader_oct == 'Yes' ? "1" : "0";
      candidate.electedFinal = obj.leader_dec == 'Yes' ? "1" : "0";
    } else {
      console.log('no found')
    }
    return candidate;

  })
  fs.writeFile('candidates-new.json', JSON.stringify(results), error => {
    console.log(error);
  });
}
main();

function compare(a, b) {
  if (a.provId < b.provId) return -1;
  if (a.provId > b.provId) return 1;
  return 0;
}
