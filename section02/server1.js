const http = require('http');

const server = http.createServer((req, res) => {
    //헤더
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    //내용
    res.write('<h1>Hello Node</h1>');
    res.write('<h1>Hello Server</h1>');
    res.end('<h1>the end</h1>');
})
.listen(8080, ()=>console.log('서버대기중'));//서버실행

server.on('error', (err) => {
    console.error(err);
});