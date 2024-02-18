console.log(this === module.exports); //전역의 this는 모듈 스코프

function a(){
    console.log(this === global); //함수의 this는 글로벌 this
}

a();