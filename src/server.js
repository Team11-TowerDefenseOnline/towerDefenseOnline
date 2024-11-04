import net from 'net';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';
import initServer from './init/index.js';

// 서버를 생성하고 초기화
const server = net.createServer(onConnection);

initServer().then(() => {
    //최기화 iniServer를 완료한 뒤 연결포트와 호스트를 설정
    server.listen(config.server.port, config.server.host, () => {
        console.log(`${config.server.host}:${config.server.port} 정상적으로 실행됨.`);
        console.log(server.address());
    });
}).catch((e)=>{
    console.error(e);
    process.exit(1);
})
