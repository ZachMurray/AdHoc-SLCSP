import { createReadStream } from 'fs';
import parse from 'csv-parse';

const Csv2Array_Promise = (async (csvFilepath) => {
  return new Promise((resolve) => {
    const csvData = [];
    createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => { csvData.push(csvRow); })
      .on('end', () => { resolve(csvData); });
  });
})

const Csv2Map_Promise = (async (csvFilepath) => {
  return new Promise((resolve) => {
    const csvData = new Map();
    createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => { csvData.set(csvRow[0], { 'state': 1, 'county_code': 2, 'name': 3, 'rate_area': 4 }); })
      .on('end', () => { resolve(csvData); });
  });
})

let Slcsp_Array, Zips_Map, Plans_Map;
Csv2Array_Promise('slcsp.csv').then((value) => { Slcsp_Array = value; });
const ZipsMap_Promise = Csv2Map_Promise('zips.csv').then((value) => { Zips_Map = value; });
Csv2Map_Promise('plans.csv').then((value) => { Plans_Map = value; });

ZipsMap_Promise.then(() => {
  let limit = 10;
  for (let [key, value] of Zips_Map) {
    if (limit <= 0) break;
    console.log(key, '=', value);
    limit--;
  }
})
