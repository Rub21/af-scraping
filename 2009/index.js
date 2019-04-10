const fs = require('fs')
const csv = require('async-csv')
const axios = require('axios');
const cheerio = require('cheerio')
const { map } = require('p-iteration');

async function main() {
    try {
        // Reading districts
        const districts = await csv.parse(fs.readFileSync('districts.csv', 'utf8'), { columns: true })
        let provincesId = districts.map(district => {
            return district.provId;
        })
        provincesId = [...new Set(provincesId)];
        const results = await map(provincesId, async province => {
            try {
                const page = await axios(`https://afghanistanelectiondata.org/election/2009/province/${province}`);
                const listDistrict = getData(page.data);
                // at this stage we have an array of objects
                const list = listDistrict.map(item => {
                    const districtId = item.link.replace('/election/2009/district/', '');
                    let districtObj = districts.find(d => {
                        return d.id == districtId
                    })
                    districtObj.name = item.title;
                    return districtObj;
                })
                return list;
            } catch (e) {
                console.error(e);
            }
        })
        console.log(JSON.stringify(results.flat(2)));
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}


let getData = html => {
    data = [];
    const $ = cheerio.load(html);
    $('table.views-table tr td a').each((i, elem) => {
        data.push({
            title: $(elem).text(),
            link: $(elem).attr('href')
        });
    });
    return data;
}

main()

