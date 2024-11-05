import { createUser } from "../../db/user/user.db.js";
import { getProtoMessages } from "../../init/loadProto.js";

const registerHandler = (socket, payload) => {
    const protoMessages = getProtoMessages();
    const Register = protoMessages.common.C2SRegisterRequest;
    let sendPayload;

    try {
        const registerMessage = Register.decode(payloadData.subarray(2));
        const {id, password, email} = registerMessage;
        createUser(id, password, email);
    } catch(error) {
        console.error(`회원가입 실패: ${error}`)
    }

    const message = Register.create({success: true, message: "회원가입 성공!", failCode: new GlobalFailCode()});
    const Packet = Register.encode(message).finish();

    socket.write()
}

export default registerHandler;