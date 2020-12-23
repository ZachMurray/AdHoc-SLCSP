import { createReadStream } from 'fs';
import parse from 'csv-parse';

let SlcspCsv_Array, ZipsCsv_Map, PlansCsv_Map;

const SlcspCsv_Array_Promise = (csvFilepath => new Promise(resolve => {
  const csvData = []
  createReadStream(csvFilepath)
    .pipe(parse({ delimiter: ',' }))
    .on('data', csvRow => csvData.push(csvRow))
    .on('end', () => { resolve(csvData) })
}))

const Csv_Map_Promise = (csvFilepath => new Promise(resolve => {
  const csvData = new Map()
  createReadStream(csvFilepath)
    .pipe(parse({ delimiter: ',' }))
    .on('data', csvRow => csvData.set(csvRow[0], csvRow.slice(1)))
    .on('end', () => resolve(csvData))
}))

Promise.all([
  SlcspCsv_Array_Promise('slcsp.csv').then(value => SlcspCsv_Array = value),
  Csv_Map_Promise('zips.csv').then(value => ZipsCsv_Map = value),
  Csv_Map_Promise('plans.csv').then(value => PlansCsv_Map = value)
])
  .then(() => {
    // console.log(SlcspCsv_Array)
    // console.log(ZipsCsv_Map)
    console.log(PlansCsv_Map)
  })