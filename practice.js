
// 一个异步任务调度器，最多同时执行两个异步任务

class Scheduler {
	constructor() {
		this.tasks = [], // 待运行的任务
		this.usingTask = [] // 正在运行的任务
	}
	// promiseCreator 是一个异步函数，return Promise
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
			promiseCreator.resolve()
			this.usingMove(promiseCreator)
			if (this.tasks.length > 0) {
				this.usingRun(this.tasks.shift())
			}
		})
	}

	usingMove(promiseCreator) {
		let index = this.usingTask.findIndex(promiseCreator)
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
addTask(200, 2) 
addTask(300, 3) 
addTask(100, 1) 

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

function request(tasks,pool){
    pool = pool || 5;
    let results = [];
    let running = 0;
    while(tasks.length > 0){ // 如果还有请求未执行
        if(running < pool) { // 如果小于并发次数 就再取出请求方法执行
            let task = tasks.shift();
            running++; 
            task().then(result => {
                results.push(result); // 将执行结果存入数组
                running --; // 当前执行个数减一
            });
        }
    }
}

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

//创建模拟请求任务
let tasks = [getRequestFn(4000),getRequestFn(2000),getRequestFn(2000),getRequestFn(2000)];
// 发送请求 并发数为2
console.time();
createRequest(tasks,2).then((value)=>{
    console.log(value)
    console.timeEnd();
})
// 输出
// [ 2000, 4000, 2000, 2000 ]
// default: 6.016s
// 可以看到执行了6s 因为同时只有两个请求可以发送 2000, 4000 =》 2000 结束以后 又执行一个2000的 最后 4000结束 执行2000的 一共6s

// promise的超时重新请求，参数（fn，times，interval）
// 模拟ajax请求
function ajaxFn(resolve, reject){
    var random = Math.random() * 10;
    setTimeout(()=>{
      if(random > 9){
        resolve('成功了：' + random)
      }else{
        reject('失败了：' + random)
      }
    }, random)
}
/**
 * promise轮询函数封装  处理ajaxFunc
 * @param {funtion} ajaxFunc 需要处理的函数
 * @param {number} times 最大重连次数，默认3次
 * @param {number} cur 当前连接次数
 */
function maxPolling(ajaxFunc, times = 3, cur = 1){
  console.log('第'+ cur +'次连接了!')
  return new Promise(function(resolve, reject){
    ajaxFunc(resolve, reject);
  }).then(res=>{
    return res;
  }, err=>{
    if(cur >= times){
      return err
    }else{
      return maxPolling(ajaxFunc, times, cur + 1);
    }
  });
}

maxPolling(ajaxFn).then(res=>{
  console.log(res);
}).catch(err=>{
  console.log(err);
});

// sleep函数
//Promise
const sleep = time => {
    return new Promise(resolve => setTimeout(resolve,time))
  }
  
  sleep(1000).then(()=>{
    console.log(1)
  })
  
  //Generator
  function* sleepGenerator(time) {
    yield new Promise(function(resolve,reject){
      setTimeout(resolve,time);
    })
  }
  sleepGenerator(1000).next().value.then(()=>{console.log(1)})
  
  
  //async
  function sleep(time) {
    return new Promise(resolve => setTimeout(resolve,time))
  }
  async function output() {
    let out = await sleep(1000);
    console.log(1);
    return out;
  }
  output();
  
  //ES5
  function sleep(callback,time) {
    if(typeof callback === 'function')
      setTimeout(callback,time)
  }
  
  function output(){
    console.log(1);
  }
  sleep(output,1000);


  // 柯里化
  function add(){
    //第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);
    //在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值。
    var _adder = function(){
        _args.push(...arguments);
        return _adder;
    };
    //利用toString隐式转换的特性，当最后执行隐式转换，并计算最终返回的值
    _adder.toString = function(){
        return _args.reduce(function(a,b){
            return a+b;
        });
    }
    return _adder;
}

add(1)(2)(3);
add(1,2,3)(4);
add(1)(2)(3)(4)(5);

// lazyMan
class _LazyMan {
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
  // lazyMan('Hank').eat('dinner').eat('supper');
  // lazyMan('Hank').sleepFirst(5).eat('supper');
// 手写redux
function createStore(reducer) {
    // 创建一个 store 对象
    let state; // 状态对象
    let listeners = []; // 监听器
  
    // 订阅器
    function subscribe(callback) {
      listeners.push(callback); // 每订阅一个，就为监听器添加一个回调函数
    }
  
    // 更新 state
    function dispatch(action) {
      state = reducer(state, action); // 更新 state
      listeners.forEach(i => {
        // 通知所有订阅者
        i();
      });
    }
  
    // 获取 state
    function getState() {
      return state;
    }
  
    // 返回 store 对象
    return {
      subscribe,
      dispatch,
      getState
    };
  }


  // 数组拍平
  const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];
// 扩展运算符 + concat
[].concat(...arr)
// [1, 2, 3, 4, 1, 2, 3, [1, 2, 3, [1, 2, 3]], 5, "string", { name: "弹铁蛋同学" }];

// concat + apply
[].concat.apply([], arr);
// [1, 2, 3, 4, 1, 2, 3, [1, 2, 3, [1, 2, 3]], 5, "string", { name: "弹铁蛋同学" }];

// toString  + split
const arr2 =[1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]]]
arr2.toString().split(',').map(v=>parseInt(v))
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3]

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];
// concat + 递归
function flat(arr) {
  let arrResult = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      arrResult = arrResult.concat(arguments.callee(item));   // 递归
      // 或者用扩展运算符
      // arrResult.push(...arguments.callee(item));
    } else {
      arrResult.push(item);
    }
  });
  return arrResult;
}
flat(arr)
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];


