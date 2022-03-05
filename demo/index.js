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