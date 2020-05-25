const promise1 = new Promise((resolve, reject) => {
    let count = 0;
    setInterval(function () {
        count++;
        console['\x6c\x6f\x67'](count);
        if (count === 3) {
            resolve("\x6f\x6e\x65")
        }
    }, 1000)
});
const promise2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 10000, '\x74\x77\x6f')
});
Promise['\x72\x61\x63\x65']([promise1, promise2])['\x74\x68\x65\x6e']((value) => {
    console['\x6c\x6f\x67'](value)
});