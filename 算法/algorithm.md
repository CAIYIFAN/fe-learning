## 算法

### 数组

优点：

构建一个数组非常简单
可以在O(1)的时间内根据数组的下标查询某个元素

缺点：

构建时必须分配一段连续的空间
查询某个元素是否存在时需要遍历整个数组，耗费O(n)的时间，n为元素的个数
删除和增添某个元素时同样需要耗费O(n)的时间

应用场景：

只需要进行访问数据操作时使用数组

### 链表

链表就是为了避免数组的一大缺陷——开辟数组需要一片连续的空间，但也牺牲了数组的一些优点。

单链表：链表中为一个结点实际上是一个单独的对象，而所有对象都通过每个有元素中的引用字段链接在一起。

双链表：与单链表类似，但是每个结点中都含有两个引用字段。

优点：

灵活分配内存空间
能在O(1)时间内删除或者添加元素，前提：该元素前一个元素已知（单、双），该元素后一个元素已知（双）

缺点：
查询元素需要O(n)时间

应用场景：

数据元素个数不确定，需要经常添加和删除元素，不需要频繁查询数据时用链表

### 栈

特点：先进后出，可以用单链表实现

应用场景：

当问题只关心最近一次的操作，而且需要在O(1)的时间内查找到更前的一次操作时使用栈

### 队列

#### 普通队列

特点：先进先出，可以用双链表实现

应用场景：按一定顺序处理数据，而且数据在不断变化的时候（广度优先搜索）

#### 双端队列

特点：头尾两端都可以在O(1)的时间内进行数据查看、添加和删除操作，也可以用双链表实现

应用场景：实现一个长度动态变化的窗口或连续区间

### 数组与链表的区别

数组是我们平时用的最多的数据结构，是有序的元素序列。
它的特点是查询数据快，插入数据慢；内存分配是连续的内存，扩容需要重新分配内存。
数组之间是通过下标维护的，支持随机查找，查询的时间复杂度是O(1)；
插入和删除的时间复杂度是O(n)：插入最好的情况是在数组最后加一阶，那么直接将数组长度+1,时间复杂度是O(1)；删除最好的情况删除最后一个元素不用移动数组，时间复杂度O(1)。
数组如果申请的空间长度不够，扩展的时候会重新申请一段连续的内存空间不利于扩展。

链表平时用的比较少，是一种物理存储单元上非连续、非顺序的存储结构。
它的特点是:插入数据快，查询数据慢；内存分配不需要连续的内存，占用连续内存少。
查询的时间复杂度是：O(n)，效率低，需要从链表头依次查找
插入和删除的时间复杂度是：O(1)，插入时只需要改变指针的指向，不需要移动元素，效率高；删除只需要把上文指向新加的节点的指针变成指向原节点就好。
它的特点是和数组相反的；

联系数据元素的逻辑顺序是通过链表中的指针链接次序实现的。

### 前端基础算法

#### 数组拍平：
```javascript
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
```

##### 第二问：用 reduce 实现 flat 函数

```javascript
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
```

##### 第三问：使用栈的思想实现 flat 函数

```javascript
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
```

##### 第四问：通过传入整数参数控制“拉平”层数

```javascript
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
```

##### 第五问：使用 Generator 实现 flat 函数

```javascript
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
[...flat(arr, Infinity)]    
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];
```

##### 第六问：实现在原型链上重写 flat 函数

```javascript
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
```

##### 第七问：考虑数组空位的情况

由最开始我们总结的 flat 特性知道，flat 函数执行是会跳过空位的。ES5 大多数数组方法对空位的处理都会选择跳过空位包括：forEach(), filter(), reduce(), every() 和 some() 都会跳过空位。

所以我们可以利用上面几种方法来实现 flat 跳过空位的特性

```javascript
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
```

#### 数组去重：

##### 一、利用ES6 Set去重（ES6中最常用）

```javascript
function unique (arr) {
  return Array.from(new Set(arr))
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
 //[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]
```

不考虑兼容性，这种去重的方法代码最少。这种方法还无法去掉“{}”空对象，后面的高阶方法会添加去掉重复“{}”的方法。

##### 二、利用for嵌套for，然后splice去重（ES5中最常用）

```javascript
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
```

双层循环，外层循环元素，内层循环时比较值。值相同时，则删去这个值。

##### 三、利用indexOf去重

```javascript
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
```

新建一个空的结果数组，for 循环原数组，判断结果数组是否存在当前元素，如果有相同的值则跳过，不相同则push进数组。

##### 四、利用sort()

```javascript
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
```

利用sort()排序方法，然后根据排序后的结果进行遍历及相邻元素比对。

##### 五、利用对象的属性不能相同的特点进行去重（这种数组去重的方法有问题，不建议用，有待改进）

```javascript
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
```

##### 六、利用includes

```javascript
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
```

##### 七、利用hasOwnProperty

```javascript
function unique(arr) {
    var obj = {};
    return arr.filter(function(item, index, arr){
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}
    var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
        console.log(unique(arr))
//[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}]   //所有的都去重了
```

利用hasOwnProperty 判断是否存在对象属性

##### 八、利用filter

```javascript
function unique(arr) {
  return arr.filter(function(item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index;
  });
}
    var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
        console.log(unique(arr))
//[1, "true", true, 15, false, undefined, null, "NaN", 0, "a", {…}, {…}]
```

##### 九、利用递归去重

```javascript
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
```

##### 十、利用Map数据结构去重

```javascript
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
```

创建一个空Map数据结构，遍历需要去重的数组，把数组的每一个元素作为key存到Map中。由于Map中不会出现相同的key值，所以最终得到的就是去重后的结果。

##### 十一、利用reduce+includes

```javascript
function unique(arr){
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr));
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}, {…}]
```

##### 十二、[...new Set(arr)]

```javascript
[...new Set(arr)] 
//代码就是这么少----（其实，严格来说并不算是一种，相对于第一种方法来说只是简化了代码）
```

#### 防抖与节流：

##### 防抖：

触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。

debounce，去抖动。策略是当事件被触发时，设定一个周期延迟执行动作，若期间又被触发，则重新设定周期，直到周期结束，执行动作。 这是debounce的基本思想，在后期又扩展了前缘debounce，即执行动作在前，然后设定周期，周期内有事件被触发，不执行动作，且周期重新设定。

延迟debounce，示意图：

