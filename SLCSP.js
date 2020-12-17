const fs = require('fs');
const parse = require('csv-parse');

let csvData;
const csvPromise = ((csvFilepath) => {
  return new Promise((resolve) => {
    csvData = [];
    fs.createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => { csvData.push(csvRow); })
      .on('end', () => { resolve(csvData); });
  }).catch((error) => { console.log(error) });
})

let SLCSP_Array, Plans_Array, Zips_Array;
let SLCSP_Promise = csvPromise('slcsp.csv').then((value) => { SLCSP_Array = value; });
let Plans_Promise = csvPromise('plans.csv').then((value) => { Plans_Array = value; });
let Zips_Promise = csvPromise('zips.csv').then((value) => { Zips_Array = value; });

SLCSP_Promise.then(() => { for (let i = 0; i < 5; i++) { console.log(`SLCSP_Array[${i}]`, SLCSP_Array[i]); } });
Plans_Promise.then(() => { for (let i = 0; i < 5; i++) { console.log(`Plans_Array[${i}]`, Plans_Array[i]); } });
Zips_Promise.then(() => { for (let i = 0; i < 5; i++) { console.log(`Zips_Array[${i}]`, Zips_Array[i]); } });

let SLCSP_Array0;
SLCSP_Promise.then(() => {
  SLCSP_Array0 = [...new Set(SLCSP_Array.map((x) => { return x[0] }))]
  for (let i = 0; i < 5; i++) { console.log(`SLCSP_Array[${i}]`, SLCSP_Array0[i]) }
})