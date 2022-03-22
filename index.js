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

const flat = arr => {
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? flat(cur) : cur);
  })
}


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
