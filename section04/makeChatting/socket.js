const SocketIO = require('socket.io');
const {removeRoom} = require('./service')

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, {path: '/socket.io'});//기본 네임스페이스

    app.set('io', io);

    const room = io.of('/room');//socket.io/room 네임 스페이스
    const chat = io.of('/chat');

    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
    chat.use(wrap(sessionMiddleware));

    room.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
        });
    });

    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스 접속');
        socket.on('join', (data) => {
            socket.join(data); //방에 참가
            socket.to(data).emit('join', {
                user: 'system',
                chat: `${socket.request.session.color}님이 입장하셨습니다.`
            })
            //socket.leave(data);//방에서 나가기
        })
        
        socket.on('disconnect', async () => {
            console.log('chat 네임스페이스 접속 해제');

            //브라우저 주소 가져와서 방아이디 찾기
            const {referer} = socket.request.headers;
            const roomId = new URL(referer).pathname.split('/').at(-1);

            const currenrRoom = chat.adapter.rooms.get(roomId);
            const userCount = currenrRoom?.size || 0;
            if(userCount === 0){
                await removeRoom(roomId);
                room.emit('removeRoom', roomId);
                console.log('방 제거 요청 성공');
            }else{
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${socket.request.session.color}님이 퇴장하셨습니다.`
                });
            }
        });
    });
}