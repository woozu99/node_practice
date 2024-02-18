const fs = require('fs').promises;

//읽기
fs.readFile("./sample.txt")
.then((data)=>{
    console.log(data);
    console.log(data.toString());
}).catch((err) => {
    throw err;
});

