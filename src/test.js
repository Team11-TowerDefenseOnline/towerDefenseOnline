import { getGameAssets, loadGameAssets } from './init/loadAssets.js';

const test = async () => {
  await loadGameAssets();
  const { monsters } = getGameAssets();

  console.log('테스트 중입니다. => ', { ...monsters.data[0] });
  const { id, displayName, decr, maxHp, asd, fsd, rwer, qwegt, xcvqwe, asdqwr } = {
    ...monsters.data[0],
  };
  console.log('테스트 2 => ', id);
};

test();
