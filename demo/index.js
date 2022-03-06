function createStore(reducer, enhance) {
    if  (enhance && typeof enhance === 'function') {
        return enhance(createStore)(reducer);
    }
    let state;
    let listeners = [];

    function getState() {
        return state;
    }

    function dispatch(action) {
        state = reducer(state, action);
        for (let i = 0; i < listeners.length; i++) {
            listeners[i]();
        }
    }

    function subscribe(listener) {
        listeners.push(listener)
    }

    const store = {
        subscribe,
        getState,
        dispatch,
    }

    return store;
}

function combineReducers(reducerMap) {
    const keys = Object.keys(reducerMap);
    return (state, action) => {
        const newState = {}
        for (let i = 0; i < keys.length; i++ ) {
            const key = keys[i];
            const currentReducer = reducerMap[key];
            const prevState = state[key];
            newState[key] = currentReducer(prevState, action);
        } 
        return newState
    }
}

function compose(...funcs) {
    return funcs.reduce((a, b) => (...args) => a(b(args)))
}

function applyMiddlewares(...middlewares) {
    return function (createStore) {
        return function (reducer) {
            const store = createStore(reducer);
            const chain = middlewares.map((middleware) => (middleware(store)))
            
            const newDispatch = compose(...chain)(store.dispatch)

            return {
                ...store,
                dispatch: newDispatch
            }
        }
    }
}

const initState = {
    milk: 0
}

function reducer(state, action) {
    switch (action.type) {
        case 'PUT_MILK':
            return {...state, milk: state.milk + action.count};
        default:
            return state;
    }
}

function deepCopy(obj1) {
    var obj2 = Array.isArray(obj1) ? [] : {};
    if (obj1 && typeof obj1 === 'object') {
        for (var i in obj1) {
            if (obj1.hasOwnProperty(i)) {
                if (obj1[i] && typeof obj1[i] === 'object') {
                   obj2[i] =  deepCopy(obj1[i])
                } else {
                    obj2[i] = obj1[i];
                }
            }
        }
    }
    return obj2;
}

const promise1 = new Promise((resolve, reject) => {
    resolve(1)
})

const promise2 = promise1.then((value) => {
    console.log(value)
    return value + 1
})

const promise3 = promise2.then(value => {
    console.log(value)
    return value + 1
})

function a (fn, time) {
    const promise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject()
        }, time)
    })
    const promise2 = new Promise((resolve, reject) => {
        fn.apply(this, arguments);
    })
    return Promise.all([promise1, promise2])
}

var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

function add() {
    var _args = Array.prototype.slice.call(arguments);
    var _adder = function() {
        args.push(...args);
        return _adder;
    }
    _adder.toString = function() {
        return _args.reduce((a, b) => (
            a+b
        ));
    }
    return _adder
}


function add() {
    var _args = Array.prototype.slice.call(arguments);
    var _adder = function() {
        _args.push(...arguments);
        return _adder;
    }

    _adder.toString = function() {
        return _args.reduce((a, b) => (
            a+b
        ))
    }

    return _adder;
}

class _LazyMan {
    constructor(name) {
        this.taskQueue = [];
        this.runTimer = null;
        this.sayHi(name);
    }

    run() {
        if (this.runTimer) {
            clearTimeout(this.runTimer);
        }
        this.runTimer = setTimeout(async () => {
            for (let asyncFun of this.taskQueue) {
                await asyncFun()
            }
            this.taskQueue.length = 0;
            this.runTimer = null;
        })
        return this
    }

    sayHi(name) {
        this.taskQueue.push(async () => console.log(`Hi, this is ${name}`))
        return this.run;
    }

    eat (food) {
        this.taskQueue.push(async () => console.log(`Eat ${food}`));
        return this.run();
      }

      sleep (second) {
        this.taskQueue.push(async () => {
          console.log(`Sleep ${second} s`)
          return this._timeout(second)
        });
        return this.run();
      }
      sleepFirst (second) {
        this.taskQueue.unshift(async () => {
          console.log(`Sleep first ${second} s`)
          return this._timeout(second);
        });
        return this.run();
      }

    async _timeout(second) {
        await new Promise(resolve => {
            setTimeout(resolve, second * 1e3);
        })
    }
}


class Scheduler {
    constructor() {
        this.tasks =[];
        this.usingTask = []
    }

    add(promiseCreator) {
        return new Promise((resolve, reject) => {
            promiseCreator.resolve = resolve
            if (this.usingTask.length < 2) {
                this.usingRun(promiseCreator);
            } else {
                this.tasks.push(promiseCreator);
            }
        })
    }

    usingRun(promiseCreator) {
        this.usingTask.push(promiseCreator)
        promiseCreator().then(() => {
            promiseCreator.resolve();
            this.usingMove(promiseCreator);
            if (this.tasks.length > 0) {
                this.usingRun(this.tasks.shift);
            }
        })
    }

    usingMove(promiseCreator) {
        let index = this.usingTask.findIndex(promiseCreator);
        this.usingTask.splice(index, 1);
    }
}

function deepCopy(obj1) {
    const obj2 = Array.isArray(obj1) ? [] :{};
    if (obj1 && typeof obj1 === 'object') {
        for (let i in obj1) {
            if (obj1.hasOwnProperty(obj1[i])) {
                if (typeof obj1[i] === 'object') {
                    obj2[i] = deepCopy(obj1[i])
                } else {
                    obj2[i] = obj1[i]
                }       
            }
        }
    }
    return obj2;
}

const flat = (arr) => {
    return arr.reduce((a, b) => {
        return a.concat(Array.isArray(b) ? flat(b): b)
    },[])
}

new Set(...[1,2,3,4,4])

for (let i = 0; i<arr.length -1; i++) {
    for (let j = 0; j < arr.length - 1 -i; j++) {
        if (arr[j] > arr[j+1]) {
            
        }
    }
}