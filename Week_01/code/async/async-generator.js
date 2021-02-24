function sleep(time){
    return new Promise(function(resolve, reject){
        setTimeout(resolve, time);
    });
}

async function* counter() {
    let i = 0;
    while(true){
        await sleep(1000);
        yield i++;
    }
}

async function go(){
    for await (let val of counter()){
        console.log(val);
    }
}

go();