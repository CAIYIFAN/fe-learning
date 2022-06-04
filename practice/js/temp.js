// 从url上获取参数
function getQuery(url, key) {
    const arr1 = url.split("?").splice(1).join('')
    const arr2 = arr1.split("&")
    const obj = {}
    for(let i = 0; i < arr2.length; i++) {
        const arr3 = arr2[i].split("=")
        obj[arr3[0]] = JSON.parse(JSON.stringify(arr3[1]))
    }
    return obj[key];
}
// 防抖
function debounce(fn, time) {
    let timer = null;
    return function() {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        },time)
    }
}
// 节流
function throttle(fn, time) {
    let flag = true;
    return function() {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            fn.apply(this, arguments)
            flag = true
        }, time)
    }
}
// 根据节点生成树
const node =[
    {
        id: '1',
        parent: '3',
    },
    {
        id: '2',
        parent: '1'
    },
    {
        id: '3',
        parent: null
    }
]
function generate(node, parentValue) {
    return node.filter((item) => item.parent === parentValue).map(items => (
        {
            ...items,
            child: generate(node, items.id)
        }
    ))
}
// 证明...为浅拷贝
const obj = {
    a: 1,
    b: {
        a: 1
    }
}
const tmp = {...obj}
console.log(tmp)
obj.b.a=2
console.log(tmp)
// redux
function createStore(reducer, enhance) {
    if (enhance && typeof enhance === 'function') {
        return enhance(createStore)(reducer)
    }
    let state;
    let listeners = [];

    function getState() {
        return state;
    }

    function dispatch(action) {
        state = reducer(state, action);
        for (let i = 0; i< listeners.length; i++) {
            listeners[i]()
        }
    }

    function subscribe(listener) {
        listeners.push(listener)
    }

    function unSubscribe(listener) {
        let index = listeners.indexOf(listener)
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    const store = {
        subscribe,
        unSubscribe,
        getState,
        dispatch
    }

    return store;
}

function combineReducers(reducerMap) {
    const keys = Object.keys(reducerMap)
    return (state, action) => {
        const newState = {};
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const currentReducer  = reducerMap[key];
            const prevState = state[key]
            newState[key] = currentReducer(prevState, action)
        }
        return newState
    }
}

function compose(...funcs) {
    return funcs.reduce((a, b) => (...args) => a(b(args)))
} 

function applyMiddlewares(...middlewares) {
    return function(createStore) {
        return function(reducer) {
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

// 深拷贝
function deepCopy(obj1) {
    var obj2 = Array.isArray(obj1) ? [] : {}
    if (obj1 && typeof obj1 === 'object') {
        for (var i in obj1) {
            if (obj1.hasOwnProperty(i)) {
                if (obj1[i] && typeof obj1[i] === 'object') {
                    obj2[i] = deepCopy(obj1[i])
                } else {
                    obj2[i] = obj1[i]
                }
            }
        }
    }
    return obj2;
}

// 反转单链表
var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while(curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev
}

// 柯里化
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

// Lazy Man
class LazyMan {
    constructor(name) {
        this.taskQueue = [];
        this.runTimer = null;
        this.sayHi(name)
    }

    run () {
        if (this.runTimer) {
            clearTimeout(this.time)
        }
        this.runTimer = setTimeout(async() => {
            for (let asyncFun of this.taskQueue) {
                await asyncFun()
            }
            this.taskQueue.length = 0;
            this.runTimer = null;
        })
        return this;
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
            setTimeout(resolve, second * 1e3)
        })
    }
}

// 任务调度器
class Scheduler {
    constructor() {
        this.tasks = [];
        this.usingTask = []
    }

    add(promiseCreator) {
        return new Promise((resolve, reject) => {
            promiseCreator.resolve = resolve
            if (this.usingTask.length  < 2) {
                this.usingRun(promiseCreator);
            } else {
                this.tasks.push(promiseCreator)
            }
        })
    }

    usingRun(promiseCreator) {
        this.usingTask.push(promiseCreator)
        promiseCreator().then(() => {
            promiseCreator.resolve();
            this.usingMove(promiseCreator);
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

// 数组拍平
const flat = (arr) => {
    return arr.reduce((a, b) => (a.concat(Array.isArray(b) ? flat(b): b)), [])
}

Array.from(new Set(...[1,1,3,4]))


// 让创建插入节点的工作分批进行：
setTimeout(() => {
    // 插入十万条数据
    const total = 100000;
    // 一次插入 20 条，如果觉得性能不好就减少
    const once = 20;
    // 渲染数据总共需要几次
    const loopCount = total / once;
    let countOfRender = 0
    let ul = document.querySelector("ul");
    function add() {
        // 优化性能，插入不会造成回流
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < once; i++) {
            const li = document.createElement("li");
            li.innerText = Math.floor(Math.random() * total);
            fragment.appendChild(li);
        }
        ul.appendChild(fragment);
        countOfRender += 1;
        loop();
    }
    function loop() {
        if (countOfRender < loopCount) {
            window.requestAnimationFrame(add);
        }
    }
    loop();
}, 0)

// 自定义Promise

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.rejected);
        } catch (error) {
            this.rejected(error)
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
        return promise2
    }


    static resolve(parameter) {
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
                ans[i]=res;
                index++;
                if (index === promiseArr.length) {
                    resolve(ans)
                }
            }).catch(err => reject(err))
        }
    })
}

