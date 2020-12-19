import { createReadStream } from 'fs';
import parse from 'csv-parse';

const csvPromise = (async (csvFilepath) => {
  return new Promise((resolve) => {
    const csvData = [];
    createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => { csvData.push(csvRow); })
      .on('end', () => { resolve(csvData); });
  });
})

let SLCSP_Array, Plans_Array, Zips_Array;

Promise.all([
  csvPromise('slcsp.csv').then((value) => { SLCSP_Array = value; }),
  csvPromise('plans.csv').then((value) => { Plans_Array = value; }),
  csvPromise('zips.csv').then((value) => { Zips_Array = value; })
]).then(() => {
  const ZipsSet_ZipArray = [...new Set(SLCSP_Array.map(SLCSP_Entry => { return SLCSP_Entry[0] }))];
  const Zips_Array_Applicable = Zips_Array.filter(Zip_Entry => ZipsSet_ZipArray.includes(Zip_Entry[0]));
  for (let i = 0; i < ZipsSet_ZipArray.length; i++)
    ZipsSet_ZipArray[i] = ([ZipsSet_ZipArray[i], Zips_Array_Applicable.filter(Zip_Entry => Zip_Entry[0] == ZipsSet_ZipArray[i])]);

  for (let i = 0; i < ZipsSet_ZipArray.length; i++)
    for (let j = 1; j < ZipsSet_ZipArray[i].length; j++)
      for (let k = 0; k < ZipsSet_ZipArray[i][j].length; k++)
        ZipsSet_ZipArray[i][j][k] = ZipsSet_ZipArray[i][j][k][ZipsSet_ZipArray[i][j][k].length - 1];
  for (let i = 1; i < ZipsSet_ZipArray.length; i++)
    for (let j = 1; j < ZipsSet_ZipArray[i].length; j++)
      ZipsSet_ZipArray[i][j] = [...new Set(ZipsSet_ZipArray[i][j].map((x) => { return x }))];
  return ZipsSet_ZipArray;
}).then((ZipCode_RateAreas_Array) => {
  for (let i = 0; i < 10; i++) { console.log(`ZipCode_RateAreas_Array[${i}]`, ZipCode_RateAreas_Array[i]); }
  const Plans_Silver_Array = Plans_Array.filter(Plan_Array => Plan_Array.includes('Silver'));
  for (let i = 0; i < 10; i++) { console.log(`Plans_Silver_Array[${i}]`, Plans_Silver_Array[i]); }
  const RateArea_Rate_Array = Plans_Silver_Array.map((Plan_Silver)=>{return [Plan_Silver[4],Plan_Silver[3]]});
  for (let i = 0; i < 10; i++) { console.log(`RateArea_Rate_Array[${i}]`, RateArea_Rate_Array[i]); }
})