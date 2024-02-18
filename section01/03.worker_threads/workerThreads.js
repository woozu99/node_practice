//worker_threads: 노드에서 멀티스레드 방식으로 작업할 수 있도록 해줌
const {isMainThread, Worker, parentPort, workerData} = require("worker_threads");

if(isMainThread){ //메인스레드
    const threads = new Set();
    threads.add(new Worker(__filename, {
        workerData: {start: 1},
    }));

    for(let worker of threads){
        worker.on("message", (value) => console.log('워커로부터', value));
        worker.on("exit", () => {
            threads.delete(worker);
            if(threads.size === 0){
              console.log('워커끝')
            }
        });
        worker.postMessage('ping');
    }

}else{ //워커스레드
    parentPort.on('message', (value) => {
        console.log('부모로부터', value);
        const data = workerData;
        parentPort.postMessage(`pong ${data.start}`);//워커 생성시 만들 workerData사용 가능
        parentPort.close();
    })
}