const fs = require('fs');
const zlib = require('zlib');//압축

const readStream = fs.createReadStream('./readFile.txt', {highWaterMark: 16});
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream('./writeFile.gz');
readStream.pipe(zlibStream).pipe(writeStream);
