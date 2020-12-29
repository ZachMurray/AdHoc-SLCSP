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
  const SlcspZips_ZipsRateAreas_Map = new Map(SLCSP_Array.map(Slcsp => [Slcsp[0], []]));
  for (const Zip_Entry of Zips_Array) {
    if (!SlcspZips_ZipsRateAreas_Map.has(Zip_Entry[0])) continue;
    SlcspZips_ZipsRateAreas_Map.set(
      Zip_Entry[0],
      [
        ...SlcspZips_ZipsRateAreas_Map.get(Zip_Entry[0]),
        Zip_Entry[4]
      ]
    )
  }
  const SlcspZips_Plans_Map = new Map();
  SlcspZips_ZipsRateAreas_Map.forEach((RateAreas, Zip) => {
    // console.log('RateAreas', RateAreas)
    const Plans = SlcspZips_Plans_Map.get(Zip) ?? new Array()
    // console.log('Plans', Plans)
    for (let Plan_Entry of Plans_Array) {
      if (Plan_Entry[2] != 'Silver' || !RateAreas.includes(Plan_Entry[4])) continue;
      Plans.push(Plan_Entry)
    }
    SlcspZips_Plans_Map.set(Zip, [...new Set(Plans)]);
  })
  // console.log(SlcspZips_Plans_Map);
  const SlcspZips_Slcsp_Array = [];
  SlcspZips_Plans_Map.forEach((Plans, Zip) => {
    // console.log(Plans);
    // const Plans_Rate_Array = Plans.map(Plan => { return Plan[3] })
    // SlcspZips_Slcsp_Array.push([Zip, Plans_Rate_Array[2]])
    SlcspZips_Slcsp_Array.push([Zip, Plans.map(Plan => { return Plan[3] })[2]])
  })
  SlcspZips_Slcsp_Array[0] = SLCSP_Array[0]
  console.log(SlcspZips_Slcsp_Array);
  return SlcspZips_Slcsp_Array;
})