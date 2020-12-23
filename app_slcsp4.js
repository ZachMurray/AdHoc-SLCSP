import { createReadStream } from 'fs';
import parse from 'csv-parse';

let SlcspZips_Rates_Array, ZipCode_RateArea_Map, RateAreaSilvers_Rates_Map;

const Csv2Array_Promise = (csvFilepath => new Promise(resolve => {
  const csvData = [];
  createReadStream(csvFilepath)
    .pipe(parse({ delimiter: ',' }))
    .on('data', (csvRow) => { csvData.push(csvRow); })
    .on('end', () => { resolve(csvData); });
}))

const ZipCode_RateArea_Map_Promise = (csvFilepath => new Promise(resolve => {
  const ZipCode_RateArea_Map = new Map();
  createReadStream(csvFilepath)
    .pipe(parse({ delimiter: ',' }))
    .on('data', (csvRow) => {
      if (ZipCode_RateArea_Map.has(csvRow[0]))
        ZipCode_RateArea_Map.set(csvRow[0], [...ZipCode_RateArea_Map.get(csvRow[0], csvRow[4])])
      else
        ZipCode_RateArea_Map.set(csvRow[0], [csvRow[4]])
    })
    .on('end', () => { resolve(ZipCode_RateArea_Map); });
}));

const RateAreaSilvers_Rates_Promise = (csvFilepath => new Promise(resolve => {
  const RateAreaSilvers_Rates_Map = new Map();
  createReadStream(csvFilepath)
    .pipe(parse({ delimiter: ',' }))
    .on('data', (csvRow) => {
      if (csvRow[2] != 'Silver')
        return;
      if (RateAreaSilvers_Rates_Map.has(csvRow[4]))
        RateAreaSilvers_Rates_Map.set(csvRow[4], [...RateAreaSilvers_Rates_Map.get(csvRow[4]), csvRow[3]]);

      else
        RateAreaSilvers_Rates_Map.set(csvRow[4], [csvRow[3]]);
    }).on('end', () => { resolve(RateAreaSilvers_Rates_Map); });
}));

Promise.all([
  Csv2Array_Promise('slcsp.csv').then(value => { SlcspZips_Rates_Array = value }),
  ZipCode_RateArea_Map_Promise('zips.csv').then(value => { ZipCode_RateArea_Map = value }),
  RateAreaSilvers_Rates_Promise('plans.csv').then(value => { RateAreaSilvers_Rates_Map = value })
]).then(() => {
  
})