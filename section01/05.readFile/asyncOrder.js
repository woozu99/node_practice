const fs = require('fs');

fs.readFile('./sample.txt', (err,data)=>{
    if(err){
        throw err;
    }
    console.log(data.toString());
    fs.writeFile('./sample.txt', 'write1', (err, data) =>{
        if(err){
            throw err;
        }
        fs.readFile('./sample.txt', (err, data)=>{
            if(err){
                throw err;
            }
            console.log(data.toString());
        })
    })
})