const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]

// 首先使用 reduce 展开一层
arr.reduce((pre, cur) => pre.concat(cur), []);
// [1, 2, 3, 4, 1, 2, 3, [1, 2, 3, [1, 2, 3]], 5, "string", { name: "弹铁蛋同学" }];

// 用 reduce 展开一层 + 递归
const flat = arr => {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
  }, []);
};
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];

// 栈思想
function flat(arr) {
    const result = []; 
    const stack = [].concat(arr);  // 将数组元素拷贝至栈，直接赋值会改变原数组
    //如果栈不为空，则循环遍历
    while (stack.length !== 0) {
      const val = stack.pop(); 
      if (Array.isArray(val)) {
        stack.push(...val); //如果是数组再次入栈，并且展开了一层
      } else {
        result.unshift(val); //如果不是数组就将其取出来放入结果数组中
      }
    }
    return result;
  }
  const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
  flat(arr)
  // [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];

  // reduce + 递归
function flat(arr, num = 1) {
    return num > 0
      ? arr.reduce(
          (pre, cur) =>
            pre.concat(Array.isArray(cur) ? flat(cur, num - 1) : cur),
          []
        )
      : arr.slice();
  }
  const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
  flat(arr, Infinity);
  // [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];


  function* flat(arr, num) {
    if (num === undefined) num = 1;
    for (const item of arr) {
      if (Array.isArray(item) && num > 0) {   // num > 0
        yield* flat(item, num - 1);
      } else {
        yield item;
      }
    }
  }
  const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
  // 调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象。
  // 也就是遍历器对象（Iterator Object）。所以我们要用一次扩展运算符得到结果
  // [...flat(arr, Infinity)]    
  // [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];

  Array.prototype.fakeFlat = function(num = 1) {
    if (!Number(num) || Number(num) < 0) {
      return this;
    }
    let arr = this.concat();    // 获得调用 fakeFlat 函数的数组
    while (num > 0) {           
      if (arr.some(x => Array.isArray(x))) {
        arr = [].concat.apply([], arr);	// 数组中还有数组元素的话并且 num > 0，继续展开一层数组 
      } else {
        break; // 数组中没有数组元素并且不管 num 是否依旧大于 0，停止循环。
      }
      num--;
    }
    return arr;
  };
  const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]
  arr.fakeFlat(Infinity)
  // [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];


  // reduce + 递归
Array.prototype.fakeFlat = function(num = 1) {
    if (!Number(num) || Number(num) < 0) {
      return this;
    }
    let arr = [].concat(this);
    return num > 0
      ? arr.reduce(
          (pre, cur) =>
            pre.concat(Array.isArray(cur) ? cur.fakeFlat(--num) : cur),
          []
        )
      : arr.slice();
  };
  const arr = [1, [3, 4], , ,];
  arr.fakeFlat()
  // [1, 3, 4]
  
  // foEach + 递归
  Array.prototype.fakeFlat = function(num = 1) {
    if (!Number(num) || Number(num) < 0) {
      return this;
    }
    let arr = [];
    this.forEach(item => {
      if (Array.isArray(item)) {
        arr = arr.concat(item.fakeFlat(--num));
      } else {
        arr.push(item);
      }
    });
    return arr;
  };
  const arr = [1, [3, 4], , ,];
  arr.fakeFlat()
  // [1, 3, 4]

  // 数组去重
  function unique (arr) {
    return Array.from(new Set(arr))
  }
  var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
  console.log(unique(arr))
   //[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]

   function unique(arr){            
    for(var i=0; i<arr.length; i++){
        for(var j=i+1; j<arr.length; j++){
            if(arr[i]==arr[j]){         //第一个等同于第二个，splice方法删除第二个
                arr.splice(j,1);
                j--;
            }
        }
    }
return arr;
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
//[1, "true", 15, false, undefined, NaN, NaN, "NaN", "a", {…}, {…}]     //NaN和{}没有去重，两个null直接消失了

function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array .indexOf(arr[i]) === -1) {
            array .push(arr[i])
        }
    }
    return array;
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
   // [1, "true", true, 15, false, undefined, null, NaN, NaN, "NaN", 0, "a", {…}, {…}]  //NaN、{}没有去重

   function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return;
    }
    arr = arr.sort()
    var arrry= [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i-1]) {
            arrry.push(arr[i]);
        }
    }
    return arrry;
}
     var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
        console.log(unique(arr))
