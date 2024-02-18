const fs = require('fs');

const writeStream = fs.createWriteStream("./writeFile.txt");

writeStream.on('finish', ()=>{
    console.log('done');
});

writeStream.write('글쓰기.\n');
writeStream.write('글쓰기 한번 더 쓰기.\n');
writeStream.write('글쓰기.');