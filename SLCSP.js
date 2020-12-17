const fs = require('fs');
const parse = require('csv-parse');

const csvPromise = (csvFilepath) => {
  return new Promise((resolve) => {
    let csvData = [];
    fs.createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => { csvData.push(csvRow); })
      .on('end', () => { resolve(csvData); });
  })
}

let SLCSP_Data = csvPromise('slcsp.csv').then((value) => { return value; });
let Plans_Data = csvPromise('slcsp.csv').then((value) => { return value; });
let ZIPs_Data = csvPromise('slcsp.csv').then((value) => { return value; });

SLCSP_Data.then((value)=>{console.log(`\nSLCSP_Data:\n`, value)});
Plans_Data.then((value)=>{console.log(`\nPlans_Data:\n`, value)});
ZIPs_Data.then((value)=>{console.log(`\nZIPs_Data:\n`, value)});
