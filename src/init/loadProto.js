/**
 * protobuf 폴더 하위에 패킷의 정의 내용을 로드하는 유틸리티
 * protoMassage 객체 형태로 저장됨.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames, enumNames } from '../protobuf/packetName.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname, '../protobuf');

// 해당 폴더의 하위 폴더를 포함해 내부에 proto 파일을 전부 가져옴.
// 재귀 형태를 사용하기 위해 fileList 파라미터를 추가
const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList); // 폴더를 발견하면 한번 더 들어감.
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });
  return fileList;
};

const protoFiles = getAllProtoFiles(protoDir);
const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(protoFiles.map((file) => root.load(file)));

    // packetNames에 미리 정리한 패킷들을 가져와 맵핑
    for (const [namespace, types] of Object.entries(packetNames)) {
      protoMessages[namespace] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[namespace][type] = root.lookupType(typeName);
      }
    }

    // enumNames에 미리 정리한 패킷들을 가져와 맵핑
    for (const [namespace, types] of Object.entries(enumNames)) {
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[namespace][type] = root.lookupEnum(typeName);
      }
    }

    // console.log('테스트중 => ', protoMessages['common'].GlobalFailCode.values.UNKNOWN_ERROR);

    console.log('Protobuf 파일이 로드되었습니다.');
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다:', error);
  }
};

export const getProtoMessages = () => {
  return { ...protoMessages }; // 얕은 복사
};
