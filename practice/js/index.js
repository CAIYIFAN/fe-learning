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
    this.list = [];
    this.count = 0;
  }
  add(promiseCreator) {
    return new Promise(resolve => {
      // 加入任务队列
      this.list.push(() => {
        resolve(Promise.resolve(promiseCreator()).then(s => {
          // 当前任务结束后，执行下一个任务
          this.count--;
          this.start();
          return s
        }));
      });
      // 执行当前任务
      this.start();
    })
  }
 
  start () {
    // 最多两个同时进行的任务
    if (this.count < 2) {
      this.count++;
      this.list[0] && this.list[0]();
      this.list.shift();
    }
  }
}
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
const scheduler = new Scheduler();
 
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(time, 'time, order', order))
}
 
 
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
// output: 2 3 1 4
// 一开始，1、2两个任务进入队列
// 500ms时，2完成，输出2，任务3进队
// 800ms时，3完成，输出3，任务4进队
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4

// promise串行
function repeat (func, times, wait) {
    let result =[]
    return function(value) {
      for (let i = 0; i < times; i++) {
        result.push(function() {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              func(value)
              resolve()
            },wait)
          })
        })
      }
      result.reduce((prev, next) => (
        prev.then(() => next())
      ), Promise.resolve())
    }
  }
   
  // 使下面调用代码能正常工作
  const repeatFunc = repeat(console.log, 4, 3000);
  repeatFunc("hello world");//会输出4次 hello world, 每次间隔3秒

// 柯里化
  var add = function(){
    let sum = 0;
    for(let i=0,len=arguments.length;i<len;i++){
        sum += arguments[i];
    }
    return sum;
}
 
var sum = function(){
    var args = Array.prototype.slice.call(arguments); // args形成闭包，存储所有待求和的参数
    var __curry = function(){
        if(arguments.length === 0){
            return add.apply(this,args); //无参数时直接返回求和的值
        }else{
            args = args.concat(Array.prototype.slice.call(arguments));//如果后续继续有参数，直接返回该函数
            console.log(args);
            return __curry; // 
        }
    }
    return __curry;
}
 
console.log(sum(1)(2)()); // 3
console.log(sum(4)(5)(6)()); // 15

class LazyMan {
    constructor (name) {
      this.taskQueue = [];
      this.runTimer = null;
      this.sayHi(name);
    }
  
    run () {
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
      return this;
    }
  
    sayHi (name) {
      this.taskQueue.push(async () => console.log(`Hi, this is ${name}`));
      return this.run();
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
  
    async _timeout (second) {
      await new Promise(resolve => {
        setTimeout(resolve, second * 1e3);
      })
    }
  }
  
  // 测试
  var LazyMan = name => new _LazyMan(name)
  
  // lazyMan('Hank');
  lazyMan('Hank').sleep(10).eat('dinner');

