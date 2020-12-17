const fs = require('fs');
const parse = require('csv-parse');

// let csvFilepath = 'slcsp.csv';
// const csvPromise = new Promise((resolve, reject) => {
//   let csvData = [];
//   fs.createReadStream(csvFilepath)
//     .pipe(parse({ delimiter: ',' }))
//     .on('data', (csvRow) => { csvData.push(csvRow); })
//     .on('end', () => { resolve(csvData); });
// });

const csvPromise = (csvFilepath) => {
  return new Promise((resolve) => {
    let csvData = [];
    fs.createReadStream(csvFilepath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (csvRow) => { csvData.push(csvRow); })
      .on('end', () => { resolve(csvData); });
  })
}

csvPromise.then((value) => {
  console.log(value);
});

