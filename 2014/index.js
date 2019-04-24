#!/usr/bin/env node
const csv = require('csvtojson');
const ss = require('string-similarity');

function simple(str) {
  return (str || '')
    .replace(/\s/g, '')
    .replace(/ *\([^)]*\) */g, '')
    .toLowerCase();
}

function checkAlterNames(name, alterNames) {
  const list = simple(alterNames || '').split(',');
  return list.filter(item => {
    return ss.compareTwoStrings(simple(name), simple(item)) > 0.6;
  });
}

async function main() {
  const agchos = await csv().fromFile('421-CSO.csv');
  const districts = await csv().fromFile('presidential-firstround/districts.csv');
  const provinces = await csv().fromFile('presidential-firstround/provinces.csv');

  const districtsProvs = districts.map(district => {
    const province = provinces.find(prov => {
      return prov.id == district.provId;
    });
    if (province) {
      district.provId = province.id;
      district.provName = province.name;
    }
    return district;
  });

  const results = districts.map(district => {
    const res = agchos.find(item => {
      return ss.compareTwoStrings(simple(district.name), simple(item.district)) > 0.6 || checkAlterNames(district.name, item.alterNames).length > 0;
    });
    return Object.assign(district, res || {});
  });
  console.log(JSON.stringify(results));
}
main();
