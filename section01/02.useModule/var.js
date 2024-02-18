//모듈생성

const odd = "홀수";
const even = "짝수";

//module.exports 는 파일에서 한번만 써야 함. 여러 값 전달 시 주로 객체 사용
module.exports = {
    odd,
    even
}

//module.exports를 안쓸거면 밑의 방법으로 모듈로 전달할 값 추가하는 것도 가능하다. 두 방법을 같이 쓸 수는 없다.
//exports.odd = odd;