const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)
        }
    }

    status = PENDING;

    value = null;

    reason = null;

    onFulfillCallbacks = [];
    
    onRejectedCallbacks = [];

    resolve = (value) => {
        if (this.status === PENDING) {
            this.status = FULFILLED;
            this.value = value;
            while(this.onFulfillCallbacks.length) {
                this.onFulfillCallbacks.shift()(value)
            }
        }
    }

    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;
            while(this.onRejectedCallbacks.length) {
                this.onRejectedCallbacks.shift()(reason)
            }
        }
    }

    then(onFulfilled, onRejected) {
        const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => reason

        const promise2 = new MyPromise((resolve, reject) => {
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }

            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }

            if (this.status === FULFILLED) {
                fulfilledMicrotask();
            } else if (this.status === REJECTED) {
                rejectedMicrotask();
            } else if ( this.status === PENDING) {
                this.onFulfillCallbacks.push(fulfilledMicrotask);
                this.onRejectedCallbacks.push(rejectedMicrotask);
            }
        })
        return promise2;
    }

    static resolve (parameter) {
        if (parameter instanceof MyPromise) {
            return parameter
        }

        return new MyPromise((resolve) => {
            resolve(parameter)
        })
    }

    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

Promise.all = function(promiseArr) {
    return new Promise((resolve, reject) => {
        const ans = [];
        let index = 0;
        for (let i = 0; i < promiseArr.length; i++) {
            promiseArr[i].then(res => {
                ans[i] = res;
                index++;
                if (index === promiseArr.length) {
                    resolve(ans);
                }
            })
            .catch(err => reject(err))
        }
    })
}


Promise.all = function(promiseArr) {
    return new Promise((resolve, reject) => {
        let ans = [];
        let index = 0;
        for (let i = 0; i < promiseArr.length; i++) {
            promiseArr[i].then(res => {
                ans.push(res);
                if (index === promiseArr.length) {
                    resolve(ans);
                }
                index++;
            })
            .catch(err => reject(err))
        }
    })
}


Promise.all = function(promiseArr) {
    return new Promise((resolve, reject) => {
        let result = [];
        let index = 0;
        for(let i = 0; i < promiseArr.length; i++) {
            promiseArr[i].then((res) => {
                result[i] = res;
                index++;
                if (index === promiseArr.length) {
                    resolve(result);
                }
            }).catch(e => {
                reject(e)
            })
        }
    })
}

Promise.prototype.race = function(promiseArr) {
    return new Promise((resolve, reject) => {
        promiseArr.forEach((item) => {
            Promise.resolve(item).then(res => {
                resolve(res)
            }, rej => {
                reject(rej)
            })
        })
    })
}

const sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {resolve()}, time)
    })
}

sleep(1000).then(() => {
    console.log(1)
})

function sleep(callback, time) {
    if (typeof callback === 'function'){
        setTimeout(callback, time)
    }
}