#!/usr/bin/env node
const csv = require('csvtojson');
const fs = require('fs');

async function main() {
    const candidates = await csv().fromFile('/Users/ruben/apps/af-elections-data/2009-presidential/candidates.csv');
    const results = await csv().fromFile('/Users/ruben/apps/af-elections-data/2009-presidential/results.csv');
    const districts = JSON.parse(fs.readFileSync('/Users/ruben/apps/af-elections-data/af-admin-areas-2018-agcho/districts-centerpoints.geojson', 'utf8'));
    const output = districts.features.map(district => {
        const filteredResults = results.filter(item => {
            return Number(item.distId) === Number(district.properties.dist_id)
        })
        const candidatesVotes = candidates.map(candidate => {
            candidate.votes = 0;
            filteredResults.forEach(item => {
                if (item.candidate === candidate.id) {
                    candidate.votes += Number(item.votes)
                }
            })
            return candidate;
        })
        district.properties.totalVotes = 0;
        candidatesVotes.forEach(candidate => {
            district.properties[`candidate${candidate.id}_id`] = candidate.id;
            district.properties[`candidate${candidate.id}_votes`] = candidate.votes;
            district.properties[`candidate${candidate.id}_name`] = candidate.name;
            district.properties.totalVotes += candidate.votes;
        });
        return district;
    })
    fs.writeFile('output.json', JSON.stringify({
        "type": "FeatureCollection",
        "features": output
    }), error => {
        console.log(error);
    });
}
main();

