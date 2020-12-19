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
  // const SLCSP_Zip_Array = [...new Set(SLCSP_Array.map((x) => { return x[0] }))]
  // const Zips_Array_Applicable = [...Zips_Array.filter((Zip_Element) => SLCSP_Zip_Array.includes(Zip_Element[0]))];
  // const ZipsSet_ZipArray = [];
  // for (const Zip of SLCSP_Zip_Array)
  //   ZipsSet_ZipArray.push([Zip, [...Zips_Array_Applicable.filter((Zip_Element) => Zip_Element[0] == Zip)]]);

  const ZipsSet_ZipArray = [...new Set(SLCSP_Array.map((x) => { return x[0] }))];
  const Zips_Array_Applicable = [...Zips_Array.filter((Zip_Element) => ZipsSet_ZipArray.includes(Zip_Element[0]))];
  for (let i = 0; i < ZipsSet_ZipArray.length; i++)
    ZipsSet_ZipArray[i] = ([ZipsSet_ZipArray[i], [...Zips_Array_Applicable.filter((Zip_Element) => Zip_Element[0] == ZipsSet_ZipArray[i])]]);

  for (let i = 0; i < ZipsSet_ZipArray.length; i++)
    for (let j = 1; j < ZipsSet_ZipArray[i].length; j++)
      for (let k = 0; k < ZipsSet_ZipArray[i][j].length; k++)
        ZipsSet_ZipArray[i][j][k] = ZipsSet_ZipArray[i][j][k][ZipsSet_ZipArray[i][j][k].length - 1];
  for (let i = 1; i < ZipsSet_ZipArray.length; i++)
    for (let j = 1; j < ZipsSet_ZipArray[i].length; j++)
      ZipsSet_ZipArray[i][j] = [...new Set(ZipsSet_ZipArray[i][j].map((x) => { return x }))];
  return ZipsSet_ZipArray;
}).then((ZipsSet_ZipArray) => {
  for (let i = 0; i < 10; i++) { console.log(`ZipsSet_ZipArray[${i}]`, ZipsSet_ZipArray[i]); }

})

