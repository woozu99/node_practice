const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = SocketIO(server, {path: '/socket.io'});

    io.on('connection', (socket) => {//처음 시작시 연결을 맺는 부분. 연결을 맺으면 아래 부분을 설정한다.
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
        
        socket.on('disconnect', () => {
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });

        socket.on('reply', (data) => {
            console.log(data);//socket.io에서는 toString 필요 없음
        });

        socket.on('error', console.error);
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket');
        }, 3000);


        
    });
}