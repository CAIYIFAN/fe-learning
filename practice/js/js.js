function create(obj) {
    function F() {}
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


function objectFactory() {
    let newObject = null;
    let constructor = Array.prototype.shift.call(arguments);
    let result = null;

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

function objectFactory() {
    let newObj = null;
    let constructor = Array.prototype.shift.call(arguments);
}

// 全排列
const permute = (nums) => {
    const res = [];
    const used = {};

    function dfs(path) {
        if (path.length == nums.length) { // 个数选够了
            res.push(path.slice()); // 拷贝一份path，加入解集res
            return;                 // 结束当前递归分支
        }
        for (const num of nums) { // for枚举出每个可选的选项
            // if (path.includes(num)) continue; // 别这么写！查找是O(n)，增加时间复杂度
            if (used[num]) continue; // 使用过的，跳过
            path.push(num);         // 选择当前的数，加入path
            used[num] = true;       // 记录一下 使用了
            dfs(path);              // 基于选了当前的数，递归
            path.pop();             // 上一句的递归结束，回溯，将最后选的数pop出来
            used[num] = false;      // 撤销这个记录
        }
    }

    dfs([]); // 递归的入口，空path传进去
    return res;
};


var levelOrder = function(root) {
    const ret = [];
    if (!root) {
        return ret;
    }

    const q = [];
    q.push(root);
    while (q.length !== 0) {
        const currentLevelSize = q.length;
        ret.push([]);
        for (let i = 1; i <= currentLevelSize; ++i) {
            const node = q.shift();
            ret[ret.length - 1].push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }
        
    return ret;
};


const lowestCommonAncestor = (root, p, q) => {
    if (root == null) { // 遇到null，返回null 没有LCA
        return null;
    }
    if (root == q || root == p) { // 遇到p或q，直接返回当前节点
        return root;
    }
    // 非null 非q 非p，则递归左右子树
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    // 根据递归的结果，决定谁是LCA
    if (left && right) {
        return root;
    }
    if (left == null) {
        return right;
    }
    return left;
};
