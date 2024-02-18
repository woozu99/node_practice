const fs = require('fs').promises;

fs.readFile('./sample.txt')
.then((data) =>{
    console.log(data.toString());
    return fs.writeFile('./sample.txt', 'write');
})
.then((data)=>{
    return fs.readFile('./sample.txt');
})
.then((data)=>{
    console.log(data.toString());
})
.catch((err)=>{
    throw err;
});