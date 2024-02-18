const fs = require('fs').promises;

//쓰기
fs.writeFile("./sample.txt", '내용쓰기')
.then((data)=>console.log(data))
.catch((err)=>{throw err;});