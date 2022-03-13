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


删除链表中倒数第k个值
209. 长度最小的子数组	4
93. 复原IP地址	2
215. 数组中的第K个最大元素	2
226. 翻转二叉树	2
94. 二叉树的中序遍历	2
322. 零钱兑换	1
129. 求根到叶子节点数字之和	1
88. 合并两个有序数组	1
121.买卖股票	1
124. 二叉树中的最大路径和	1
104. 二叉树的最大深度	1
42. 接雨水
200. 岛屿数量
最长回文子串
求最终路径
求1-1000内的完数
实现一个计算器，求字符串的值，例如((2 + (3 * 2) ) * (2 + 3) + (3 - 1) )
已知数组 a=[1,[2,[3,[4,null]]]], 实现数组 b=[4,[3,[2,[1,null]]]] ，考虑n级嵌套的情况
168. Excel表列名称
快排
sort的底层实现
最长无重复字符
最大连续子数组和
112. 路径总和
蛇形层序遍历二叉树相关知识点： 栈树广度优先搜索(BFS)相关知识点： 栈树广度优先搜索(BFS)相关知识点： 栈树广度优先搜索(BFS)
冒泡，选择，归并
二叉树求和
判断链表内是否存在环
版本号判断
用数组模拟一个栈，每次获取栈内最小元素的时间复杂度为o(1)
实现Promise.allSettled()
2维数组斜45度输出

原型链继承
反转链表
二叉树中序遍历
做题：最长公共子序列-II
做题：连续子数组的最大和
堆排序
螺旋矩阵
20 有效括号
树的最大深度怎么算
深度遍历
手写reduce
E2E