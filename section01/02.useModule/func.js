//모듈 사용

const value = require('./var');
const {odd, even} = require("./var"); //구조분해 할당도 가능(변수명 같게 할 것!)

//console.log(value.odd);
//console.log(value.even);

function checkStringOddOrEven(str){
    if(str.length % 2){
        return `${odd}입니다.`;
    }else{
        return `${even}입니다.`;
    }
}

//함수 모듈화
module.exports = checkStringOddOrEven;