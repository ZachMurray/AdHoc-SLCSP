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
  const SlcspZipsSet_ZipArray = [...new Set(SLCSP_Array.map(SLCSP_Entry => { return SLCSP_Entry[0] }))];
  const Zips_Array_Applicable = Zips_Array.filter(Zip_Entry => SlcspZipsSet_ZipArray.includes(Zip_Entry[0]));
  for (let i = 0; i < SlcspZipsSet_ZipArray.length; i++)
    SlcspZipsSet_ZipArray[i] = ([SlcspZipsSet_ZipArray[i], Zips_Array_Applicable.filter(Zip_Entry => Zip_Entry[0] == SlcspZipsSet_ZipArray[i])]);

  for (let i = 0; i < SlcspZipsSet_ZipArray.length; i++)
    for (let j = 1; j < SlcspZipsSet_ZipArray[i].length; j++)
      for (let k = 0; k < SlcspZipsSet_ZipArray[i][j].length; k++)
        SlcspZipsSet_ZipArray[i][j][k] = SlcspZipsSet_ZipArray[i][j][k][SlcspZipsSet_ZipArray[i][j][k].length - 1];
  for (let i = 1; i < SlcspZipsSet_ZipArray.length; i++)
    for (let j = 1; j < SlcspZipsSet_ZipArray[i].length; j++)
      SlcspZipsSet_ZipArray[i][j] = [...new Set(SlcspZipsSet_ZipArray[i][j].map((x) => { return x }))];
  return SlcspZipsSet_ZipArray;
}).then((SlcspZipCode_RateAreas_Array) => {
  // for (let i = 0; i < 10; i++) { console.log(`SlcspZipCode_RateAreas_Array[${i}]`, SlcspZipCode_RateAreas_Array[i]); }
  const Plans_Silver_Array = Plans_Array.filter(Plan_Array => Plan_Array.includes('Silver'));
  // for (let i = 0; i < 10; i++) { console.log(`Plans_Silver_Array[${i}]`, Plans_Silver_Array[i]); }
  const RateArea_Rate_Array = Plans_Silver_Array.map(Plan_Silver => { return [Plan_Silver[4], Plan_Silver[3]] });
  // for (let i = 0; i < 10; i++) { console.log(`RateArea_Rate_Array[${i}]`, RateArea_Rate_Array[i]); }
  const RateArea_Rates_Array = [... new Set(RateArea_Rate_Array.map(RateArea_Rate => { return [RateArea_Rate[0], []] }))];
  // for (let i = 0; i < 10; i++) { console.log(`RateArea_Rates_Array[${i}]`, RateArea_Rates_Array[i]); }
  RateArea_Rate_Array.forEach(RateArea_Rate => {
    for (let i = 0; i < RateArea_Rates_Array.length; i++) {
      if (RateArea_Rate[0] == RateArea_Rates_Array[i][0])
        RateArea_Rates_Array[i][1].push(RateArea_Rate[1]);
    }
  });
  // for (let i = 0; i < 10; i++) { console.log(`RateArea_Rates_Array[${i}]`, RateArea_Rates_Array[i]); }
  for (let i = 0; i < SlcspZipCode_RateAreas_Array.length; i++) {
    for (let j = 0; j < SlcspZipCode_RateAreas_Array[i].length; j++) {
      // console.log(`SlcspZipCode_RateAreas_Array[${i}][${j}]`, SlcspZipCode_RateAreas_Array[i][j]);
      for (let k = 0; k < RateArea_Rates_Array.length; k++) {
        if (SlcspZipCode_RateAreas_Array[i][j][1]==RateArea_Rates_Array[k][0]) {
          // console.log(`SlcspZipCode_RateAreas_Array[${i}][${j}][1]==RateArea_Rates_Array[${k}][0]`, SlcspZipCode_RateAreas_Array[i][j][1], RateArea_Rates_Array[k][0]);
          // console.log(`SlcspZipCode_RateAreas_Array[${i}][${j}][1], RateArea_Rates_Array[${k}][1]`, SlcspZipCode_RateAreas_Array[i][j][1], RateArea_Rates_Array[k][1]);
          // SlcspZipCode_RateAreas_Array[i][j][1] = RateArea_Rates_Array[k][1];
          SlcspZipCode_RateAreas_Array[i][j] = [SlcspZipCode_RateAreas_Array[i][j][0], RateArea_Rates_Array[k]];
        }
      } 
    }
  }
  // for (let i = 0; i < 10; i++) { console.log(`RateArea_Rates_Array[${i}]`, RateArea_Rates_Array[i]); }
  for (let i = 0; i < 10; i++) { console.log(`SlcspZipCode_RateAreas_Array[${i}]`, SlcspZipCode_RateAreas_Array[i]); }
})