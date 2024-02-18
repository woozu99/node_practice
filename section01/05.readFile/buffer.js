const buffer = Buffer.from('저를 버퍼로 바꿔주세요.');
console.log(buffer);
console.log(buffer.length);
console.log(buffer.toString());

const array = [buffer.from('띄엄 '), buffer.from('띄어쓰기 '), buffer.from(' 띄 어 쓰 기')];
console.log(Buffer.concat(array).toString());