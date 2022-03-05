// 单例
class User{
    constructor () {
        if (new.target !== User) {
            return 
        }
        if (!User.instance) {
            this.name = 'xm'
            User._instance = this
        }
        return User._instance
    }
}

const u1 = new User();
const u2 = new User();
console.log(u1 === u2);

class User {
    constructor() {
        this.name = 'xm'
    }
    static getInstance() {
        if (!User._instance) {
            User._instance = new User()
        }
        return User._instance
    }
}

const u1 = User.getInstance()
const u2 = User.getInstance()

console.log(u1 === u2)

// 继承
function inheritObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
function inheritPrototype(subClass, superClass) {
    var p = inheritObject(superClass.prototype)
    p.constructor = subClass;
    subClass.prototype = p;
}

// 数组拍平

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];

function flat(arr) {
    let arrResult =[]
    arr.forEach(item => {
        if (Array.isArray(item)) {
            // arrResult = arrResult.concat(flat(item))
            arrResult.push(...flat(item))
        } else {
            arrResult.push(item)
        }
    });
    return arrResult
}

flat(arr)

arr.reduce((prev, cur) => prev.concat(cur),[])

const flat = arr => {
    return  arr.reduce((prev, cur) => {
        return prev.concat(Array.isArray(cur) ? flat(cur) : cur);
    },[]);
};


function flat() {
    const result = [];
    const stack = [].concat(arr);
    while(stack.length !== 0) {
        const val = stack.pop();
        if (Array.isArray(val)) {
            stack.push(...val);
        } else {
            result.unshift(val)
        }
    }
    return result
}

function* flat(arr, num) {
    if (num === undefined) num = 1;
    for (const item of arr) {
        if (Array.isArray(item) && num > 0){
            yield * flat(item, num -1);
        } else {
            yield item
        }
    }
}

[...flat(arr, Infinity)]

// forEach跳过数组空位

function createStore(reducer) {
    let state;
    let listeners = [];

    function getState() {
        return state;
    }

    function subscribe(listener) {
        listeners.push(listener);
    }

    function unSubscribe(listener) {
        splice(listeners.indexOf(listener), 1);
    }

    function dispatch(action) {
        state = reducer(state, action)
        for (let i = 0; i < listeners.length; i++) {
            listeners[i]()
        }
    }

    const store = {
        getState,
        subscribe,
        unSubscribe,
        dispatch,
    }
    
    return  store;
}

class Scheduler {
    constructor () {
        this.tasks = [];
        this.usingTask = [];
    }

    add(promiseCreator) {
        return new Promise((resolve, reject) => {
            promiseCreator.resolve = resolve
            if (this.usingTask.length < 2) {
                this.usingRun(promiseCreator)
            } else {
                this.tasks.push(promiseCreator)
            }
        })
    }

    usingRun(promiseCreator) {
        this.usingTask.push(promiseCreator)
        promiseCreator().then(() => {
            promiseCreator.resolve();
            this.usingMove(promiseCreator)
            if (this.tasks.length > 0) {
                this.usingRun(this.tasks.shift())
            }
        })
    }

    usingMove(promiseCreator) {
        let index = this.usingTask.findIndex(promiseCreator);
        this.usingTask.splice(index, 1)
    }
}

const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})

const scheduler = new Scheduler()

const addTask = (time, order) => {
    scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(400, 4)