![img](https://img-blog.csdn.net/20180705005109564?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

前缘debounce，示意图

![img](https://img-blog.csdn.net/20180705005639201?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

debounce的特点是当事件快速连续不断触发时，动作只会执行一次。 延迟debounce，是在周期结束时执行，前缘debounce，是在周期开始时执行。但当触发有间断，且间断大于我们设定的时间间隔时，动作就会有多次执行。

debounce 的实现：

###### 版本1:  周期内有新事件触发，清除旧定时器，重置新定时器；这种方法，需要高频的创建定时器。

```javascript
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
```

###### 版本2: 周期内有新事件触发时，重置定时器开始时间撮，定时器执行时，判断开始时间撮，若开始时间撮被推后，重新设定延时定时器。

```javascript
// 优化版： 定时器执行时，判断start time 是否向后推迟了，若是，设置延迟定时器
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
```

###### 版本3: 在版本2基础上增加是否立即执行选项：

```javascript
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
```

###### 自定义Hook：

```javascript
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
```

###### 使用场景：

页面resize事件，常见于需要做页面适配的时候。需要根据最终呈现的页面情况进行dom渲染（这种情形一般是使用防抖，因为只需要判断最后一次的变化情况）

##### 节流：

高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率

throttling，节流的策略是，固定周期内，只执行一次动作，若有新事件触发，不执行。周期结束后，又有事件触发，开始新的周期。 节流策略也分前缘和延迟两种。与debounce类似，延迟是指 周期结束后执行动作，前缘是指执行动作后再开始周期。

延迟throttling示意图：

![img](https://img-blog.csdn.net/20180705012049136?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

前缘throttling 示意图：

![img](https://img-blog.csdn.net/20180705012224728?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1cGlhbjE5ODk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

throttling的特点在连续高频触发事件时，动作会被定期执行，响应平滑。

throttling 的实现：

###### 版本1: 简单版

```javascript
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
```

###### 版本2: 增加前缘选项：（考虑情况较简单，复杂情况可参考underscope 的_.throttle）

```javascript
/// 增加前缘
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
```

###### 自定义Hook：

```javascript
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
```

###### 使用场景：

搜索框input事件，例如要支持输入实时搜索可以使用节流方案（间隔一段时间就必须查询相关内容），或者实现输入间隔大于某个值（如500ms），就当做用户输入完成，然后开始搜索，具体使用哪种方案要看业务需求。

#### LazyMan ( LazyMan('Jack').eat('lunch').sleep(1).eat('dinner').sleepFirst(2) )

```javascript
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
```

#### Curry柯里化的实现？用途？

##### 一、什么是柯里化（ curry）

在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

举例来说，一个接收3个参数的普通函数，在进行柯里化后， 柯里化版本的函数接收一个参数并返回接收下一个参数的函数， 该函数返回一个接收第三个参数的函数。 最后一个函数在接收第三个参数后， 将之前接收到的三个参数应用于原普通函数中，并返回最终结果。

##### **数学和计算科学中的柯里化：**

```javascript
// 数学和计算科学中的柯里化：

//一个接收三个参数的普通函数
function sum(a,b,c) {
    console.log(a+b+c)
}

//用于将普通函数转化为柯里化版本的工具函数
function curry(fn) {
  //...内部实现省略，返回一个新函数
}

//获取一个柯里化后的函数
let _sum = curry(sum);

//返回一个接收第二个参数的函数
let A = _sum(1);
//返回一个接收第三个参数的函数
let B = A(2);
//接收到最后一个参数，将之前所有的参数应用到原函数中，并运行
B(3)    // print : 6
```

而对于`Javascript`语言来说，我们通常说的柯里化函数的概念，与数学和计算机科学中的柯里化的概念并不完全一样。

在数学和计算机科学中的柯里化函数，一次只能传递一个参数；

而我们`Javascript`实际应用中的柯里化函数，可以传递一个或多个参数。

**来看这个例子：**

```javascript
//普通函数
function fn(a,b,c,d,e) {
  console.log(a,b,c,d,e)
}
//生成的柯里化函数
let _fn = curry(fn);

_fn(1,2,3,4,5);     // print: 1,2,3,4,5
_fn(1)(2)(3,4,5);   // print: 1,2,3,4,5
_fn(1,2)(3,4)(5);   // print: 1,2,3,4,5
_fn(1)(2)(3)(4)(5); // print: 1,2,3,4,5
```

对于已经柯里化后的 `_fn `函数来说，当接收的参数数量与原函数的形参数量相同时，执行原函数； 当接收的参数数量小于原函数的形参数量时，返回一个函数用于接收剩余的参数，直至接收的参数数量与形参数量一致，执行原函数。

当我们知道柯里化是什么了的时候，我们来看看柯里化到底有什么用？

##### 二、柯里化的用途

柯里化实际是把简答的问题复杂化了，但是复杂化的同时，我们在使用函数时拥有了更加多的自由度。 而这里对于函数参数的自由处理，正是柯里化的核心所在。 柯里化本质上是降低通用性，提高适用性。**来看一个例子：**

我们工作中会遇到各种需要通过正则检验的需求，比如校验电话号码、校验邮箱、校验身份证号、校验密码等， 这时我们会封装一个通用函数 `checkByRegExp `,接收两个参数，校验的正则对象和待校验的字符串

```javascript
function checkByRegExp(regExp,string) {
    return regExp.test(string);  
}

checkByRegExp(/^1\d{10}$/, '18642838455'); // 校验电话号码
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com'); // 校验邮箱
```

上面这段代码，乍一看没什么问题，可以满足我们所有通过正则检验的需求。 但是我们考虑这样一个问题，如果我们需要校验多个电话号码或者校验多个邮箱呢？

**我们可能会这样做：**

```javascript
checkByRegExp(/^1\d{10}$/, '18642838455'); // 校验电话号码
checkByRegExp(/^1\d{10}$/, '13109840560'); // 校验电话号码
checkByRegExp(/^1\d{10}$/, '13204061212'); // 校验电话号码

checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com'); // 校验邮箱
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@qq.com'); // 校验邮箱
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@gmail.com'); // 校验邮箱
```

我们每次进行校验的时候都需要输入一串正则，再校验同一类型的数据时，相同的正则我们需要写多次， 这就导致我们在使用的时候效率低下，并且由于 `checkByRegExp `函数本身是一个工具函数并没有任何意义， 一段时间后我们重新来看这些代码时，如果没有注释，我们必须通过检查正则的内容， 我们才能知道我们校验的是电话号码还是邮箱，还是别的什么。

此时，我们可以借助柯里化对 `checkByRegExp `函数进行封装，以简化代码书写，提高代码可读性。

```javascript
//进行柯里化
let _check = curry(checkByRegExp);
//生成工具函数，验证电话号码
let checkCellPhone = _check(/^1\d{10}$/);
//生成工具函数，验证邮箱
let checkEmail = _check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);

checkCellPhone('18642838455'); // 校验电话号码
checkCellPhone('13109840560'); // 校验电话号码
checkCellPhone('13204061212'); // 校验电话号码

checkEmail('test@163.com'); // 校验邮箱
checkEmail('test@qq.com'); // 校验邮箱
checkEmail('test@gmail.com'); // 校验邮箱
```

再来看看通过柯里化封装后，我们的代码是不是变得又简洁又直观了呢。

经过柯里化后，我们生成了两个函数` checkCellPhone 和 checkEmail， checkCellPhone `函数只能验证传入的字符串是否是电话号码， `checkEmail `函数只能验证传入的字符串是否是邮箱， 它们与 原函数 `checkByRegExp` 相比，从功能上通用性降低了，但适用性提升了。 柯里化的这种用途可以被理解为：参数复用

我们再来看一个例子

**假定我们有这样一段数据：**

```javascript
let list = [
    {
        name:'lucy'
    },
    {
        name:'jack'
    }
]
```

我们需要获取数据中的所有 name 属性的值，常规思路下，我们会这样实现:

```javascript
let names = list.map(function(item) {
  return item.name;
})
```

那么我们如何用柯里化的思维来实现呢

```javascript
let prop = curry(function(key,obj) {
    return obj[key];
})
let names = list.map(prop('name'))
```

看到这里，可能会有疑问，这么简单的例子，仅仅只是为了获取 `name `的属性值，为何还要实现一个 `prop `函数呢，这样太麻烦了吧。

我们可以换个思路，`prop `函数实现一次后，以后是可以多次使用的，所以我们在考虑代码复杂程度的时候，是可以将 `prop `函数的实现去掉的。

我们实际的代码可以理解为只有一行` let names = list.map(prop('name'))`

这么看来，通过柯里化的方式，我们的代码是不是变得更精简了，并且可读性更高了呢。

##### 三、如何封装柯里化工具函数

接下来，我们来思考如何实现 `curry `函数。

回想之前我们对于柯里化的定义，接收一部分参数，返回一个函数接收剩余参数，接收足够参数后，执行原函数。

我们已经知道了，当柯里化函数接收到足够参数后，就会执行原函数，那么我们如何去确定何时达到足够的参数呢？

**我们有两种思路：**

1. 通过函数的 length 属性，获取函数的形参个数，形参的个数就是所需的参数个数
2. 在调用柯里化工具函数时，手动指定所需的参数个数

我们将这两点结合以下，实现一个简单 `curry `函数：

```javascript
/**
 * 将函数柯里化
 * @param fn    待柯里化的原函数
 * @param len   所需的参数个数，默认为原函数的形参个数
 */
function curry(fn,len = fn.length) {
    return _curry.call(this,fn,len)
}

/**
 * 中转函数
 * @param fn    待柯里化的原函数
 * @param len   所需的参数个数
 * @param args  已接收的参数列表
 */
function _curry(fn,len,...args) {
    return function (...params) {
        let _args = [...args,...params];
        if(_args.length >= len){
            return fn.apply(this,_args);
        }else{
            return _curry.call(this,fn,len,..._args)
        }
    }
}
```

**我们来验证一下：**

```javascript
let _fn = curry(function(a,b,c,d,e){
    console.log(a,b,c,d,e)
});

_fn(1,2,3,4,5);     // print: 1,2,3,4,5
_fn(1)(2)(3,4,5);   // print: 1,2,3,4,5
_fn(1,2)(3,4)(5);   // print: 1,2,3,4,5
_fn(1)(2)(3)(4)(5); // print: 1,2,3,4,5
```

我们常用的工具库 `lodash `也提供了 `curry `方法，并且增加了非常好玩的 `placeholder `功能，通过占位符的方式来改变传入参数的顺序。

比如说，我们传入一个占位符，本次调用传递的参数略过占位符， 占位符所在的位置由下次调用的参数来填充，比如这样：

**直接看一下官网的例子：**

![img](https://img.jbzj.com/file_images/article/202109/2021915115511610.png?2021815115542)

接下来我们来思考，如何实现占位符的功能。

对于 `lodash `的 `curry `函数来说，`curry `函数挂载在 `lodash `对象上，所以将 `lodash `对象当做默认占位符来使用。

而我们的自己实现的 `curry `函数，本身并没有挂载在任何对象上，所以将 `curry `函数当做默认占位符

使用占位符，目的是改变参数传递的顺序，所以在 `curry `函数实现中，每次需要记录是否使用了占位符，并且记录占位符所代表的参数位置。

```javascript
/**
 * @param  fn           待柯里化的函数
 * @param  length       需要的参数个数，默认为函数的形参个数
 * @param  holder       占位符，默认当前柯里化函数
 * @return {Function}   柯里化后的函数
 */
function curry(fn,length = fn.length,holder = curry){
    return _curry.call(this,fn,length,holder,[],[])
}
/**
 * 中转函数
 * @param fn            柯里化的原函数
 * @param length        原函数需要的参数个数
 * @param holder        接收的占位符
 * @param args          已接收的参数列表
 * @param holders       已接收的占位符位置列表
 * @return {Function}   继续柯里化的函数 或 最终结果
 */
function _curry(fn,length,holder,args,holders){
    return function(..._args){
        //将参数复制一份，避免多次操作同一函数导致参数混乱
        let params = args.slice();
        //将占位符位置列表复制一份，新增加的占位符增加至此
        let _holders = holders.slice();
        //循环入参，追加参数 或 替换占位符
        _args.forEach((arg,i)=>{
            //真实参数 之前存在占位符 将占位符替换为真实参数
            if (arg !== holder && holders.length) {
                let index = holders.shift();
                _holders.splice(_holders.indexOf(index),1);
                params[index] = arg;
            }
            //真实参数 之前不存在占位符 将参数追加到参数列表中
            else if(arg !== holder && !holders.length){
                params.push(arg);
            }
            //传入的是占位符,之前不存在占位符 记录占位符的位置
            else if(arg === holder && !holders.length){
                params.push(arg);
                _holders.push(params.length - 1);
            }
            //传入的是占位符,之前存在占位符 删除原占位符位置
            else if(arg === holder && holders.length){
                holders.shift();
            }
        });
        // params 中前 length 条记录中不包含占位符，执行函数
        if(params.length >= length && params.slice(0,length).every(i=>i!==holder)){
            return fn.apply(this,params);
        }else{
            return _curry.call(this,fn,length,holder,params,_holders)
        }
    }
}
```

**验证一下：**

```javascript
let fn = function(a, b, c, d, e) {
    console.log([a, b, c, d, e]);
}

let _ = {}; // 定义占位符
let _fn = curry(fn,5,_);  // 将函数柯里化，指定所需的参数个数，指定所需的占位符

_fn(1, 2, 3, 4, 5);                 // print: 1,2,3,4,5
_fn(_, 2, 3, 4, 5)(1);              // print: 1,2,3,4,5
_fn(1, _, 3, 4, 5)(2);              // print: 1,2,3,4,5
_fn(1, _, 3)(_, 4,_)(2)(5);         // print: 1,2,3,4,5
_fn(1, _, _, 4)(_, 3)(2)(5);        // print: 1,2,3,4,5
_fn(_, 2)(_, _, 4)(1)(3)(5);        // print: 1,2,3,4,5
```

#### 递归和循环在代码的执行层面有什么区别

递归是在一个函数的内部调用这个函数本身。

循环是通过设置计算的初始值及终止条件，在一个范围内重复计算。

通过比较上述两种方法，显然递归方式比循环方式代码简洁，递归只使用了1条语句，而循环需要4条语句。此外，在树的前序、中序、后序遍历算法的代码中，递归的实现方式也比循环简单的多，而且更加容易实现。

递归由于是调用自身，而函数调用是有时间和空间的消耗的：每一次函数调用，都需要再内存中分配空间以保存参数、返回地址及临时变量，而且往栈里压入数据和弹出数据都需要时间，更何况，每个进程的栈的容量是有限的。因此，递归实现的效率不如循环，而且，递归还有可能引起严重的调用栈溢出等问题。

#### 解析Url上的参数

```javascript
/**
 * [获取URL中的参数名及参数值的集合]
 * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
 * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
 * @return {[string]}       [参数集合]
 */
function GetRequest(urlStr) {
    if (typeof urlStr == "undefined") {
        var url = decodeURI(location.search); //获取url中"?"符后的字符串
    } else {
        var url = "?" + urlStr.split("?")[1];
    }
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var parms_1 = GetRequest();
console.log(parms_1); // {"uid":"admin","rid":"1","fid":"2","name":"小明"}
console.log(parms_1['name']); // '小明'
var parms_2 = GetRequest('http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明');
console.log(parms_2); // {"uid":"admin","rid":"1","fid":"2","name":"小明"}
console.log(parms_2['name']); // '小明'
```

```javascript
/**
 * [通过参数名获取url中的参数值]
 * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
 * @param  {[string]} queryName [参数名]
 * @return {[string]}           [参数值]
 */
function GetQueryValue(queryName) {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) { return pair[1]; }
    }
    return null;
}

var queryVal=GetQueryValue('name');
console.log(queryVal);// 小明
```

```javascript
/**
 * [通过参数名获取url中的参数值]
 * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
 * @param  {[string]} queryName [参数名]
 * @return {[string]}           [参数值]
 */
function GetQueryValue1(queryName) {
    var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if ( r != null ){
       return decodeURI(r[2]);
    }else{
       return null;
    }
}
var queryVal=GetQueryValue1('name');
console.log(queryVal);// 小明
```

#### compose函数复合

compose 是函数式编程中很重要的函数之一， 因为其巧妙的设计而被广泛使用。compose 函数的作用就是组合函数的，将函数串联起来执行，将多个函数组合起来，一个函数的输出结果是另一个函数的输入参数，一旦第一个函数开始执行，就会像多米诺骨牌一样推导执行了。

组合的概念是非常直观的，并不是函数式编程独有的，在我们生活中或者前端开发中处处可见。

比如我们现在流行的 SPA (单页面应用)，都会有组件的概念，为什么要有组件的概念呢，因为它的目的就是想让你把一些通用的功能或者元素组合抽象成可重用的组件，就算不通用，你在构建一个复杂页面的时候也可以拆分成一个个具有简单功能的组件，然后再组合成你满足各种需求的页面。

其实函数组合也是类似，函数组合就是一种将已被分解的简单任务组合成复杂任务的过程。

按照我们对组合的理解，现假定有compose函数可以实现如下功能：

```javascript
function compose(...fns){
    //忽略
}
// compose(f,g)(x) === f(g(x))
// compose(f,g,m)(x) === f(g(m(x)))
// compose(f,g,m)(x) === f(g(m(x)))
// compose(f,g,m,n)(x) === f(g(m(n(x))))
//···
```

我们可以看到`compose`函数，会接收若干个函数作为参数，每个函数执行后的输出作为下一个函数的输出，直至最后一个函数的输出作为最终的结果。

##### 实现

数组的`reduce`函数

```javascript
function compose(...fns) {
  return function(x){
    return fns.reverse().reduce(function(arg, fn, index){
      return fn(arg);
    }, x);
  }
}
```

数组的`reduceRight`函数

```javascript
function compose(...fns){
    return function(x){
        return fns.reduceRight(function(arg,fn){
            return fn(arg);
        },x)
    }
}
```

`compose`的数据流是`从右至左`的，因为最右侧的函数首先执行，最左侧的函数最后执行！

但有些人喜欢`从左至右`的执行方式，即最左侧的函数首先执行，最右侧的函数最后执行！

从左至右处理数据流的过程称之为管道(pipeline)!

```javascript
function pipe(...fns){
    return function(x){
        return fns.reduce(function(arg,fn){
            return fn(arg);
        },x)
    }
}
```

#### isEqual(a, b) 实现深度比较

```javascript
// 判断是否是对象或者数组
function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}
function isEqual (obj1, obj2) {
  // 参数有一个不是对象 直接判断值是否相等就行
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }
  // 如果两个数都是数组或者对象
  // 1. 先比较keys的个数，如果个数不相同 直接就不想等了
  var obj1Keys = Object.keys(obj1)
  var obj2Keys = Object.keys(obj2)
  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }
  // 如果个数相同再以obj1为基准 和 obj2依次递归比较
  // for...in 适用于对象，也适用于数组
  for (let key in obj1) {
    const res = arguments.callee(obj1[key], obj2[key]) // 递归
    if (!res) {
      return false
    }
  }
  return true
}
```

#### 千分位逗号分割

方法1：使用正则表达式：

```javascript
/**
 * 大数字转换 将数字分段显示，每三位用逗号隔开
 * @param value 数字值
*/
export function formatNumber (value: string | number) {
   value = value + '';
   return value.replace(/(\d)(?=(\d{3})+$)/g, "$1,");;
};

formatNumber(25555) //25,555
```

方法2：使用 toLocaleString() 方法：

```javascript
/**

 * 大数字转换 将数字分段显示，每三位用逗号隔开
 * @param value 数字值
   */
export function formatNumber (value: string | number) {
   value = Number(value);
   return value.toLocaleString('en-US');
};

formatNumber(26666) //26,666
```

#### 字符串形式的大数相加

```javascript
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
```

#### 给一个数组，随机打乱下标，生成新数组返回

```
function shuffle(arr) { 
    let i = arr.length
    while (i) { 
        let j = Math.floor(Math.random() * i--)
        [arr[j], arr[i]] = [arr[i], arr[j]]
    } 
}
```

#### 实现lodash库中的get方法，用于获取object路径上的值

```javascript
// 1、主方法 get
function get(object, path, defaultValue) {
  // 判断object是否为null,如果不是，调用baseGet方法获取object的path路径下的值
  const result = object == null ? undefined : baseGet(object, path) 
 // 若结果是undefined，则返回默认值
  return result === undefined ? defaultValue : result
}

// 2、baseGet方法 获取对象路径下的值
function baseGet(object, path) {
	// castPath方法获取object的path
  **path = castPath(path, object)**

  let index = 0
  const length = path.length
  
	//如果object不为null且当前index < 路径的长度时，获取object的值,更新object
  **while (object != null && index < length) {
    object = object[toKey(path[index++])] // 将path数组中的值转为key
  }**
	// 最后一级，返回object或者返回 undefined
  return (index && index == length) ? object : undefined
}

// 以上涉及两个方法：（1）将castPath 获取 object中的path，转为数组
// （2）toKey 将path数组中对应的值转为key

// (1）castPath（path, object） 如castPath('a[b].c', object)
function castPath(value, object) {
  if (Array.isArray(value)) {
    return value // 如果value是个数组，直接返回
  }
  return isKey(value, object) ? [value] : stringToPath(value)
	// 其中，isKey方法判断value是不是object对象的获取key的合法路径，主要基于value的类型判断和正则匹配，具体可见[lodash的解释](https://github.com/Liusq-Cindy/lodash/blob/e0029485ab4d97adea0cb34292afb6700309cf16/.internal/isKey.js#L15)
	// stringTopath方法，则是将字符串形式的路径，转化为数组，如将'a[0].c.d' 利用正则和字符串api转化为 ['a',0,'c','d'],具体可见[github](https://github.com/Liusq-Cindy/lodash/blob/e0029485ab4d97adea0cb34292afb6700309cf16/.internal/isKey.js#L15)
}

//（2）toKey(path[index++]) 将path数组中对应的值转为key
const INFINITY = 1 / 0
function toKey(value) {
	// 如果数组中取到的key是字符串或isSymbol为true,则返回字符串
  if (typeof value === 'string' || isSymbol(value)) {
    return value
  }
	// 此外，判断+-0，或者返回value本身，如纯数字 
  const result = `${value}`
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}
```

#### 实现一个斐波那契数列，时间复杂度、空间复杂度

```javascript
var fib = function(n) {
    if (n < 2) {
        return n;
    }
    let p = 0, q = 0, r = 1;
    for (let i = 2; i <= n; i++) {
        p = q;
        q = r;
        r = p + q;
    }
    return r;
};
```

**复杂度分析**

- 时间复杂度：O(n)。
- 空间复杂度：O(1)。

##### 矩阵快速幂

```javascript
var fib = function(n) {
    if (n < 2) {
        return n;
    }
    const q = [[1, 1], [1, 0]];
    const res = pow(q, n - 1);
    return res[0][0];
};

const pow = (a, n) => {
    let ret = [[1, 0], [0, 1]];
    while (n > 0) {
        if ((n & 1) === 1) {
            ret = multiply(ret, a);
        }
        n >>= 1;
        a = multiply(a, a);
    }
    return ret;
}

const multiply = (a, b) => {
    const c = new Array(2).fill(0).map(() => new Array(2).fill(0));
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            c[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j];
        }
    }
    return c;
}
```

**复杂度分析**

- 时间复杂度：O*(log*n*)。
- 空间复杂度：O*(1)。

##### 通项公式

```javascript
var fib = function(n) {
    const sqrt5 = Math.sqrt(5);
    const fibN = Math.pow((1 + sqrt5) / 2, n) - Math.pow((1 - sqrt5) / 2, n);
    return Math.round(fibN / sqrt5);
};
```

#### 哈希什么是哈希冲突 如何解决哈希冲突

**哈希冲突(哈希碰撞)**
不同的元素，通过相同的哈希函数，计算出了相同的哈希地址

##### 解决哈希冲突的方式

闭散列：又叫开放地址法或者也叫线性探测法。

什么意思呢？当我们要往哈希表中插入一个数据时，通过哈希算法计算key的hashcode，当我们找到该位置时，发现已经有元素了，此时我们就找紧跟着这一位置的下一个位置，看是否存在元素，如果能则插入，不能则继续探测紧跟着当前位置的下一个位置。

开散列方法，open hashing，也称为拉链法，separate chaining。开散列法把发生冲突的关键码存储在散列表主表之外。

思考：HashMap处理哈希冲突采用的是哪种方式？

答：HashMap解决哈希冲突采用的是链地址法。属于开散列。说白了就是把冲突的key连接起来，放到桶里。当桶中的元素个数不超过6个时，以单链表的形式串起来，当桶中的元素个数超过6个时，以红黑树的形式串起来。

#### 尾递归优化

尾调用之所以与其他调用不同，就在于它的特殊的调用位置。

我们知道，函数调用会在内存形成一个"调用记录"，又称"调用帧"（call frame），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用记录上方，还会形成一个B的调用记录。等到B运行结束，将结果返回到A，B的调用记录才会消失。如果函数B内部还调用函数C，那就还有一个C的调用记录栈，以此类推。所有的调用记录，就形成一个["调用栈"](https://zh.wikipedia.org/wiki/调用栈)（call stack）。

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015041002.png)

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用记录，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了。

> ```javascript
> function f() {
>   let m = 1;
>   let n = 2;
>   return g(m + n);
> }
> f();
> 
> // 等同于
> function f() {
>   return g(3);
> }
> f();
> 
> // 等同于
> g(3);
> ```

上面代码中，如果函数g不是尾调用，函数f就需要保存内部变量m和n的值、g的调用位置等信息。但由于调用g之后，函数f就结束了，所以执行到最后一步，完全可以删除 f() 的调用记录，只保留 g(3) 的调用记录。

这就叫做"尾调用优化"（Tail call optimization），即只保留内层函数的调用记录。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存。这就是"尾调用优化"的意义。

#### 全排列

回溯算法

![46.全排列](https://pic.leetcode-cn.com/1631607821-lOapRO-file_1631607821406)

```javascript

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const res = [], path = [];
    backtracking(nums, nums.length, []);
    return res;
    
    function backtracking(n, k, used) {
        if(path.length === k) {
            res.push(Array.from(path));
            return;
        }
        for (let i = 0; i < k; i++ ) {
            if(used[i]) continue;
            path.push(n[i]);
            used[i] = true; // 同支
            backtracking(n, k, used);
            path.pop();
            used[i] = false;
        }
    }
};
```

### 查找

#### 二分查找

```javascript
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
```

**复杂度分析**

- 时间复杂度：O*(log*n*)，其中 n*n* 是数组的长度。
- 空间复杂度：O*(1)。

### 排序

![1a533b16238abe098c7f019d49b96ff8.png](https://img-blog.csdnimg.cn/img_convert/1a533b16238abe098c7f019d49b96ff8.png)

算法稳定性指的是在一组待排序记录中，如果存在任意两个相等的记录R和S，且在待排序记录中R在S前，如果在排序后R依然在S前，即它们的前后位置在排序前后不发生改变，则称为排序算法为稳定的。

#### 快排

```javascript
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
```

#### 归并

```javascript
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
```

#### 堆排序

```javascript
//调整函数function headAdjust(elements, pos, len){
  //将当前节点值进行保存
  var swap = elements[pos];

  //定位到当前节点的左边的子节点
  var child = pos * 2 + 1;

  //递归，直至没有子节点为止
  while(child < len){
    //如果当前节点有右边的子节点，并且右子节点较大的场合，采用右子节点
    //和当前节点进行比较
    if(child + 1 < len && elements[child] < elements[child + 1]){
      child += 1;
    }

    //比较当前节点和最大的子节点，小于则进行值交换，交换后将当前节点定位
    //于子节点上
    if(elements[pos] < elements[child]){
      elements[pos] = elements[child];
      pos = child;
      child = pos * 2 + 1;
    }
    else{
      break;
    }

    elements[pos] = swap;
  }
}
//构建堆
function buildHeap(elements){
  //从最后一个拥有子节点的节点开始，将该节点连同其子节点进行比较，
  //将最大的数交换与该节点,交换后，再依次向前节点进行相同交换处理，
  //直至构建出大顶堆（升序为大顶，降序为小顶）
  for(var i=elements.length/2; i>=0; i--){
    headAdjust(elements, i, elements.length);
  }
}

function sort(elements){
  //构建堆
  buildHeap(elements);

  //从数列的尾部开始进行调整
  for(var i=elements.length-1; i>0; i--){
    //堆顶永远是最大元素，故，将堆顶和尾部元素交换，将
    //最大元素保存于尾部，并且不参与后面的调整
    var swap = elements[i];
    elements[i] = elements[0];
    elements[0] = swap;

    //进行调整，将最大）元素调整至堆顶
    headAdjust(elements, 0, i);
  }
}

var elements = [3, 1, 5, 7, 2, 4, 9, 6, 10, 8];
console.log('before: ' + elements);
sort(elements);
console.log(' after: ' + elements);
```

#### 冒泡排序

```javascript
function bubbleSort(arr) {
  const length = arr.length;
  for (let i = 0; i < length - 1; i++) {
    let changeOccur = false; //用于标记某次外循环中，是否方式内循环交换事件
    for (let j = 0; j < length - i -1; j++) {
      if (arr[j] > arr[j+1]) {
        /*
        const temp = arr[j]; 
        arr[j] = arr[j+1];
        arr[j+1] = temp; 
        */
        //这三行的交换函数用ES6来写：
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        changeOccur = true;
      }
    }

    if (!changeOccur) { //如果一次外循环中，没有发生一次内循环交换，那么可以直接结束排序比较
      break;
    }
  }
}
```

### 链表

#### 链表的实现原理

　　链表是一种物理存储单元上非连续、非顺序的存储结构，数据元素的逻辑顺序是通过链表中的指针链接次序实现的。链表由一系列结点（链表中每一个元素称为结点）组成，结点可以在运行时动态生成。每个结点包括两个部分：一个是存储数据元素的数据域，另一个是存储下一个结点地址的指针域。

　　使用链表结构可以克服数组链表需要预先知道数据大小的缺点，链表结构可以充分利用计算机内存空间，实现灵活的内存动态管理。但是链表失去了数组随机读取的优点，同时链表由于增加了结点的指针域，空间开销比较大。

#### 判断链表是否有环

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    //快指针 慢指针
    if(!head||!head.next){
        return false
    }
    let slow=head,fast=head.next
    while(slow!==fast){
        if(!fast||!fast.next){
            return false
        }
        slow=slow.next
        fast=fast.next.next
    }
    return true
};
```

#### 删除链表结点

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
var deleteNode = function(head, val) {
    if(head == null){
        return [];
    }
    if(head.val == val){
        head = head.next;
        return head;
    }
    var p = head.next;
    var q = head;
    while(p!=null){
        if(p.val == val){
            q.next = p.next;
            return head;
        }
        p = p.next;
        q = q.next;
    }

};
```

#### 反转链表

```javascript
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
};
```

```javascript
var reverseList = function(head) {
    if (head == null || head.next == null) {
        return head;
    }
    const newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
};
```

#### LRU算法

##### 概念理解

1.LRU是Least Recently Used的缩写，即最近最少使用页面置换算法，是为虚拟页式存储管理服务的，是根据页面调入内存后的使用情况进行决策了。由于无法预测各页面将来的使用情况，只能利用“最近的过去”作为“最近的将来”的近似，因此，LRU算法就是将最近最久未使用的页面予以淘汰。

2.操作系统课程里有学过，在内存不够的场景下，淘汰旧内容的策略。LRU … Least Recent Used，淘汰掉最不经常使用的。可以稍微多补充两句，因为计算机体系结构中，最大的最可靠的存储是硬盘，它容量很大，并且内容可以固化，但是访问速度很慢，所以需要把使用的内容载入内存中；内存速度很快，但是容量有限，并且断电后内容会丢失，并且为了进一步提升性能，还有CPU内部的 L1 Cache，L2 Cache等概念。因为速度越快的地方，它的单位成本越高，容量越小，新的内容不断被载入，旧的内容肯定要被淘汰，所以就有这样的使用背景。

##### LRU原理

可以用一个特殊的栈来保存当前正在使用的各个页面的页面号。当一个新的进程访问某页面时，便将该页面号压入栈顶，其他的页面号往栈底移，如果内存不够，则将栈底的页面号移除。这样，栈顶始终是最新被访问的页面的编号，而栈底则是最近最久未访问的页面的页面号。

在一般标准的操作系统教材里，会用下面的方式来演示 LRU 原理，假设内存只能容纳3个页大小，按照 7 0 1 2 0 3 0 4 的次序访问页。假设内存按照栈的方式来描述访问时间，在上面的，是最近访问的，在下面的是，最远时间访问的，LRU就是这样工作的。


但是如果让我们自己设计一个基于 LRU 的缓存，这样设计可能问题很多，这段内存按照访问时间进行了排序，会有大量的内存拷贝操作，所以性能肯定是不能接受的。

那么如何设计一个LRU缓存，使得放入和移除都是 O(1) 的，我们需要把访问次序维护起来，但是不能通过内存中的真实排序来反应，有一种方案就是使用双向链表。

##### 基于 HashMap 和 双向链表实现 LRU 的

LRU 缓存机制可以通过哈希表辅以双向链表实现，我们用一个哈希表和一个双向链表维护所有在缓存中的键值对。

双向链表按照被使用的顺序存储了这些键值对，靠近头部的键值对是最近使用的，而靠近尾部的键值对是最久未使用的。

哈希表即为普通的哈希映射（HashMap），通过缓存数据的键映射到其在双向链表中的位置。

这样以来，我们首先使用哈希表进行定位，找出缓存项在双向链表中的位置，随后将其移动到双向链表的头部，即可在 O(1) 的时间内完成 get 或者 put 操作。具体的方法如下：

对于 get 操作，首先判断 key 是否存在：

如果 key 不存在，则返回 −1；

如果 key 存在，则 key 对应的节点是最近被使用的节点。通过哈希表定位到该节点在双向链表中的位置，并将其移动到双向链表的头部，最后返回该节点的值。

对于 put 操作，首先判断 key 是否存在：

如果 key 不存在，使用 key 和 value 创建一个新的节点，在双向链表的头部添加该节点，并将 key 和该节点添加进哈希表中。然后判断双向链表的节点数是否超出容量，如果超出容量，则删除双向链表的尾部节点，并删除哈希表中对应的项；

如果 key 存在，则与 get 操作类似，先通过哈希表定位，再将对应的节点的值更新为 value，并将该节点移到双向链表的头部。

上述各项操作中，访问哈希表的时间复杂度为 O(1) ，在双向链表的头部添加节点、在双向链表的尾部删除节点的复杂度也为 O(1) 。而将一个节点移到双向链表的头部，可以分成「删除该节点」和「在双向链表的头部添加节点」两步操作，都可以在 O(1) 时间内完成。

小贴士

在双向链表的实现中，使用一个伪头部（dummy head）和伪尾部（dummy tail）标记界限，这样在添加节点和删除节点的时候就不需要检查相邻的节点是否存在。

```javascript
/*
 * @lc app=leetcode.cn id=146 lang=javascript
 *
 * [146] LRU 缓存机制
 */

// @lc code=start
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    // 重点思想：hash 映射表定位，链表增删移动
    // 初始化，首尾相接
    this.head = new DLinkNode()
    this.tail = new DLinkNode()
    this.head.next = this.tail
    this.tail.prev = this.head
    this.size = 0   // 实际大小
    this.cache = new Map()  // hash 映射表
    this.capacity = capacity    // 缓存大小
};

/**
 * 双向链表节点——数据结构
 * @param {键}} _key 
 * @param {值} _val 
 */
var DLinkNode = function (_key, _val) {
    this.key = _key
    this.val = _val
    this.prev = null
    this.next = null
}

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    // 获取 hash 映射表 key 所对应的数据
    // 存在，将该数据键值对提取到首位并返回对应 数据
    // 不存在，返回 -1
    const node = this.cache.get(key)
    if (node) {
        this.moveToHead(node)
        return node.val
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
    // 获取 hash 映射表 key 所对应的数据
    const node = this.cache.get(key)
    if (node) {
        // 存在，更新数据，将该节点移动到首位
        node.val = value
        this.moveToHead(node)
    } else {
        // 不存在，创建节点并移动到 首节点
        const node = new DLinkNode(key, value)
        this.cache.set(key, node)
        this.addHead(node)
        if (++this.size > this.capacity) {
            // 内存溢出：
            //  1.移除尾节点
            //  2.删除 hash 映射表中的数据
            //  3.将 cache 缓存实际大小减 1
            const tail = this.deleteTail()
            this.cache.delete(tail.key)
            --this.size
        }
    }
};

LRUCache.prototype.addHead = function(node) {
    // 插入节点时，首先要将 插入的节点 于 其他节点 建立关系
    //            然后，再将 其他节点 的关系改编成与 插入节点 的关系
    node.prev = this.head
    node.next = this.head.next
    this.head.next.prev = node
    this.head.next = node
}

LRUCache.prototype.removeNode = function(node) {
    // 删除节点时，直接将要将删除的节点的关系依赖跳过即可
    node.prev.next = node.next
    node.next.prev = node.prev
}

LRUCache.prototype.moveToHead = function (node) {
    this.removeNode(node)
    this.addHead(node)
}

LRUCache.prototype.deleteTail = function() {
    const res = this.tail.prev
    this.removeNode(res)
    return res
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// @lc code=end
```

### 二叉树

#### 二叉树遍历的方式

##### 前序遍历

```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root) {
  let res = [];
  const preOrder = (root) => {
    if (root == null) return res;
    res.push(root.val);
    preOrder(root.left);
    preOrder(root.right);
  };
  preOrder(root);
  return res;
};

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root) {
  /* 定义：输入一个节点，返回以该节点为根的二叉树的前序遍历结果 */
  let res = [];
  if (root == null) return res;
  // 前序遍历结果特点：第一个是根节点的值，接着是左子树，最后是右子树
  res.push(root.val);
  res.push(...preorderTraversal(root.left));
  res.push(...preorderTraversal(root.right));
  return res;
};

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root) {
  let res = [],
    stack = [];
  while (stack.length || root) {
    while (root) {
      res.push(root.val);
      stack.push(root);
      root = root.left;
    }
    root = stack.pop();
    root = root.right;
  }
  return res;
};
```

##### 中序遍历

```javascript
// 1
var inorderTraversal = function(root) {
    const res = [];
    const inorder = (root) => {
        if (!root) {
            return;
        }
        inorder(root.left);
        res.push(root.val);
        inorder(root.right);
    }
    inorder(root);
    return res;
};
// 2
var inorderTraversal = function(root) {
    const res = [];
    const stk = [];
    while (root || stk.length) {
        while (root) {
            stk.push(root);
            root = root.left;
        }
        root = stk.pop();
        res.push(root.val);
        root = root.right;
    }
    return res;
};
// 3
var inorderTraversal = function(root) {
    const res = [];
    let predecessor = null;

    while (root) {
        if (root.left) {
            // predecessor 节点就是当前 root 节点向左走一步，然后一直向右走至无法走为止
            predecessor = root.left;
            while (predecessor.right && predecessor.right !== root) {
                predecessor = predecessor.right;
            }

            // 让 predecessor 的右指针指向 root，继续遍历左子树
            if (!predecessor.right) {
                predecessor.right = root;
                root = root.left;
            }
            // 说明左子树已经访问完了，我们需要断开链接
            else {
                res.push(root.val);
                predecessor.right = null;
                root = root.right;
            }
        }
        // 如果没有左孩子，则直接访问右孩子
        else {
            res.push(root.val);
            root = root.right;
        }
    }

    return res;
};
```

##### 后序遍历

```javascript
// 1
var postorderTraversal = function(root) {
  const ans = [];
  if(root == null) {
    return ans;
  }

  const stack = [];
  let prev = null;
  while(root != null || stack.length) {
    while(root != null) {
      stack.push(root);
      root = root.left;
    }

    root = stack.pop();
    if(root.right == null || root.right == prev) {
      ans.push(root.val);
      prev = root;
      root = null;
    }else {
      stack.push(root);
      root = root.right;
    }
  }

  return ans;
};

// 2
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {
  let res = [];
  const postOrder = (root) => {
    if (root == null) return;
    postOrder(root.left);
    postOrder(root.right);
    res.push(root.val);
  };
  postOrder(root);
  return res;
};

// 3 
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {
  /* 定义：输入一个节点，返回以该节点为根的二叉树的后序遍历结果 */
  let res = [];
  if (root == null) return res;
  // 后序遍历结果特点：先是左子树，然后是右子树，最后是根节点的值
  res.push(...postorderTraversal(root.left));
  res.push(...postorderTraversal(root.right));
  res.push(root.val);
  return res;
};
```

#### 如何求二叉树的高度

1.递归
树的深度 = 1（根节点深度）+ max(左子树深度，右子树深度)
递归求解其每个节点的深度，最后返回到根节点

```javascript
int maxDepth(TreeNode* root) {
    if (root == nullptr)  
        return 0;
    int leftDepth = maxDepth(root->left);  //左子树深度
    int rightDepth = maxDepth(root->right);  //右子树深度
    int depth = 1 + max(leftDepth, rightDepth);  //当前节点的深度
    return depth;
}
```

递归代码简化如下：

应先搞懂逻辑，再追求代码的简化！

```javascript
int maxDepth(TreeNode* root) {
    if (root == nullptr)
        return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}
```

2.BFS
类似层序遍历，但每层循环只将计数+1

```javascript
int maxDepth(TreeNode* root) {
    if (root == nullptr)
        return 0;
    queue<TreeNode*> que;
    que.push(root);
    int depth = 0;
    while (!que.empty()) {
        ++depth;
        int n = que.size();
        for (int i = 0; i < n; ++i) {
            TreeNode* node = que.front();
            que.pop();
            if (node->left)
                que.push(node->left);
            if (node->right)
                que.push(node->right);
        }
    }
    return depth;
}
```

3.DFS
DFS稍复杂，不像BFS是按层往下，DFS的栈中还需要存储每个节点的深度

```javascript
int maxDepth(TreeNode* root) {
    if (root == nullptr)
        return  0;
    stack<pair<TreeNode*, int>> stk;
    int dep = 0, maxDep = 0;
    while (!stk.empty() || root) {
        while (root) {
            stk.push(pair<TreeNode*, int>(root, ++dep));
            root = root->left;
        }
        root = stk.top().first;
        dep = stk.top().second;
        stk.pop();
        maxDep = max(maxDep, dep);
        //再往右走
        root = root->right;
    }
    return maxDep;
}
```

#### 二叉树的层序遍历

```javascript
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
```

#### 深度优先和广度优先的区别

（1）首先二叉树的深度优先遍历的非递归的通用做法是采用栈，广度优先遍历的非递归做法是采用队列。

（2）深度优先遍历：对每一个可能的分支路径深入到不能再深入为止，而且每个节点只能访问一次（二叉树的深度优先遍历比较特殊，可以细分为先序遍历，中序遍历，后序遍历）。

  广度优先遍历：又叫层次遍历从上往下对每一层依次访问，在每一层中，从左往右（也可以从右往左）访问节点，访问完一层就继续访问下一层，直到没有节点可以访问为止。

（3）深度优先搜索算法，：不全部保留节点，占用空间少，有回溯操作（即有入栈，出栈操作），运行速度慢。

广度优先搜索算法：保留全部节点，占用空间大，无回溯操作（即无入栈，出栈操作），运行速度快。

（4）深度优先遍历：不全部保留节点，扩展完的结点从数据库中弹出删去，这样，一般在数据库中存储的结点数就是深度值，因此它占用的空间较少。

广度优先遍历：一般需要存储产生的所有的结点，占用的存储空间要比深度优先搜索大的多，因此在程序设计的过程中必须考虑溢出和节省内存空间的问题。    

### 正则

#### 正则匹配手机号

```
/^[1]([3-9])[0-9]{9}$/
```

#### 正则匹配邮箱

```
[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9-.]+
```

### 动态规划

#### 最大升序子数组和

```javascript
var maxAscendingSum = function (nums) {
  let max = nums[0]; // 存放最大值
  let pre = nums[0]; // 存放第i个元素的的最大值

  for (let i = 1; i < nums.length; i++) {
    if (nums[i - 1] < nums[i]) {
      pre += nums[i]; // 如果是递增，就累加
    } else {
      pre = nums[i]; // 不是递增就，重新开始
    }

    if (pre > max) {
      max = pre;
    }
  }

  return max;
};
```

#### 最长递增子序列

##### 利用单调栈 + 二分查找实现o(nlogn)解法

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    const stack = new Array(nums.length)
    let idx = 0
    for(const num of nums){
        let l = 0, r = idx
        while(l < r){
            let mid = Math.floor((l+r)/2)
            if(stack[mid] < num)
                l = mid + 1
            else
                r = mid
        }
        if(l == idx)
            stack[idx++] = num
        else
            stack[l] = num
    }
    return idx
};
```

##### 动态规划

思路：dp[i]表示选择nums[i]，并且以nums[i]结尾的最长上升子序列的长度。两层循环，i：1～nums.length，

j：0～i，如果nums[i] > nums[j]，则构成一个上升对，dp[i]就从dp[i], dp[j]+1两个种选择较大者，最后返回dp数组总的最大数

复杂度分析：时间复杂度O(n^2)，n是nums的长度，外层需要循环n次，dp[i]需要从dp[0~i-1],所以复杂度是O(n^2)。空间复杂度是O(n)，即dp数组的空间

```javascript
const lengthOfLIS = (nums) => {
    let dp = Array(nums.length).fill(1);
    let result = 1;

    for(let i = 1; i < nums.length; i++) {
        for(let j = 0; j < i; j++) {
            if(nums[i] > nums[j]) {//当nums[i] > nums[j]，则构成一个上升对
                dp[i] = Math.max(dp[i], dp[j]+1);//更新dp[i]
            }
        }
        result = Math.max(result, dp[i]);//更新结果
    }

    return result;
};
```

##### 二分查找+贪心

思路：准备tail数组存放最长上升子序列，核心思想就是越小的数字越要往前放，这样后面就会有更多的数字可以加入tails数组。将nums中的数不断加入tail，当nums中的元素比tail中的最后一个大时 可以放心push进tail，否则进行二分查找，让比较小的数二分查找到合适的位置，让后面有更多的数字与这个数形成上升子序列
复杂度：时间复杂度O(nlogn)，n为nums的长度，每次二分查找需要logn，所以是总体的复杂度是O(nlogn)。空间复杂度是O(n) ,tail数组的开销

```javascript
var lengthOfLIS = function (nums) {
    let n = nums.length;
    if (n <= 1) {
        return n;
    }
    let tail = [nums[0]];//存放最长上升子序列数组
    for (let i = 0; i < n; i++) {
        if (nums[i] > tail[tail.length - 1]) {//当nums中的元素比tail中的最后一个大时 可以放心push进tail
            tail.push(nums[i]);
        } else {//否则进行二分查找
            let left = 0;
            let right = tail.length - 1;
            while (left < right) {
                let mid = (left + right) >> 1;
                if (tail[mid] < nums[i]) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            tail[left] = nums[i];//将nums[i]放置到合适的位置，此时前面的元素都比nums[i]小
        }
    }
    return tail.length;
};
```

#### 最长公共子序列

```javascript
var longestCommonSubsequence = function(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        const c1 = text1[i - 1];
        for (let j = 1; j <= n; j++) {
            const c2 = text2[j - 1];
            if (c1 === c2) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
};
```



#### 最长重复子串

使用滑动窗口处理，如果当前窗口字符串长度大于已找到的最长子串长度，且在原字符串的末尾能找到另一个窗口字符串，则当前窗口字符串可以更新为最长子串；重复该动作直至窗口闭合。

最长重复子串记为maxStr，窗口左右边界分别记为i和j，窗口内的字符串记为curStr
当窗口curStr的长度大于maxStr或者右边界j越界时，窗口左边界右移i++，并移除窗口curStr起始位置的字母
当窗口curStr的长度不大于maxStr且右边界j未越界时
在窗口curStr末尾追加右边界之后的字母s[j]，并将窗口右边界右移j++
若窗口curStr的长度大于maxStr且在字符串s尾部找到另一个curStr，则更新maxStr
最后返回maxStr
代码:

```javascript
var longestDupSubstring = function (s) {
  let maxStr = '',curStr = '';
  for (let i = 0, j = 0; i < s.length; i++) {
    curStr = curStr.replace(s[i - 1], '');
    while (curStr.length <= maxStr.length && j < s.length) {
      curStr += s[j], j++;
      if (curStr.length > maxStr.length && s.lastIndexOf(curStr) > i) maxStr = curStr;
    }
  }
  return maxStr;
};
```

优化:
Java和C++用这个思路会超时，可能有几个方面原因：

1、可能Node.js的下限比较低（受限于语言执行效率），所以Node.js能过其他不行
2、字符串操作方法replace和+=，Java这里应该可以用StringBuilder优化，C++不太清楚能否优化
3、字符串索引方法lastIndexOf没有限制边界，最坏情况下会完整遍历原字符串，但是窗口扫过的字符串实际是不需要遍历的；改成下面这样限制查找起点能快700ms~1000ms左右

```javascript
 if (curStr.length > maxStr.length && s.indexOf(curStr, i + 1) > -1) maxStr = curStr;
```

还可以考虑手写索引方法，另外引入哈希表做缓存避免重复遍历；尝试了下，用例64（30000个v的字符串）超时，这个时候简单的缓存策略是完全失效的。

附上优化后的完整代码，只需修改 lastIndexOf 那一行

```javascript
var longestDupSubstring = function (s) {
    let maxStr = '', curStr = '';
    for (let i = 0, j = 0; i < s.length; i++) {
        curStr = curStr.replace(s[i - 1], '');
        while (curStr.length <= maxStr.length && j < s.length) {
            curStr += s[j], j++;
            if (curStr.length > maxStr.length && s.indexOf(curStr, i + 1) > -1) maxStr = curStr;
        }
    }
    return maxStr;
};
```


整体调整，更简洁的版本：

```javascript
var longestDupSubstring = function (s) {
    let maxStr = '';
    for (let i = 0, j = 0; i < s.length; i++) {
        while (j - i <= maxStr.length && j < s.length && ++j) {
            if (j - i <= maxStr.length) continue;
            const curStr = s.slice(i, j);
            if (s.indexOf(curStr, i + 1) > -1) maxStr = curStr;
        }
    }
    return maxStr;
};
```



#### 括号匹配

```javascript
var isValid = function(s) {
    const n = s.length;
    if (n % 2 === 1) {
        return false;
    }
    const pairs = new Map([
        [')', '('],
        [']', '['],
        ['}', '{']
    ]);
    const stk = [];
    for (let ch of s){
        if (pairs.has(ch)) {
            if (!stk.length || stk[stk.length - 1] !== pairs.get(ch)) {
                return false;
            }
            stk.pop();
        } 
        else {
            stk.push(ch);
        }
    };
    return !stk.length;
};
```

