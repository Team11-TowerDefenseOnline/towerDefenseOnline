import { createUser } from "../../db/user/user.db.js";
import { getProtoMessages } from "../../init/loadProto.js";
import { serializer } from "../../utils/notification/game.notification.js";
import bcrypt from 'bcrypt'

const registerHandler = async ({socket, payloadData}) => {
    const protoMessages = getProtoMessages();
    const request = protoMessages.common.C2SRegisterRequest;
    const failCode = protoMessages.common.GlobalFailCode;
    let sendPayload;

    try {
        const requestMessage = request.decode(payloadData.subarray(2));
        console.log(requestMessage)
        const {id, password, email} = requestMessage;

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(id, hashedPassword, email);
        
        sendPayload = {
            success: true, 
            message: "회원가입 성공!", 
            failCode: 0};

    } catch(error) {
        console.error(`회원가입 실패: ${error}`)

        sendPayload = {
            success: false, 
            message: "회원가입 실패!", 
            failCode: 0};
    }

    const response = protoMessages.common.GamePacket;
    // const message = response.create({ registerResponse: sendPayload });
    const packet = response.encode({ registerResponse: sendPayload }).finish();

    socket.write(serializer(packet, 2, 1));
}

export default registerHandler;