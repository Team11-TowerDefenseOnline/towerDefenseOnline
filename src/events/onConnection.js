import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';

// 클라이언트와 연결이 성공할 경우 작동하는 이벤트
// 각 data, end, error 등 이벤트를 정의함.
export const onConnection = (socket) => {
    console.log('클라이언트 연결 성공 :', socket.remoteAddress, socket.remotePort);


    // 소켓에 버퍼를 하나 만든다. 각 클라이언트를 구분해서 저장하는 용도로 활용됨.
    socket.buffer = Buffer.alloc(0)

    socket.on('data', onData(socket));
    socket.on('end', onEnd(socket));
    socket.on('error', onError(socket));
};
