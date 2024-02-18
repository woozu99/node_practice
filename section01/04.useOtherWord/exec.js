const {exec, spawn} = require('child_process');

const process = exec('dir');

process.stdout.on('data', function(data){
    console.log(data.toString());
});

process.stderr.on('data', function(data){
    console.error(data.toString());
});

/************* */

const spawnProcess = spawn('python', [test.py]);

spawnProcess.stdout.on('data', function(data){
    console.log(data.toString());
});

spawnProcess.stderr.on('data', function(data){
    console.error(data.toString());
});