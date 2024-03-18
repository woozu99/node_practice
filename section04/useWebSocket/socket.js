const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({server});

    wss.on('connection', (ws, req) => {//처음 시작시 연결을 맺는 부분. 연결을 맺으면 아래 부분을 설정한다.

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip);
        
        //메시지 받기
        ws.on('message', (message) => {
            console.log(message.toString);//버퍼로 들어오기 때문에 toString해야 인간이 읽을 수 있다.*websocket 7버전에서는 string으로 들어왔는데 8버전에서 바뀜.
        });
        
        ws.on('error', console.error);
        
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval); //인터벌 설정시 반드시!! 연결 끝날때 끊어줄 것. 안그러면 메모리 터짐
        });

        ws.interval = setInterval(()=>{
            if(ws.readyState === ws.OPEN){
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.'); //메시지 보내기
            }
        }, 3000);
    });
}