Promise.prototype.race = function(promiseArr) {
    return new Promise((resolve, rejected) => {
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

function create(obj) {
    function F() {}
    F.prototype = obj
    return new F()
}

// instanceof
function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left)
    let prototype = right.prototype

    while(true) {
        if (!proto) return false;
        if (proto === prototype) return true;
        proto = Object.getPrototypeOf(proto)
    }
}


// new方法
function objectFactory() {
    let newObject = null;
    let constructor = Array.prototype.shift.call(arguments)
    let result = null

    newObject = Object.create(constructor.prototype)
    result = constructor.apply(newObject, arguments)
    let flag = result && (typeof result === 'object' || typeof result === 'function');
    return flag ? result : newObject;
}

// call
Function.prototype.myCall = function(context) {
    if (typeof this !== 'function') {
        console.log('type error');
    }

    let args = [...arguments].slice(1);
    context = context || window;
    context.fn = this;
    result = context.fn(...args);
    delete context.fn;
    return result;
}
// apply
Function.prototype.myApply = function(context, arr) {
    let args = arr;
    context = context || window;
    context.fn = this;
    let result = context.fn(args);
    delete context.fn;
    return result;
}

// bind
Function.prototype.myBind = function(context) {
    let args = [...arguments].slice(1);
    let fn = this;
    return function() {
        fn.apply(this, [...args, ...arguments])
    }
}

// curry
function curry(fn, ...args) {
    return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}

//xhr
const SERVER_URL = "/server";

let xhr = new XMLHttpRequest();

xhr.open("GET", SERVER_URL, true);

xhr.onreadystatechange = function() {
    if (this.readyState !== 4) {
        return;
    }
    if (this.status === 200) {
        FileSystemHandle(this.response);
    }
}

xhr.responseType = 'json';

xhr.setRequestHeader('Accept', 'application/json');

xhr.send(null);

function getJSON(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
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


// 全排列
const permute = (nums) => {
    const res = [];
    const used = [];

    function dfs(path) {
        if (path.length === nums.length) {
            res.push(path.slice())
            return;
        }

        for (const num of nums) {
            if (used[num]) continue;
            path.push(num);
            used[num] = true;
            dfs(path);
            path.pop();
            used[num] = false;
        }
    }
    dfs([]);
    return res;
}

// 中序遍历
const levelOrder = function(root) {
    const ret = [];
    if (!root) {
        return ret;
    }

    const q = [];
    q.push(root);
    while(q.length !== 0) {
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
} 

// 公共父节点
const lowestCommonAncestor = (root, p, q) => {
    if (root == null) {
        return null;
    }
    if (root == q || root == p) {
        return root;
    }
    const left = lowestCommonAncestor(root.left, p, q)
    const right = lowestCommonAncestor(root.right, p, q);
    if (left && right) {
        return root;
    }
    if (left == null) {
        return right;
    }
    return left;
}

// promise串行

function repeat(func, times, wait) {
    let result =[]
    return function(value) {
        for (let i = 0; i < times; i++) {
            result.push(function() {
                return new Promise((resolve, rejected) => {
                    setTimeout(() => {
                        func(value)
                        resolve()
                    }, wait)
                })
            })
        }
        result.reduce((prev, next) => (prev.then(() => (next()))), Promise.resolve())
    }
}

// 使下面调用代码能正常工作
const repeatFunc = repeat(console.log, 4, 3000);
repeatFunc("hello world");//会输出4次 hello world, 每次间隔3秒

function jsQuickSort(array) {
    if (array.length <= 1) {
        return array;
    }
    const pivotIndex = Math.floor(array.length / 2);
    const pivot = array.splice(pivotIndex, 1)[0];  //从数组中取出我们的"基准"元素
    const left = [], right = [];
    array.forEach(item => {
        if (item < pivot) {  //left 存放比 pivot 小的元素
            left.push(item); 
        } else {  //right 存放大于或等于 pivot 的元素
            right.push(item);
        }
    });
    //至此，我们将数组分成了left和right两个部分
    return jsQuickSort(left).concat(pivot, jsQuickSort(right));  //分而治之
}

const arr = [98, 42, 25, 54, 15, 3, 25, 72, 41, 10, 121];
console.log(jsQuickSort(arr));  //输出：[ 3, 10, 15, 25, 25, 41, 42, 54, 72, 98, 121 ]


// 编写方法，实现冒泡
var arr = [29,45,51,68,72,97];
//外层循环，控制趟数，每一次找到一个最大值
for (var i = 0; i < arr.length - 1; i++) {
    // 内层循环,控制比较的次数，并且判断两个数的大小
    for (var j = 0; j < arr.length - 1 - i; j++) {
        // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
        if (arr[j] > arr[j + 1]) {
            var temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
        }
    }

}
console.log(arr);//[2, 4, 5, 12, 31, 32, 45, 52, 78, 89]'

Array.prototype.reduce  = function(callback, prev) {
    for(let i = 0; i < this.length; i++) {
        if (prev === undefined) {
            prev = callback(this[i], this[i+1], i+1, this)
            i++
        } else {
            prev = callback(prev,this[i],i,this)
        }
    }
    return prev
}

// 终极方法finally finally其实就是一个promise的then方法的别名，在执行then方法之前，先处理callback函数
MyPromise.prototype.finally = function(cb) {
    return this.then(
        value => MyPromise.resolve(cb()).then(() => value)
        ,
        reason => MyPromise.reject(cb()).then(() => { throw reason })
    )
  }
  
  // 把setTimeout封装成Promise
  function timeout(delay){
    return new Promise(resolve => setTimeout(resolve, delay));
  };
  

// 二分查找
var search = function(nums, target) {
    let low = 0, high = nums.length - 1;
    while (low <= high) {
        const mid = Math.floor((high - low) / 2) + low;
        const num = nums[mid];
        if (num === target) {
            return mid;
        } else if (num > target) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return -1;
  };
  
  
// 归并

function mergeSort (arr) {
    let len = arr.length
    if (len < 2) {
        return arr
    }
    let middle = Math.floor(len/2)
    //拆分成两个子数组
    let left =  arr.slice(0, middle)
    let right = arr.slice(middle,len)
    //递归拆分
    let mergeSortLeft = mergeSort(left)
    let mergeSortRight = mergeSort(right)
    //合并
    return merge( mergeSortLeft,mergeSortRight)
  }
  const merge = (left, right) => {
    const result = [];
  
    while (left.length && right.length) {
        // 注意: 判断的条件是小于或等于，如果只是小于，那么排序将不稳定.
        if (left[0] <= right[0]) {
            result.push(left.shift()); //每次都要删除left或者right的第一个元素，将其加入result中
        } else {
            result.push(right.shift());
        }
    }
    //将剩下的元素加上
    while (left.length) result.push(left.shift());
  
    while (right.length) result.push(right.shift());
  
    return result;
  };

//节点值累加
const hasPathSum = (root, sum) => {
      if (root == null) {
          return false;
      }
      if (root.left === null && root.right === null) {
          return sum -root.val === 0;
      }

      return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val)
}

// 括号匹配
const generateParenthesis = function(n) {
    let set = new Set(['()']);
    for(let c = 2; c <= n; c++) {
        let nextSet = new Set();
        for (const s of set) {
            for (let j = 0; j <= s.length; j++) {
                nextSet.add(s.slice(0, j) + '()' + s.slice(j));
            }
        }
        set = nextSet;
    }
    return [...set];
}

// 股票的最大利润涵手续费
var maxProfit = function(prices, fee) {
    let value = prices[0];
    let sum = 0;
    for (let i = 0; i < prices.length; i++) {
        if (value > prices[i]) {
            value = prices[i]
        } else if ((t = prices[i] - value - fee) > 0) {
            sum = sum + t;
            value = prices[i] - fee;
        }
    }

    return sum;
}

// 中心扩散法求最长回文子串
/**
 * @param {string} s
 * @return {string}
 */

var longestPalindrome = function(s) {
    let res = ""
    for(let i = 0; i < s.length; i++) {
        const s1 = palindrome(s, i, i);
        const s2 = palindrome(s, i, i+1);
        res = res.length <= s1.length ? s1 : res;
        res = res.length <= s2.length ? s2 : res;
    }
}


function palindrome(s, l, r) {
    while(l >= 0 && r < s.length && s[l] === s[r]) {
        l--;
        r++;
    }
    return s.slice(l+1, r)
}

// 动态规划，最小路径
/**
 * @param {number[][]} grid
 * @return {number}
 */
 var minPathSum = function(grid) {
    let m = grid.length;
    let n = grid[0].length;
    for(let i = 1; i < m; i++){
        grid[i][0] += grid[i - 1][0]
    }
    for(let j = 1; j < n; j++){
        grid[0][j] += grid[0][j - 1]
    }
        
    for(let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            grid[i][j] += Math.min(grid[i][j - 1], grid[i - 1][j])
        }
    }
    return grid[m-1][n-1]
};

// 最大连续数组和
/**
 * @param {number[]} nums
 * @return {number}
 */

var maxSubArray = function(nums) {
    let max = nums[0];
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        if (sum >= 0){
            sum = sum + nums[i];
        } else {
            sum = nums[i]
        }
        if (sum > max) {
            max = sum;
        }
    }
    return max;
}

// 最长公共前缀
/**
 * @param {string[]} strs
 * @return {string}
 */

 var longestCommonPrefix = function (strs) {
    if (!strs.length) return ''
    let res = strs[0]
    for (ch of strs) {
        for (let i = 0; i < res.length; i++) {
            if (ch[i] !== res[i]) {
                res = res.slice(0, i)
                break
            }
        }
    }
    return res
  };
  
  //最长不含重复字符的子字符串
  /**
   * @param {string} s
   * @return {number}
   */
   var lengthOfLongestSubstring = function(s) {
    let max = 0;
    let result = []
    for (let i = 0; i < s.length; i++) {
        while(result.includes(s[i])){
            result.shift()
        }
        result.push(s[i]);
        if (result.length > max) {
            max = result.length;
        }
    }
    return max;
  };
  
  // 螺旋矩阵
  /**
   * @param {number[][]} matrix
   * @return {number[]}
   */
   var spiralOrder = function(matrix) {
    const n = matrix.length;
    const m = matrix[0].length;
    const ans= []
    const circle = Math.min(Math.ceil(n/2), Math.ceil(m/2));
    function doCircle(cur) {
        for (let i = cur; i < m -cur; i++) {
            ans.push(matrix[cur][i])
        }
        for (let i = cur + 1; i < n -cur; i++) {
            ans.push(matrix[i][m-cur-1])
        }
        for (let i = m-cur-2; i >= cur && (n-cur- 1 > cur); i--) {
            ans.push(matrix[n-cur-1][i])
        }
        for (let i = n-cur-2 ; i > cur && cur < m - cur - 1; i--) {
            ans.push(matrix[i][cur])
        }
    }
    for(let i=0; i < circle; i++) {
        doCircle(i)
    }
    return ans;
  };
  
  // 长度最小的子数组
  /**
   * @param {number} target
   * @param {number[]} nums
   * @return {number}
   */
   var minSubArrayLen = function(target, nums) {
    const length = nums.length;
    let left = 0;
    let right = 0;
    let sum = nums[0];
    let min = Number.MAX_SAFE_INTEGER;
    while(right < length) {
        if (sum >= target) {
            min = Math.min(min, right-left+1)
            if (min === 1) return min;
            sum = sum - nums[left];
            left++;
        } else{
            right++;
            sum = sum + nums[right]
        }
    }
    return min === Number.MAX_SAFE_INTEGER ? 0 : min;
  };
  
  // 接雨水
  const trap = height => {
    let count = 0;
    let [left, right] = [0, height.length - 1];
    let [leftMax, rightMax] = [0, 0];
    while (left < right) {
        leftMax = Math.max(leftMax, height[left]);
        rightMax = Math.max(rightMax, height[right]);
        if (leftMax < rightMax) {
            count += leftMax - height[left++];
        } else {
            count += rightMax - height[right--];
        }
    }
    return count;
  };
  
  //EXCEL
  /**
   * @param {number} columnNumber
   * @return {string}
   */
   var convertToTitle = function(n) {
    if (n <= 0) return "";
    let res = [];
    while(n) {
      let remain = n % 26 ? n % 26 : 26; // 类似 十进制的 521 进行不断取余
      res.unshift(String.fromCharCode(remain + 64)); // 然后余数 + 64 获得字符（不是+65的原因是题目的A从1开始，要减去1）
      n = Math.floor((n - remain) / 26); // 然后减去余数再除26，刚好除得尽，新的一位开始
    }
    return res.join("");
  };
  
  // 完美数
  var checkPerfectNumber = function(num) {
    if (num === 1) {
        return false;
    }
  
    let sum = 1;
    for (let d = 2; d * d <= num; ++d) {
        if (num % d === 0) {
            sum += d;
            if (d * d < num) {
                sum += Math.floor(num / d);
            }
        }
    }
    return sum === num;
  };
  
  // 发饼干
  var findContentChildren = function(g, s) {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    const numOfChildren = g.length, numOfCookies = s.length;
    let count = 0;
    for (let i = 0, j = 0; i < numOfChildren && j < numOfCookies; i++, j++) {
        while (j < numOfCookies && g[i] > s[j]) {
            j++;
        }
        if (j < numOfCookies) {
            count++;
        }
    }
    return count;
  };
  
  
  
  // LRU
  /**
   * @param {number} capacity
   */
   var LRUCache = function(capacity) {
    this.map = new Map();
    this.capacity = capacity;
  };
  
  /** 
  * @param {number} key
  * @return {number}
  */
  LRUCache.prototype.get = function(key) {
    if(this.map.has(key)){
        let value = this.map.get(key);
        this.map.delete(key); // 删除后，再 set ，相当于更新到 map 最后一位
        this.map.set(key, value);
        return value
    } else {
        return -1
    }
  };
  
  /** 
  * @param {number} key 
  * @param {number} value
  * @return {void}
  */
  LRUCache.prototype.put = function(key, value) {
    // 如果已有，那就要更新，即要先删了再进行后面的 set
    if(this.map.has(key)){
        this.map.delete(key);
    }
    this.map.set(key, value);
    // put 后判断是否超载
    if(this.map.size > this.capacity){
        this.map.delete(this.map.keys().next().value);
    }
  
  };

//   var canJump = function(nums) {
//     // 必须到达end下标的数字
//     let end = nums.length - 1;
  
//     for (let i = nums.length - 2; i >= 0; i--) {
//         if (end - i <= nums[i]) {
//             end = i;
//         }
//     }
  
//     return end == 0;
//   };
  
//   var rob = function(nums) {
//     const len = nums.length;
//     if(len == 0)
//         return 0;
//     const dp = new Array(len + 1);
//     dp[0] = 0;
//     dp[1] = nums[0];
//     for(let i = 2; i <= len; i++) {
//         dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i-1]);
//     }
//     return dp[len];
//   };

// 千分位