  /**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const res = [];
    const used = {};
    let count = 0;
    function dfs(path) {
        if (path.length === nums.length) {
            res.push(path.slice());
            return;
        }
        for (const num of nums) {
            if (count === 1) return;
            for(let i = 0; i<num.length; i++) {
                if (used[num[i]]) continue;
                path.push(num[i]);
                for(let j = 0; j < num.length; j++) {
                    used[num[j]] = true;
                }
                dfs(path);
                path.pop();
                for(let j = 0; j < num.length; j++) {
                    used[num[j]] = false;
                }
            }
            count++;
        }
    }
    dfs([])
    return res.map((item) => item.sort());
};

var permute = function(nums) {
    let result = [];
    let used = {};
    function dfs (path) {
        if (path.length === nums.length) {
            result.push(path.slice());
            return;
        }
        for(let i = 0; i < nums.length; i++) {
            if (used[nums[i]]) {
                continue;
            }
            path.push(nums[i]);
            used[nums[i]] = true;
            dfs(path);
            path.pop();
            used[nums[i]] = false;
        }
    }
    dfs([]);
    return result;
};

[['a', 'b','c'], ['d', 'e','f']]

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


    // 2, 4, 3, 1

// reduce
Array.prototype.reduce = function(callback,prev){
  // this 代表这个源数组
  for(let i=0;i<this.length;i++){
      if(prev===undefined){
          prev = callback(this[i],this[i+1],i+1,this)
          i++
      }else{
          prev = callback(prev,this[i],i,this)
      }
  } 
  return prev
}

// Promise.all
function all(arr){
  //返回一个promise
  return new Promise((res,rej) => {
    let length = arr.length  //传入的promise的个数
    let count = 0  //进入fullfilled的promise个数
    const result = []  //创建一个等长的数组,放置结果
    // 当传递是一个空数组，返回一个为fulfilled状态的promise
    if(arr.length === 0 ) {
      return new Promise.resolve(arr)
    }
    for(let i = 0; i < arr.length; i++){
      arr[i].then(resolve => {
        result.push(resolve) //将每次结果保存在result数组中
        count ++  //个数加1
        //是否所有的promise都进入fullfilled状态
        if(count === length){
          res(result)  //返回结果
        }
      }).catch(e => {
        rej(e)  //如果有错误则直接结束循环，并返回错误
      })
    }
  })
}
// Promise.race
function race(arr){
  return new Promise((res,rej) => {
    for(let i = 0; i < arr.length; i++){
      arr[i].then(resolve => {
        res(resolve)  //某一promise完成后直接返回其值
      }).catch(e => {
        rej(e)  //如果有错误则直接结束循环，并返回错误
      })
    }
  })
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


timeout(2000).then(()=>{
  console.log('2s');
  return timeout(2000).then(value =>{
      console.log('2s-');
  })
})

// Ajax是异步的返回一个promise，那你怎么使用XHR封装一个ajax？
function ajax(options) {
  //这个options时传入给ajax的配置参数
  return new Promise((resolve, reject) => {
    //返回一个promise对象 resolve成功是的处理，reject失败时的处理
    if (!options.url) { // 需要请求的路径
      console.log("请确认你的url路径");
      return;
    }
    let method = options.method || "GET"; //请求方式如果没有就默认为get
    let async = options.async || true; //ajax是否异步请求默认位true
    let xhr = new XMLHttpRequest();
    if (method === "GET") {
      xhr.open(method, options.url + "?" + Math.random(), async); //防止缓存
      xhr.send(null);
    } else if (method === "POST") {
      xhr.open(method, options.url, async);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(options.data);
    }
    // xhr.responseType = options.type || "";

    xhr.onreadystatechange = () => {
      if (xhr.responseText) {
        //有数据说明相应成功
        resolve(xhr.responseText);
      }
    };
    xhr.onerror = err => {
      reject(err);
    };
  }).catch(e => {});
}

// promise实现同一时间内限制并发请求数
let getRequestFn = function(time){
  return ()=>{
      return new Promise((resolve,reject)=>{
          setTimeout(() => {
              resolve(time)
          }, time);
      })
  }
} // 执行函数可返回一个自定义请求事件的函数，用来模拟请求

// 要保证同时同时有pool个请求执行
function createRequest(tasks=[],pool){
  pool = pool || 5; //限制并发的数量
  let results = [];
  let running = 0; // 当前运行个数
  let resultsLength = tasks.length; // 用来判断最后的是否全部成功
  return new Promise((resolve,reject)=>{
      next();
      function next(){
          while(running < pool && tasks.length){ // 这个wile循环保证 一直有pool个请求在进行
          running++;
          let task = tasks.shift();
          task().then(result => {
              results.push(result);
          }).finally(()=>{
              running--;
              next();
          })
          }
          if(results.length === resultsLength) { // 全部执行结束
              resolve(results);
          }
      }
  })
}

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


const hasPathSum = (root, sum) => {
if (root == null) { // 遍历到null节点
  return false;
}                
if (root.left == null && root.right == null) { // 遍历到叶子节点
  return sum - root.val == 0;                  // 如果满足这个就返回true。否则返回false
}
// 不是上面的情况，则拆成两个子树的问题，其中一个true了就行
return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val); 
}
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

// 深拷贝
function deepCopy(obj1) {
  var obj2 = Array.isArray(obj1) ? [] : {};
  if (obj1 && typeof obj1 === "object") {
    for (var i in obj1) {
      if (obj1.hasOwnProperty(i)) {
        // 如果子属性为引用数据类型，递归复制
        if (obj1[i] && typeof obj1[i] === "object") {
          obj2[i] = deepCopy(obj1[i]);
        } else {
          // 如果是基本数据类型，只是简单的复制
          obj2[i] = obj1[i];
        }
      }
    }
  }
  return obj2;
}
var obj1 = {
  a: 1,
  b: 2,
  c: {
    d: 3
  }
}
var obj2 = deepCopy(obj1);
obj2.a = 3;
obj2.c.d = 4;
alert(obj1.a); // 1
alert(obj2.a); // 3
alert(obj1.c.d); // 3
alert(obj2.c.d); // 4

var generateParenthesis = function (n) {
  let set = new Set(['()']);
  for (let c = 2; c <= n; c++) {
      let nextSet = new Set();
      for (const s of set) {
          for (let j = 0; j <= s.length; j++) {
              nextSet.add(s.slice(0, j) + '()' + s.slice(j));
          }
      }
      set = nextSet;
  }
  return [...set];
};


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

function create(proto, propertiesObject = undefined){ // proto 新创建对象的原型对象, propertiesObject 要定义其可枚举属性或修改的属性描述符的对象
  if(typeof proto !== 'object' && proto !== null && typeof proto !== 'function') // 只能是 null 或者 object
    throw Error('Uncaught TypeError: Object prototype may only be an Object or null');
    
  function F(){} // 创建一个空的构造函数 F
  F.prototype = proto; // F 原型指向 proto
  let obj = new F(); // 创建 F 的实例

  if(propertiesObject !== undefined) // propertiesObject有值则调用 Object.defineProperties
   Object.defineProperties(obj, propertiesObject); 
  
  return obj; // 返回 这个 obj
}

class EventBus {
  constructor(){}
  handlerBus={}
  //注册
  $on(eventName,handler){
      if(!this.handlerBus.hasOwnProperty(eventName)){
          this.handlerBus[eventName] = []
      }
      this.handlerBus[eventName].push(handler)
  }
  //触发
  $emit(eventName,handlerParams){
      if(!this.handlerBus.hasOwnProperty(eventName)){
          return new Error('未注册该事件')
      }
      const eventHandlers = this.handlerBus[eventName]
      for(let i = 0;i<eventHandlers.length;i++){
          eventHandlers[i](handlerParams)
      }
  }
  //触发一次
  $onece(eventName,handlerParams){
      this.$emit(eventName,handlerParams)
      this.$remove(eventName)
  }
  //移除
  $remove(eventName,handler){
      if(!this.handlerBus.hasOwnProperty(eventName)){
          return new Error('未注册该事件')
      }
      if(!handler){
          //如果没指定移除的子handler 则移除整个eventName
          Reflect.defineProperty(this.handlerBus,eventName)
          return
      }
      //如果指定了handler
      const eventHandlers = this.handlerBus[eventName]
      const handlerIndex = eventHandlers.findIndex(event=>event === handler)
      if(handlerIndex === -1){
          return new Error('未绑定该事件')
      }
      this.handlerBus[eventName].splice(handlerIndex,1)
      if(this.handlerBus[eventName].length === 0)Reflect.defineProperty(this.handlerBus,eventName)
  }
}
export default EventBus

const EventBusObj = new EventBus()
const f1=(p)=>{
    console.log('f1')
    console.log(p)
}
const f2=(p)=>{
    console.log('f2')
    console.log(p)
}
        //注册
EventBusObj.$on('event1',f1)
EventBusObj.$on('event1',f2)
          
 
       //触发
EventBusObj.$emit('event1',{a:1})
       //移除event1的f1方法
EventBusObj.$remove('event1',f1)   

// 股票的最大利润涵手续费
var maxProfit = function(prices, fee) {
  let value = prices[0]
  let sum = 0;
  for (let i = 0; i < prices.length; i++) {
      if (value > prices[i]) {
          value = prices[i]
      } else if ((t = prices[i] - value - fee) > 0){
          console.log(t,i)
          sum = sum + t;
          value = prices[i] -fee;
      }
  }
  return sum;
};

// 中心扩散法求最长回文子串
/**
 * @param {string} s
 * @return {string}
 */
 var longestPalindrome = function(s) {
  let res = ""
  for (let i = 0; i < s.length; i++) {
      const s1 = palindrome(s, i, i);
      const s2 = palindrome(s, i, i+1);
      res = res.length <= s1.length ? s1 : res;
      res = res.length <= s2.length ? s2 : res;
  }
  return res
};

function palindrome(s, l, r) {
  while(l >= 0 && r < s.length && s[l] == s[r]) {
      l--;
      r++
  }
  return s.slice(l+1,r)
}

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

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
 var sumNumbers = function(root) {
  return dfs(root, 0);
};

var dfs = (root, prevSum) => {
  if (root === null) return 0;
  const sum = prevSum*10 + root.val
  if (root.left === null && root.right === null){
      return sum;
  } else {
      return dfs(root.left, sum) + dfs(root.right, sum);
  }
}

/**
 * @param {number[]} nums
 * @return {number}
 */
 var maxSubArray = function(nums) {
  let max = nums[0];
  let sum = 0;
  for (let i = 0; i< nums.length; i++) {
      if (sum >= 0) {
          sum = sum + nums[i];
      } else {
          sum = nums[i]
      }
      if (sum > max) {
          max = sum;
      }
  }
  return max;
};

// 公共父节点
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
 var lowestCommonAncestor = function(root, p, q) {
  return dfs(root, p, q)
};

function dfs(root, p, q) {
  if(!root || root === p || root === q) return root;
  let left = dfs(root.left, p, q);
  let right = dfs(root.right, p, q);
  if (!left && !right) {
      return null
  } else if(!left && right) {
      return right
  } else if(!right && left) {
      return left
  }
  return root;
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

/**
* Your LRUCache object will be instantiated and called as such:
* var obj = new LRUCache(capacity)
* var param_1 = obj.get(key)
* obj.put(key,value)
*/


function test() {
  let value = 0;
  setTimeout(() =>{
    console.log('set1',value)
  }, 10000)
  setTimeout(() =>{
    console.log('set2',value)
  }, 1000)
  const a = new Promise((resolve, reject) => {
    setTimeout(() =>{
      console.log('set3',value)
    }, 1000)
    resolve(value+1)
  }).then((res) => {
    value = res
    console.log('res',res)
  })
}
test()

function test() {
  let value = 0;
  setTimeout(() =>{
    console.log('set1',value)
  }, 9000)
  setTimeout(() =>{
    console.log('set2',value)
  }, 1000)
  const a = new Promise((resolve, reject) => {
    setTimeout(() =>{
      console.log('set3',value)
      resolve(value+1)
    }, 10000)
  }).then((res) => {
    value = res
    console.log('res',res)
  })
}
test()

function test() {
  let value = 0;
  setTimeout(() =>{
    console.log('set1',value)
    value = 3
  }, 9000)
  setTimeout(() =>{
    console.log('set2',value)
    value = 2
  }, 4000)
  setTimeout(() =>{
    console.log('set3',value)
    value = 1
  }, 1000)
}
test()

var synchronousFile = function(id) {
  console.log('开始同步文件，id为:' + id)
}

var proxySynchronousFuke = (function() {
  var cache = [],
  timer;

  return function(id) {
    cache.push(id);
    if (timer) {
      return;
    }
    timer = setTimeout(function() {
      synchronousFile(cache.join(','));
      clearTimeout(timer);
      timer = null;
      cache.length = 0;
    }, 2000);
  }
})();

var checkbox = document.getElementsByTagName('input');

for (var i = 0, c; c = checkbox[i++];) {
  c.onclick = function() {
    if (this.checked === true) {
      proxySynchronousFuke(this.id)
    }
  }
}

var createProxyFactory = function(fn) {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ',');
    if ( args in cache) {
      return cache[args];
    }
    return cache[args] = fn.apply(this, arguments)
  }
}