// [0, 1, 15, "NaN", NaN, NaN, {…}, {…}, "a", false, null, true, "true", undefined]      //NaN、{}没有去重

function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var arrry= [];
     var  obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            arrry.push(arr[i])
            obj[arr[i]] = 1
        } else {
            obj[arr[i]]++
        }
    }
    return arrry;
}
    var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
        console.log(unique(arr))
//[1, "true", 15, false, undefined, null, NaN, 0, "a", {…}]    //两个true直接去掉了，NaN和{}去重

function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array =[];
    for(var i = 0; i < arr.length; i++) {
            if( !array.includes( arr[i]) ) {//includes 检测数组是否有某个值
                    array.push(arr[i]);
              }
    }
    return array
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
    console.log(unique(arr))
    //[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}, {…}]     //{}没有去重


    function unique(arr) {
        var obj = {};
        return arr.filter(function(item, index, arr){
            return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
        })
    }
        var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
            console.log(unique(arr))
    //[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}]   //所有的都去重了

    function unique(arr) {
        return arr.filter(function(item, index, arr) {
          //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
          return arr.indexOf(item, 0) === index;
        });
      }
          var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
              console.log(unique(arr))
      //[1, "true", true, 15, false, undefined, null, "NaN", 0, "a", {…}, {…}]


      function unique(arr) {
        var array= arr;
        var len = array.length;

    array.sort(function(a,b){   //排序后更加方便去重
        return a - b;
    })

    function loop(index){
        if(index >= 1){
            if(array[index] === array[index-1]){
                array.splice(index,1);
            }
            loop(index - 1);    //递归loop，然后数组去重
        }
    }
    loop(len-1);
    return array;
}
 var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
//[1, "a", "true", true, 15, false, 1, {…}, null, NaN, NaN, "NaN", 0, "a", {…}, undefined]


function arrayNonRepeatfy(arr) {
    let map = new Map();
    let array = new Array();  // 数组用于返回结果
    for (let i = 0; i < arr.length; i++) {
      if(map .has(arr[i])) {  // 如果有该key值
        map .set(arr[i], true); 
      } else { 
        map .set(arr[i], false);   // 如果没有该key值
        array .push(arr[i]);
      }
    } 
    return array ;
  }
   var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
      console.log(unique(arr))
  //[1, "a", "true", true, 15, false, 1, {…}, null, NaN, NaN, "NaN", 0, "a", {…}, undefined]

  function unique(arr){
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr));
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}, {…}]

[...new Set(arr)] 
//代码就是这么少----（其实，严格来说并不算是一种，相对于第一种方法来说只是简化了代码）


// 防抖与节流：

// 暴力版： 定时器期间，有新操作时，清空旧定时器，重设新定时器
var debounce = (fn, wait) => {
	let timer, timeStamp=0;
	let context, args;

  let run = ()=>{
    timer= setTimeout(()=>{
      fn.apply(context,args);
    },wait);
  }
  let clean = () => {
    clearTimeout(timer);
  }

  return function(){
    context=this;
    args=arguments;
    let now = (new Date()).getTime();

      if(now-timeStamp < wait){
        console.log('reset',now);
        clean();  // clear running timer 
        run();    // reset new timer from current time
      }else{
        console.log('set',now);
        run();    // last timer alreay executed, set a new timer
      }
      timeStamp=now;
	}
}

