import { createReadStream } from 'fs';
import parse from 'csv-parse';
import { resolve } from 'path';

let Slcsp_Array, RateArea_ZipCode_Map, RateAreaSilvers_Rates_Map;

const Csv2Array_Promise = (async (csvFilepath) => {
  return new Promise((resolve) => {
    const csvData = [];
    createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => { csvData.push(csvRow); })
      .on('end', () => { resolve(csvData); });
  });
})

Csv2Array_Promise('slcsp.csv').then((value) => { Slcsp_Array = value; });

const RateArea_ZipCode_Map_Promise = ((csvFilepath) => {
  return new Promise((resolve) => {
    const RateArea_ZipCode_Map = new Map();
    createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => {
        if (RateArea_ZipCode_Map.has(csvRow[4]))
          RateArea_ZipCode_Map.set(csvRow[4], [...RateArea_ZipCode_Map.get(csvRow[4]), csvRow[0]])
        else
          RateArea_ZipCode_Map.set(csvRow[4], [csvRow[0]])
      })
      .on('end', () => { resolve(RateArea_ZipCode_Map) });
  })
});

RateArea_ZipCode_Map_Promise('zips.csv')
  .then((value) => {
    RateArea_ZipCode_Map = value;
    console.log(RateArea_ZipCode_Map);
    // for (let i = 0; i < 10; i++) { console.log(`RateArea_ZipCode_Map.get(${i})`, RateArea_ZipCode_Map.get(i)); }
  });

const Plans_Silvers_Promise = ((csvFilepath) => {
  return new Promise((resolve) => {
    const RateAreaSilvers_Rates_Map = new Map();
    createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => {
        if (csvRow[2] != 'Silver') return;
        if (RateAreaSilvers_Rates_Map.has(csvRow[4]))
          RateAreaSilvers_Rates_Map.set(csvRow[4], [...RateAreaSilvers_Rates_Map.get(csvRow[4]), csvRow[3]]);
        else
          RateAreaSilvers_Rates_Map.set(csvRow[4], [csvRow[3]]);
      }).on('end', () => { resolve(RateAreaSilvers_Rates_Map) })
  })
})

Plans_Silvers_Promise('plans.csv').then((value) => {
  RateAreaSilvers_Rates_Map = value;
  console.log(RateAreaSilvers_Rates_Map);
})