var Singleton = function (name) {
  this.name = name;
}

Singleton.instance = null;

Singleton.prototype.getName = function() {
  alert(this.name)
}

Singleton.getInstance = function(name) {
  if(!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance
}

// 动态创建命名空间

MyApp.namespace = function (name) {
  var parts = name.split('.');
  var current = MyApp;
  for(var i in parts) {
    if (!current[parts[i]]) {
      current[parts[i]]= {}
    }
    current = current[parts[i]];
  }
};

MyApp.namespace('event');
MyApp.namespace('dom.style');

console.dir(MyApp);

var MyApp = {
  event: {},
  dom: {
    style: {}
  }
}


var user = (function() {
  var __name = 'sven',
  __age = 29;

  return {
    getUserInfo: function() {
      return __name + '-' + __age
    }
  }
})


Singleton.getInstance = (function() {
  var instance = null;
  return function(name) {
    if (!instance) {
      instance = new Singleton(name);
    }
    return instance;
  }
})

var createIframe = (function() {
  var iframe;
  return function() {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    return iframe;
  }
})


var getSingle = function(fn) {
  var result;
  return function() {
    return result || (result = fn.apply(this, arguments));
  }
}

var createLoginLayer = function() {
  var div = document.createElement('div');
  div.innerHTML = 'i am login dialog';
  div.style.display = 'none';
  document.body.appendChild(div);
}

var createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById('loginBtn').onClick = function() {
  var loginLayer = createSingleLoginLayer();
  loginLayer.style.display = 'block'
}


// 观察者模式
class Observer {
  constructor(name) {
    this.name = name;
  }

  update({taskType, taskInfo}) {
    if (taskType === 'route') {
      console.log(`${this.name}不需要日常任务`);
      return ;
    }
    this.goTaskHome(taskInfo);
  }

  goToTaskHome(info) {
    console.log(`${this.name}去任务大殿抢${info}任务`);
  }
}


class Subject {
  constructor() {
    this.observerList = []
  }
  addObserver(observer) {
    this.observerList.push(observer);
  }
  notify(task) {
    console.log("发布五星任务");
    this.observerList.forEach(observer => observer.update(task))
  }
}

const subject = new Subject();
const stu1 = new Observer("弟子1");
const stu2 = new Observer("弟子2");

subject.addObserver(stu1);
subject.addObserver(stu2);

// 任务殿发布五星战斗任务
const warTask = {
  taskType: 'war',
  taskInfo: "猎杀时刻"
}

// 任务大殿通知购买权限弟子
subject.notify(warTask);

// 任务殿发布五星日常任务
const routeTask = {
  taskType: 'route',
  taskInfo: "种树浇水"
}

subject.notify(routeTask);

// 发布订阅模式

class PubSub {
  constructor() {
    this.events = {};
  }

  subscribe(type, cb) {
    if (!this.events[type]) {
      this.events[type] = []
    }

    this.events[type].push(cb);
  }

  publish(type, ...args) {
    if (this.events[type]) {
      this.events[type].forEach(cb => cb(...args))
    }
  }

  unsubscribe(type, cb) {
    if (this.events[type]) {
      const cbIndex = this.events[type].findIndex(e => e === cb);
      if (cbIndex != -1) {
        this.events[type].splice(cbIndex, 1);
      }
    }
    if (this.events[type].length === 0) {
      delete this.events[type];
    }
  }
  unsubscribeAll(type) {
    if (this.events[type]) {
      delete this.events[type];
    }
  }
}

// 创建一个中介公司
let pubsub = new PubSub();

// 弟子一订阅战斗任务
pubsub.subscribe('warTask', function (taskInfo){
    console.log("宗门殿发布战斗任务，任务信息:" + taskInfo);
})
// 弟子一订阅战斗任务
pubsub.subscribe('routeTask', function (taskInfo) {
    console.log("宗门殿发布日常任务，任务信息:" + taskInfo);
});
// 弟子三订阅全类型任务
pubsub.subscribe('allTask', function (taskInfo) {
    console.log("宗门殿发布五星任务，任务信息:" + taskInfo);
});

// 发布战斗任务
pubsub.publish('warTask', "猎杀时刻");
pubsub.publish('allTask', "猎杀时刻");

// 发布日常任务
pubsub.publish('routeTask', "种树浇水");
pubsub.publish('allTask', "种树浇水");


  //声明父类
  var SuperClass = function () {
    var id = 1;
    this.name = ['javascript'];
    this.superValue = function () {
        console.log('superValue is true');
        console.log(id)
    }
  };

  //为父类添加共有方法
  SuperClass.prototype.getSuperValue = function () {
      return this.superValue();
  };

  //声明子类
  var SubClass = function () {
      this.subValue = function () {
          console.log('this is subValue ')
      }
  };

  //继承父类
  SubClass.prototype = new SuperClass() ;

  //为子类添加共有方法
  SubClass.prototype.getSubValue= function () {
      return this.subValue()
  };

  var sub = new SubClass();
  var sub2 =  new  SubClass();

  sub.getSuperValue();   //superValue is true
  sub.getSubValue();     //this is subValue

  console.log(sub.id);    //undefined
  console.log(sub.name);  //javascript

  sub.name.push('java');  //["javascript"]
  console.log(sub2.name)  //["javascript", "java"]



// 缓存优化的手段
var mult = (function() {
  var cache = {};
  var calculate = function() {
    var a = 1;
    for(var i = 0, l = arguments.length; i < l; i++) {
      a = a * arguments[i];
    }
    return a;
  };

  return function() {
    var args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = calculate.apply(null, arguments)
  }
})


var Type = {};

for (var i = 0, type; type =[])