//  优化版： 定时器执行时，判断start time 是否向后推迟了，若是，设置延迟定时器
var debounce = (fn, wait) => {
	let timer, startTimeStamp=0;
	let context, args;
  let run = (timerInterval)=>{
    timer= setTimeout(()=>{
      let now = (new Date()).getTime();
      let interval=now-startTimeStamp
      if(interval<timerInterval){ // the timer start time has been reset, so the interval is less than timerInterval
        console.log('debounce reset',timerInterval-interval);
        startTimeStamp=now;
        run(wait-interval);  // reset timer for left time 
      }else{
        fn.apply(context,args);
        clearTimeout(timer);
        timer=null;
      }

    },timerInterval);
  }

  return function(){
    context=this;
    args=arguments;
    let now = (new Date()).getTime();
    startTimeStamp=now;
    if(!timer){
      console.log('debounce set',wait);
      run(wait);    // last timer alreay executed, set a new timer
    }
  }
}

// 增加前缘触发功能
var debounce = (fn, wait, immediate=false) => {
	let timer, startTimeStamp=0;
	let context, args;
  let run = (timerInterval)=>{
    timer= setTimeout(()=>{
      let now = (new Date()).getTime();
      let interval=now-startTimeStamp
      if(interval<timerInterval){ // the timer start time has been reset，so the interval is less than timerInterval
        console.log('debounce reset',timerInterval-interval);
        startTimeStamp=now;
        run(wait-interval);  // reset timer for left time 
      }else{
        if(!immediate){
          fn.apply(context,args);
        }
        clearTimeout(timer);
        timer=null;
      }

    },timerInterval);
  }

  return function(){
    context=this;
    args=arguments;
    let now = (new Date()).getTime();
    startTimeStamp=now; // set timer start time

    if(!timer){
      console.log('debounce set',wait);
      if(immediate) {
        fn.apply(context,args);
      }
      run(wait);    // last timer alreay executed, set a new timer
    }
  }
}

//函数快速执行，触发防抖
const useDebounceFn = (fn,time,dep=[])=>{
    const { current } = useRef({fn,timeOut:null})//使用useRef进行变量timeOut的记录
      useEffect(()=>{
      current.fn = fn
    },[fn])
    return useCallback((param)=>{
      if(current.timeOut){
        clearTimeout(current.timeOut)
      }
      current.timeOut = setTimeout(()=>{
        current.fn(param)
      },time)
    },dep)
  }

  // 简单版： 定时器期间，只执行最后一次操作
var throttling = (fn, wait) => {
	let timer;
	let context, args;
 
	let run = () => {
		timer=setTimeout(()=>{
			fn.apply(context,args);
			clearTimeout(timer);
			timer=null;
		},wait);
	}
 
	return function () {
		context=this;
		args=arguments;
		if(!timer){
			console.log("throttle, set");
			run();
		}else{
			console.log("throttle, ignore");
		}
	}
}

// 增加前缘
var throttling = (fn, wait, immediate) => {
	let timer, timeStamp=0;
	let context, args;
 
	let run = () => {
		timer=setTimeout(()=>{
			if(!immediate){
				fn.apply(context,args);
			}
			clearTimeout(timer);
			timer=null;
		},wait);
	}
 
	return function () {
		context=this;
		args=arguments;
		if(!timer){
			console.log("throttle, set");
			if(immediate){
				fn.apply(context,args);
			}
			run();
		}else{
			console.log("throttle, ignore");
		}
	}
}

const useThrottle = (fn,time,dep=[])=>{
    const { current } = useRef({fn,timer:null})
    useEffect(()=>{
      current.fn = fn
    },[fn])
    return useCallback((param)=>{
      if(current.timer){
        return
      }
      current.timer = setTimeout(()=>{
        fn(param)
        current.time = null
      },time)
    },dep)
  }

//  千分位逗号分割
/**

 * 大数字转换 将数字分段显示，每三位用逗号隔开
 * @param value 数字值
   */
 export function formatNumber (value: string | number) {
    value = Number(value);
    return value.toLocaleString('en-US');
 };
 
 formatNumber(26666) //26,666


 // 大数相加
 let a = "9007199254740991";
let b = "1234567899999999999";

function add(a ,b){
   //取两个数字的最大长度
   let maxLength = Math.max(a.length, b.length);
   //用0去补齐长度
   a = a.padStart(maxLength , 0);//"0009007199254740991"
   b = b.padStart(maxLength , 0);//"1234567899999999999"
   //定义加法过程中需要用到的变量
   let t = 0;
   let f = 0;   //"进位"
   let sum = "";
   for(let i=maxLength-1 ; i>=0 ; i--){
      t = parseInt(a[i]) + parseInt(b[i]) + f;
      f = Math.floor(t/10);
      sum = t%10 + sum;
   }
   if(f == 1){
      sum = "1" + sum;
   }
   return sum;
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