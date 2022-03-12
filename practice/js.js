function create(obj) {
    function F() {}
    F.prototype = obj;
    return new F();
}

function create(obj) {
    function F();
    F.prototype = obj;
    return new F();
}

function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left),
        prototype = right.prototype;
    
    while(true) {
        if (!proto) return false;
        if (proto === prototype) {
            return true
        }
        proto = Object.getPrototypeOf(proto)
    }
}

function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left);
    let prototype = right.prototype;

    while(true) {
        if (!proto) return false;
        if (proto === prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}

function objectFactory() {
    let newObject = null;
    let constructor = Array.prototype.shift.call(arguments);
    let result = null;

    if (typeof constructor !== 'function') {
        console.error('type error');
        return;
    }

    newObject = Object.create(constructor.prototype);
    result = constructor.apply(newObject, arguments);
    let flag = result && (typeof result === 'object' || typeof result === 'function');
    return flag ? result : newObject;
}


function objectFactory() {
    let newObj = null;
    let result = null;
    let constructor = Array.prototype.shift.call(arguments);

    newObj = Object.create(constructor.prototype);
    result = constructor.apply(newObj, arguments);
    let flag = result && (typeof result === 'object' || typeof result === 'function');

    return flag ? result : newObj;
}

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function myPromise(fn) {
    var self = this;

    this.state = PENDING;

    this.value = null;

    this.resolveCallbacks = [];

    this.rejectCallbacks = [];

    function resolve(value) {
        if (value instanceof myPromise) {
            return value.then(resolve, reject);
        }

        setTimeout(() => {
            if(self.state === PENDING) {
                self.state = FULFILLED;

                self.value = value;

                self.resolveCallbacks.forEach(callback => {
                    callback(value);
                });
            }
        }, 0);
    }

    function reject(value) {
        setTimeout(() => {
            if (self.state === PENDING) {
                self.state = REJECTED;

                self.value = value;

                self.rejectCallbacks.forEach(callback => {
                    callback(value);
                });
            }
        },0)
    }
    
    try {
        fn(resolve, reject);
    } catch(e) {
        reject(e);
    }


    function then(onFulfilled, onRejected) {
        const self = this;
        return new myPromise((resolve, reject) => {
            let fulfilled = () => {
                try{
                  const result = onFulfilled(self.value); // 承前
                  return result instanceof MyPromise? result.then(resolve, reject) : resolve(result); //启后
                }catch(err){
                  reject(err)
                }
              }
              // 封装前一个promise失败时执行的函数
              let rejected = () => {
                try{
                  const result = onReject(self.reason);
                  return result instanceof MyPromise? result.then(resolve, reject) : reject(result);
                }catch(err){
                  reject(err)
                }
              }
              switch(self.status){
                case PENDING: 
                  self.onFulfilledCallbacks.push(fulfilled);
                  self.onRejectedCallbacks.push(rejected);
                  break;
                case FULFILLED:
                  fulfilled();
                  break;
                case REJECT:
                  rejected();
                  break;
              }
        })
    }
}

function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new Error(`argument must be a array`)
        }
        let result = [];
        promises.forEach((promise) => {
            promise.then((value) => {
                result.push(value)
            }, (error) => {
                return reject(error)
            })
            if (result.length === promises.length) {
                return resolve(result);
            }
        })
    })
}

function debounce(fn, time) {
    let timer = null
    return function() {
        const self = this;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        setTimeout(() => {
            fn.call(self, arguments)
        }, time)        
    }
}

function throttle(fn, delay) {
    let curTime = Date.now();
    return function() {
        const self = this;
        const now = Date.now();
        if (now - curTime >= delay) {
            curTime = Date.now();
            fn.call(self, arguments);
        }
    }
}

Function.prototype.myCall = function(context) {
    if (typeof this !== 'function') {
        console.log('type error');
    }

    let args = [...arguments].slice(1);
    context = context || window;
    context.fn  = this;
    result = context.fn(...args);
    delete context.fn;
    return result;
}

Function.prototype.myCall = function(context) {
    if (typeof this !== 'function') {

    }
    let args = [...arguments].slice(1);
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
}

Function.prototype.myApply = function(context, arr) {
    let args = arr;
    context = context || window;
    context.fn = this;
    let result = context.fn(args);
    delete context.fn;
    return result;
}

Function.prototype.myBind = function(context) {
    let args = [...arguments].slice(1);
    let fn = this;
    return function() {
        fn.apply(this,[...args, ...arguments])
    }
}


function curry(fn, ...args) {
    return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}

const SERVER_URL = "/server";

let xhr = new XMLHttpRequest();

xhr.open("GET", SERVER_URL, true);

xhr.onreadystatechange = function() {
    if (this.readyState !== 4) {
        return;
    }
    if(this.status === 200) {
        handle(this.response);
    }
}

xhr.responseType = 'json';
xhr.setRequestHeader('Accept', 'application/json');

xhr.send(null);

function getJSON(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", SERVER_URL, true);

        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            if(this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText))
            }
        }
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.send(null);
    })
}

function deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for(let key in obj) {
        if (!obj.hasOwnProperty(key)) {
            return;
        }
        if(typeof obj[key] === 'object') {
            result[key] = deepCopy(obj[key])
        }else {
            result[key] = obj[key];
        }
    }
    return result;
}

function flat(arr) {
    return arr.reduce((a,b) => a.concat(Array.isArray(b) ? flat(b) : b), [])
}

function add() {
    var _args = Array.prototype.slice.call(arguments);
    var _adder = function() {
        _args.push(...arguments);
        return _adder
    }

    _adder.toString = function() {
        return _args.reduce((a, b) => (a + b));
    }
    return _adder
}

class _LazyMan{
    constructor(name) {
        this.taskQueue = [];
        this.runTimer = null;
        this.sayHi(name)
    }
    run() {
        if (this.runTimer) {
            clearTimeout(this.runTimer);
            this.runTimer = null;
        }
        this.runTimer = setTimeout(async () => {
            for (let fn of this.taskQueue) {
                await fn()
            }
            this.taskQueue.length = 0;
            this.runTimer = null;
        },0)
        return this;
    }
    sayHi(name) {
        this.taskQueue.push(async () => console.log(`Hi, this is ${name}`))
        return this.run;
    }
}

function sleep() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        },1000)
    })
}


class Scheduler {
    constructor() {
        this.tasks = [];
        this.usingTask = [];
    }

    add(func) {
        return new Promise((resolve, reject) => {
            func.resolve = resolve
            if (this.usingTask.length < 2) {
                this.usingRun(func)
            } else {
                this.task.push(func)
            }
        })
    }

    usingRun(func) {
        this.usingRun.push(func) 
        func().then(() => {
            func.resolve();
            this.usingMove(func);
            if (this.tasks.length > 0) {
                this.usingRun(this.tasks.shift);
            }
        })
    }

    usingMove(func) {
        let index = this.usingTask.findIndex(func);
        this.usingTask.splice(index, 1);
    }
}