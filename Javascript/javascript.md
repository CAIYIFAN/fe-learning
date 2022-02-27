## JavaScript

### this的指向规则

this 的指向，始终坚持一个原理：**this 永远指向最后调用它的那个对象**。

#### 如何改变this指向？

###### 如何改变this指向？

##### 1、使用 ES6 的箭头函数

**箭头函数的 this 始终指向函数定义时的 this，而非执行时。**箭头函数需要记着这句话：“**箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值**，**如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined”。**

```var name = "windowName";
var a={
	name:"Cherry",
	func1:function(){
		console.log(this.name);
	},
	func2:function(){
		setTimeout(()=>{
			this.func1();
		},100)
	}
}
a.func2();//Cherry
```

##### 2、在函数内部使用 _this = this

```var a={
	name:"Cherry",
	func1:function(){
		console.log(this.name);
	},
	func2:function(){
		var _this =this;
		setTimeout(function(){
			_this.func1();
		},100)
	}
}
a.func2();//Cherry
```

在函数内部使用 _this = this

这个例子中，在 func2 中，首先设置 var _this = this;，这里的 this 是调用 func2 的对象 a，为了防止在 func2 中的 setTimeout 被 window 调用而导致的在 setTimeout 中的 this 为 window。我们将 this(指向变量 a) 赋值给一个变量 _this，这样，在 func2 中我们使用 _this 就是指向对象 a 了。

##### 3、使用 apply、call、bind

fun.apply(thisArg, [argsArray])

- thisArg：在 fun 函数运行时指定的 this 值。需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。
- argsArray：一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 fun 函数。如果该参数的值为null 或 undefined，则表示不需要传入任何参数。

##### 4、new 实例化一个对象

* New 实例化一个对象
  如果函数调用前使用了 new 关键字, 则是调用了构造函数。
  这看起来就像创建了新的函数，但实际上 JavaScript 函数是重新创建的对象

### call apply bind区别

apply传递数组，call传递参数，而bind改变this指向的时候返回的是一个函数。而apply、call是立即执行。

###### 1、call模拟实现

```
Function.prototype.call =function(context){
    context = context? Object(context): window;
    context.fn = this;//this也就是调用call的函数
    let args = [...argments].slice(1);
    let r = context.fn(...args);
    delete context.fn;
    return r;
}
```

###### 2、apply模拟实现

```
Function.prototype.apply = function(context,args){
        context = context? Object(context): window;//不传递context默认为window
        context.fn = this;
        if(!args){
            return context.fn();
        }
        let r = context.fn(...args);
        delete context.fn;
        return r;
}
```

###### 3.手写bind

```
Function.prototype.bind = function(context){
    const _this = this;
    const argus = Array.prototype.slice.apply(argments,[1]) //拿到除了context之外的预置参数序列
    return function(){
        _this.apply(context,argus.concat(Array.prototype.slice.call(argments)))
        //绑定this同时将调用时传递的序列和预置序列进行合并
    }
}
```

### JS基础数据类型

number、string、boolean、null、undefined、symbol

#### 类型对比

##### 1、严格相等 ===

全等操作符比较两个值是否相等，两个被比较的值在比较前都**不进行隐式转换**。如果两个被比较的值具有不同的类型，这两个值是不全等的。否则，如果两个被比较的值类型相同，值也相同，并且都不是 number 类型时，两个值全等。最后，如果两个值都是 number 类型，当两个都不是 NaN，并且数值相同，或是两个值分别为 +0 和 -0 时，两个值被认为是全等的。

##### 2、非严格相等 ==

相等操作符比较两个值是否相等，**在比较前将两个被比较的值转换为相同类型**。在转换后（等式的一边或两边都可能被转换），最终的比较方式等同于全等操作符 === 的比较方式。 相等操作符满足交换律。

##### 3、Object.is 方法

```
Object.is =function(x,y){
    if(x === y){
        // +0,-0情况处理
        return x !==0 || 1/x ===1/y;
    }else{
        //NaN
        return x !== x && y!==y;
    }
}
```

#### 数据类型判断的方法

##### 1、instanceof

instanceof运算符可以**用来判断某个构造函数的prototype属性是否存在于另外一个要检测对象的原型链上。** 
object instanceof constructor

```
[]  instanceof Object; // true
```

###### 手写instanceOf

```
function _instanceOf(left,right){
    let prototype =right.prototype;
    obj = left.__proto__;
    while(true){
        if(obj === null) return false;
        if(obj === prototype) return true;
        obj = obj.__proto__;
    }
}
function Person(){
    this.name = "first";
}
let person = new Person();
console.log(_instanceOf(person,Person));
```

##### 2、Object.prototype.toString.call()

每一个继承 Object 的对象都有 toString 方法，如果 toString 方法没有重写的话，会返回 [Object type]，其中 type 为对象的类型。但当除了 Object 类型的对象外，其他类型直接使用 toString 方法时，会直接返回都是内容的字符串，所以我们需要使用call或者apply方法来改变toString方法的执行上下文。

```
const an = ['Hello','An'];
an.toString(); // "Hello,An"
Object.prototype.toString.call(an); // "[object Array]"
Object.prototype.toString.call('An') // "[object String]"
Object.prototype.toString.call(1) // "[object Number]"
Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(function(){}) // "[object Function]"
Object.prototype.toString.call({name: 'An'}) // "[object Object]"
```

Object.prototype.toString.call() 常用于判断浏览器内置对象时。

##### 3、typeof一元运算符

typeof一元运算符，用来返回操作数类型的字符串。
typeof只有一个实际应用场景，就是**用来检测一个对象是否已经定义或者是否已经赋值。**

##### 4、Array.isArray()

* 功能：用来判断对象是否为数组

* instanceof 与 isArray
  当检测Array实例时，Array.isArray 优于 instanceof ，因为 Array.isArray 可以检测出 iframes

  ```
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  xArray = window.frames[window.frames.length-1].Array;
  var arr = new xArray(1,2,3); // [1,2,3]
  // Correctly checking for Array
  Array.isArray(arr);  // true
  Object.prototype.toString.call(arr); // true
  // Considered harmful, because doesn't work though iframes
  arr instanceof Array; // false
  ```

  Array.isArray() 与 Object.prototype.toString.call()
  Array.isArray()是ES5新增的方法，当不存在 Array.isArray() ，可以用 Object.prototype.toString.call() 实现。

  ```
  if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
  }
  ```


### 深浅拷贝，手写深拷贝

实现一个对象的深拷贝函数，需要考虑对象的元素类型以及对应的解决方案：

（1）基础类型：这种最简单，直接赋值即可

（2）对象类型：递归调用拷贝函数

（3）数组类型：因为数组中的元素可能是基础类型、对象还可能数组，因此要专门做一个函数来处理数组的深拷贝。

#### 浅拷贝

​		浅拷贝只会将对象的各个属性进行依次复制，并不会进行递归复制，也就是说只会赋值目标对象的第一层属性。
**对于目标对象第一层为基本数据类型的数据，就是直接赋值，即「传值」；**
**而对于目标对象第一层为引用数据类型的数据，就是直接赋存于栈内存中的堆内存地址，即「传址」。**

##### 关于Object.assign() 方法

> Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

- 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。
- Object.assign 方法只会拷贝源对象自身的并且可枚举的属性到目标对象。该方法使用源对象的[[Get]]和目标对象的[[Set]]，所以它会调用相关 getter 和 setter。因此，它分配属性，而不仅仅是复制或定义新的属性。如果合并源包含getter，这可能使其不适合将新属性合并到原型中。为了将属性定义（包括其可枚举性）复制到原型，应使用Object.getOwnPropertyDescriptor()和Object.defineProperty() 。
- String类型和 Symbol 类型的属性都会被拷贝。
- 在出现错误的情况下，例如，如果属性不可写，会引发TypeError，如果在引发错误之前添加了任何属性，则可以更改target对象。
- Object.assign 不会在那些source对象值为 `null`或 `undefined` 的时候抛出错误。
- 针对**深拷贝**，需要使用其他办法，因为 Object.assign()拷贝的是属性值。假如源对象的属性值是一个对象的引用，那么它也只指向那个引用。也就是说，如果对象的属性值为简单类型（如string， number），通过Object.assign({},srcObj);得到的新对象为`深拷贝`；如果属性值为对象或其它引用类型，那对于这个对象而言其实是`浅拷贝`的。

#### 深拷贝

​		深拷贝不同于浅拷贝，它不只拷贝目标对象的第一层属性，而是递归拷贝目标对象的所有属性。
​		一般来说，在JavaScript中考虑复合类型的深层复制的时候，往往就是指对于 Date 、Object 与 Array 这三个复合类型的处理。我们能想到的最常用的方法就是先创建一个空的新对象，然后递归遍历旧对象，直到发现基础类型的子节点才赋予到新对象对应的位置。
​	   不过这种方法会存在一个问题，就是 JavaScript 中存在着神奇的原型机制，并且这个原型会在遍历的时候出现，然后需要考虑原型应不应该被赋予给新对象。那么在遍历的过程中，我们可以考虑使用 **hasOwnProperty** 方法来判断是否过滤掉那些继承自原型链上的属性。

##### 1、通过 JSON.parse(JSON.stringify(object)) 来解决

* 会忽略 undefined
* 会忽略 symbol
* 不能序列化函数
* 不能解决循环引用的对象

##### 2、手写方法

```
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
```

### JS闭包的实现以及缺陷

简单讲，闭包就是指有权访问另一个函数作用域中的变量的函数。

```
function  func(){
	var a=1,b=2;
	function closure(){
		return a+b;
	}
	return closure;
}
```

通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。但是，在创建了一个闭包以后，这个函数的作用域就会一直保存到闭包不存在为止。
在javascript中，如果一个对象不再被引用，那么这个对象就会被垃圾回收机制回收； 
如果两个对象互相引用，而不再被第3者所引用，那么这两个互相引用的对象也会被回收。
**闭包只能取得包含函数中任何变量的最后一个值，**这是因为**闭包所保存的是整个变量对象**，而不是某个特殊的变量。

```
function test(){
	var arr = [];
	for(var i=0;i<10;i++){
		arr[i] =function(){
			return i;
		};
	}
	for(var a=0;a<10;a++){
		console.log(arr[a]());
	}
}
test();
```

```
function test(){
    var arr =[];
    for(let i=0;i<10;i++){
        arr[i] = function(){
            return i;
        };
    }
    for(var a=0;a<10;a++){
        console.log(arr[a]());
    }
}
test();
```

**obj.getName()()**实际上是在全局作用域中调用了匿名函数，this指向了window。这里要理解函数名与函数功能（或者称函数值）是分割开的，不要认为函数在哪里，其内部的this就指向哪里。**匿名函数的执行环境具有全局性**，因此其 this 对象通常指向 window。

```
var name = "The Window";
var obj = {
    name: "My Object",
    getName:function(){
        return function(){
            return  this.name;
        };
    }
};
console.log(obj.getName()());
```

```
var name = "The Window";
var obj = {
    name: "My Object",
    getName: function(){
        var that =this;
        return function(){
            return that.name;
        };
    }
};
console.log(obj.getName()());
```

##### 闭包的应用

1、应用闭包的主要场合是：设计私有的方法和变量。
任何在函数中定义的变量，都可以认为是私有变量，因为不能在函数外部访问这些变量。私有变量包括函数的参数、局部变量和函数内定义的其他函数。
把有权访问私有变量的公有方法称为特权方法（privileged method）。

```
function Animal(){
    //私有变量
    var series = "哺乳动物";
    function run(){
        console.log("Run!!!")
    }
    //特权方法
    this.getSeries = function(){
        return series;
    };
}
```

2、模块模式（The Module Pattern）：为单例创建私有变量和方法。
单例（singleton）：指的是只有一个实例的对象。JavaScript 一般以对象字面量的方式来创建一个单例对象。

```
//单例模式
class CreateUser{
	constructor(name){
		this.name = name;
		this.getName();
	}
	getName(){
		return this.name;
	}
}
var  ProxyMode = (function(){
	var instance = null;
	return function(name){
		if(!instance){
			instance = new CreateUser(name);
		}
		return instance;
	}
})();

var a= new ProxyMode('aaa');
var b= new ProxyMode('bbb');
```

匿名函数最大的用途是创建闭包，并且还可以构建命名空间，以减少全局变量的使用。从而使用闭包模块化代码，减少全局变量的污染。

3、函数作为返回值

```
function F1() {
var a = 100
return function() {
console.log(a)
}
}
var f1 = F1()
var a = 200
f1()
```

4、函数作为参数传递

```
  function F1() {
      var a = 100
      return function () {
          console.log(a)
      }
  }
  function F2(f1) {
      var a = 200
      console.log(f1())
  }
  var f1 = F1()
  F2(f1)
```

  ##### **闭包的缺陷**

* 闭包的缺点就是常驻内存会增大内存使用量，并且使用不当很容易造成内存泄露。
* 如果不是因为某些特殊任务而需要闭包，在没有必要的情况下，在其它函数中创建函数是不明智的，因为闭包对脚本性能具有负面影响，包括处理速度和内存消耗。

##### 造成内存泄漏的原因

**内存泄漏**指由于疏忽或错误造成程序未能释放已经不再使用的内存。内存泄漏并非指内存在物理上的消失，而是应用程序分配某段内存后，由于设计错误，导致在释放该段内存之前就失去了对该段内存的控制，从而造成了内存的浪费。 内存泄漏通常情况下只能由获得程序源代码的程序员才能分析出来。然而，有不少人习惯于把任何不需要的内存使用的增加描述为内存泄漏，即使严格意义上来说这是不准确的。

###### 1.console.log()

```
  function foo() {
      this.variable = "potential accidental global";
}
```

  ###### 解决方法：

  在JavaScript文件中添加`'use strict'`，开启严格模式，可以有效地避免上述问题。

  ###### 2.闭包

  在传递给console.log的对象是不能被垃圾回收 ♻️，因为在代码运行之后需要在开发工具能查看对象信息。所以最好不要在生产环境中console.log任何对象。

  ###### 3.意外的全局变量

  当一个函数A返回一个内联函数B，即使函数A执行完，函数B也能访问函数A作用域内的变量，这就是一个闭包——————本质上闭包是将函数内部和外部连接起来的一座桥梁。

 https://juejin.im/post/5a26b9baf265da431e169fe9

### JS函数柯里化

柯里化是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

#### Currying有哪些好处呢？

##### 1、参数复用

```
function check(reg,txt){
    return reg.test(txt);
}
check(/\d+/g,'test'); //false
check*(/[a-z]+/g,'test'); //true

function curryingCheck(reg){
    return function(txt){
        return reg.test(txt);
    }
}
var hasNumber = curryingCheck(/\d+/g);
var hasLetter = curryingCheck(/[a-z]+/g);

hasNumber('test1');//true
hasNumber('testtest');//false
hasLetter('212222')//flase
```

##### 2、延迟运行

```
function.prototype.bing = function(context){
    var _this = this;
    var args = Array.prototype.slice.call(arguments,1)
return function(){
    return _this.apply(context,args);
  }
}
```

##### 柯里化常见题

```
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
```

### 数组拍平

#### 功能概述

**flat()** 函数提供了将一组数组项串联成一个全新的数组并在函数完成后返回新数组的能力。由于这个函数产生了一个全新的数组，所以一旦函数完成操作后，任何包含在原始数组中的现有的、完全独立的数组都不会被改变，在开始操作之前，不需要采取任何预防措施。

**flat()** 函数仅采用一个参数，该参数是可选的，唯一的参数是 **depth** 参数。如果原始数组包含一个或多个嵌套数组结构，则此参数决定函数将多少数组层压扁为单个层。由于该参数是可选的，所以它的默认值为 1，并且在函数完成时，只有单层数组将被平展到返回的全新数组中。

#### 没有参数的情况

在介绍了一般的函数行为之后，让我们看一下 **flat()** 函数在实践中是如何工作的一些示例。以下示例说明了未指定参数值的情况：

```lua
var array1 = [1, 2, [3, 4], [[5, 6]], [[[7, 8]]], [[[[9, 10]]]]];
var array2 = array1.flat();
// array2: [1, 2, 3, 4, [5, 6], [[7, 8]], [[[9, 10]]]]
```

调用 **flat()** 函数时不带参数值。考虑到可选参数的默认值，此函数调用与 **flat(1)** 相同。这意味着原始数组中深度为 **1** 的任何数组都将被完全展平，以便将其所有内容单独连接到新数组。原始数组中深度为 **2** 或更大的任何数组的深度都将减小 **1** ，并且这些数组中深度为1的任何单个数组项将单独连接到新数组。结果，原始数组中包含 **3** 和 **4** 的第一个数组被展平，以便将这两个数组项分别连接到新数组。此外，其余三个嵌套的数组中的每个数组都被串联到新的数组中，其嵌套深度减少了一个。

#### 正深度

以下示例演示了指定正 **depth** 参数值的情况：

```lua
var array1 = [1, 2, [3, 4], [[5, 6]], [[[7, 8]]], [[[[9, 10]]]]];
var array2 = array1.flat(2);
// array2: [1, 2, 3, 4, 5, 6, [7, 8], [[9, 10]]]
```

使用深度参数值 **2** 调用 **flat()** 函数。这意味着在原始数组中深度最大为2的任何数组都将被完全展平，以便将其所有内容单独连接到新数组。原始数组中深度为3或更大的任何数组的深度将减少2，并且这些数组中深度为1或2的任何单个数组项将单独连接到新数组。结果，包含 **3** 和 **4** 以及 **5** 和 **6** 的原始数组中的前两个数组被展平，从而将这四个数组项分别连接到新数组。另外，剩下的两个嵌套数组都连接到新数组，它们的嵌套深度减少了2。

#### 无限深度

以下示例演示了指定无限 **depth** 参数值的情况：

```lua
var array1 = [1, 2, [3, 4], [[5, 6]], [[[7, 8]]], [[[[9, 10]]]]];
var array2 = array1.flat(Infinity);
// array2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

使用 **depth** 参数值 **Infinity** 调用 **flat()** 函数。这意味着原始数组中具有任何深度的所有数组都将被展平，以便将其所有内容单独连接到新数组。在与 **flat()** 函数一起使用诸如 **Infinity** 之类的值时，要记住的一件非常重要的事情是，如果应用程序遇到嵌套得足够深的数组，则它可能会耗尽内存。尽管此处使用 **Infinity** 来证明可以将这种值与 **flat()** 函数一起使用，但建议使用更小的有限参数值，以避免应用程序中发生任何无法预料的错误。

#### 零深度

以下示例演示了将 **depth** 参数值指定为 **0** 的情况：

```lua
var array1 = [1, 2, [3, 4], [[5, 6]], [[[7, 8]]], [[[[9, 10]]]]];
var array2 = array1.flat(0);
// array2: [1, 2, [3, 4], [[5, 6]], [[[7, 8]]], [[[[9, 10]]]]]
```

使用深度参数值 **0** 调用 **flat()** 函数。这意味着原始数组中包含的任何数组都不会被展平，并且新数组的单个数组项和嵌套数组的组成与原始数组完全相同。

#### 负深度

以下示例演示了指定负深度参数值的情况：

```lua
var array1 = [1, 2, [3, 4], [[5, 6]], [[[7, 8]]], [[[[9, 10]]]]];
var array2 = array1.flat(-Infinity);
// array2: [1, 2, [3, 4], [[5, 6]], [[[7, 8]]], [[[[9, 10]]]]]
```

使用 **depth** 参数值 **-Infinity** 调用 **flat()** 函数。由于负深度值对于扁平嵌套数组没有意义，所以在指定负深度参数值的情况下，将使用 **0** 作为替代。正如前面的示例所演示的那样，当指定深度参数值为 **0** 时，原始数组中没有数组是扁平的，而新数组中各个数组项和嵌套数组的组成与原始数组完全相同。

#### 经验教训

关于 **flat()** 函数，可以从本文中学到一些经验教训。首先要记住的是，**flat()** 函数不会以任何方式改变原始数组中的任何普通或嵌套数组，因此在使用该函数之前无需维护这些数组的状态。**flat()** 函数唯一会改变的数组是函数完成后返回的全新数组，它只是使用原始数组的所有内容构建的。

要记住的第二件事是，**flat()** 函数将删除原始数组中存在的所有空值。下面的示例演示了该功能的实际作用：

```yaml
var array1 = [1, , 3, , 5];
var array2 = array1.flat();
// array2: [1, 3, 5]
```

尽管原始数组占用了五个位置，而第二个和第四个位置的值未定义，但是 **flat()** 函数从函数完成后返回的新数组中删除了这两个数组项。结果，新数组只包含三个数组项，它们的值不为 **undefined**。

关于 **flat()** 函数要记住的第三件事，也是最后一件事，是它的一般用途，以及它如何有助于简化逻辑，如果没有一个可用的 **flat()**函数，要合并任何数组中包含的所有项目，通常的方法是编写自定义的逻辑来迭代所有的数组，从一个数组中单独拉出项目，然后把它们放到另一个数组中，可能会考虑到其中的嵌套数组。这样的逻辑往往比较混乱，而且容易出错，因此，通过使用抽象的内置函数（如 **flat()** 函数）来避免它的出现，是一个很好的选择。

#### 手写实现

```
//方法一
function ArrayFlat(arr){
    let a = [];
    arr.forEach(function(item){
        if(Array.isArray(item)){
            ArrayFlat(item);
        }else{
            a.push(item);
        }
    })
    return a;
}

//方法二

var a = arr.toString.split(',');
for(var i=0;i<a.length;i++){
    a[i] =eval(arr[i]);
}
```

### for...of循环：

具有 iterator 接口，就可以用for...of循环遍历它的成员(属性值)。for...of循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象、Generator 对象，以及字符串。for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。对于普通的对象，for...of结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。可以中断循环。

for...of 语句创建一个循环来迭代可迭代的对象。在 ES6 中引入的 for...of 循环，以替代 for...in 和 forEach() ，并支持新的迭代协议。for...of 允许你遍历 Arrays（数组）, Strings（字符串）, Maps（映射）, Sets（集合）等可迭代的数据结构等。

for...of 更多用于特定于集合（如数组和对象），但不包括所有对象。

```
Generators(生成器)
生成器是一个函数，它可以退出函数，稍后重新进入函数。
// generator-example.js
function* generator(){ 
  yield 1; 
  yield 2; 
  yield 3; 
}; 

for (const g of generator()) { 
  console.log(g); 
}

// Output:
// 1
// 2
// 3
```

```
for (variable of iterable) {
    statement
}
variable：每个迭代的属性值被分配给该变量。
iterable：一个具有可枚举属性并且可以迭代的对象。
const iterable = new Map([['one', 1], ['two', 2]]);

for (const [key, value] of iterable) {
  console.log(`Key: ${key} and Value: ${value}`);
}

// Output:
// Key: one and Value: 1
// Key: two and Value: 2
// set-example.js
const iterable = new Set([1, 1, 2, 2, 1]);

for (const value of iterable) {
  console.log(value);
}
// Output:
// 1
// 2
字符串用于以文本形式存储数据。
// string-example.js
const iterable = 'javascript';

for (const value of iterable) {
  console.log(value);
}
把一个参数对象看作是一个类数组(array-like)对象，并且对应于传递给函数的参数。这是一个用例：
// arguments-example.js
function args() {
  for (const arg of arguments) {
    console.log(arg);
  }
}

args('a', 'b', 'c');
// Output:
// a
// b
// c
```

### for...in循环：

遍历对象自身的和继承的可枚举的属性, 不能直接获取属性值。可以中断循环。

```
for (变量 in 对象)
{
    在此执行代码
}
```

```
for...in 循环将遍历对象的所有可枚举属性。
//for-in-example.js
Array.prototype.newArr = () => {};
Array.prototype.anotherNewArr = () => {};
const array = ['foo', 'bar', 'baz'];

for (const value in array) { 
  console.log(value);
}
// Outcome:
// 0
// 1
// 2
// newArr
// anotherNewArr
```


for...in 不仅枚举上面的数组声明，它还从构造函数的原型中查找继承的非枚举属性

### forEach:

只能遍历数组，不能中断，没有返回值(或认为返回值是undefined)。

```
forEach
[].forEach(function(value, index, array) {
  // ...
});
```

### map

只能遍历数组，不能中断，返回值是修改后的数组。

```
map
[].map(function(value, index, array) {
  // ...
});
```

### filter

```
var ages = [32, 33, 16, 40];

function checkAdult(age) {
    return age >= 18;
}

function myFunction() {
    document.getElementById("demo").innerHTML = ages.filter(checkAdult);
}
```

### Some

```
var scores = [5,8,3,10];
var current = 7;

function higherThanCurrent(score){
    return score > current;
}
if(scores.some(higherThanCurrent)){
    alert(1);
}
```

### every

```
if(scroes.every(higherThanCurrent)){
    console.log(1);
}else{
    console.log(2);
}
```

### reduce

```
var sum = [1, 2, 3, 4].reduce(function (previous, current, index, array) {
  return previous + current;
});
console.log(sum); // 10
```

### 原型

每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，这个对象（函数.prototype）的用途是包含可以由特定类型的所有实例共享的属性和方法

#### 一、isPrototypeOf()方法,判断一个对象是否是另一个对象的原型

```
 function Student(name,age){
             this.name=name;
            this.age=age;
            
         }
var student = new Student('yjj',15);

alert(Student.prototype.isPrototypeOf(student));//true
```

#### 二、Obeject.getPrototypeOf()方法,获取某个对象的原型对象

```
function Student(name,age){
             this.name=name;
            this.age=age;
            
         }
var student = new Student('yjj',15);
alert(Object.getPrototypeOf(student )==Student.prototype);//true
```

此方法为ECMAScript 5新增,支持该方法的浏览器有IE9+,Firefox 3.5+,Safari 5+,Opera 12+,Chrome.

#### 三、hasOwnProperty()方法判断对象是不是自身的属性

```
function Student(name,age){
             this.name=name;
            this.age=age;
            
         }
Student.prototype.xxx='ssss';
var student = new Student('yjj',15);
alert(student.hasOwnProperty('name'));//true
alert(student.hasOwnProperty('xxx'));//false
```

#### 四、in操作符,in操作符单独使用时,会在通过对象能够访问给定属性时返回true,无论该属性存在于实例还是原型中。

```
function Student(name,age){
             this.name=name;
            this.age=age;
            
         }
Student.prototype.xxx='ssss';

var student = new Student('yjj',15);
alert("name" in student); //true
alert("xxx" in student); //true
```

 判断一个对象的属性是否是原型属性。

```
function hasPrototypeProperty(object,name){
     return !object.hasOwnProperty(name)&&(name in object)   
     //不是自身属性，但能够访问到 就是原型属性   
} 
```

### 原型链

基本思想就是利用原型让一个引用类型继承另一个引用类型的属性和方法

原型链的作用：如果在对象上没有找到需要的属性或方法引用，引擎就会继续在原型关联的对象上寻找。

原型链就是多个对象通过 __proto__ 的方式连接了起来。为什么 obj 可以访问到 valueOf 函数，就是因为 obj 通过原型链找到了 valueOf 函数

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210313111035900.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3RpYW4xOTk3,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021041622112990.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3RpYW4xOTk3,size_16,color_FFFFFF,t_70)

- Object是所有对象的爸爸，所有对象都可以通过 __proto__找到它
- Function是所有函数的爸爸，所有函数都可以通过 __proto__找到它
- 函数的 prototype 是一个对象
- 对象的__proto__属性指向原型，__proto__将对象和原型连接起来组成了原型链

#### js中__proto__和prototype的区别和关系？

__proto__是每个对象都有的一个属性，而prototype是函数才会有的属性。
__proto__指向的是当前对象的原型对象，而prototype指向的，是以当前函数作为构造函数构造出来的对象的原型对象。
prototype 与__proto__ 的关系就是：你的__proto__来自你构造函数的prototype

### 原型继承和Class继承

首先先来讲下 class，其实在 JS中并不存在类，class 只是语法糖，本质还是函数

```
class Person {}
Person instanceof Function // true
```

**1. 原型链继承**

> 优点：
>
> 实现函数复用，简单
> 缺点：
>
> 1. 子类实例共享属性，造成实例间的属性会相互影响
> 2. 创建子类实例的时候，不能向超类型的构造函数中传递参数

```
  function Super(){
    this.color=['red','yellow','black']
  }

  function Sub(){
  }
  //继承了color属性 Sub.prototype.color=['red','yellow','black']
  //原型链继承
  Sub.prototype=new Super()

  //创建实例 instance1.__proto__.color
  const instance1=new Sub()
  const instance2=new Sub()
  console.log(instance1.__proto__.color===instance2.__proto__.color) //true
```

**2. 借用构造函数继承**

> 优点：可以在构造函数中向超类型构造函数传递参数
> 缺点：不能函数复用，方法只能定义在构造函数中

```
//构造函数继承
function Parent(name) {
  this.name = name
  this.rename = function () {
  	this.name.push('xiuzhu')
  }
}

function Child() {
  Parent.call(this, "chenyi")
}

var child1 = new Child()
var child2 = new Child()
console.log(child.name) //chenyi
console.log(child1.rename === child2.rename) // false, 实例没有共享同一个方法
```

**3. 组合继承**

> 组合继承是**最常用的继承方式**
>
> 继承方式优点：实现了函数复用，且能在构造函数中传参，不会与父类引用属性共享，可以复用父类的函数
>
> 缺点：会调用两次超类型的构造函数，一次在创建子类型原型的时候，另一次在子类型构造函数内部。就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费

```
function Parent(value) {
  this.val = value
}
//原型式继承
Parent.prototype.getValue = function() {
  console.log(this.val)
}
//构造函数继承
function Child(value) {
  Parent.call(this, value)
}
//原型继承
Child.prototype = new Parent()

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

**4. 原型式继承**

> 1. 引用类型值会共享，值类型不会共享
>    因为在改变值类型时，相当于给自己添加了属性。
>    当去修改引用类型的某个值时，是在修改__proto__中的对象。但如果直接给引用类型赋值，那也和值类型一样，是给自己增加了属性

```
 function object(o){
    function F(){}
    //F.prototype={name:'ccdida',friends:['shelly','Bob']}
    F.prototype=o
    // new F() 
    //F是个构造函数，返回F的实例：1.this此时用不上 2.将实例的__proto__指向F.prototype.
    //即返回了一个实例，其__proto__指向{name:'ccdida',friends:['shelly','Bob']}
    return new F()
  }
  var person={
    name:'ccdida',
    friends:['shelly','Bob']
  }
  var person1=object(person)
  var person2=object(person)
  //object函数相当于实现了Object.Create的功能
  console.log(person1.__proto__===person) //true 
  person2.friends.push('shlimy')
  console.log(person1.friends)// ["shelly", "Bob", "shlimy"]
```

**5. 寄生继承**

> 缺点：不能做到函数复用，引用类型数据依然共享
> 原型式继承：基于已有的对象（原型对象）创建新对象（实现[Object](https://so.csdn.net/so/search?q=Object&spm=1001.2101.3001.7020).create())
> 寄生式继承：创建一个用于封装继承过程的函数（实现Object.create()),同时以某种方式增强对象（比如添加方法）

```
 var person={
    name:'ccdida',
    friends:['shelly','Bob']
  }
  function createAnother(original){
    //clone.__proto__===original
    var clone=Object.create(original)
    //增强对象，添加属于自己的方法
    clone.sayHi=function(){
      console.log('hi')
    }
    return clone
  }
  var person1=createAnother(person)
  var person2=createAnother(person)
  person1.friends.push('shmily')
  console.log(person2.friends)//["shelly", "Bob","shmily"]
  person1.sayHi() //hi
```

**6. 寄生组合继承**
引用类型最理想的继承范式

> 前面的组合继承有个缺点：每次创建实例时都会调用两次超类方法，一次是通过`new`设置原型的时候，另一次是用`call`执行的时候

```
function Parent(value) {
  this.val = value
}
//原型式继承
Parent.prototype.getValue = function() {
  console.log(this.val)
}
//构造函数继承
function Child(value) {
  Parent.call(this, value)
}
//寄生继承
//Object.create()是ES5规范化的原型式继承:一个是用作新对象原型的对象和
//（可选的）一个新对象定义额外属性的对象
// 如下是补充因为重写Parent原型而失去默认的constructor属性，最后将新创建的对象赋值给子类型的原型
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

- 思路：不需要为了指定子类型的原型而调用超类型的构造函数（我理解为就是不需要显示的new操作），通过上面的寄生式继承方式来继承超类型的原型即可。

**7. Class 继承**

> 在 ES6 中，我们可以使用 `class` 去实现继承，并且实现起来很简单

```
class Parent {
  constructor(value) {
    this.val = value
  }
  getValue() {
    console.log(this.val)
  }
}
class Child extends Parent {
  constructor(value) {
    super(value)
    this.val = value
  }
}
let child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```

- `class` 实现继承的核心在于使用 `extends` 表明继承自哪个父类，并且在子类构造函数中必须调用 `super`，因为这段代码可以看成 `Parent.call(this, value)`。

#### super 方法

`super`作为函数调用时，代表父类的构造函数。

ES6 要求，子类的构造函数必须执行一次`super`函数。子类`B`的构造函数之中的`super()`，代表调用父类的构造函数。

注意，`super`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例，即`super`内部的`this`指的是`B`的实例，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。

作为函数时，`super()`只能用在子类的构造函数之中，用在其他地方就会报错。

#### super 对象

`super`作为对象时，在普通方法中，指向父类的原型对象，在静态方法中，指向父类。

由于`super`指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过`super`调用的。ES6 规定，在子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类实例。由于`this`指向子类实例，所以如果通过`super`对某个属性赋值，这时`super`就是`this`，赋值的属性会变成子类实例的属性。

如果`super`作为对象，用在静态方法之中，这时`super`将指向父类，而不是父类的原型对象。在子类的静态方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类，而不是子类的实例。

#### 注意

使用`super`的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。`console.log(super)`当中的`super`，无法看出是作为函数使用，还是作为对象使用，所以 JavaScript 引擎解析代码的时候就会报错。这时，如果能清晰地表明`super`的数据类型，就不会报错。

最后，由于对象总是继承其他对象的，所以可以在任意一个对象中，使用`super`关键字。

```js
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```

### 严格模式的限制？

```
"use strict”
```

##### 1、在对象中声明相同的属性名

```
	var obj ={
                   'name': 1,
                   'name': 2
           };
```

会抛出SyntaxError: Duplicate data property in object literal not allowed in strict mode.

##### 2、在函数声明中相同的参数名

```
     function fix(a,b,a) {     
         return a+b;     
     }
```

会抛出 SyntaxError: Strict mode function may not have duplicate parameter names .

##### 3：不能用前导0声明8进制直接量

```
 var a = 012;
```

会抛出 SyntaxError: Octal literals are not allowed in strict mode.

##### 4： 不能重新声明、删除或重写eval和arguments这两个标示符

```
var eval = ......;
```

会抛出  SyntaxError: Assignment to eval or arguments is not allowed in strict mode

##### 5:用delete删除显示声明的标识符、名称和具名函数

```
  function temp() {
       'use strict';
        var test = 1;
        delete test;
    }
```


会抛出 SyntaxError: Delete of an unqualified identifier in strict mode.

##### 6.代码中使用扩展的保留字，例如 interface,let,yield,package,private等

  会抛出SyntaxError: Unexpected strict mode reserved word

##### 7.严格模式下是禁止使用with的

会抛出 SyntaxError: Strict mode code may not include a with statement

### NaN 是什么？有什么特别之处？

NaN 属性是代表非数字值的特殊值。该属性用于指示某个值不是数字。可以把 Number 对象设置为该值，来指示其不是数字值。

### 对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？

原始（Primitive）类型

##### 原始类型有哪几种？null 是对象嘛？

在 JS 中，存在着 6 种原始值，分别是：

1、boolean  2、null  3、undefined   4、number   5、string   6、symbol
首先原始类型存储的都是值，是没有函数可以调用的，比如 undefined.toString()
此时你肯定会有疑问，这不对呀，明明 '1'.toString() 是可以使用的。其实在这种情况下，'1' 已经不是原始类型了，而是被强制转换成了 String 类型也就是对象类型，所以可以调用 toString 函数。
其中 JS 的 number 类型是浮点类型的，在使用中会遇到某些 Bug，比如 0.1 + 0.2 !== 0.3，但是这一块的内容会在进阶部分讲到。string 类型是不可变的，**无论你在 string 类型上调用何种方法，都不会对值有改变。**
另外对于 null 来说，很多人会认为他是个对象类型，其实这是错误的。虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

##### 对象（Object）类型

##### 对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？

​	在 JS 中，除了原始类型那么其他的都是对象类型了。对象类型和原始类型不同的是，**原始类型存储的是值，对象类型存储的是地址（指针）。**当你创建了一个对象类型的时候，计算机会在内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址（指针）。

```
const a = []
```

对于常量 a 来说，假设内存地址（指针）为 #001，那么在地址 #001 的位置存放了值 []，常量 a存放了地址（指针） #001，再看以下代码

```
const a = []
const b = a
b.push(1)
```

当我们将变量赋值给另外一个变量时，复制的是原本变量的地址（指针），也就是说当前变量 b 存放的地址（指针）也是 #001，当我们进行数据修改的时候，就会修改存放在地址（指针） #001 上的值，也就导致了两个变量的值都发生了改变。

```
function test(person){
    person.age = 26 ;
    person = {
        name:'yyy',
        age:30
    }
    return person;
}
const p1 ={
    name: 'yck',
    age:25
}
const p2 = test(p1);
console.log(p1); //{name: "yck", age: 26}
console.log(p2); //{name: "yyy", age: 30}
```

* 首先，函数传参是传递对象指针的副本
* 到函数内部修改参数的属性这步，我相信大家都知道，当前 p1 的值也被修改了
* 但是当我们重新为 person 分配了一个对象时就出现了分歧
  所以最后 person 拥有了一个新的地址（指针），也就和 p1 没有任何关系了，导致了最终两个变量的值是不相同的。

## 谈谈你对 JS 执行上下文栈和作用域链的理解？

执行上下文就是当前 JavaScript 代码被解析和执行时所在环境, JS执行上下文栈可以认为是一个存储函数调用的栈结构，遵循先进后出的原则。

* JavaScript执行在单线程上，所有的代码都是排队执行。

* 一开始浏览器执行全局的代码时，首先创建全局的执行上下文，压入执行栈的顶部。

* 每当进入一个函数的执行就会创建函数的执行上下文，并且把它压入执行栈的顶部。当前函数执行-完成后，当前函数的执行上下文出栈，并等待垃圾回收。

* 浏览器的JS执行引擎总是访问栈顶的执行上下文。

* 全局上下文只有唯一的一个，它在浏览器关闭时出栈。
  作用域链: 无论是 LHS 还是 RHS 查询，都会在当前的作用域开始查找，如果没有找到，就会向上级作用域继续查找目标标识符，每次上升一个作用域，一直到全局作用域为止。

* 如果查找的目的是对变量进行赋值，那么就会使用LHS 查询；如果目的是获取变量的值，就会使用RHS 查询

RHS 查询与简单地查找某个变量的值别无二致，而LHS 查询则是试图找到变量的容器本身，从而可以对其赋值。
LHS查询指的是找到变量的容器本身，从而可以对其进行赋值。也就是找到赋值操作的目标。
LHS查询的时候会沿着作用域链进行查询，找到的话就会将值赋值给这个变量，如果到达作用域顶端仍然找不到，就会在作用域链顶端创建这个变量。

### 实现一个 reduce 函数，作用和原生的 reduce 类似下面的例子。

```
function reduce(param,callback ,initVal){
    var hasInitVal = initVal !== void 0;
    var acc =hasInitVal ? initVal: param[0];
    each(hasInitVal? param:Array.prototype.slice.call(param,1),function(v,k,o){
        acc = callback(acc,v,k,o);
    });
    return acc;
}
```

### new 的原理是什么？通过 new 的方式创建对象和通过字面量创建有什么区别？

new:

1. 创建一个新对象。

2. 这个新对象会被执行[[原型]]连接。

3. 属性和方法被加入到 this 引用的对象中。并执行了构造函数中的方法.

4. 如果函数没有返回其他对象，那么this指向这个新对象，否则this指向构造函数中返回的对象。

   ```
   function new(func){
       let target ={};
       target.__proto__ = func.prototype;
       let res = func.call(target);
       if(res &&typeof(res) =="object" || typeof(res) =="function"){
           return res;
       }
       return target;
   }
   ```

字面量创建对象，不会调用 Object构造函数, 简洁且性能更好;
new Object() 方式创建对象本质上是方法调用，涉及到在proto链中遍历该方法，当找到该方法后，又会生产方法调用必须的堆栈信息，方法调用结束后，还要释放该堆栈，性能不如字面量的方式。
通过对象字面量定义对象时，不会调用Object构造函数。

#### 模拟实现 new 操作符

```
function newOperator(ctor){
    if(typeof ctor !== 'function'){
      throw 'newOperator function the first param must be a function';
    }
    // ES6 new.target 是指向构造函数
    newOperator.target = ctor;
    // 1.创建一个全新的对象，
    // 2.并且执行[[Prototype]]链接
    // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
    var newObj = Object.create(ctor.prototype);
    // ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
    // 除去ctor构造函数的其余参数
    var argsArr = [].slice.call(arguments, 1);
    // 3.生成的新对象会绑定到函数调用的`this`。
    // 获取到ctor函数返回结果
    var ctorReturnResult = ctor.apply(newObj, argsArr);
    // 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
    var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === 'function';
    if(isObject || isFunction){
        return ctorReturnResult;
    }
    // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
    return newObj;
}
```

### Js中创建对象的几种方式

###### 1.普通方法

1）字面量的方式

```
var box={name:'苏',age:22,run:function(){return this.name+this.age}}
```

2)new 方法：

```
var box = new object();
box.name = '苏';
box.age =22;
//缺点：想创建类似的对象，即属性，方法名相同但是值不相同的对象，就需要写很多代码。
```

###### 2.工厂模式

```
function createObjet(name ,age){
    var obj = new object;
    obj.name = name;
    obj.age = age;
    obj.run = function (){
         return this.name + this.age;
    }
    return obj;
}
var a = createObjet('苏',22);
```

缺点：没有办法判断对象的来源，即无法判断出对象是谁创建出来的实例。存在识别问题。

###### 3.构造函数式

方式：通过构造函数去创建实例对象

```
function Box(name,age){
    this.name = name;
    this.age = age;
    this.run = function(){
        return this.name + this.age;
    }
}
var a = new Box('苏',22)；
a instanceof Object;//true
a instanceof Box;//true
```

原理：1.构造函数没有 new Object();但后台会自动创建 obj=new Object();

​			2.this相当于obj

​			3.构造函数不需要返回对象引用，直接new就可以了；

构造函数规范：

​			1.构造函数也是函数，但函数名第一个大写。

​			2.不用想普通函数一样，直接new 出来即可。

优点：**解决了识别问题，即创建每个实例对象都是这个Box的实例。**

缺点:通过构造函数创建对象的时候，当一个构造函数被实例化多次后，构造函数中的方法也会被实例化多次，同一类型的不同对象之间并不共用同一个函数，造成内存浪费。

```
var a = new Box('苏'，22)；
var b = new Box('苏'，22)；
a.run() == b.run();//true;
a.run = b.run //false;引用地址不同
```

###### 4.原型链方式：

```
function Box(){};
Box.prototype.name='苏';
Box.prototype.age=22;
Box.prototype.run=function(){
	return this.name+this.age;
}
var a=new Box();
var b=new Box();
alert(a.run==b.run)  //true
```

PS:在原型模式声明中，多了两个属性：_proto_，constructor。

原型用字面量方式改写：

```
function Box(){};
Box.prototype={
	constructor:Box,  //强制转到Box
	name:'苏',
	age:22,
	run:function(){
		return this.name+this.age;
	}
}
```

字面量创建的对象实例constructor属性不会指向实例，可强制指向。

缺点：没有办法传参。可在实例里来添加或覆盖原型属性：

特点：原型里的属性和方法都是共享的。

###### 5.构造函数加原型模式；

```
function Box(name,age){
	this.name=name;
	this.age=age;
}
Box.prototype.run=function(){
	return this.name+this.age;
}
```

方式：需要传参的实例属性用构造函数，需要共享的方法用原型模式。

缺点：不管是否调用了原型里的方法，在创建实例对象时，都会对方法进行初始化。

###### 6.动态原型链模式

```
function Box(name,age){
	this.name=name;
	this.age=age;
if(typeof this.run!='function'){         //只在第一次创建对象时初始化
		Box.prototype.run=function(){
		return this.name+this.age;
		}
	}
}
```

不可再用字面量方式重写原型。

###### 7.寄生构造函数

```
function Box(){
	var obj=new Object();
	obj.name=name;
	obj.age=age;
	obj.run=function(){
		return this.name+this.age;
	}
}
```

### 为数组添加Math方法

```
// ES5 的写法 
Math.max.apply(null, [14, 3, 77, 30]);
 // ES6 的写法 
Math.max(...[14, 3, 77, 30]); 
// reduce 
[14,3,77,30].reduce((accumulator, currentValue)=>{
     return accumulator = accumulator > currentValue ? accumulator : currentValue 
});
```

### Event Loop 是什么

> JavaScript的事件分两种，**宏任务(macro-task)**和**微任务(micro-task)**

- **宏任务**：包括整体代码script，setTimeout，setInterval
- **微任务**：Promise.then(非new Promise)，process.nextTick(node中)
- 事件的执行顺序，`是先执行宏任务，然后执行微任务`，这个是基础，任务可以有同步任务和异步任务，同步的进入主线程，异步的进入Event Table并注册函数，异步事件完成后，会将回调函数放入Event Queue中(`宏任务和微任务是不同的Event Queue`)，同步任务执行完成后，会从Event Queue中读取事件放入主线程执行，回调函数中可能还会包含不同的任务，因此会循环执行上述操作。

微任务 ——> Dom渲染 ——> 宏任务

### Object.create()、new Object()和{}的区别

#### **直接字面量创建**

```javascript
var objA = {};
objA.name = 'a';
objA.sayName = function() {
    console.log(`My name is ${this.name} !`);
}
// var objA = {
//     name: 'a',
//     sayName: function() {
//         console.log(`My name is ${this.name} !`);
//     }
// }
objA.sayName();
console.log(objA.__proto__ === Object.prototype); // true
console.log(objA instanceof Object); // true
```

#### **new关键字创建**

```javascript
var objB = new Object();
// var objB = Object();
objB.name = 'b';
objB.sayName = function() {
    console.log(`My name is ${this.name} !`);
}
objB.sayName();
console.log(objB.__proto__ === Object.prototype); // true
console.log(objB instanceof Object); // true
```

在[JS的指向问题](https://link.juejin.cn?target=https%3A%2F%2Flijing0906.github.io%2Fpost%2FJSthis)中讲**new绑定**时讲了`new`操作符其实做了以下四步：

```javascript
var obj = new Object(); // 创建一个空对象
obj.__proto__ = Object.prototype; // obj的__proto__指向构造函数Object的prototype
var result = Object.call(obj); // 把构造函数Object的this指向obj，并执行构造函数Object把结果赋值给result
if (typeof(result) === 'object') {
    objB = result; // 构造函数Object的执行结果是引用类型，就把这个引用类型的对象返回给objB
} else {
    objB = obj; // 构造函数Object的执行结果是值类型，就返回obj这个空对象给objB
}
```

这样一比较，其实字面量创建和new关键字创建并没有区别，创建的新对象的`__proto__`都指向`Object.prototype`，只是字面量创建更高效一些，少了`__proto__`指向赋值和`this`。

#### **Object.create()**

> `Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。 [MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2Fcreate)

```javascript
const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};
const me = Object.create(person); // me.__proto__ === person
me.name = "Matthew"; // name属性被设置在新对象me上，而不是现有对象person上
me.isHuman = true; // 继承的属性可以被重写
me.printIntroduction(); // My name is Matthew. Am I human? true
```

> Object.create(proto[, propertiesObject])

- `proto`必填参数，是新对象的原型对象，如上面代码里新对象`me`的`__proto__`指向`person`。注意，如果这个参数是`null`，那新对象就彻彻底底是个空对象，没有继承`Object.prototype`上的任何属性和方法，如`hasOwnProperty()、toString()`等。

```javascript
var a = Object.create(null);
console.dir(a); // {}
console.log(a.__proto__); // undefined
console.log(a.__proto__ === Object.prototype); // false
console.log(a instanceof Object); // false 没有继承`Object.prototype`上的任何属性和方法，所以原型链上不会出现Object
```

- `propertiesObject`是可选参数，指定要添加到新对象上的可枚举的属性（即其自定义的属性和方法，可用`hasOwnProperty()`获取的，而不是原型对象上的）的描述符及相应的属性名称。

```javascript
var bb = Object.create(null, {
    a: {
        value: 2,
        writable: true,
        configurable: true
    }
});
console.dir(bb); // {a: 2}
console.log(bb.__proto__); // undefined
console.log(bb.__proto__ === Object.prototype); // false
console.log(bb instanceof Object); // false 没有继承`Object.prototype`上的任何属性和方法，所以原型链上不会出现Object

// ----------------------------------------------------------

var cc = Object.create({b: 1}, {
    a: {
        value: 3,
        writable: true,
        configurable: true
    }
});
console.log(cc); // {a: 3}
console.log(cc.hasOwnProperty('a'), cc.hasOwnProperty('b')); // true false 说明第二个参数设置的是新对象自身可枚举的属性
console.log(cc.__proto__); // {b: 1} 新对象cc的__proto__指向{b: 1}
console.log(cc.__proto__ === Object.protorype); // false
console.log(cc instanceof Object); // true cc是对象，原型链上肯定会出现Object
```

`Object.create()`创建的对象的原型指向传入的对象。跟字面量和`new`关键字创建有区别。

- 自己实现一个Object.create()

```javascript
Object.mycreate = function(proto, properties) {
    function F() {};
    F.prototype = proto;
    if(properties) {
        Object.defineProperties(F, properties);
    }
    return new F();
}
var hh = Object.mycreate({a: 11}, {mm: {value: 10}});
console.dir(hh);
```

#### **总结**

- 字面量和`new`关键字创建的对象是`Object`的实例，原型指向`Object.prototype`，继承内置对象`Object`
- `Object.create(arg, pro)`创建的对象的原型取决于`arg`，`arg`为`null`，新对象是空对象，没有原型，不继承任何对象；`arg`为指定对象，新对象的原型指向指定对象，继承指定对象

### 0.1 + 0.2 === 0.3 嘛？为什么？

JavaScript 使用 Number 类型来表示数字（整数或浮点数），遵循 IEEE 754 标准，通过 64 位来表示一个数字（1 + 11 + 52）

- 1 符号位，0 表示正数，1 表示负数 s
- 11 指数位（e）
- 52 尾数，小数部分（即有效数字）

最大安全数字：Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1，转换成整数就是 16 位，所以 0.1 === 0.1，是因为通过 toPrecision(16) 去有效位之后，两者是相等的。

在两数相加时，会先转换成二进制，0.1 和 0.2 转换成二进制的时候尾数会发生无限循环，然后进行对阶运算，JS 引擎对二进制进行截断，所以造成精度丢失。

所以总结：**精度丢失可能出现在进制转换和对阶运算中**

### 去除字符串中的最后一个字符

substr、substring、splice

### splice和slice

1.[slice](https://so.csdn.net/so/search?q=slice&spm=1001.2101.3001.7020)(start,end)：方法可从已有数组中返回选定的元素，返回一个新数组，包含从start到end（不包含该元素）的数组元素。

注意：该方法不会改变原数组，而是返回一个子数组，如果想删除数组中的一段元素，应该使用Array.splice()方法。

2.splice()：该方法向或者从数组中添加或者删除项目，返回被删除的项目。（该方法会改变原数组）

### js隐式转换判断

看javascript语言精髓与编程实践笔记

### parseInt和number的区别

三者的作用：把其他数据类型转换成数字

区别：`Number()` 可以用于任何数据类型转换成数值；`parseInt()` 用于将字符串转换成数值

> ```
> parseInt()`和 `parseFloat()` 这两者的区别就是`整数`和`浮点数`的区别，所以本文将只比较`Number()`和`parseInt()
> ```

## 一、Number()

1. Boolean值，true 转换成 1， false 转换成 0；
2. null，返回0；
3. undefined, 返回NaN；
4. 如果是字符串：
   - 字符串只包含数据时，将转换成十进制的数值，第一个数字是0的话，将会忽略，如：`Number('0123') -> 123`；
   - 字符串包含有效的浮点数，如“1.1”，将转换成对应的浮点数，如：`Number('01.1') -> 1.1`；
   - 字符串包含有效的十六进制格式，如“0xf”，将转换成相同大小的十进制数值，如：`Number('0xf') -> 15`；
   - 字符串为空，转换成0，如：`Number('') -> 0`；
   - 字符串包含了除上面这几种格式外的字符，将转换成`NaN`，如：`Number('123x') -> NaN`
5. 如果是对象，则调用对象的ValueOf()方法，然后依照前面的规则转换返回的值；如果转换的结果是NaN，则调用的对象的toString()方法，然后再次依照前面的规则转换返回的字符串值。

## 二、parseInt()

只能将字符串转换成数值；与 `Number()`转字符串的区别是：

1. 字符串数字开头或者负号开头，往后取值，直到非数字停止，如：`parseInt('123x') -> 123`、`parseInt('-023x') -> -23`，注意：`parseInt('-0a') -> -0`、`parseInt('-0x') -> NaN`(0x为十六进制数的开头)、`parseInt('-abc') -> NaN`；
2. 字符串非数字或者负号开头，则为`NaN`，如：`parseInt('x123') -> NaN`；
3. 空字符串，返回`NaN`, 如：`parseInt('') -> NaN`；
4. `parseInt('1.1') -> 1` 这也是它和 parseFloat() 的差别。

### Number() 和 parseInt() 对比的一张表

| 值         | Number() | parseInt() |
| ---------- | -------- | ---------- |
| ''         | 0        | NaN        |
| true/false | 1/0      | NaN        |
| '0123'     | 123      | 123        |
| '123x'     | NaN      | 123        |
| 'x123'     | NaN      | NaN        |
| '01.1'     | 1.1      | 1          |

### parseInt() 还有第二个参数

第二个参数用于指定转换时，转换成多少进制(如2进制、8进制、10进制、16进制 等等)，默认为10进制。

```javascript
parseInt('-023x', 8) // -19

parseInt('010', 10) // 10

parseInt('010', 8) // 8

parseInt('0x10',10) // 0

parseInt('0x10',16) // 16

parseInt('0xf', 16) // 15

复制代码
```

说到这第二个参数，有一个非常经典的面试题：

```javascript
['1', '2', '3'].map(parseInt) // 会得到什么结果？？？

复制代码
```

如果你不假思索的写出了 `[1, 2, 3]`，那你的面试可能就会Game Over了。

为什么？？？

正确答案应该是 `[1, NaN, NaN]`... 原因就出在parseInt()的第二个参数身上： ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1afef5f6baf446d0a1d0f5567a7c29cf~tplv-k3u1fbpfcp-watermark.awebp)

然而，map的语法又是这样的： ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75d6119d62e94d52851372425fbfd8c9~tplv-k3u1fbpfcp-watermark.awebp)

```
['1', '2', '3'].map(parseInt)`，其实拆解出来就是： `['1', '2', '3'].map((currentValue, index) => parseInt(currentValue, index))
```

三个值转换相当于：`parseInt('1', 0)`、`parseInt('2', 1)`、`parseInt('3', 2)`

> 1. parseInt('1', 0) 第二个参数为0,相当的没传，即默认值,也就是10进制，正确转换成1；
> 2. parseInt('2', 1) 第二参数不合法，看文档，第二个参数是2-36的值，`如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN`；
> 3. parseInt('3', 2) 参数合法，但是，2进制里没有3这个数字，所以返回`NaN`

### 最大安全数字 Number.MAX_VALUE

最大安全数字是 Math.pow(2, 53) - 1，对于 16 位十进制。

### DOMContentloaded和window.onload

#### 1、`DOMContentLoaded`

当纯HTML被完全加载以及解析时，DOMContentLoaded 事件会被触发，而不必等待样式表，图片或者子框架完成加载。比下面其他几个方法都先执行 document.addEventListener('DOMContentLoaded', () => { console.log('DOMContentLoaded'); });

#### 2、`window.onload`

在页面全部内容加载完毕后执行

### 将URL参数解析成对象

只记录一下正则的方法

```javascript
const getURLParameters = (url) =>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
      (a, v) => (
        (a[v.slice(0, v.indexOf("="))] = v.slice(v.indexOf("=") + 1)), a
      ),
      {}
    );
getURLParameters("https://juejin.cn/"); // {}
getURLParameters("http://url.com/page?name=Tom&age=18"); // {name: "Tom", age: "18"}
```

### js单线程，如何处理异步的

#### 执行上下文（Execution context）

在 JavaScript 中代码运行时需要创建执行上下文，全局代码有全局执行上下文，每个方法也有自己的执行上下文。

#### 调用栈 （Call stack）

调用栈是运行 JavaScript 的地方，执行上下文被押入栈中才会被执行，执行完后被弹出，遵循先入后出，后入先出的原则。

了解了这两个概念后来看这段代码的执行过程：



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/28/16c3458e783ed3d2~tplv-t2oaga2asx-watermark.awebp)



最先押入栈的是 `main()` 全局执行上下文，每个方法在执行时都会押入栈中，当 `main()` 弹出，整段代码执行完毕。从中我们可以很容易发现任意方法执行时间很长的话，都会阻塞整个栈（或者线程）。

**怎么解决？当然是引入异步执行**

来看一段异步执行的代码：

```
const networkRequest = () => {
  const callback = () => console.log('Async Code');
  setTimeout(callback, 2000);
};
console.log('Hello World');
networkRequest();
// => 'Hello World'
// 等待 2s
// => 'Async Code'
复制代码
```

我们用 `setTimeout` 模拟接口请求，需要注意的是 `setTimeout` 不属于 Javascript，它是由浏览器提供的 API（当然 `Node.js` 也有这个 API）。

执行到 `setTimeout` 时，交给浏览器提供的线程执行的，后续 `console.log('Hello World')` 继续执行，并不会等待 `setTimeout` 执行完后再执行，这就形成了异步执行。

当 `setTimeout` 执行完后，`callback` 被推入 **消息队列（Message Queue）** 中。此时 **事件循环（The Event Loop）** 会观察 `Call Stack` 是否清空，如果已清空，将 `callback` 押入栈中执行。如下动图：



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/28/16c3459433d4ef15~tplv-t2oaga2asx-watermark.awebp)



#### 总结

`setTimeout`，`Promise`，`Async/Await` 等都可实现异步，需要注意的是 `ES6` 为了引入 `Promise` 加入了微任务队列（Micro Task Queue），它的优先级高于消息队列（Message Queue），也就是说当调用栈清空后事件循环（The Event Loop）会率先将微任务队列的回调押入栈中执行，看如下代码：

```
function func() {
	setTimeout(()=>{console.log('setTimeout')}, 0)
	new Promise((resolve, reject)=>{
		resolve('Promise')
	}).then((msg) => {console.log(msg)})
}
func()
// => Promise
// => setTimeout
复制代码
```

虽然 `setTimeout` 的代码先于 `Promise` 执行，但打印结果显示 `Promise` 的回调是先于 `setTimeout` 执行的。

### var和function变量提升的优先级

var高

### 静态作用域和动态作用域

在 JavaScript 里面，函数、块、模块都可以形成作用域（一个存放变量的独立空间），他们之间可以相互嵌套，作用域之间会形成引用关系，这条链叫做作用域链。

作用域链具体是什么样呢？

#### 静态作用域链

比如这样一段代码

```javascript
  function func() {
    const guang = 'guang';
    function func2() {
      const ssh = 'ssh';
      {
        function func3 () {
          const suzhe = 'suzhe';
        }
      }
    }
  }

复制代码
```

其中，有 guang、ssh、suzhe 3个变量，有 func、func2、func3 3个函数，还有一个块，他们之间的作用域链可以用babel查看一下。

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const code = `
  function func() {
    const guang = 'guang';
    function func2() {
      const ssh = 'ssh';
      {
        function func3 () {
          const suzhe = 'suzhe';
        }
      }
    }
  }
`;

const ast = parser.parse(code);

traverse(ast, {
  FunctionDeclaration (path) {
    if (path.get('id.name').node === 'func3') {
      console.log(path.scope.dump());
    }
  }
})
复制代码
```

结果是

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72f12fc7e7164cc0af23f3e16f03bb06~tplv-k3u1fbpfcp-watermark.awebp)

用图可视化一下就是这样的

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df0acc1d0b904b8194b87622ac66f097~tplv-k3u1fbpfcp-watermark.awebp)

函数和块的作用域内的变量声明会在作用域 （scope） 内创建一个绑定（变量名绑定到具体的值，也就是 binding），然后其余地方可以引用 （refer） 这个 binding，这样就是静态作用域链的变量访问顺序。

**为什么叫“静态”呢？**

因为这样的嵌套关系是分析代码就可以得出的，不需要运行，按照这种顺序访问变量的链就是静态作用域链，这种链的好处是可以直观的知道变量之间的引用关系。

相对的，还有动态作用域链，也就是作用域的引用关系与嵌套关系无关，与执行顺序有关，会在执行的时候动态创建不同函数、块的作用域的引用关系。缺点就是不直观，没法静态分析。

静态作用域链是可以做静态分析的，比如我们刚刚用 babel 分析的 scope 链就是。所以绝大多数编程语言都是作用域链设计都是选择静态的顺序。

但是，JavaScript 除了静态作用域链外，还有一个特点就是函数可以作为返回值。比如

```javascript
function func () {
  const a = 1;
  return function () {
    console.log(a);
  }
}
const f2 = func();
复制代码
```

这就导致了一个问题，本来按照顺序创建调用一层层函数，按顺序创建和销毁作用域挺好的，但是如果内层函数返回了或者通过别的暴露出去了，那么外层函数销毁，内层函数却没有销毁，这时候怎么处理作用域，父作用域销不销毁？ （比如这里的 func 调用结束要不要销毁作用域）

#### 不按顺序的函数调用与闭包

比如把上面的代码做下改造，返回内部函数，然后在外面调用：

```javascript
function func() {
  const guang = 'guang';
  function func2() {
    const ssh = 'ssh';
    function func3 () {
      const suzhe = 'suzhe';
    }
    return func3;
  }
  return func2;
}

const func2 = func();
复制代码
```

当调用 func2 的时候 func1 已经执行完了，这时候销不销毁 ？于是 JavaScript 就设计了闭包的机制。

#### 闭包怎么设计？

先不看答案，考虑一下我们解决这个静态作用域链中的父作用域先于子作用域销毁怎么解决。

**首先，父作用域要不要销毁？ 是不是父作用域不销毁就行了？**

不行的，父作用域中有很多东西与子函数无关，为啥因为子函数没结束就一直常驻内存。这样肯定有性能问题，所以还是要销毁。 但是销毁了父作用域不能影响子函数，所以要再创建个对象，要把子函数内引用（refer）的父作用域的变量打包里来，给子函数打包带走。

**怎么让子函数打包带走？**

设计个独特的属性，比如 [[Scopes]] ，用这个来放函数打包带走的用到的环境。并且这个属性得是一个栈，因为函数有子函数、子函数可能还有子函数，每次打包都要放在这里一个包，所以就要设计成一个栈结构，就像饭盒有多层一样。

我们所考虑的这个解决方案：销毁父作用域后，把用到的变量包起来，打包给子函数，放到一个属性上。这就是闭包的机制。

我们来试验一下闭包的特性：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c21f15ec42443b892baa191e9bcf898~tplv-k3u1fbpfcp-watermark.awebp)

这个 func3 需不需要打包一些东西？ 会不会有闭包？

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88178215cc7d4e76a77df1add6de120e~tplv-k3u1fbpfcp-watermark.awebp)

其实还是有闭包的，闭包最少会包含全局作用域。

但是为啥 guang、ssh、suzhe 都没有 ？ suzhe是因为不是外部的，只有外部变量的时候才会生成，比如我们改动下代码，打印下这 3 个变量。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a96d6398cb6941c0a953e50b14271111~tplv-k3u1fbpfcp-watermark.awebp)

再次查看 [[Scopes]] （打包带走的闭包环境）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a1d1964e1cb40ada4b3eeeffbebd5af~tplv-k3u1fbpfcp-watermark.awebp)

这时候就有俩闭包了，为什么呢？ suzhe 哪去了？

首先，我们需要打包的只是环境内没有的，也就是闭包只保存外部引用。然后是在创建函数的时候保存到函数属性上的，创建的函数返回的时候会打包给函数，但是 JS 引擎怎么知道它要用到哪些外部引用呢，需要做 AST 扫描，很多 JS 引擎会做 Lazy Parsing，这时候去 parse 函数，正好也能知道它用到了哪些外部引用，然后把这些外部用打包成 Closure 闭包，加到 [[scopes]] 中。

所以，**闭包是返回函数的时候扫描函数内的标识符引用，把用到的本作用域的变量打成 Closure 包，放到 [[Scopes]] 里。**

所以上面的函数会在 func3 返回的时候扫描函数内的标识符，把 guang、ssh 扫描出来了，就顺着作用域链条查找这俩变量，过滤出来打包成两个 Closure（因为属于两个作用域，所以生成两个 Closure），再加上最外层 Global，设置给函数 func3 的 [[scopes]] 属性，让它打包带走。

调用 func3 的时候，JS 引擎 会取出 [[Scopes]] 中的打包的 Closure + Global 链，设置成新的作用域链， 这就是函数用到的所有外部环境了，有了外部环境，自然就可以运行了。

这里思考一个问题： 调试代码的时候为什么遇到过某个变量明明在作用域内能访问到，但就是没有相关信息呢？

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2679bca268984d4893bb01f24257ce39~tplv-k3u1fbpfcp-watermark.awebp)

这个 traverse，明明能访问到的，为啥就是不显示信息呢？是 debugger 做的太烂了么？

不是的，如果你不知道原因，那是因为你还不理解闭包，因为这个 FunctionDeclaration 的函数是一个回调函数，明显是在另一个函数内调用的，就需要在创建的时候打包带走这个环境内的东西，根据只打包必要的环境的原则（不浪费内存），traverse 没有被引用（refer），自然就不打包了。并不是 debugger 有 bug 了。

所以我们只要访问一下，就能在调试的时候访问到了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/219a40756ad2432d969c077b18ab656d~tplv-k3u1fbpfcp-watermark.awebp)

是不是突然知道为啥调试的时候不能看一些变量的信息了，能解释清楚这个现象，就算理解闭包了。

#### eval

再来思考一个问题： 闭包需要扫描函数内的标识符，做静态分析，那 eval 怎么办，他有可能内容是从网络记载的，从磁盘读取的等等，内容是动态的。用静态去分析动态是不可能没 bug 的。怎么办？

没错，eval 确实没法分析外部引用，也就没法打包闭包，这种就特殊处理一下，打包整个作用域就好了。

验证一下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f15d3641cc7845669300c78a7e88eb11~tplv-k3u1fbpfcp-watermark.awebp)

这个就像上面所说的，会把外部引用的打包成闭包

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/143b186936554141aa84525a708c7eea~tplv-k3u1fbpfcp-watermark.awebp)

这个就是 eval 的实现，因为没法静态分析动态内容所以全部打包成闭包了，本来闭包就是为了不保存全部的作用域链的内容，结果 eval 导致全部保存了，所以尽量不要用 eval。会导致闭包保存内容过多。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1d4d856b2484661beac889915761bcc~tplv-k3u1fbpfcp-watermark.awebp)

但是 JS 引擎只处理了直接调用，也就是说直接调用 eval 才会打包整个作用域，如果不直接调用 eval，就没法分析引用，也就没法形成闭包了。

这种特殊情况有的时候还能用来完成一些黑魔法，比如利用不直接调用 eval 不会生成闭包，会在全局上下文执行的特性。

#### 给闭包下个定义

用我们刚刚的试验来给闭包下个定义：

**闭包是在函数创建的时候，让函数打包带走的根据函数内的外部引用来过滤作用域链剩下的链。它是在函数创建的时候生成的作用域链的子集，是打包的外部环境。evel 因为没法分析内容，所以直接调用会把整个作用域打包（所以尽量不要用 eval，容易在闭包保存过多的无用变量），而不直接调用则没有闭包。**

过滤规则：

1. 全局作用域不会被过滤掉，一定包含。所以在何处调用函数都能访问到。
2. 其余作用域会根据是否内部有变量被当前函数所引用而过滤掉一些。不是每个返回的子函数都会生成闭包。
3. 被引用的作用域也会过滤掉没有被引用的 binding （变量声明）。只把用到的变量打个包。

#### 闭包的缺点

JavaScript 是静态作用域的设计，闭包是为了解决子函数晚于父函数销毁的问题，我们会在父函数销毁时，把子函数引用到的变量打成 Closure 包放到函数的 [[Scopes]] 上，让它计算父函数销毁了也随时随地能访问外部环境。

这样设计确实解决了问题，但是有没有什么缺点呢？

其实问题就在于这个 [[Scopes]] 属性上

我们知道 JavaScript 引擎会把内存分为函数调用栈、全局作用域和堆，其中堆用于放一些动态的对象，调用栈每一个栈帧放一个函数的执行上下文，里面有一个 local 变量环境用于放内部声明的一些变量，如果是对象，会在堆上分配空间，然后把引用保存在栈帧的 local 环境中。全局作用域也是一样，只不过一般用于放静态的一些东西，有时候也叫静态域。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41c5c82d485b469ca92a36aec5b73ac0~tplv-k3u1fbpfcp-watermark.awebp)

每个栈帧的执行上下文包含函数执行需要访问的所有环境，包括 local 环境、作用域链、this等。

那么如果子函数返回了会发生什么呢？

首先父函数的栈帧会销毁，子函数这个时候其实还没有被调用，所以还是一个堆中的对象，没有对应的栈帧，这时候父函数把作用域链过滤出需要用到的，形成闭包链，设置到子函数的 [[Scopes]] 属性上。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/473fde71299f47fd81bc4d2e1cbd90bb~tplv-k3u1fbpfcp-watermark.awebp)

父函数销毁，栈帧对应的内存马上释放，用到的 ssh Obj 会被 gc 回收，而返回的函数会把作用域链过滤出用到的引用形成闭包链放在堆中。 这就导致了一个隐患： 如果一个很大的对象被函数引用，本来函数调用结束就能销毁，但是现在引用却被通过闭包保存到了堆里，而且还一直用不到，那这块堆内存就一直没法使用，严重到一定程度就算是内存泄漏了。所以闭包不要乱用，少打包一点东西到堆内存。

#### 总结

我们从静态作用域开始聊起，明确了什么是作用域，通过 babel 静态分析了一下作用域，了解了下静态和动态作用域，然后引入了子函数先于父函数销毁的问题，思考了下方案，然后引入了闭包的概念，分析下闭包生成的流程，保存的位置。我们还用闭包的特性分析了下为什么有时候调试的时候查看不了变量信息，之后分析了下 eval 为什么没法精确生成闭包，什么时候全部打包作用域、什么时候不生成闭包， eval 为什么会导致内存占用过多。之后分析了下带有闭包的函数在内存中的特点，解释了下为啥可能会内存泄漏。

闭包是在返回一个函数的时候，为了把环境保存下载，创建的一个快照，对作用域链做了tree shking，只留下必要的闭包链，保存在堆里，作为对象的 [[scopes]] 属性，让函数不管走到哪，随时随地可访问用到的外部环境。在执行这个函数的时候，会利用这个“快照”，恢复作用域链。

因为还没执行函数，所以要静态分析标识符引用。静态分析动态这件事情被无数个框架证明做不了，所以返回的函数有eval 只能全部打包或者不生成闭包。类似webpack 的动态import没法分析一样。

### setTimeout,setInterval,requestAnimationFrame的区别

#### 动画前置知识

在此简单介绍一下形成动画的原因和基本概念，方便后面阅读理解。

##### 1. 计算机屏幕刷新率与浏览器重绘次数

- 屏幕刷新率指`1s`内屏幕刷新的次数。
- 一般的电脑的屏幕刷新率为`1s 60次`(`1000ms / 60 ≈ 16.7ms` | `60FPS`)，也就是每`16.7ms`会刷新一下屏幕。当然此数值受到分辨率、显卡、屏幕尺寸等其他因素的影响。
- 由于一般的电脑的刷新频率是`60FPS`，所以大多数浏览器会限制其重绘次数，一般不会超过计算机的重绘次数，因为即使超过了其频率，用户的体验也不会得到提升。

##### 2. 动画是如何形成的？

动画是由于肉眼导致的视觉残留，通过连续播放的静态图像形成的动态幻觉。**当`1s`中连续播放24张图片时(`24FPS`)，即可形成流畅的动画，通常来说计算机的刷新频率是`60FPS`**。

##### 3.web实现动画的方式

- `css`：`animation`、`transition`
- `js`: `setTimeout`、`setInteval`
- `html`: `canvas`、`svg`
- `requestAnimationFrame`等...

本文将重点介绍`setTimeout`、`setInterval`、`requestAnimationFrame`这三种`API`。

#### 正文

##### setInterval

`setInterval`方法按照指定的周期（毫秒）来调用函数或执行一段代码段（`eval`）。。

> 敲重点：定时器指定的时间间隔，表示的是何时将回调函数添加到消息队列，而不是何时执行回调函数。 真正何时执行函数的时间是不能确定的，取决于该回调函数何时被主线程的事件循环取到，并执行。

##### 参数

- ```
  function/code
  ```

  - 【必需】要重复调用的函数/字符串。当为字符串时，会被编译为`js`代码执行。

- ```
  delay
  ```

  - 【必需】周期性调用`function/code`的时间间隔，以毫秒计数。
  - 注：`HTML5`规定，执行时间间隔最小为`10ms`当小于`10ms`时，默认为`10ms`。

- ```
  args1... argsN
  ```

  - 【非必需】传递给执行函数的参数

```js
// 每1000ms，控制台打印1
setInterval(function(){
    console.log(1);
}, 1000);
复制代码
```

##### setInterval缺点

###### 1.存在无用调用，浪费性能

会一直不停的执行函数，**即使将浏览器最小化，或者切换到另一个`tab`，定时器还依旧会继续在后台执行**。除非关闭网页才会停止调用。

###### 2.忽略错误代码，即使出错还会调用

`setInterval`中执行的代码如果出错，不会停止运行，而是继续调用。

###### 3.无法保证调用的时间间隔相同；某次回调可能会被跳过

> 敲重点：`setInterval`每次将回调函数推入异步队列前，会检查异步队列中是否有**该定时器的代码实例**，如果存在，则不会添加本次回调函数。

如果回调函数的执行需要花费很大时间执行，某些处于中间的调用会被忽略。

例：分析如下代码执行步骤

```text
...some event...
setInterval(T, 100);
// 代表每100ms将T函数推入异步队列中
复制代码
```

![img.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16c52af1605a49d8b845e5c2bfa5dc88~tplv-k3u1fbpfcp-watermark.awebp?)

1. 代码开始执行，先执行`some event`同步代码，`100ms`后将`T1`添加到异步队列的尾部；
2. 此时主线程依旧有`event`任务在执行，所以无法立即执行`T1`。只能待主线程任务结束后，执行`T1`；
3. 又过了`100ms`，`T1`在主线程执行，此时将`T2`添加到异步队列尾部，由于`T1`还在执行，所以`T2`只能等待执行；
4. **又过了`100ms`，此时本应该将`T3`添加到异步队列尾部，但是由于异步队列中存在`T2`,所以`T3`不会被添加到队列中（被跳过）。**
5. `T1`执行完毕后，立即从异步队列中取出`T2`执行（`T1`连着`T2`执行，并没有达到定时器的效果）

由以上的例子我们可以看出`setInterval`的两个缺点：

1. 某些极端情况下，无法保证按照时间间隔运行回调函数；
2. 当回调函数执行时间过长时，某次的回调可能被直接忽略。

##### 使用setTimeout替代setInterval

```js
/**
 * 使用setTimeout模拟setInterval计时器
 * @param fn
 * @param delay
 * @param args
 * @returns {{clear: (function(): void)}}
 * @private
 */
function _interval(fn, delay, ...args){
    let timerId;

    function callback(){
        fn(...args);
        timerId = setTimeout(callback, delay)
    }

    timerId = setTimeout(callback, delay);
    // 清除计时器方法
    return {
        clear:() => clearTimeout(timerId)
    };
}

// 开始计时器
const timer  = _interval(function(){
    console.log(1);
}, 1000);

// 清除该计时器
setTimeout(timer.clear, 5 * 1000);
复制代码
```

#### setTimeout

`setTimeout`设置一个定时器，该定时器在指定时间到期**后**执行一个函数或者一段代码。

> 敲重点：定时器指在延迟时间后会将回调函数添加到异步队列中，真正的执行时机需要等到主线程为空后取出再执行。 所以 真正的执行的时间 >= 延迟时间

#### 参数

- ```
  function/code
  ```

  - 【必需】要重复调用的函数/字符串。当为字符串时，会被编译为`js`代码执行。

- ```
  delay
  ```

  - 【必需】周期性调用`function/code`的时间间隔，以毫秒计数。
  - 注：`HTML5`规定，执行时间间隔最小为`4ms`当小于`4ms`时，默认为`4ms`。

- ```
  args1... argsN
  ```

  - 【非必需】传递给执行函数的参数

```js
// 1000ms后将函数添加到异步队列中，打印1
setTimeout(function(){
    console.log(1);
}, 1000);
复制代码
```

#### setTimeout缺点

#### 1.执行时间不能确定

#### 2.动画在某些机型上可能存在卡顿、丢帧、抖动的现象。

如开篇所述，动画的本质是：肉眼导致的视觉残留，通过连续播放的静态图像形成的动态幻觉。我们有时会感到卡顿是因为帧率不够。

虽然可以通过设定固定间隔`setTimeout(fn, 16.7)`的方式，设置时间间隔与大部分计算机刷新频率同步。但是依旧会受到以下因素的影响：

- 由于`JS引擎`线程是异步的，`setTimeout`本身是异步任务，需要等待主线程的任务执行完毕后才可以执行。所以其回调真实的`开始执行时间 >= 16.7ms`
- 不同的机器，其刷新频率是不同的，`setTimeout`只能写死一个时间，不够准确

以上的情况都会使`setTimeout`执行的时间间隔和浏览器刷新频率不同步，导致动画卡顿、丢帧、抖动的现象。

那么有没有动画的终极神器呢？下面来介绍`requestAnimationFrame`API。

#### requestAnimationFrame(rFA)

> 虽然我们可以使用`CSS3`的`animation、transition`属性来实现动画，但是如果遇到"请将滚动条**匀速**的返回到顶部"的需求，`CSS3`就鞭长莫及了。因为`CSS3`无法控制`scrollTop`属性。这时就要用到`requestAnimationFrame`这个神器了。

`window.requestAnimationFrame() `告诉浏览器:**你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。**

#### 参数

- ```
  callback
  ```

  - 【必需】下一次重绘之前要执行的函数，该函数默认被传入一个`performance`参数，用来测试网页性能。

#### 使用示例

如下代码只会再浏览器第一次刷新时调用，只会执行一次：

```js
window.requestAnimationFrame(function () {
    console.log(this);  // 只执行一次 打印window
})
```

> 如果想形成连续的动画，需要在`rAF`中回调函数中，再次调用自己

如果想与浏览器刷新频率同步调用，需这样写：

```js
// 不断打印出 window
function animateFn (){
    console.log(this);
    window.requestAnimationFrame(animateFn);
}
window.requestAnimationFrame(animateFn);
```

### 优点

#### 1.执行时机由浏览器决定，与浏览器刷新频率保持同步，不会有丢帧、卡顿的情况

与`setTImeout、setInterval`不同，**`requestAnimationFrame`回调函数的调用时机不是由开发者定义，是由浏览器决定的。**

- 如果该机器的刷新的频率为`60FPS`，`requestAnimationFrame`的回调函数就会`1 / 60  ≈ 16.7ms`左右执行一次；
- 如果机器的刷新频率为`80FPS`，`requestAnimationFrame`的回调函数就会`1 / 80  ≈ 12.5ms`左右执行一次；

这样的机制，可以与浏览器刷新频率同步，不会导致丢帧、卡顿的情况。

#### 2.节省CPU资源

与`setTimeout、setInterval`不同，**当网页被最小化，或是当前`tab`处于"未激活"的状态时，该页面的刷新任务会被系统暂停，`requestAnimationFrame`也会停止渲染，节省`CPU`资源。** 当`tab`重新被"激活"后，`requestAnimationFrame`会继续渲染。

#### 3.高频函数节流

对于`resize、scroll`高频触发事件来说，使用 **`requestAnimationFrame`可以保证在每个绘制区间内，函数只被执行一次，节省函数执行的开销。** 如果使用`setTimeout、setInterval`可能会在浏览器刷新间隔中有无用的回调函数调用，浪费资源。

#### cancelAnimation(id) 取消rFA

与`setTimeout、setInterval`相同，`requestAnimationFrame`执行完后会返回一个代表此次执行的唯一`id`，可以用此`id`取消`rFA`。

```js
const id = requestAnimationFrame(function(){});
cancelAnimationFrame(id);
复制代码
```

#### 写个🌰

使用`rFA`，实现点击`div`开始向右运动，点击停止，再次点击继续运动：

```html
<!doctype html>
<html lang="en">
<head>
    <title>Document</title>
    <style>
        .box{
            width: 100px;
            height: 100px;
            background: paleturquoise;
            position: absolute;
            left: 0;
        }
    </style>
</head>
<body>
    <div class="box"/>
    <script src="./index.js"></script>
</body>
</html>
复制代码
(function (window, document) {
    const oBox = document.getElementsByClassName('box')[0];
    let animationId;

    oBox.addEventListener('click', function () {
        animationId ? cancelAnimation() : startAnimation(oBox);
    });

    /**
     * 开始运动
     * @param element dom元素
     */
    function startAnimation(element) {
        element.style.left = parseInt(window.getComputedStyle(element).getPropertyValue("left")) + 1 + 'px';
        animationId = requestAnimationFrame(() => startAnimation(element))
    }

    /**
     * 取消运动
     */
    function cancelAnimation() {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
})(window, document);
复制代码
```

效果： ![Dec-22-2021 15-33-37.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d6c31f69ff141deaae6ddd8d09b28c5~tplv-k3u1fbpfcp-watermark.awebp?)

### JavaScript内置对象

#### 一、Array 数组对象

##### 1、push() 在数组尾部添加一个或者多个元素，并且返回数组的新长度

```
      arr=[1,2,3]
      arr.push("a","b"); //插入字符串
      arr.push(6); //在数组的尾部插入一个新元素
      arr.push(6,7,8); //在数组的尾部插入多个新元素
      a=arr.push(6,7,8); //通过添加到尾部元素后返回数组的新长度
      console.log(arr);
      console.log(a);
复制代码
```

**会返回数组的新长度** ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd4933290b~tplv-t2oaga2asx-watermark.awebp)

##### 2、unshift() 在数组头部添加一个或者多个元素，并且返回数组的新长度

```
      arr=[1,2,3]
      arr.unshift(0); //在数组的头部插入一个新元素
      arr.unshift(-3,-2,-1,0); //在数组的头部插入多个新元素
      var a=arr.unshift(-3,-2,-1,0); //返回数组的新长度
      console.log(arr);
      console.log(a);
复制代码
```

**会返回数组的新长度** ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd4b030363~tplv-t2oaga2asx-watermark.awebp)

##### 3、pop() 删除数组尾部的最后一个元素，并且将这个被删除的元素返回

```
      arr=[1,2,3,4,5,6]
      arr.pop(); //pop中没有参数,删除数组的最尾部一个元素
      var a=arr.pop(); //pop删除数组 的最尾部一个元素，并且将被删除的元素返回
      console.log(arr);
      console.log(a);
复制代码
```

**将这个被删除的元素返回** ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd4c073111~tplv-t2oaga2asx-watermark.awebp)

##### 4、shift() 删除数组的第一个元素，并且返回被删除的元素

```
      arr=[1,2,3,4,5,6]
      arr.shift(); //将数组的第一个元素删除
      var a=arr.shift(); //将数组的第一个元素删除，并且返回这个被删除的元素
      console.log(arr);
      console.log(a);
复制代码
```

**返回被删除的元素** ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd4dc63a1b~tplv-t2oaga2asx-watermark.awebp)

**`不管删除还是添加都会改变数组的长度`**

##### 5、concat() 数组的合并，合并后会返回一个新数组，原来的两个数组不会变化

```
      var arr=[1,2,3,4];
      var arr1=[5,6,7,8];
      var arr2=arr.concat(arr1);  // 数组的合并，合并后会返回一个新数组，原来的两个数组不会变化
      console.log(arr2);
      var arr3=arr.concat(0,-1,-2); // 数组除了可以合并数组，也可以合并元素，将多个元素与原数组合并，返回新数组
      console.log(arr3)
      var arr4=arr.concat(0,arr1,["A","B"]); // concat既可以合并元素，也可以合并数组
      console.log(arr4)
      var arr5=arr.concat(); // 如果直接使用concat，就可以完成数组的复制功能
      console.log(arr5)
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd531fbeaa~tplv-t2oaga2asx-watermark.awebp)

##### 6、join() 将数组的每个元素以指定的字符连接形成新字符串返回

```
      var arr=[1,2,3,4,5]; // join就是将数组的每个元素以指定的字符连接形成新字符串返回
      var str=arr.join( ); // 将数组合并为字符串返回，默认使用逗号,连接
      console.log(str);
      var str=arr.join("|"); // 在这里join的参数是字符串的连接符v
      console.log(str);
      var str=arr.join(""); // ""作为连接符，会将数组元素首尾相连成为字符串
      console.log(str);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd74ce4042~tplv-t2oaga2asx-watermark.awebp)

##### 7、splice() 这个方法可以从指定的位置删除给定数量的元素，并且在这个位置插入需要的元素，并且返回被删除的元素组成的新数组

**splice(从什么位置开始,删除多少个元素,要插入的元素);**

###### 1）splice 刪除全部数组返回值

```
      var arr1=arr.splice(); // 没有任何参数时,返回一个空数组
      console.log(arr1);
      第一个参数是0，表示从第0位开始，第二个参数删除多少个没有填，意味着删除到尾部
      var arr1=arr.splice(0); // 将所有数据转移到新数组
      console.log(arr1);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd782b117c~tplv-t2oaga2asx-watermark.awebp)

###### 2）splice 可以从前向后，也可以从后向前

```
      var arr1=arr.splice(0,3); // 从第0位开始删除3个元素，返回到新数组arr1
      var arr1=arr.splice(-2); // 从第几位开始可以是负数，从后向前数（倒数）,因为没有给要删除的数量，因此删除到尾部
      var arr1=arr.splice(0,1,-1); // 从数组的第0位开始，删除1个元素，并且在这个位置插入一个元素 -1,替换
      var arr1=arr.splice(-1,1,0); // 数组的最后一位替换位0
      var arr1=arr.splice(2,2,10,11); // 将数组中第二位开始两位元素替换为10，11
复制代码
```

###### 3）splice 可以插入一个，可以插入多个元素

```
      var arr=[1,2,3,4,5];
      arr.splice(2,0,-1); // 在数组的第二位插入一个元素 -1
      console.log(arr);
      arr.splice(2,0,-1,-2,-3,-4); // 在数组的第二位插入多个元素
      console.log(arr);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd79a70ef4~tplv-t2oaga2asx-watermark.awebp)

##### 8、slice(start,end) 按指定位置截取复制数组的内容，返回新数组，不会改变原数组

**从下标 start 开始，截取到 end，包括 start 但不包括 end。第二个参数不写，默认截取到尾部，只能从前向后截取**

```
      var arr1=arr.slice(1,4); // 从第1位开始截取到第4位之前
      var arr1=arr.slice();   // 复制数组arr
      var arr1=arr.slice(0);  // 复制数组
      var arr1=arr.slice(3);  //从第三位截取到尾部复制
      var arr1=arr.slice(-2); //从倒数第二位开始截取到尾部
      var arr1=arr.slice(-3,-1); //从倒数第三位到倒数第一位
复制代码
```

##### 9、indexOf(要查询得元素,从什么位置开始查询) 位置就是下标

**在数组中查找元素，找到返回元素下标，找不到返回-1，查询到第一个后，就返回下标不再继续查询**

###### 1）不能查询对象

```
      var arr=[{a:1},{a:2},{a:3},{a:4}];
      var  index=arr.indexOf({a:1}); // 这是错误得，查找不到，因为查找得是新对象,地址不同
      console.log(index);
复制代码
```

**查询不到返回-1** ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd7df8cc99~tplv-t2oaga2asx-watermark.awebp)

###### 2）查询所有相同的元素

```
      var arr=[1,3,1,2,3,5,2,3,4,6];
      var index=arr.indexOf(3); // 这样只能查询到第一个3 （下标为1）
      console.log(index);
      var index=arr.indexOf(3,2); // 这样只能查询到第二个3 （下标为4）
      console.log(index);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd8072ab8b~tplv-t2oaga2asx-watermark.awebp)

**查询全部相同的元素利用循环查询**

```
      var arr=[1,3,1,2,3,5,2,3,4,6];
      var index=0; // 使用循环，查询到数组中所有为3的元素，并打印下标
      while(true){
           index=arr.indexOf(3,index);
           console.log(index);
           if(index===-1) break; // 查询到最后，查不到时返回-1  如果为-1 跳出循环，不再查询
           index++;
      }
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd892402bd~tplv-t2oaga2asx-watermark.awebp)

##### 10、Array.from(类似于数组的列表) 转为数组

###### 1）根据标签名获取到标签列表 （获取到的是列表，不是数组，不能直接使用数组的方法

```
      var divs=document.getElementsByTagName("div"); // 获取html元素标签名是div的元素

      divs.pop()；// 错误，不是数组不能直接使用数组的方法

      var arr=Array.from(divs);  // ES6 的写法，把divs这个列表，转为数组
      // ES5写法 =>  var arr=Array.prototype.slice.call(divs);
复制代码
```

###### 2）给所有 div 元素添加点击事件

```
      var divs=document.getElementsByTagName("div");
      var arr=Array.from(divs); // 把获取到的所有div转成数组

      for(var i=0;i<arr.length;i++){ // 遍历数组给每个div添加点击事件
          arr[i].onclick=clickHandler;
      }
      function clickHandler(){
          console.log(this);
          var index=arr.indexOf(this);
          console.log(index);  // 这样就可以判断点击得是列表中得第几个元素
      }
复制代码
```

##### 11、lastIndexOf(查找得元素，从什么位置开始查找) 从后向前查找

```
      var arr=[1,3,1,2,3,5,2,3,4,6];
      var index=arr.lastIndexOf(3);
      console.log(index); // 打印下标 7
复制代码
```

##### 12、遍历数组（forEach 和 map）

###### 1）forEach

```
arr.forEach(function(数组中的元素，每个元素对应的下标，数组自身){ })
      var arr=[1,2,3,5,6,7,8,9];
      arr.forEach(function(a,b,c){
         console.log(a,b,c);
      })
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdd9ef7e3b0~tplv-t2oaga2asx-watermark.awebp) **forEach没有返回值，使用return无效**

###### 2）map会返回一个与原数组长度相等的新数组

```
arr.map(function(item,index,arr){ })
      var arr=[3,5,7,9,1,2,4];
      var arr2=arr.map(function(item,index,arr){
            // console.log(item,index,arr);
            // return "a";
            return item+10;  // 在map中使用return 就是在对应的下标中添加对应的数据
      });
      console.log(arr2);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdda8350ac1~tplv-t2oaga2asx-watermark.awebp)

```
      // 遍历数组arr，将大于4的元素生成一个新的数组（新数组中会有undefined）
      var arr=[1,3,5,7,2,4,6,8];
      var arr1=arr.map(function(item){
            if(item>4){
                return item;
            }
      });
      console.log(arr1); 
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdda82731d3~tplv-t2oaga2asx-watermark.awebp) `map有返回值，与原数组等长的新数组，元素内容由return确定，不写return返回undefined`

##### 13、arr.sort() 排序，仅能10以内数字

**缺点：按字符排序** `sort(function(后一项,前一项){}) 仅适用于数值`

###### 1）数值排序

```
      var arr=[1,3,5,7,2,4,6,8];
      arr.sort(function(a,b){      
           return  a-b;  // 从小到大   
           // return  b-a;  // 从大到小
        })    
        console.log(arr);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fddaf5fb4e4~tplv-t2oaga2asx-watermark.awebp)

###### 2）字符排序，先把字符转换成Unicode编码

```
      var arr=["n","c","g","h","a","j","y","k"];
      arr.sort(function(a,b){   // 将字符排序
           console.log(a.charCodeAt(0),b.charCodeAt(0)); // str.charCodeAt(0) => 将str字符串的第0项转换为Unicode编码
           return a.charCodeAt(0)-b.charCodeAt(0);  // a-z
           // return b.charCodeAt(0)-a.charCodeAt(0);  // z-a
        })
        console.log(arr);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdda83bd879~tplv-t2oaga2asx-watermark.awebp)

##### 14、some()

**判断数组中是否存在满足条件的元素，如果有就返回true，如果没有就返回false
 遍历数组，如果有一个满足条件的元素，都会直接返回true，不继续向后遍历**

```
        var arr=[1,4,6,2,7,9,0];
        var bool=arr.some(function(item,index,arr){  // 遍历数组，是否存在大于5的元素
           return item>5;
        });
        console.log(bool);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fddaaf79597~tplv-t2oaga2asx-watermark.awebp)

##### 15、every()

`var bool=arr.every(function(item,index,arr){ });`
 **判断数组中是否每一个都满足条件，如果有一个不满足条件，直接跳出，所有都满足时返回为ture**

```
        var arr=[1,4,6,2,7,9,0];
        var bool=arr.every(function(item,index,arr){   // 判断数组中 是否所有的元素都大于2
            return item>2;
        });
        console.log(bool); 
复制代码
```

##### 16、filter()

**要求是将数组中大于5的返回到一个新数组
 首先想到map，map只能实现原数组和新数组长度相同**

```
        var arr1=arr.filter(function(item,index,arr){
           return item>5;
        });
        console.log(arr1);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fddd01e68c5~tplv-t2oaga2asx-watermark.awebp)

##### 17、reduce()

**从数组的第1位开始遍历，第0位没有遍历，下标从1开始
 刚开始value是数组的第0项，后面每次value都是undefined
 如果在函数中使用return 就会将返回值在下次数组的遍历中赋予value**

```
        var arr=[10,3,4,7,3,5,8,9];
        arr.reduce(function(value,item,index,arr){
            // 循环的次数是数组的个数-1
            // value就是上次遍历return的值，第0次遍历时（最开始时是数组的第0项）
            console.log(value);
            return value+1
        }) 
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fddde414758~tplv-t2oaga2asx-watermark.awebp)

**累积相加数组元素求和
 reduce返回的是一个值，就是遍历到最后一次return出来的值**

```
        var arr=[10,3,4,7,3,5,8,9];
        var sum=arr.reduce(function(value,item){
            return value+item;
        });
        console.log(sum);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fddd58fe37f~tplv-t2oaga2asx-watermark.awebp)

**希望求累积相加数组元素求和，在基数100的前提下，100就是初始值**

```
        var arr=[10,3,4,7,3,5,8,9];
        var sum=arr.reduce(function(value,item){
            // 函数后面的参数就是累加的初始值
            console.log(value);
            return value+item;
        },100); 
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fdde6505db4~tplv-t2oaga2asx-watermark.awebp)

##### 18、Array.isArray()

用来判断是不是数组

```
        var arr=[1,2,3,4];
        var obj={a:1};
        console.log(typeof arr);
        // 判断元素是否是数组，如果是数组返回true否则返回false，ES6
        console.log(Array.isArray(arr));
        console.log(Array.isArray(obj));
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/14/172b2fddf4a0ad50~tplv-t2oaga2asx-watermark.awebp)

#### 二、Math方法

##### 1、π和根号2

```
      Math.PI; // Π
      Math.SQRT2; // 根号2  常量，只能使用不能修改
复制代码
```

##### 2、取整

###### 1）向下取整 Math.floor()

```
      a=Math.floor(25.6);
      console.log(a);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd8ffc171d5~tplv-t2oaga2asx-watermark.awebp)

###### 2）向上取整 Math.ceil()

```
      b=Math.ceil(25.6);
      console.log(b);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd900e7d59a~tplv-t2oaga2asx-watermark.awebp)

###### 3、四舍五入 Math.round()

**方法存在误差**

```
      c=Math.round(25.5);
      console.log(c);
复制代码
```

**负数的四舍五入，一般都是转换为正数处理**

###### 4、最大值和最小值

1）最小值Math.min()

```
      c=Math.min(4,7,8,3,1,9,6,0,3,2)
      console.log(c)
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd90363a5f8~tplv-t2oaga2asx-watermark.awebp)

2）最大值 Math.max()

```
      c=Math.max(4,7,8,3,1,9,6,0,3,2)
      console.log(c)
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd906f801cf~tplv-t2oaga2asx-watermark.awebp)

###### 5、随机数 Math.random

```
      c=Math.random()*10+1; // 随机1-10之间的任意数
      console.log(c)
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd90d8d6ebf~tplv-t2oaga2asx-watermark.awebp)

**随机的数不是一个整数一般做取整处理**

```
      c=Math.random()*10+1;
      console.log(Math.floor(c)); // 向下取整
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd91380f356~tplv-t2oaga2asx-watermark.awebp)

###### 6、其他的方法

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd97177122e~tplv-t2oaga2asx-watermark.awebp)

#### 三、String 字符串方法

##### 1、charAt()

**获取下标位置的字符，和str[1]; 一样的**

```
      var str="abcdef";
      console.log(str.charAt(3));
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd96c21b010~tplv-t2oaga2asx-watermark.awebp)

##### 2、charCodeAt()

**将下标位置的字符转为Unicode编码**

```
      var str="abcdef";
      console.log(str.charCodeAt(2));
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd976469355~tplv-t2oaga2asx-watermark.awebp)

##### 3、String.fromCharCode()

**将Unicode编码转为字符串**

```
      n=String.fromCharCode(65); // 将Unicode编码转为字符串
      console.log(n);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd97a9fab81~tplv-t2oaga2asx-watermark.awebp)

##### 4、str.concat()

**连接字符串，效果等同于拼接符+**

```
        var str="abc";
        var str1="def";
        var str2=str.concat(str1);   // var str2=str+str1; 这个等同于concat
        console.log(str2); 
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd986b1707e~tplv-t2oaga2asx-watermark.awebp)

##### 5、 indexOf() 、lastIndexOf()

**和数组中indexOf相同查找字符所在下标**

```
      var arr=[
        {id:1001,name:"计算机",price:4999},
        {id:1002,name:"电机",price:1999},
        {id:1003,name:"记事本",price:9},
        {id:1004,name:"课本",price:99},
        {id:1005,name:"计算器",price:149},
      ]; 
 
        // 模糊查找
       var arr1=arr.filter(function(item){
             return item.name.indexOf("本")>-1 
             });
        console.log(arr1); 
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd994a5de61~tplv-t2oaga2asx-watermark.awebp)

##### 6、replace()

**替换，类似于数组中的splice();
 replace不修改原字符的内容，会返回一个被修改后的新字符串
 如果出现两个相同的元素，那么只修改第一次被查找到的元素**

```
      var str="abcdecf";
      var str1=str.replace("c","z");
      str.replace()
      console.log(str,str1);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd99fe4515e~tplv-t2oaga2asx-watermark.awebp)

##### 7、slice(start,end)

**slice (从下标几开始，到下标几之前结束) 截取复制字符串**
 **允许有负值，负值表示从后向前**

```
      var str="abcdecf";
      var s=str.slice(1,2);
      console.log(s);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9a06b5c25~tplv-t2oaga2asx-watermark.awebp)

##### 8、substring()

```
      var str="abcdecf";
      var s=str.substring(2,4); // 和slice相似
      // substring不允许负数，所有的负值指0之前，因此负数都是0
      // 可以逆向截取赋值
      var s=str.substring(4,2);
      console.log(s);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9adad3f40~tplv-t2oaga2asx-watermark.awebp)

##### 9、substr (从下标几开始，截取长度);

```
      var str="abcdecf";
      var s=str.substr(-2,5); //从下标几开始，截取长度
      console.log(s);
复制代码
```

##### ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9a75e9dbf~tplv-t2oaga2asx-watermark.awebp)

##### 10、split(分隔符)   将字符串以分隔符进行分割转换为数组

```
      var str="a,b,c,d,e,f";
      var arr=str.split(",");
      console.log(arr);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9b31a0279~tplv-t2oaga2asx-watermark.awebp)

##### 11、reverse()；数组元素倒序或者反转，这是一个数组方法

```
      var str="abcdefg";
      var str1=str.split("").reverse().join("");   //  连缀
      console.log(str1)
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9bc463788~tplv-t2oaga2asx-watermark.awebp)

##### 12、字符串转换大小写

###### 1）str.toLowerCase转为小写

```
      console.log("ABC".toLowerCase()); // 将字符串转换成小写
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9c3bb0d0b~tplv-t2oaga2asx-watermark.awebp)

###### 2）str.toUpperCase转为大写

```
      console.log("abc".toUpperCase()); // 将字符串转换成大写
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9d31411af~tplv-t2oaga2asx-watermark.awebp)

#### 三、日期对象

##### 1、创建日期对象

```
      var date=new Date(); // 创建日期对象
复制代码
```

##### 2、获取日期

```
      var date=new Date(); 
      date.getFullYear(); // 获取年份
      date.getYear();   // 获取的年份是从1900年开始计算的，有问题
      date.getMonth()+1; // 获取月份 从0开始
      date.getDate();  // 获取日期
      date.getDay();   // 获取星期  从0开始  0就是星期日 1是星期1
      date.getHours();   // 获取小时
      date.getMinutes(); // 获取分钟
      date.getSeconds(); // 获取秒
      date.getMilliseconds()；// 获取毫秒
      console.log(date);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9d82e4ccc~tplv-t2oaga2asx-watermark.awebp)

##### 2、以上日期均可设置

```
      var date=new Date(); 
      date.setFullYear(2021);
      date.setMonth(12); // 1月，进位了年份+1 是从0开始的;
      date.setDate(40); // 设置进位了
      date.setHours(date.getHours() + 2); // 设置为现在时间的2小时后
      date.getUTCFullYear(); // 凡是带有UTC都是格林尼治时间
      date.toString(); // 直接转换为字符串
      date.toLocaleString(); // 转换为本地（windows上）设置格式时间字符串
      date.toUTCString(); // 转换为格林尼治时间字符串
      console.log(date);
复制代码
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/21/172d5bd9dae64a1f~tplv-t2oaga2asx-watermark.awebp)

##### 3、时间戳

```
      date.getTime(); // 毫秒数，是计算从1970年1月1日 00：00：00 到现在的毫秒数 
复制代码
```

**时间会一直流逝，这个数据将会一直变大，每毫秒获取值都不同，因此这个数字永远不重复
 浏览器认为每次请求的地址如果相同时，会先查看浏览器缓存是否存在，如果有就用本地缓存
 可以通过时间戳使每次访问的地址都不同，避免浏览器使用本地缓存**

### 如何实现一个 setTimeout

```
function mysetTimeout(fn, time){
    let now = Date.now();
    let flag = true;
    while(flag){
        if(Date.now() - now >= time){
            flag = false;
            fn();
        }
    }
}
```

```
function mysetInterval(fn, time){
    let timeId = null;
    let isClear = false;
    function interval(){
        if(isClear){
            isClear = false;
            clearTimeout(timeId);
        }else{
            fn();
            timeId = setTimeout(interval, time);
        }
    }
    timeId = setTimeout(interval, time);
    return () => {isClear = true};
}
```

### 一个异步任务调度器，最多同时执行两个异步任务

```
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
```

### js异步处理方案

##### 前言

我们知道Javascript语言的执行环境是"单线程"。也就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务。

这种模式虽然实现起来比较简单，执行环境相对单纯，但是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段Javascript代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

为了解决这个问题，Javascript语言将任务的执行模式分成两种：同步和异步。本文主要介绍异步编程几种办法，并通过比较，得到最佳异步编程的解决方案！

##### 一、同步与异步

我们可以通俗理解为异步就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。排在异步任务后面的代码，不用等待异步任务结束会马上运行，也就是说，**异步任务不具有”堵塞“效应**。比如，有一个任务是读取文件进行处理，异步的执行过程就是下面这样



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/5/1681d3f072df2e14~tplv-t2oaga2asx-watermark.awebp)



这种不连续的执行，就叫做异步。相应地，连续的执行，就叫做同步



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/5/1681d42b6e8708fc~tplv-t2oaga2asx-watermark.awebp)



"异步模式"非常重要。在浏览器端，耗时很长的操作都应该异步执行，避免浏览器失去响应，最好的例子就是Ajax操作。在服务器端，"异步模式"甚至是唯一的模式，因为执行环境是单线程的，如果允许同步执行所有http请求，服务器性能会急剧下降，很快就会失去响应。接下来介绍下异步编程六种方法。

##### 二、回调函数（Callback）

回调函数是异步操作最基本的方法。以下代码就是一个回调函数的例子：

```
ajax(url, () => {
    // 处理逻辑
})
复制代码
```

但是回调函数有一个致命的弱点，就是容易写出**回调地狱（Callback hell）**。假设多个请求存在依赖性，你可能就会写出如下代码：

```
ajax(url, () => {
    // 处理逻辑
    ajax(url1, () => {
        // 处理逻辑
        ajax(url2, () => {
            // 处理逻辑
        })
    })
})
复制代码
```

回调函数的优点是简单、容易理解和实现，缺点是不利于代码的阅读和维护，各个部分之间高度耦合，使得程序结构混乱、流程难以追踪（尤其是多个回调函数嵌套的情况），而且每个任务只能指定一个回调函数。此外它不能使用 try catch 捕获错误，不能直接 return。

##### 三、事件监听

这种方式下，**异步任务的执行不取决于代码的顺序，而取决于某个事件是否发生**。

下面是两个函数f1和f2，编程的意图是f2必须等到f1执行完成，才能执行。首先，为f1绑定一个事件（这里采用的jQuery的写法）

```
f1.on('done', f2);
复制代码
```

上面这行代码的意思是，当f1发生done事件，就执行f2。然后，对f1进行改写：

```
function f1() {
  setTimeout(function () {
    // ...
    f1.trigger('done');
  }, 1000);
}
复制代码
```

上面代码中，f1.trigger('done')表示，执行完成后，立即触发done事件，从而开始执行f2。

这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以"去耦合"，有利于实现模块化。缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。阅读代码的时候，很难看出主流程。

##### 四、发布订阅

我们假定，存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做"发布/订阅模式"（publish-subscribe pattern），又称"观察者模式"（observer pattern）。

首先，f2向信号中心jQuery订阅done信号。

```
jQuery.subscribe('done', f2);
复制代码
```

然后，f1进行如下改写：

```
function f1() {
  setTimeout(function () {
    // ...
    jQuery.publish('done');
  }, 1000);
}
复制代码
```

上面代码中，jQuery.publish('done')的意思是，f1执行完成后，向信号中心jQuery发布done信号，从而引发f2的执行。 f2完成执行后，可以取消订阅（unsubscribe）

```
jQuery.unsubscribe('done', f2);
复制代码
```

这种方法的性质与“事件监听”类似，但是明显优于后者。因为可以通过查看“消息中心”，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

##### 五、Promise/A+

Promise本意是承诺，在程序中的意思就是承诺我过一段时间后会给你一个结果。 什么时候会用到过一段时间？答案是异步操作，异步是指可能比较长时间才有结果的才做，例如网络请求、读取本地文件等

###### 1.Promise的三种状态

- Pending----Promise对象实例创建时候的初始状态
- Fulfilled----可以理解为成功的状态
- Rejected----可以理解为失败的状态



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/6/16821592df2d2d58~tplv-t2oaga2asx-watermark.awebp)



**这个承诺一旦从等待状态变成为其他状态就永远不能更改状态了**，比如说一旦状态变为 resolved 后，就不能再次改变为Fulfilled

```
let p = new Promise((resolve, reject) => {
  reject('reject')
  resolve('success')//无效代码不会执行
})
p.then(
  value => {
    console.log(value)
  },
  reason => {
    console.log(reason)//reject
  }
)
```

当我们在构造 Promise 的时候，构造函数内部的代码是立即执行的

```
new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
})
console.log('end')
// new Promise => end
复制代码
```

###### 2.promise的链式调用

- 每次调用返回的都是一个新的Promise实例(这就是then可用链式调用的原因)
- 如果then中返回的是一个结果的话会把这个结果传递下一次then中的成功回调
- 如果then中出现异常,会走下一个then的失败回调
- 在 then中使用了return，那么 return 的值会被Promise.resolve() 包装(见例1，2)
- then中可以不传递参数，如果不传递会透到下一个then中(见例3)
- catch 会捕获到没有捕获的异常

接下来我们看几个例子：

```
  // 例1
  Promise.resolve(1)
  .then(res => {
    console.log(res)
    return 2 //包装成 Promise.resolve(2)
  })
  .catch(err => 3)
  .then(res => console.log(res))
复制代码
// 例2
Promise.resolve(1)
  .then(x => x + 1)
  .then(x => {
    throw new Error('My Error')
  })
  .catch(() => 1)
  .then(x => x + 1)
  .then(x => console.log(x)) //2
  .catch(console.error)
复制代码
// 例3
let fs = require('fs')
function read(url) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}
read('./name.txt')
  .then(function(data) {
    throw new Error() //then中出现异常,会走下一个then的失败回调
  }) //由于下一个then没有失败回调，就会继续往下找，如果都没有，就会被catch捕获到
  .then(function(data) {
    console.log('data')
  })
  .then()
  .then(null, function(err) {
    console.log('then', err)// then error
  })
  .catch(function(err) {
    console.log('error')
  })
复制代码
```

Promise不仅能够捕获错误，而且也很好地解决了回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```
ajax(url)
  .then(res => {
      console.log(res)
      return ajax(url1)
  }).then(res => {
      console.log(res)
      return ajax(url2)
  }).then(res => console.log(res))
复制代码
```

它也是存在一些缺点的，比如无法取消 Promise，错误需要通过回调函数捕获。

#### 六、生成器Generators/ yield

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同，Generator 最大的特点就是可以控制函数的执行。

- 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
- **Generator 函数除了状态机，还是一个遍历器对象生成函数**。
- **可暂停函数, yield可暂停，next方法可启动，每次返回的是yield后的表达式结果**。
- yield表达式本身没有返回值，或者说总是返回undefined。**next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值**。

我们先来看个例子：

```
function *foo(x) {
  let y = 2 * (yield (x + 1))
  let z = yield (y / 3)
  return (x + y + z)
}
let it = foo(5)
console.log(it.next())   // => {value: 6, done: false}
console.log(it.next(12)) // => {value: 8, done: false}
console.log(it.next(13)) // => {value: 42, done: true}
复制代码
```

可能结果跟你想象不一致，接下来我们逐行代码分析：

- 首先 Generator 函数调用和普通函数不同，它会返回一个迭代器
- 当执行第一次 next 时，传参会被忽略，并且函数暂停在 yield (x + 1) 处，所以返回 5 + 1 = 6
- 当执行第二次 next 时，传入的参数12就会被当作上一个yield表达式的返回值，如果你不传参，yield 永远返回 undefined。此时 let y = 2 * 12，所以第二个 yield 等于 2 * 12 / 3 = 8
- 当执行第三次 next 时，传入的参数13就会被当作上一个yield表达式的返回值，所以 z = 13, x = 5, y = 24，相加等于 42

我们再来看个例子：有三个本地文件，分别1.txt,2.txt和3.txt，内容都只有一句话，下一个请求依赖上一个请求的结果，想通过Generator函数依次调用三个文件

```
//1.txt文件
2.txt
复制代码
//2.txt文件
3.txt
复制代码
//3.txt文件
结束
复制代码
let fs = require('fs')
function read(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}
function* r() {
  let r1 = yield read('./1.txt')
  let r2 = yield read(r1)
  let r3 = yield read(r2)
  console.log(r1)
  console.log(r2)
  console.log(r3)
}
let it = r()
let { value, done } = it.next()
value.then(function(data) { // value是个promise
  console.log(data) //data=>2.txt
  let { value, done } = it.next(data)
  value.then(function(data) {
    console.log(data) //data=>3.txt
    let { value, done } = it.next(data)
    value.then(function(data) {
      console.log(data) //data=>结束
    })
  })
})
// 2.txt=>3.txt=>结束
复制代码
```

从上例中我们看出手动迭代`Generator` 函数很麻烦，实现逻辑有点绕，而实际开发一般会配合 `co` 库去使用。**`co`是一个为Node.js和浏览器打造的基于生成器的流程控制工具，借助于Promise，你可以使用更加优雅的方式编写非阻塞代码**。

安装`co`库只需：`npm install co`

上面例子只需两句话就可以轻松实现

```
function* r() {
  let r1 = yield read('./1.txt')
  let r2 = yield read(r1)
  let r3 = yield read(r2)
  console.log(r1)
  console.log(r2)
  console.log(r3)
}
let co = require('co')
co(r()).then(function(data) {
  console.log(data)
})
// 2.txt=>3.txt=>结束=>undefined
复制代码
```

我们可以通过 Generator 函数解决回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```
function *fetch() {
    yield ajax(url, () => {})
    yield ajax(url1, () => {})
    yield ajax(url2, () => {})
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()
复制代码
```

#### 七、async/await

##### 1.Async/Await简介

使用async/await，你可以轻松地达成之前使用生成器和co函数所做到的工作,它有如下特点：

- async/await是基于Promise实现的，它不能用于普通的回调函数。
- async/await与Promise一样，是非阻塞的。
- async/await使得异步代码看起来像同步代码，这正是它的魔力所在。

**一个函数如果加上 async ，那么该函数就会返回一个 Promise**

```
async function async1() {
  return "1"
}
console.log(async1()) // -> Promise {<resolved>: "1"}
复制代码
```

Generator函数依次调用三个文件那个例子用async/await写法，只需几句话便可实现

```
let fs = require('fs')
function read(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}
async function readResult(params) {
  try {
    let p1 = await read(params, 'utf8')//await后面跟的是一个Promise实例
    let p2 = await read(p1, 'utf8')
    let p3 = await read(p2, 'utf8')
    console.log('p1', p1)
    console.log('p2', p2)
    console.log('p3', p3)
    return p3
  } catch (error) {
    console.log(error)
  }
}
readResult('1.txt').then( // async函数返回的也是个promise
  data => {
    console.log(data)
  },
  err => console.log(err)
)
// p1 2.txt
// p2 3.txt
// p3 结束
// 结束
复制代码
```

##### 2.Async/Await并发请求

如果请求两个文件，毫无关系，可以通过并发请求

```
let fs = require('fs')
function read(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}
function readAll() {
  read1()
  read2()//这个函数同步执行
}
async function read1() {
  let r = await read('1.txt','utf8')
  console.log(r)
}
async function read2() {
  let r = await read('2.txt','utf8')
  console.log(r)
}
readAll() // 2.txt 3.txt
复制代码
```

#### 八、总结

**1.JS 异步编程进化史：callback -> promise -> generator -> async + await**

**2.async/await 函数的实现，就是将 Generator 函数和自动执行器，包装在一个函数里。**

**3.async/await可以说是异步终极解决方案了。**

**(1) async/await函数相对于Promise，优势体现在**：

- 处理 then 的调用链，能够更清晰准确的写出代码
- 并且也能优雅地解决回调地狱问题。

当然async/await函数也存在一些缺点，因为 await 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低，代码没有依赖性的话，完全可以使用 Promise.all 的方式。

**(2) async/await函数对 Generator 函数的改进，体现在以下三点**：

- 内置执行器。 Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，**async 函数的执行，与普通函数一模一样，只要一行**。
- 更广的适用性。 co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 **async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）**。
- 更好的语义。 async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

### 模块化

模块化的开发方式可以提高代码复用率，方便进行代码的管理。通常一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数。目前流行的js模块化规范有CommonJS、AMD、CMD以及ES6的模块系统。参见阮一峰老师的文章 [module-loader](https://link.juejin.cn?target=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Fmodule-loader) 。

#### 一、CommonJS

Node.js是commonJS规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。实际使用时，用`module.exports`定义当前模块对外输出的接口（不推荐直接用`exports`），用`require`加载模块。

```
// 定义模块math.js
var basicNum = 0;
function add(a, b) {
  return a + b;
}
module.exports = { //在这里写上需要向外暴露的函数、变量
  add: add,
  basicNum: basicNum
}

// 引用自定义的模块时，参数包含路径，可省略.js
var math = require('./math');
math.add(2, 5);

// 引用核心模块时，不需要带路径
var http = require('http');
http.createService(...).listen(3000);
复制代码
```

commonJS用同步的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。

#### 二、AMD和require.js

AMD规范采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。这里介绍用require.js实现AMD规范的模块化：用`require.config()`指定引用路径等，用`define()`定义模块，用`require()`加载模块。

首先我们需要引入require.js文件和一个入口文件main.js。main.js中配置`require.config()`并规定项目中用到的基础模块。

```
/** 网页中引入require.js及main.js **/
<script src="js/require.js" data-main="js/main"></script>

/** main.js 入口文件/主模块 **/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
    "underscore": "underscore.min",
  }
});
// 执行基本操作
require(["jquery","underscore"],function($,_){
  // some code here
});
复制代码
```

引用模块的时候，我们将模块名放在`[]`中作为`reqiure()`的第一参数；如果我们定义的模块本身也依赖其他模块,那就需要将它们放在`[]`中作为`define()`的第一参数。

```
// 定义math.js模块
define(function () {
    var basicNum = 0;
    var add = function (x, y) {
        return x + y;
    };
    return {
        add: add,
        basicNum :basicNum
    };
});
// 定义一个依赖underscore.js的模块
define(['underscore'],function(_){
  var classify = function(list){
    _.countBy(list,function(num){
      return num > 30 ? 'old' : 'young';
    })
  };
  return {
    classify :classify
  };
})

// 引用模块，将模块放在[]内
require(['jquery', 'math'],function($, math){
  var sum = math.add(10,20);
  $("#sum").html(sum);
});
复制代码
```

#### 三、CMD和sea.js

require.js在申明依赖的模块时会在第一之间加载并执行模块内的代码：

```
define(["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
    // 等于在最前面声明并初始化了要用到的所有模块
    if (false) {
      // 即便没用到某个模块 b，但 b 还是提前执行了
      b.foo()
    } 
});
复制代码
```

CMD是另一种js模块化方案，它与AMD很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。此规范其实是在sea.js推广过程中产生的。

```
/** AMD写法 **/
define(["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
     // 等于在最前面声明并初始化了要用到的所有模块
    a.doSomething();
    if (false) {
        // 即便没用到某个模块 b，但 b 还是提前执行了
        b.doSomething()
    } 
});

/** CMD写法 **/
define(function(require, exports, module) {
    var a = require('./a'); //在需要时申明
    a.doSomething();
    if (false) {
        var b = require('./b');
        b.doSomething();
    }
});

/** sea.js **/
// 定义模块 math.js
define(function(require, exports, module) {
    var $ = require('jquery.js');
    var add = function(a,b){
        return a+b;
    }
    exports.add = add;
});
// 加载模块
seajs.use(['math.js'], function(math){
    var sum = math.add(1+2);
});
复制代码
```

#### 四、ES6 Module

ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：`export`和`import`。`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。

```
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
    return a + b;
};
export { basicNum, add };

/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
    ele.textContent = add(99 + basicNum);
}
复制代码
```

如上例所示，使用`import`命令的时候，用户需要知道所要加载的变量名或函数名。其实ES6还提供了`export default`命令，为模块指定默认输出，对应的`import`语句不需要使用大括号。这也更趋近于ADM的引用写法。

```
/** export default **/
//定义输出
export default { basicNum, add };
//引入
import math from './math';
function test(ele) {
    ele.textContent = math.add(99 + math.basicNum);
}
复制代码
```

ES6的模块不是对象，`import`命令会被 JavaScript 引擎静态分析，在编译时就引入模块代码，而不是在代码运行时加载，所以无法实现条件加载。也正因为这个，使得静态分析成为可能。

#### 五、 ES6 模块与 CommonJS 模块的差异

##### 1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

- CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
- ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的`import`有点像 Unix 系统的“符号连接”，原始值变了，`import`加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

##### 2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

- 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
- 编译时加载: ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import`时采用静态命令的形式。即在`import`时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。

CommonJS 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

## ES

### const,let,var的区别？暂时性死区？

**`var`和`let`/`const`的区别**

1. 块级作用域
2. 不存在变量提升
3. 暂时性死区
4. 不可重复声明
5. let、const声明的全局变量不会挂在顶层对象下面

**`const`命令两个注意点:**

1. const 声明之后必须马上赋值，否则会报错
2. const 简单类型一旦声明就不能再更改，复杂类型(数组、对象等)指针指向的地址不能更改，内部数据可以更改。

#### 为什么需要块级作用域?

ES5只有全局作用域和函数作用域，没有块级作用域。

这带来很多不合理的场景:

1. 内层变量可能覆盖外层变量
2. 用来计数的循环变量泄露为全局变量

```
var tmp = new Date();
function f() {
  console.log(tmp); // 想打印外层的时间作用域
  if (false) {
    var tmp = 'hello world'; // 这里声明的作用域为整个函数
  }
}
f(); // undefined

var s = 'hello';
for (var i = 0; i < s.length; i++) {
  console.log(s[i]); // i应该为此次for循环使用的变量
}
console.log(i); // 5 全局范围都可以读到
复制代码
```

#### 块级作用域

1. 作用域

```
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
    console.log(n); // 10 内层的n
  }
  console.log(n); // 5 当前层的n
}
复制代码
```

1. 块级作用域任意嵌套

```
{{{{
  {let insane = 'Hello World'}
  console.log(insane); // 报错 读不到子作用域的变量
}}}};
复制代码
```

1. 块级作用域真正使代码分割成块了

```
{
let a = ...;
...
}
{
let a = ...;
...
}
复制代码
```

以上形式，**可以用于测试一些想法，不用担心变量重名，也不用担心外界干扰**

#### 块级作用域声明函数：

> 在块级作用域声明函数，因为浏览器的要兼容老代码，会产生一些[问题](https://link.juejin.cn?target=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Flet%23%E5%9D%97%E7%BA%A7%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8E%E5%87%BD%E6%95%B0%E5%A3%B0%E6%98%8E)！

**在块级作用域声明函数，最好使用匿名函数的形式**。

```
if(true){
  let a = function () {}; // 作用域为块级 令声明的函数作用域范围更清晰
}
复制代码
```

**ES6 的块级作用域允许声明函数的规则，只在使用大括号的情况下成立，如果没有使用大括号，就会报错**。

```
// 报错
'use strict';
if (true)
  function f() {} // 我们需要给if加个{}
复制代码
```

#### 不存在变量提升

**变量提升的现象**：在同一作用域下，变量可以在声明之前使用，值为 undefined

ES5 时使用`var`声明变量，经常会出现变量提升的现象。

```
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
复制代码
```

#### 暂时性死区：

只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，**只有等到声明变量的那一行代码出现，才可以获取和使用该变量**

```
var tmp = 123; // 声明
if (true) {
  tmp = 'abc'; // 报错 因为本区域有tmp声明变量
  let tmp; // 绑定if这个块级的作用域 不能出现tmp变量
}
复制代码
```

**暂时性死区和不能变量提升的意义在于:**

为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。

#### 不允许重复声明变量

> 在测试时出现这种情况:`var a= '声明';const a = '不报错'`，这种情况是因为babel在转化的时候，做了一些处理，在浏览器的控制台中测试，就成功报错

`let`、`const`不允许在相同作用域内，重复声明同一个变量

```
function func(arg) {
  let arg; // 报错
}

function func(arg) {
  {
    let arg; // 不报错
  }
}
复制代码
```

#### let、const声明的全局变量不会挂在顶层对象下面

1. 浏览器环境顶层对象是: `window`
2. node环境顶层对象是: `global`
3. var声明的全局变量会挂在顶层对象下面，而let、const不会挂在顶层对象下面。如下面这个栗子

```
var a = 1;
// 如果在 Node环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
复制代码
```

#### const命令

1. **一旦声明，必须马上赋值**

   ```
   let p; var p1; // 不报错
   const p3 = '马上赋值'
   const p3; // 报错 没有赋值
   复制代码
   ```

2. **const一旦声明值就不能改变**

   #### 简单类型:不能改动

   ```
   const p = '不能改变';
   p = '报错'
   复制代码
   ```

   #### 复杂类型:变量指针不能变

   考虑如下情况：

   ```
   const p = ['不能改动']
   const p2 = {
     name: 'OBKoro1'
   }
   p[0] = '不报错'
   p2.name = '不报错'
   p = ['报错']
   p2 = {
     name: '报错'
   }
   复制代码
   ```

   const所说的一旦声明值就不能改变，实际上指的是：**变量指向的那个内存地址所保存的数据不得改动**

   - 简单类型(number、string、boolean)：**内存地址就是值,即常量(一变就报错)**.

   - 复杂类型(对象、数组等)：**地址保存的是一个指针，`const`只能保证指针是固定的(总是指向同一个地址),它内部的值是可以改变的(不要以为const就安全了！)**

     所以只要不重新赋值整个数组/对象， 因为保存的是一个指针，所以对数组使用的`push`、`shift`、`splice`等方法也是允许的，你就是把值一个一个全都删光了都不会报错。

   > 复杂类型还有函数，正则等，这点也要注意一下。

#### 总结:

再总结一下，看到这些名词，脑子里应该会有对应的理解，如果没有的话，那可以再看看对应的内容。

#### `var`和`let`/`const`的区别:

1. 块级作用域
2. 不存在变量提升
3. 暂时性死区
4. 不可重复声明
5. let、const声明的全局变量不会挂在顶层对象下面

#### `const`命令两个注意点:

1. `let`可以先声明稍后再赋值,而`const`在 声明之后必须马上赋值，否则会报错
2. const 简单类型一旦声明就不能再更改，复杂类型(数组、对象等)指针指向的地址不能更改，内部数据可以更改。

#### let、const使用场景:

1. `let`使用场景：变量，用以替代`var`。
2. `const`使用场景：常量、声明匿名函数、箭头函数的时候。

### 箭头函数和普通函数的区别？

#### 箭头函数的this指向规则：

##### 1. 箭头函数没有`prototype`(原型)，所以箭头函数本身没有this

```
let a = () =>{};
console.log(a.prototype); // undefined
复制代码
```

##### 2. 箭头函数的this指向在定义的时候继承自外层第一个普通函数的this。

下面栗子中在一个函数中定义箭头函数，然后在另一个函数中执行箭头函数。

```
let a,
  barObj = { msg: 'bar的this指向' };
fooObj = { msg: 'foo的this指向' };
bar.call(barObj); // 将bar的this指向barObj
foo.call(fooObj); // 将foo的this指向fooObj
function foo() {
  a(); // 结果：{ msg: 'bar的this指向' }
}
function bar() {
  a = () => {
    console.log(this, 'this指向定义的时候外层第一个普通函数'); // 
  }; // 在bar中定义 this继承于bar函数的this指向
}
复制代码
```

从上面栗子中可以得出两点

1. **箭头函数的this指向定义时所在的外层第一个普通函数，跟使用位置没有关系**。
2. **被继承的普通函数的this指向改变，箭头函数的this指向会跟着改变**

##### 3. 不能直接修改箭头函数的this指向

上个栗子中的foo函数修改一下，尝试直接修改箭头函数的this指向。

```
let fnObj = { msg: '尝试直接修改箭头函数的this指向' };
function foo() {
  a.call(fnObj); // 结果：{ msg: 'bar的this指向' }
}
复制代码
```

很明显，call显示绑定this指向失败了，包括aaply、bind都一样。

> 它们(call、aaply、bind)会默认忽略第一个参数，但是可以正常传参。

然后我又通过隐式绑定来尝试同样也失败了，new 调用会报错，这个稍后再说。

SO，**箭头函数不能直接修改它的this指向**。

幸运的是，我们可以通过间接的形式来修改箭头函数的指向：

**去修改被继承的普通函数的this指向，然后箭头函数的this指向也会跟着改变**，这在上一个栗子中有演示。

```
bar.call(barObj); // 将bar普通函数的this指向barObj 然后内部的箭头函数也会指向barObj
复制代码
```

##### 4. 箭头函数外层没有普通函数，严格模式和非严格模式下它的this都会指向`window`(全局对象)

> 唔，这个问题实际上是面试官提出来的，当时我认为的箭头函数规则就是：箭头函数的this指向继承自外层第一个普通函数的this，现在看来真是不严谨(少说一个定义的时候)，要是面试官问我：定义和执行不在同一个普通函数中，它又指向哪里，肯定歇菜...

既然箭头函数的this指向在定义的时候继承自外层第一个普通函数的this，那么：

**当箭头函数外层没有普通函数，它的this会指向哪里**？

这里跟我之前写的[this绑定规则](https://juejin.cn/post/6844903630592540686#heading-3)不太一样(不懂的可以点进去看一下),普通函数的默认绑定规则是：

在非严格模式下，默认绑定的this指向全局对象，严格模式下this指向undefined

**如果箭头函数外层没有普通函数继承，它this指向的规则**：

经过测试，箭头函数在全局作用域下，**严格模式和非严格模式下它的this都会指向`window`(全局对象)**。

Tip：测试的时候发现**严格模式在中途声明无效，必须在全局/函数的开头声明才会生效**：

```
a = 1;
'use strict'; // 严格模式无效 必须在一开始就声明严格模式
b = 2; // 不报错
复制代码
```

#### 箭头函数的

##### 箭头函数的arguments

箭头函数的this指向全局，使用arguments会报未声明的错误

如果箭头函数的this指向`window`(全局对象)使用`arguments`会报错，未声明`arguments`。

```
let b = () => {
  console.log(arguments);
};
b(1, 2, 3, 4); // Uncaught ReferenceError: arguments is not defined
复制代码
```

PS：如果你声明了一个全局变量为`arguments`，那就不会报错了，但是你为什么要这么做呢？

箭头函数的this指向普通函数时,它的`argumens`继承于该普通函数

上面是第一种情况：箭头函数的this指向全局对象，会报arguments未声明的错误。

第二种情况是：箭头函数的this如果指向普通函数,它的`argumens`继承于该普通函数。

```
function bar() {
  console.log(arguments); // ['外层第二个普通函数的参数']
  bb('外层第一个普通函数的参数');
  function bb() {
    console.log(arguments); // ["外层第一个普通函数的参数"]
    let a = () => {
      console.log(arguments, 'arguments继承this指向的那个普通函数'); // ["外层第一个普通函数的参数"]
    };
    a('箭头函数的参数'); // this指向bb
  }
}
bar('外层第二个普通函数的参数');
复制代码
```

那么应该如何来获取箭头函数不定数量的参数呢？答案是：ES6的rest参数（`...`扩展符）

##### rest参数获取函数的多余参数

这是ES6的API，用于获取函数不定数量的参数数组，这个API是用来替代`arguments`的，API用法如下：

```
let a = (first, ...abc) => {
  console.log(first, abc); // 1 [2, 3, 4]
};
a(1, 2, 3, 4);
复制代码
```

上面的栗子展示了，获取函数除第一个确定的参数，以及用一个变量接收其他剩余参数的示例。

也可以直接接收函数的所有参数，rest参数的用法相对于`arguments`的优点：

1. 箭头函数和普通函数都可以使用。

2. 更加灵活，接收参数的数量完全自定义。

3. 可读性更好

   参数都是在函数括号中定义的，不会突然出现一个`arguments`，以前刚见到的时候，真的好奇怪了！

4. rest是一个真正的数组，可以使用数组的API。

   因为`arguments`是一个类数组的对象，有些人以为它是真正的数组，所以会出现以下场景：

   ```
   arguments.push(0); // arguments.push is not a function
   复制代码
   ```

   如上，如果我们需要使用数组的API，需要使用扩展符/Array.from来将它转换成真正的数组:

   ```
   arguments = [...arguments]; 或者 ：arguments = Array.from(arguments);
   复制代码
   ```

**rest参数有两点需要注意**：

1. rest必须是函数的最后一位参数：

   ```
   let a = (first, ...rest, three) => {
     console.log(first, rest,three); // 报错：Rest parameter must be last formal parameter
   };
   a(1, 2, 3, 4);
   复制代码
   ```

2. 函数的length属性，不包括 rest 参数

   ```
   (function(...a) {}).length  // 0
   (function(a, ...b) {}).length  // 1
   复制代码
   ```

扩展运算符还可以用于数组，这里是阮一峰老师的[文档](https://link.juejin.cn?target=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Farray%23%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6)

PS：感觉这里写多了，但比较喜欢把一个知识点讲清楚...

##### 使用`new`调用箭头函数会报错

无论箭头函数的thsi指向哪里，使用`new`调用箭头函数都会报错，因为箭头函数没有`constructor`

```
let a = () => {};
let b = new  a(); // a is not a constructor
复制代码
```

##### 箭头函数不支持`new.target`：

`new.target`是ES6新引入的属性，普通函数如果通过`new`调用，`new.target`会返回该函数的引用。

此属性主要：用于确定构造函数是否为new调用的。

1. 箭头函数的this指向全局对象，在箭头函数中使用箭头函数会报错

   ```
   let a = () => {
     console.log(new.target); // 报错：new.target 不允许在这里使用
   };
   a();
   复制代码
   ```

2. 箭头函数的this指向普通函数，它的new.target就是指向该普通函数的引用。

   ```
   new bb();
   function bb() {
     let a = () => {
       console.log(new.target); // 指向函数bb：function bb(){...}
     };
     a();
   }
   复制代码
   ```

更多关于`new.target`可以看一下阮一峰老师关于这部分的[解释](https://link.juejin.cn?target=http%3A%2F%2Fes6.ruanyifeng.com%2F%3Fsearch%3Dnew.target%26x%3D0%26y%3D0%23docs%2Fclass%23new-target-%E5%B1%9E%E6%80%A7)。

##### 箭头函数不支持重命名函数参数,普通函数的函数参数支持重命名

如下示例，普通函数的函数参数支持重命名，后面出现的会覆盖前面的，箭头函数会抛出错误：

```
function func1(a, a) {
  console.log(a, arguments); // 2 [1,2]
}

var func2 = (a,a) => {
  console.log(a); // 报错：在此上下文中不允许重复参数名称
};
func1(1, 2); func2(1, 2);
复制代码
```

##### 箭头函数相对于普通函数语法更简洁优雅：

讲道理，语法上的不同，也属与它们两个的区别！

1. 箭头函数都是匿名函数，并且都不用写`function`

2. 只有一个参数的时候可以省略括号:

   ```
   var f = a => a; // 传入a 返回a
   复制代码
   ```

3. 函数只有一条语句时可以省略`{}`和`return`

   ```
   var f = (a,b,c) => a; // 传入a,b,c 返回a
   复制代码
   ```

4. 简化回调函数，让你的回调函数更优雅：

```
[1,2,3].map(function (x) {
  return x * x;
}); // 普通函数写法 
[1,2,3].map(x => x * x); // 箭头函数只需要一行
复制代码
```

------

#### 箭头函数的注意事项及不适用场景

##### 箭头函数的注意事项

1. 一条语句返回对象字面量，需要加括号，或者直接写成多条语句的`return`形式，

   否则像func中演示的一样，花括号会被解析为多条语句的花括号，不能正确解析

```
var func1 = () => { foo: 1 }; // 想返回一个对象,花括号被当成多条语句来解析，执行后返回undefined
var func2 = () => ({foo: 1}); // 用圆括号是正确的写法
var func2 = () => {
  return {
    foo: 1 // 更推荐直接当成多条语句的形式来写，可读性高
  };
};
复制代码
```

1. 箭头函数在参数和箭头之间不能换行！

```
var func = ()
           => 1;  // 报错： Unexpected token =>
复制代码
```

1. 箭头函数的解析顺序相对靠前

MDN: 虽然箭头函数中的箭头不是运算符，但箭头函数具有与常规函数不同的特殊[运算符优先级](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FOperators%2FOperator_Precedence)解析规则

```
let a = false || function() {}; // ok
let b = false || () => {}; // Malformed arrow function parameter list
let c = false || (() => {}); // ok
复制代码
```

#### 箭头函数不适用场景：

围绕两点：箭头函数的this意外指向和代码的可读性。

1. 定义字面量方法,this的意外指向。

因为箭头函数的简洁

```
const obj = {
  array: [1, 2, 3],
  sum: () => {
    // 根据上文学到的：外层没有普通函数this会指向全局对象
    return this.array.push('全局对象下没有array，这里会报错'); // 找不到push方法
  }
};
obj.sum();
复制代码
```

上述栗子使用普通函数或者ES6中的方法简写的来定义方法，就没有问题了：

```
// 这两种写法是等价的
sum() {
  return this.array.push('this指向obj');
}
sum: function() {
  return this.array.push('this指向obj');
}
复制代码
```

还有一种情况是给普通函数的原型定义方法的时候，通常会在普通函数的外部进行定义，比如说继承/添加方法的时候。

这时候因为没有在普通函数的内部进行定义，所以this会指向其他普通函数，或者全局对象上，导致bug！

1. 回调函数的动态this

下文是一个修改dom文本的操作，因为this指向错误，导致修改失败：

```
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    this.innerHTML = 'Clicked button'; // this又指向了全局
});
复制代码
```

相信你也知道了，改成普通函数就成了。

1. 考虑代码的可读性，使用普通函数

   - 函数体复杂：

     具体表现就是箭头函数中使用多个三元运算符号，就是不换行，非要在一行内写完，非常恶心！

   - 行数较多

   - 函数内部有大量操作

#### 普通函数和箭头函数的区别：

1. 箭头函数没有`prototype`(原型)，所以箭头函数本身没有this
2. 箭头函数的this在定义的时候继承自外层第一个普通函数的this。
3. 如果箭头函数外层没有普通函数，严格模式和非严格模式下它的this都会指向`window`(全局对象)
4. 箭头函数本身的this指向不能改变，但可以修改它要继承的对象的this。
5. 箭头函数的this指向全局，使用arguments会报未声明的错误。
6. 箭头函数的this指向普通函数时,它的`argumens`继承于该普通函数
7. 使用`new`调用箭头函数会报错，因为箭头函数没有`constructor`
8. 箭头函数不支持`new.target`
9. 箭头函数不支持重命名函数参数,普通函数的函数参数支持重命名
10. 箭头函数相对于普通函数语法更简洁优雅

#### 箭头函数的注意事项及不适用场景

**箭头函数的注意事项**：

1. 箭头函数一条语句返回对象字面量，需要加括号
2. 箭头函数在参数和箭头之间不能换行
3. 箭头函数的解析顺序相对`||`靠前

**不适用场景**：箭头函数的this意外指向和代码的可读性

### 实现reduce

#### 语法

```
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
复制代码
```

#### 参数

callback 必需。用于执行每个数组元素的函数。

- accumulator 初始值, 它是上一次调用回调时返回的累积值
- currentValue 当前元素
- index 数组中正在处理的当前元素的索引。 如果提供了initialValue，则起始索引号为0，否则从索引1起始。
- array 调用reduce()的数组（可选）

initialValue 传递给函数的初始值（可选）

#### 用法

首先reduce能干啥呢？他是es5数组中新增的一个方法，可以用来求和、去重、组合等等

- 求和

```
[0, 1, 2, 3].reduce((accumulator, currentValue)=> {
  return accumulator + currentValue;
}, 0);
// 和为 6
复制代码
```

- 去重

```
var arrData = [
    {id: 0, name: "小明"},
    {id: 1, name: "小张"},
    {id: 2, name: "小李"},
    {id: 3, name: "小孙"},
    id: 1, name: "小周"},
    {id: 2, name: "小陈"},
];
var obj = {};
arrData = arrData.reduce((cur,next) => {
    if(!obj[next.id]){
        obj[next.id] = true
        cur.push(next);
    }
    return cur;
},[]) //设置cur默认类型为数组，并且初始值为空的数组
console.log(arrData);//打印出数组去重后的结果
复制代码
```

一看去重这写法，太简单了，利用对象的key值唯一性，哎，一想到那时候自己，脑袋真的是秀逗了

- 组合

这我们经常看到的是在redux中源码中用到的组合

#### 源码

```
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
```

### require和import的区别

#### require/exports

```
// module.js
    let counts = 1;
    function sayHello() {
        alert(`"hello , ${counts}`)
    }

    setTimeout(() => {
    counts += 2
    }, 3000);

    module.exports = {counts, sayHello};

    index.js
    const { counts, sayHello } = require('./module.js');
    
    // 注意此处的代码结果
    const click = () => {
        console.log('counts: ', counts) // 每次点击事件，打印的 counts 始终为 1
        sayHello(); // 1  ==》 3秒钟后 =>> 3
    }

    ...
    <!-- 此处counts始终是 1 -->
    <p>import {counts}</p> 
    <Button type="primary" onClick={click}>require </Button>
复制代码
```

结果分析： 在源文件中更改变量的值，通过 `require` 引入 `counts` 的变量，拿到的值始终是初始化的值

#### import/export

```
// module.js
    let counts = 1;
        function sayHello() {
        alert(`"hello , ${counts}`)
    }
    setTimeout(() => {
        counts += 2
    }, 3000);
    export { counts, sayHello };

    // index.js
    import { counts, sayHello } from './module.js';
    
    // 注意此处的代码结果
    const click = () => {
        console.log('counts: ', counts) // 初始为 1， ==》 3秒钟后 =>> 3
        sayHello(); // 初始为 1， ==》 3秒钟后 =>> 3
    }

    ...
    <!-- 此counts处始终是 1 -->
    <p>import {counts}</p> 
    <Button type="primary" onClick={click}>require </Button>
复制代码
```

结果分析：通过 `import` 引入 `counts` 的变量，在源文件中修改变量的值后，引入拿到的变量值也会改变。

#### require和import的区别

1. 导入`require` 导出 `exports/module.exports` 是 `CommonJS` 的标准，通常适用范围如 `Node.js`
2. `import/export` 是 `ES6` 的标准，通常适用范围如 `React`
3. `require` 是**赋值过程**并且是**运行时才执行**，也就是*同步加载*
4. `require` 可以理解为一个全局方法，因为它是一个方法所以意味着可以在任何地方执行。
5. `import` 是**解构过程**并且是**编译时执行**，理解为*异步加载*
6. `import` 会提升到整个模块的头部，具有置顶性，但是建议写在文件的顶部。

> `commonjs` 输出的，是一个值的拷贝，而`es6`输出的是值的引用；

> `commonjs` 是运行时加载，`es6`是编译时输出接口；

#### require和import的性能

`require` 的性能相对于 `import` 稍低。

因为 `require` 是在运行时才引入模块并且还赋值给某个变量，而 `import` 只需要依据 `import` 中的接口在编译时引入指定模块所以性能稍高

### 实现forEach

```
Array.prototype.selfForeach = function(callback, context) {
  // 不能是null调用方法
  if (this === null) {
    throw new TypeError(
      "Array.prototype.reduce" + "called on null or undefined"
    );
  }
  // 第一个参数必须要为function
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  // 获取数组
  let arr = Array.prototype.slice.call(this);
  let _len = arr.length;
  for (let i = 0; i < _len; i++) {
    callback.call(context, arr[i], i, arr);
  }
  return arr;
};
```

```
Array.prototype.reduceForeach = function(callback, context) {
  // 不能是null调用方法
  if (this === null) {
    throw new TypeError(
      "Array.prototype.reduce" + "called on null or undefined"
    );
  }
  // 第一个参数必须要为function
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  // 获取数组
  let arr = Array.prototype.slice.call(this);
  arr.reduce((pre, cur, index) => {
    return [...pre, callback.call(context, cur, index, this)];
  }, []);
};
```

### 实现 map

```
Array.prototype.selfMap = function(callback, context) {
  // 不能是null调用方法
  if (this === null) {
    throw new TypeError(
      "Array.prototype.reduce" + "called on null or undefined"
    );
  }
  // 第一个参数必须要为function
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  // 声明要用到的变量
  let arr = Array.prototype.slice.call(this);
  let _len = arr.length;
  let aMap = [];
  // 循环调用
  for (let i = 0; i < _len; i++) {
    // 过滤稀疏值
    if (!arr.hasOwnProperty(i)) {
      continue;
    }
    aMap[i] = callback.call(context, arr[i], i, this);
  }
  return aMap;
};
```

```
Array.prototype.reduceMap = function(callback, context) {
  // 不能是null调用方法
  if (this === null) {
    throw new TypeError(
      "Array.prototype.reduce" + "called on null or undefined"
    );
  }
  // 第一个参数必须要为function
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  // 获取数组
  let aMap = Array.prototype.slice.call(this);
  // 使用reduce实现循环
  return aMap.reduce((pre, cur, index) => {
    // 拼接上次循环结果和当前结果
    // 循环调用callback
    return [...pre, callback.call(context, cur, index, this)];
  }, []);
};
```

### filter 实现

#### for 循环实现

```
Array.prototype.selfFilter = function(callback, context) {
  // 不能是null调用方法
  if (this === null) {
    throw new TypeError(
      "Array.prototype.reduce" + "called on null or undefined"
    );
  }
  // 第一个参数必须要为function
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  // 获取数组
  let aArr = Array.prototype.slice.call(this);
  let _len = aArr.length;
  let aFArr = [];
  // 循环调用callback
  for (let i = 0; i < _len; i++) {
    if (!aArr.hasOwnProperty(i)) {
      continue;
    }
    callback.call(context, aArr[i], i, this) && aFArr.push(aArr[i]);
  }
  return aFArr;
};
```

#### reduce 实现

```
Array.prototype.reduceFilter = function(callback, context) {
  // 不能是null调用方法
  if (this === null) {
    throw new TypeError(
      "Array.prototype.reduce" + "called on null or undefined"
    );
  }
  // 第一个参数必须要为function
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  // 获取数组
  let aArr = Array.prototype.slice.call(this);

  // 循环调用callback
  aArr.reduce((pre, cur, index) => {
    return callback.call(context, cur, index, this) ? [...pre, cur] : [...pre];
  }, []);

  return aArr;
};
```

### sleep函数

```
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
```

### ["1","2","3"].map(parseInt)结果，并解释原因，如何返回[1,2,3] 用你能想到的最简单的方案(要求使用[].map())

#### console.log(['1','2','3'].map(parseInt));

[权威原文参考 A JavaScript Optional Argument Hazard](https://link.juejin.cn?target=http%3A%2F%2Fwww.wirfs-brock.com%2Fallen%2Fposts%2F166)

- 答案：[1,NaN,NaN]
- 解析：这个题，答主我是知道答案的，因为这个题是 `网红题` 要解析他 我们先来看看

map这个方法他或回`调函数的参数` ，和他的使用

```
//这是MDN
var array1 = [1, 4, 9, 16];
// pass a function to map
const map1 = array1.map(x => x * 2);

console.log(map1);
// expected output: Array [2, 8, 18, 32]
复制代码
```

- 语法

```
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array }[, 
thisArg])
复制代码
```

- 参数
- callback

生成新数组元素的函数，使用三个参数：

- `currentValue`

  `callback` 数组中正在处理的当前元素。

- **`index`可选 ** `看到这里先注意起来这个参数，思考一下`

  `callback` 数组中正在处理的当前元素的索引。

- `array`可选

  `callback`  `map` 方法被调用的数组。

`thisArg`可选

执行 `callback` 函数时使用的`this` 值。

- map 也是常有用的一个array的prototype方法，大家并不陌生，好现在我们来看一看 `parseInt`，这个方法

他们会擦出什么火花



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/22/1691435685020630~tplv-t2oaga2asx-watermark.awebp)



#### 原因

- 注意到上面这2个家伙，接下来就好解释了
- 原因： 其实就是 `map`的`callback`的第二个参数 index 也就是当前元素的索引 被当做`parseInt` 的第二个参数`radix` 的来使用了

仔细想一下，我们原本以为我们的的三次调用时这样的

```
parseInt('1')
parseInt('2')
parseInt('3')
复制代码
```

实际上是这样被调用的

```
parseInt('1',0,theArray);
parseInt('2',1,theArray);
parseInt('3',2,theArray);
复制代码
```

好，那么重点来了，index 是如何影响 radix的呢？

- 第一次，当我我们第一次调用的时候 是这样的：`parseInt('1',0)` 这个是没问题的 转十进制的 看我红框的图片
  - 返回 1
- 第二次，调用第二个index参数是1,也是说1作为数值的基础。规范里说的很清楚了，如果基础是非0或者小于2，函数都不会查询字符串直接返回NaN。
- 第三次，2作为基数。这就意味着字符串将被解析成字节数，也就是仅仅包含数值0和1。parseInt的规范第十一步指出，它仅尝试分析第一个字符的左侧，这个字符还不是要求基数的有效数字。这个字符串的第一个字符是“3”，它并不是基础基数2的一个有效数字。所以这个子字符串将被解析为空。第十二步说了：如果子字符串被解析成空了，函数将返回为NaN。
  - 所以这里的结果就应该是[1,NaN,NaN].

#### 解决

**这里问题所在就是容易忽视parseInt是需要两个参数的。map中有三个参数。所以这里结合起来，就导致了上面问题。** 换个方式写：

```
['1','2','3'].map(function(value){
        return parseInt(value)
})
复制代码
```

这样就不会出错。

当然，我们也可以写：

```
['1','2','3'].map(Number)
```

### symbol

#### 前言

在 Es6 中引入了一个新的基础数据类型:`Symbol`,对于其他基本数据类型(`数字number`,`布尔boolean`,`null`,`undefined`,`字符串string`)想必都比较熟悉,但是这个`Symbol`平时用得很少,甚至在实际开发中觉得没有什么卵用,能够涉及到的应用场景屈指可数.

往往在面试的时候,屡面不爽.下面一起来看看的这个数据类型的

#### 具体解决的问题

在 Es5 的对象属性名中都是字符串,当一对象的属性名出现重复时,后者往往会覆盖前者.

若使用`Symbol`就能够保证每个属性的名字都是独一无二的,相当于生成一个唯一的标识 ID,这样就从根本上防止属性名的冲突

#### Symbol 类型

`symbol`是`Es6`规范引入的一项新的特性,表示独一无二的值,归纳为`JS`语言的第 7 种数据类型,它是通过`Symbol`函数生成

通过`Symbol()`函数来创建生成一个`Symbol实例`

```
let s1 = Symbol();
console.log(typeof s1); //symbol
console.log(Object.prototype.toString.call(s1)); // [object Symbol]
复制代码
```

在上面示例代码中,用`typeof`进行了类型的检测,它返回的是`Symbol`类型,而不是什么`string`,`object`之类的

在 `Es5` 中原有的对象的属性名是字符串类型中拓展了一个`Symbol`类型,也就是说,现在对象的属性名有两种类型

- 字符串类型
- `Symbol` 类型

**注意**

`Symbol` 函数前不能使用`new`关键字,否则就会报错,这是因为生成的`Symbol`是一个原始类型的值,它不是对象

因为不是对象,所以也不能添加属性,它是一种类似于字符串的数据类型,可以理解为是在字符串类型的一种额外的拓展

`Symbol`函数可以接收一个字符串做为参数,它是对该`Symbol`实例的一种描述,主要是为了在控制台显示

**Symbol 的描述是可选的，仅用于调试目的或转为字符串时,进行区分**,不是访问 symbol 本身

可以使用`Symbol().description`会返回`Symbol()`的实例描述的具体内容,如果有值,则会返回该描述,若无则会返回`undefined`

`description`是`Symbol`的一个静态属性

当使用字符串定义对象的属性名时,若出现同名属性,则会出现属性覆盖问题,而使用`Symbol`类型定义的对象属性名,则不会,它是独一无二的,每调用一次`Symbol()`都会生成一个唯一的标识,即使是使用`Symbol()` 生成的实例描述相同,但它们依旧不相等,总会返回`false` 如下代码所示

```
let s1 = Symbol('itclanCoder'); // 定义了一s1变量,它是Symbol()类型,并接收了一个itclanCoder字符串,作为该Symbol的实例
let s2 = Symbol('itclanCoder'); // 实例化了一个s2,Symbol()类型
console.log(s1.description); // itclanCoder
console.log(s1.description); // itclanCoder
console.log(s1 === s2); // false
复制代码
```

从第 5 行代码比较结果看出,`s1`与`s2`是两个不同的`Symbol`值,这里让`Symbol`接受一个参数,如果不加参数,它们在控制台输出的都是`Symbol`,即使参数相同,但是它们依旧是两个不同的`Symbol`

如果您希望使用拥有同一个`Symbol`值,那该怎么办?在 Es6 中,提供了一个`Symbol.for()`方法可以实现,它接受一个字符串作为参数 然后搜索有没有以该参数作为名称的`Symbol值`

如果有,就返回这个`Symbol值`,否则就新建一个以该字符串为名称的`Symbol值`,并会将它注册到全局坏境中

```
let s1 = Symbol.for('itclanCoder');
let s2 = Symbol.for('itclanCoder');
console.log(s1 === s2); // true
复制代码
```

在上面的示例代码中,`s1` 和 `s2` 都是`Symbol`实例化出来的值,但是它们都是由`Symbol.for`方法生成的,指向的是同一个值,地止

- **`Symbol` 与 `Symbol.for` 的区别**

**比较**

**共同点:** 都会生成新的`Symbol` **不同点:** `Symbol.for()`会被登记在全局坏境中供搜索,而`Symbol()`不会,`Symbol.for()`不会每次调用就返回一个新的`Symbol`类型的值,而是会先检查给定的`key`是否已经存在,如果不存在才会新建一个`Symbol`值

如:调用`Symbol.for('itclanCoder')`100 次,每次都会返回同一个`Symbol`值,但是调用`Symbol('itclanCoder')`100 次,会返回 100 个不同的`Symbol`值

```
Symbol.for("itclanCoder") === Symbol.for("itclanCoder") // true

Symbol("itclanCoder") === Symbol("itclanCoder") // false
复制代码
```

在上面代码中，由于`Symbol()`写法没有登记机制,所以每次调用都会返回一个不同的值,也就是每次都会在栈内存中重新开辟一块空间

也可以通过`Symbol.keyFor()`方法返回一个已登记的`Symbol`类型值的`key`,通过该方法检测是否有没有全局注册

```
let s1 = Symbol.for("itclan");
console.log(Symbol.keyFor(s1)) // "itclan"

let s2 = Symbol("itclan");
console.log(Symbol.keyFor(s2)) // undefined

复制代码
```

在上面的代码中,变量`s2`属于未被登记的`Symbol`值,所以就返回`undefined`

**注意**

`Symbol.for()`是为`Symbol`值登记的名字,在整个全局作用域范围内都起作用

```
function foo() {
  return Symbol.for('itclan');
}

const x = foo();
const y = Symbol.for('itclan');
console.log(x === y); // true
复制代码
```

在上面代码中，`Symbol.for('itclan')`是在函数内部运行的，但是生成的 `Symbol 值`是登记在全局环境的。所以，第二次运行`Symbol.for('itclan')`可以取到这个 `Symbol 值`

- **应用场景**:`Symbol.for()`

这个全局记录特性,可以用在不同的`iframe`火`service worker`中取到同一个值

在前端开发中,有时候会用到`iframe`,但是`iframe`之间相互隔离的,有时候想要取到不同的`iframe`中同一份数据,那么这个`Symbol.for()`就派上用场了的

如下示例代码所示

```
let iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo') // true
复制代码
```

在上面代码中，`iframe`窗口生成的`Symbol 值`，可以在主页面拿得到,在整个全局作用域内都可以取到

#### Symbol 应用场景

- #### 应用场景 1-使用`Symbol`来作为对象属性名(key)

在 Es6 之前,通常定义或访问对象的属性都是使用字符串,如下代码所示

```
let web = {
    site: "http://itclan.cn",
    name: "itclanCoder"
}
console.log(web['site']); // http://itclan.cn
console.log(web['name']); // itclanCoder
复制代码
```

访问变量对象的属性,除了可以通过`对象.属性名`的方式外,可以通过`对象['属性名']`的方式进行访问,如果一个对象中出现了同名属性那么后者会覆盖前者

由于每调用一次`Symbol`函数,生成的值都是不相等的,这意味着`Symbol`值可以作为标识符,用于对象的属性名,就能保证不会出现同名的属性

针对一个对象由多个模块构成的情况就变得非常有用了的,使用`Symbol`能放置某一个键被不小心改写或覆盖

`Symbol`可以用于对象属性的定义和访问

如下示例代码所示

```
const PERSON_NAME = Symbol();
const PERSON_AGE = Symbol();

let person = {
    [PERSON_NAME]: "随笔川迹"
}

person[PERSON_AGE] =  20;

console.log(person[PERSON_NAME])  // 随笔川迹
console.log(person[PERSON_AGE])   // 20
复制代码
```

在上面的示例代码中,使用`Symbol`创建了`PERSON_NAME`,`PERSON_AGE`两个`Symbol`类型,但是在实际开发中却带来了一些问题

当您使用了`Symbol`作为对象的属性`key`后,你若想对该对象进行遍历,于是用到了`Object.keys()`,`for..in`,`for..of`,`Object.getOwnPropertyNames()、JSON.stringify()`进行枚举对象的属性名

你会发现使用`Symbol`后会带来一个非常令人难以接受的现实,如下示例代码所示

```
let person = {
   [Symbol('name')]: '随笔川迹',
   age: 20,
   job: 'Engineer'
}
console.log(Object.keys(person)) // ["age", "job"]
for(var i in person) {
    console.log(i);   // age job
}

Object.getOwnPropertyNames(person) // ["age", "job"]
JSON.stringify(person); // "{"age":20,"job":"Engineer"}"
复制代码
```

通过上面的示例代码结果可知,`Symbol`类型实例化出的`key`是不能通过`Object.keys()`,`for..in`,`for..of`,来枚举的

它也没有包含子自身属性集合`Object.getOwnPropertyName()`当中,该方法无法获取到

利用该特性,我们可以**把一些不需要对外操作和访问的属性使用`Symbol`来定义**

这样,我们在定义接口的数据对象时,可以决定对象的哪些属性,对内私有操作与对外公有操作变得可控,更加的方便

使用常规的方法,无法获取到以`Symbol`方式定义对象的属性,在 Es6 中,提供了一个专门针对`Symbol`的 API

用`Object.getOwnPropertySymbols()`方法,可以获取指定对象的所有`Symbol`属性名,该方法会返回一个数组

它的成员是当前对象的所有用作属性名的 `Symbol 值`

```
let person = {
   [Symbol('name')]: '随笔川迹',
   age: 20,
   job: 'Engineer'
}

// 使用Object的API
Object.getOwnPropertySymbols(person) // [Symbol(name)]

复制代码
```

如下是`Object.getOwnPropertySymbols()`方法与`for..in`循环,`Object.getOwnPropertyNames`方法进行对比的例子

```
const person = {};
const name = Symbol('name');

person[name] = "随笔川迹"

for(let i  in person) {
  console.log(i); // 无任何输出
}

Object.getOwnPropertyNames(person); // []
Object.getOwnPropertySymbols(person); // [Symbol('name')]
复制代码
```

在上面代码中，使用`for...in`循环和`Object.getOwnPropertyNames()`方法都得不到 `Symbol 键名`，需要使用`Object.getOwnPropertySymbols()`方法。

如果想要获取全部的属性,可以使用一个新的 API，`Reflect.ownKeys()`方法可以返回所有类型的键名，包括常规键名和 `Symbol` 键名

```
let person = {
  [Symbol('name')]: "川川",
  enum: 2,
  nonEnum: 3
};

Reflect.ownKeys(person)  //  ["enum", "nonEnum", Symbol(name)]
复制代码
```

正由于以`Symbol 值`作为键名，不会被常规方法(`for..in`,`for..of`)遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法,达到保护私有属性的目的

- #### 应用场景 2：使用 Symbol 定义类的私有属性/方法

JavaScript 是一弱类型语言,弱并不是指这个语言功能弱,而所指的是,它的类型没有强制性,是没有如`java`等面向对象语言的访问控制关键字`private`的，类上所有定义的属性和方法都是公开访问的,当然在`TypeScript`中新增了一些关键字,解决了此问题的

有时候,类上定义的属性和方法都能公开访问,会造成一些困扰

而有了`Symbol`类的私有属性和方法成为了实现

如下示例代码

```
let size = Symbol('size');  // 声明定义了一个size变量,类型是Symbol(),类型描述内容是size

class Collection {          // class关键字定义了一个Collection类
  constructor() {           // 构造器`constructor`函数
    this[size] = 0;         // 在当前类上私有化了一个size属性
  }

  add(item) {              // Collection类下的一个方法
    this[this[size]] = item;
    this[size]++;
  }

  static sizeOf(instance) { // 静态属性
    return instance[size];
  }
}

let x = new Collection(); // 实例化x对象
Collection.sizeOf(x) // 0

x.add('foo');       // 调用方法
Collection.sizeOf(x) // 1

Object.keys(x) // ['0']
Object.getOwnPropertyNames(x) // ['0']
Object.getOwnPropertySymbols(x) // [Symbol(size)]
复制代码
```

上面代码中，对象 `x` 的 `size` 属性是一个 `Symbol` 值，所以 `Object.keys(x)`、`Object.getOwnPropertyNames(x)`都无法获取它。这就造成了一种非私有的内部方法的效果

- #### 应用场景 3-模块化机制

结合`Symbol`与模块化机制,类的私有属性和方法完美实现,如下代码所示 在文件`a.js`中

```
const PASSWORD = Symbol();  // 定义一个PASSWORD变量,类型是Symbol

class Login() {      // class关键字声明一个Login类
  constructor(username, password) {    // 构造器函数内初始化属性
    this.username = username;
    this[PASSWORD] = password;
  }

  checkPassword(pwd) {
    return this[PASSWORD] === pwd;
  }

}
export default Login;
复制代码
```

在文件`b.js`中

```
import Login from './a'

const login = new Login('itclanCoder', '123456'); // 实例化一个login对象

login.checkPassword('123456'); // true
login.PASSWORD;  // 访问不到
login[PASSWORD]; // 访问不到
login['PASSWORD'] // 访问不到

复制代码
```

因为通过`Symbol`定义的`PASSWORD`常量定义在`a.js`模块中,外面的模块是获取不到这个`Symbol`的,在外部无法引用这个值,也无法改写,也不可能在在创建一个一模一样的`Symbol`出来

因为`Symbol`是唯一的

在`a.js`模块中,这个`PASSWORD`的`Symbol`类型只能在当前模块文件(`a.js`)中内部使用,所以使用它来定义的类属性是没有办法被模块外访问到的

这样就达到了一个私有化的效果

- #### 应用场景 4-使用`Symbol`来替代常量

在使用`React`中,结合`Redux`做公共数据状态管理时,当想要改变组件中的某个状态时,`reducer`是一个纯函数,它会返回一个最新的状态给`store`,返回的结果是由`action`和`state`共同决定的

`action`是一个对象,有具体的类型`type`值,如果你写过几行`Redux`的代码,就会常常看到,进行`action`的拆分,将事件动作的类型定义成常量

```
const CHANGE_INPUT_VALUE = 'CHANGE_INPUT_VALUE';  // 监听input框输入值的常量
const ADD_INPUT_CONTENT = 'ADD_INPUT_CONTENT';    // 添加列表
const DELETE_LIST = 'DELETE_LIST';                // 删除列表

function reducer(state, action) {
    const newState =  JSON.parse(JSON.stringify(state));
    switch(action.type) {
        case CHANGE_INPUT_VALUE:
             // ...
        case ADD_INPUT_CONTENT:
             // ...
        case DELETE_LIST;
              // ...
        default:
             return state;
    }

}
复制代码
```

以上代码在`Redux`中很常见,将`action`对象中的`type`值,给抽离出来,定义一个常量存储,来代表一种业务逻辑,通常希望这些常量是唯一的,在`Redux`中定义成常量,是为了便于调试查错

常常因为取`type`值时,非常苦恼.

现在有了`Symbol`,改写一下,就可以这样

```
const CHANGE_INPUT_VALUE = Symbol()
const ADD_INPUT_CONTENT = Symbol();
const DELETE_LIST = Symbol()

function reducer(state, action) {
    const newState =  JSON.parse(JSON.stringify(state));
    switch(action.type) {
        case CHANGE_INPUT_VALUE:
             // ...
        case ADD_INPUT_CONTENT:
             // ...
        case DELETE_LIST;
              // ...
        default:
             return state;
    }

}
复制代码
```

通过`Symbol`定义字符串常量,就保证了三个常量的值唯一性

**划重点**

- 常量使用`Symbol`值最大的好处,就是其他任何值都不可能有相同的值了,可以保证常量的唯一性,因此,可以保证上面的`switch`语句按照你设计的方式条件去工作

- 当`Symbol`值作为属性名时,该属性是公开属性,不是私有属性

- #### 应用场景 5-注册和获取全局的`Symbol

在浏览器窗口(`window`)中,使用`Symbol()`函数来定义生成的`Symbol`实例是唯一的

但是若应用涉及到多个`window`,最常见的就是在各个页面窗口中嵌入`iframe`了,并在各个`iframe`页面中取到来自同一份公共的数据源

也就是在各个`window`中使用的某些`Symbol`希望是同一个,那么这个时候,使用`Symbol()`就不行不通了

因为用它在不同`window`中创建的`Symbol实例`总是唯一的，而我们需要的是在所有这些`window环境下`保持一个共享的`Symbol`值。

在这种情况下，我们就需要使用另一个 API 来创建或获取`Symbol`，那就是`Symbol.for()`，它可以注册或获取一个`window`间全局的`Symbol实例`，它是`Symbol`的一个静态方法

这个在前面已经提到过一次,这个还是有那么一点点用处,所以在提一嘴的

如下示例代码所示

```
let gs1 = Symbol.for('global_symbol_1')  //注册一个全局Symbol
let gs2 = Symbol.for('global_symbol_1')  //获取全局Symbol

console.log(gs1 === gs2 ) // true
复制代码
```

经过`Symbol.for()`实例化出来的`Symbol`字符串类型,只要描述的内容相同,那么不光是在当前`window`中是唯一的,在其他全局范围内的`window`也是唯一的,并且相同

该特性,若是创建跨文件可用的`symbol`，甚至跨域（每个`window`都有它自己的全局作用域） , 可以使用 `Symbol.for()`取到相同的值

也就是说,使用了`Symbol.for()`在全局范围内,`Symbol`类型值可以共享

#### 注意事项

- **`Symbol` 值不能与其他类型的值进行运算-会报错**

```
let symItclan = Symbol('itclan');

console.log("主站" + symItclan)
console.log(`主站 ${symItclan}`) // Uncaught TypeError: Cannot convert a Symbol value to a string
复制代码
```

- **`Symbol`可以显示转为字符串**

```
let SyItclanCoder = Symbol('https://coder.itclan.cn');

console.log(String(SyItclanCoder)) // Symbol(https://coder.itclan.cn)
console.log(SyItclanCoder.toString()) // Symbol(https://coder.itclan.cn)
复制代码
```

- **`Symbol`值可以转为布尔值,但是不能转为数值**

```
let sym = Symbol();
console.log(Boolean(sym)) // true
console.log(!sym)  // false

if (sym) {
  // ...
}

Number(sym) // TypeError  Cannot convert a Symbol value to a number
sym + 2 // TypeError
复制代码
```

由上面的错误提示可以看出,`Symbol`不能转换为数字,无法做相应的运算

- **`Symbol`函数不能使用`new`命令**

`Symbol`函数前不能使用`new`命令,否则就会报错,`Symbol`是一个原始类型的值,不是对象,它是类似字符串的数据类型

- **`Symbol值`作为对象属性名时，不能用点运算符**

当`Symbol`值作为对象的属性名时,访问它时,不能用点运算符

```
const username = Symbol();
const person = {};
person.username = '随笔川迹';
person[username]; // undefined
person['username']; // 随笔川迹
复制代码
```

第 4 行代码值为`undefined`,因为点运算符后面总是字符串,所以不会读取`username`作为标识符名所指代的那个值

导致`person`对象的属性名实际上是一个字符串,而不是一个`Symbol`值

由此可见:在对象内部,使用`Symbol`类型定义属性名时,**`Symbol`值必须放在中括号之中**

```
let s = Symbol();
let obj = {
  [s]: function(arg) {
    return arg;
  }
}

obj[s]("itclanCoder")
复制代码
```

在上面的代码中,如果变量`s`不放在中括号中,该属性的键名就是字符串`s`,而不是定义`Symbol`类型值

### bigint

#### 问题

对于学过其他语言的程序员来说，JS中缺少显式整数类型常常令人困惑。许多编程语言支持多种数字类型，如浮点型、双精度型、整数型和双精度型，但JS却不是这样。在JS中，按照[IEEE 754-2008](https://link.juejin.cn?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FIEEE_754-2008_revision)标准的定义，所有数字都以[双精度64位浮点](https://link.juejin.cn?target=http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDouble_precision_floating-point_format)格式表示。

在此标准下，无法精确表示的非常大的整数将自动四舍五入。确切地说，JS 中的`Number`类型只能安全地表示`-9007199254740991 (-(2^53-1))` 和`9007199254740991(2^53-1)`之间的整数，任何超出此范围的整数值都可能失去精度。

```
console.log(9999999999999999);    // → 10000000000000000
复制代码
```

该整数大于JS Number 类型所能表示的最大整数，因此，它被四舍五入的。意外四舍五入会损害程序的可靠性和安全性。这是另一个例子：

```
// 注意最后一位的数字
9007199254740992 === 9007199254740993;    // → true
复制代码
```

JS 提供`Number.MAX_SAFE_INTEGER`常量来表示 最大安全整数，`Number.MIN_SAFE_INTEGER`常量表示最小安全整数：

```
const minInt = Number.MIN_SAFE_INTEGER;

console.log(minInt);         // → -9007199254740991

console.log(minInt - 5);     // → -9007199254740996

// notice how this outputs the same value as above
console.log(minInt - 4);     // → -9007199254740996
复制代码
```

#### 解决方案

为了解决这些限制，一些JS开发人员使用字符串类型表示大整数。 例如，[Twitter API](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.twitter.com%2Fen%2Fdocs%2Fbasics%2Ftwitter-ids) 在使用 JSON 进行响应时会向对象添加字符串版本的 ID。 此外，还开发了许多库，例如 [bignumber.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMikeMcl%2Fbignumber.js%2F)，以便更容易地处理大整数。

使用BigInt，应用程序不再需要变通方法或库来安全地表示`Number.MAX_SAFE_INTEGER`和`Number.Min_SAFE_INTEGER`之外的整数。 现在可以在标准JS中执行对大整数的算术运算，而不会有精度损失的风险。

要创建`BigInt`，只需在整数的末尾追加n即可。比较:

```
console.log(9007199254740995n);    // → 9007199254740995n
console.log(9007199254740995);     // → 9007199254740996
复制代码
```

或者，可以调用`BigInt()`构造函数

```
BigInt("9007199254740995");    // → 9007199254740995n
复制代码
```

`BigInt`文字也可以用二进制、八进制或十六进制表示

```
// binary
console.log(0b100000000000000000000000000000000000000000000000000011n);
// → 9007199254740995n

// hex
console.log(0x20000000000003n);
// → 9007199254740995n

// octal
console.log(0o400000000000000003n);
// → 9007199254740995n

// note that legacy octal syntax is not supported
console.log(0400000000000000003n);
// → SyntaxError
复制代码
```

请记住，不能使用严格相等运算符将`BigInt`与常规数字进行比较，因为它们的类型不同：

```
console.log(10n === 10);    // → false

console.log(typeof 10n);    // → bigint
console.log(typeof 10);     // → number
复制代码
```

相反，可以使用等号运算符，它在处理操作数之前执行隐式类型转换

```
console.log(10n == 10);    // → true
复制代码
```

除一元加号(`+`)运算符外，所有算术运算符都可用于`BigInt`

```
10n + 20n;    // → 30n
10n - 20n;    // → -10n
+10n;         // → TypeError: Cannot convert a BigInt value to a number
-10n;         // → -10n
10n * 20n;    // → 200n
20n / 10n;    // → 2n
23n % 10n;    // → 3n
10n ** 3n;    // → 1000n

const x = 10n;
++x;          // → 11n
--x;          // → 9n
复制代码
```

不支持一元加号（`+`）运算符的原因是某些程序可能依赖于`+`始终生成`Number`的不变量，或者抛出异常。 更改`+`的行为也会破坏`asm.js`代码。

当然，与`BigInt`操作数一起使用时，算术运算符应该返回`BigInt`值。因此，除法(`/`)运算符的结果会自动向下舍入到最接近的整数。例如:

```
25 / 10;      // → 2.5
25n / 10n;    // → 2n
复制代码
```

#### 隐式类型转换

因为隐式类型转换可能丢失信息，所以不允许在`bigint`和 `Number` 之间进行混合操作。当混合使用大整数和浮点数时，结果值可能无法由`BigInt`或`Number`精确表示。思考下面的例子：

```
(9007199254740992n + 1n) + 0.5
复制代码
```

这个表达式的结果超出了`BigInt`和`Number`的范围。小数部分的`Number`不能精确地转换为`BigInt`。大于`2^53`的`BigInt`不能准确地转换为数字。

由于这个限制，不可能对混合使用`Number`和`BigInt`操作数执行算术操作。还不能将`BigInt`传递给Web api和内置的 JS 函数，这些函数需要一个 `Number` 类型的数字。尝试这样做会报`TypeError`错误

```
10 + 10n;    // → TypeError
Math.max(2n, 4n, 6n);    // → TypeError
复制代码
```

**请注意**，关系运算符不遵循此规则，如下例所示：

```
10n > 5;    // → true
复制代码
```

如果希望使用`BigInt`和`Number`执行算术计算，首先需要确定应该在哪个类型中执行该操作。为此，只需通过调用`Number()`或`BigInt()`来转换操作数：

```
BigInt(10) + 10n;    // → 20n
// or
10 + Number(10n);    // → 20
复制代码
```

当 `Boolean` 类型与`BigInt` 类型相遇时，`BigInt`的处理方式与`Number`类似，换句话说，只要不是`0n`，`BigInt`就被视为`truthy`的值：

```
if (5n) {
    // 这里代码块将被执行
}

if (0n) {
    // 这里代码块不会执行
}
复制代码
```

排序`BigInts`和`Numbers`数组时，不会发生隐式类型转换：

```
const arr = [3n, 4, 2, 1n, 0, -1n];

arr.sort();    // → [-1n, 0, 1n, 2, 3n, 4]
复制代码
```

位操作符如`|、&、<<、>>`和`^`对`Bigint`的操作方式与`Number`类似。下面是一些例子

```
90 | 115;      // → 123
90n | 115n;    // → 123n
90n | 115;     // → TypeError
复制代码
```

#### BigInt构造函数

与其他基本类型一样，可以使用构造函数创建`BigInt`。传递给`BigInt()`的参数将自动转换为`BigInt`:

```
BigInt("10");    // → 10n
BigInt(10);      // → 10n
BigInt(true);    // → 1n
复制代码
```

无法转换的数据类型和值会引发异常:

```
BigInt(10.2);     // → RangeError
BigInt(null);     // → TypeError
BigInt("abc");    // → SyntaxError
复制代码
```

可以直接对使用构造函数创建的`BigInt`执行算术操作

```
BigInt(10) * 10n;    // → 100n
复制代码
```

使用严格相等运算符的操作数时，使用构造函数创建的`Bigint`与常规`Bigint`的处理方式类似

```
BigInt(true) === 1n;    // → true
复制代码
```

#### 库函数

在撰写本文时，`Chrome +67` 和`Opera +54`完全支持`BigInt`数据类型。不幸的是，`Edge`和`Safari`还没有实现它。`Firefox`默认不支持BigInt，但是可以在`about:config`中将`javascript.options.bigint` 设置为`true`来开启它，最新支持的情况可在“[Can I use](https://link.juejin.cn?target=https%3A%2F%2Fcaniuse.com%2F%23search%3Dbigint)”上查看。

不幸的是，转换`BigInt`是一个极其复杂的过程，这会导致严重的运行时性能损失。直接polyfill `BigInt`也是不可能的，因为该提议改变了几个现有操作符的行为。目前，更好的选择是使用[JSBI](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGoogleChromeLabs%2Fjsbi)库，它是`BigInt`提案的纯JS实现。

这个库提供了一个与原生`BigInt`行为完全相同的API。下面是如何使用JSBI：

```
import JSBI from './jsbi.mjs';

const b1 = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
const b2 = JSBI.BigInt('10');

const result = JSBI.add(b1, b2);

console.log(String(result));    // → '9007199254741001'
复制代码
```

使用`JSBI`的一个优点是，一旦浏览器支持，就不需要重写代码。 相反，可以使用`babel`插件自动将JSBI代码编译为原生 `BigInt`代码。

#### 总结

`BigInt`是一种新的数据类型，用于当整数值大于`Number`数据类型支持的范围时。这种数据类型允许我们安全地对大整数执行算术操作，表示高分辨率的时间戳，使用大整数id，等等，而不需要使用库。

重要的是要记住，不能使用`Number`和`BigInt`操作数的混合执行算术运算，需要通过显式转换其中的一种类型。 此外，出于兼容性原因，不允许在`BigInt`上使用一元加号（`+`）运算符。

### webworker

（1）**同源限制**

分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。

（2）**DOM 限制**

Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用`document`、`window`、`parent`这些对象。但是，Worker 线程可以`navigator`对象和`location`对象。

（3）**通信联系**

Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。

（4）**脚本限制**

Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。

（5）**文件限制**

Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。

### Map、Set、WeakMap、WeakSet

#### Map

Map 是一组键值对的结构，和 JSON 对象类似。

**(1) Map数据结构如下**

这里我们可以看到的是Map的数据结构是一个键值对的结构

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d9cd0b4c2504300829aa34d1cc70eac~tplv-k3u1fbpfcp-watermark.awebp?)

**(2) key 不仅可以是字符串还可以是对象**

```
var obj ={name:"小如",age:9}
let map = new Map()
map.set(obj,"111")
复制代码
```

打印结果如下

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fef5ef67750f4f2087c6d12185affdd1~tplv-k3u1fbpfcp-watermark.awebp?)

**(3) Map常用语法如下**

```
//初始化`Map`需要一个二维数组(请看 Map 数据结构)，或者直接初始化一个空`Map` 
let map = new Map();

//添加key和value值
map.set('Amy','女')
map.set('liuQi','男')

//是否存在key，存在返回true,反之为false
map.has('Amy') //true
map.has('amy') //false

//根据key获取value
map.get('Amy') //女

//删除 key为Amy的value
map.delete('Amy')
map.get('Amy') //undefined  删除成功
复制代码
```

**(4) 一个key只能对应一个value，多次对一个key放入value，后面的值会把前面的值覆盖掉**

```
var map =new Map
map.set('Amy',"女")
map.set('Amy',"男")
console.log(map) 
复制代码
```

打印结果如下

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce93b0be447544238b45ab8fcb4aa102~tplv-k3u1fbpfcp-watermark.awebp?)

#### Set

Set 对象类似于数组，且成员的值都是唯一的

**(1) 打印出的数据结构如下**

这里打印出来是一个对象

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08746590e3fb41e5a62af8cc808de6bf~tplv-k3u1fbpfcp-watermark.awebp?)

**(2) 最常用来去重使用，去重方法有很多但是都没有它运行的快。**

```
var arr=[1,3,4,2,5,1,4]
// 这里原本是一个对象用了es6的语法 转化成了数组，就是转化数组之前已经过滤掉了重复的元素了
var arr2=[...new Set(arr)] //[1,3,4,2,5]
复制代码
```

**(3) Set常用语法如下**

```
//初始化一个Set ，需要一个Array数组，要么空Set
var set = new Set([1,2,3,5,6]) 
console.log(set)  // {1, 2, 3, 5, 6}

//添加元素到Set中
set.add(7) //{1, 2, 3, 5, 6, 7}

//删除Set中的元素
set.delete(3) // {1, 2, 5, 6, 7}

//检测是否含有此元素，有为true，没有则为false
set.has(2) //true
复制代码
```

#### Array 和 Set 对比

- `Array` 的 `indexOf` 方法比 `Set` 的 `has` 方法效率低下
- `Set` 不含有重复值（可以利用这个特性实现对一个数组的去重）
- `Set` 通过 `delete` 方法删除某个值，而 `Array` 只能通过 `splice`。两者的使用方便程度前者更优
- `Array` 的很多新方法 `map`、`filter`、`some`、`every` 等是 `Set` 没有的（但是通过两者可以互相转换来使用）

#### 总结Map和Set的区别

**(1) 这两种方法具有极快的查找速度;那么下面我们来对比一下Map，Set，Array 的执行时间**

```
//首先初始化数据
var lng=100
var arr =new Array(lng).fill(2)
var set =new Set(arr)
let map =new Map()
for(var i=0;i<lng;i++){
arr[i]=i
map.set(i,arr[i])
}

// Array
console.time()
for(var j=0;j<lng;j++){
arr.includes(j)
}
console.timeEnd()  //default: 0.01220703125 ms


// Set
console.time()
for(var j=0;j<lng;j++){
set.has(j)
}
console.timeEnd()  // default: 0.005859375 ms

// Map
console.time()
for(var j=0;j<lng;j++){
map.has(j)
}
console.timeEnd()
// default: 0.007080078125 ms
复制代码
```

通过以上几种方法我们可以看到，Set执行时间最短，那么查找速度最快，当然了Set 和 Map的查找速度都很快想差不大，所以说这两种方法具有极快的查找速度。

**(2) 初始化需要的值不一样，Map需要的是一个二维数组，而Set 需要的是一维 Array 数组**

**(3) Map 和 Set 都不允许键重复**

**(4) Map的键是不能修改，但是键对应的值是可以修改的；Set不能通过迭代器来改变Set的值，因为Set的值就是键。**

**(5) Map 是键值对的存在，值也不作为健；而 Set 没有 value 只有 key，value 就是 key；**

#### object与map的比较

相同点：

1.都通过kv进行存储

2.结构上相似

不同点：

1.Object的key只能是String/Symbol

2.Object用在OO中

3.Map具有size属性

4.Map可以使用forEach遍历

#### WeakMap

WeakMap 和 Map 的第一个不同点就是 WeakMap 的键必须是对象，不能是原始值。

```javascript
let people = { name: "coolFish" };

let weakMap = new WeakMap();

weakMap.set(people, "ok"); // 正常工作（以对象作为键）

weakMap.set("test", "Whoops"); // Error，因为 "test" 不是一个对象

people = null; // 覆盖引用  // people 被从内存中删除了！
复制代码
```

我们可以发现，如果`people` 只是作为 WeakMap 的键而存在，他们会被从 map 中自动删除。 `WeakMap` 不支持迭代以及 `keys()`，`values()` 和 `entries()` 方法。所以没有办法获取 `WeakMap` 的所有键或值。 我们可以用下面几个方法，获取一些我们想要的信息

- weakMap.get(key) ，拿键取值。
- weakMap.set(key,value)  ,设置weakMap
- weakMap.delete(key)  ,根据键删除值
- weakMap.has(key)  ,是否包含该键

这种限制的原因是，当 weakMap 中的对象失去他的所有引用，就会开始自动垃圾回收，垃圾回收时，可能会立即回收，也可能当前有很多回收任务，所以会延迟回收，这样我们就不知道`**何时会被回收**` ，因此不支持访问 WeakMap的所有键值的方法。

#### WeakMap 使用场景

`WeakMap` 的主要应用场景是 **额外数据的存储**。 例如我们在处理一个属于另外一个代码的一个对象，并且想存储一些相关的数据，那么这些数据就应该和这个对象共存亡，这时候 WeakMap 就是我们需要的，我们把这些数据放到 WeakMap 中，并且使用该对象作为这些数据的键 ，那么当该对象被垃圾回收了，数据也会被回收，同理，当数据不存在的时候，对象也会被回收。

我们来看一个缓存案例

```javascript
//首先我们创建一个缓存函数
let cache = new Map()
//计算并且记住结果
function process(obj) {
  if (!cache.has(obj)) {
    let result = obj;
    cache.set(obj, result);
  }
  return cache.get(obj);
}

//我们在其他文件使用他时
let obj = {/* 假设我们有个对象 */};
let result1 = process(obj); // 计算完成
// ……稍后，来自代码的另外一个地方……
let result2 = process(obj); // 取自缓存的被记忆的结果
// ……稍后，我们不再需要这个对象时：
obj = null;
alert(cache.size); // 1（啊！该对象依然在 cache 中，并占据着内存！）
复制代码
```

小结：我们可以看到，我们应用缓存函数时，将我们传入的对象，作为 map 的键，所以当我们初始化对象的时候，该对象会依旧在 cache 中，因为他被定义在 cache 中的键。

要解决该问题，我们可以使用 WeakMap 这样当键这个对象不可访问时，即便他作为键，他也会被一同被内存中删除。

#### WeakSet

- 与 `Set` 类似，但是我们只能向 `WeakSet` 添加对象（而不能是原始值）。
- 对象只有在其它某个（些）地方能被访问的时候，才能留在 set 中。
- 跟 `Set` 一样，`WeakSet` 支持 `add`，`has` 和 `delete` 方法，但不支持 `size` 和 `keys()`，并且不可迭代。

我们可以把对象添加到 WeakSet中，以便去重，并且当对象不可读取时，他会进行垃圾回收。

```javascript
let visitedSet = new WeakSet();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

visitedSet.add(john); // John 访问了我们
visitedSet.add(pete); // 然后是 Pete
visitedSet.add(john); // John 再次访问

// visitedSet 现在有两个用户了

// 检查 John 是否来访过？
alert(visitedSet.has(john)); // true

// 检查 Mary 是否来访过？
alert(visitedSet.has(mary)); // false

john = null;

// visitedSet 里将只有pete
复制代码
```

#### 总结

`WeakMap` 是类似于 `Map` 的集合，它仅允许对象作为键，并且一旦通过其他方式无法访问它们，便会将它们与其关联值一同删除。 `WeakSet` 是类似于 `Set` 的集合，它仅存储对象，并且一旦通过其他方式无法访问它们，便会将其删除。 它们都不支持引用所有键或其计数的方法和属性。仅允许单个操作。 `WeakMap` 和 `WeakSet` 被用作“主要”对象存储之外的“辅助”数据结构。一旦将对象从主存储器中删除，如果该对象仅被用作 `WeakMap` 或 `WeakSet` 的键，那么它将被自动清除。

#### WeakMap对象

WeakMap的键必须是对象类型，值可以是任意类型。他的键被弱保持，也就是说当其键所指的对象没有其他地方引用的时候就会被GC回收掉。

WeakMap不可枚举。

#### WeakSet对象

WeakSet对象不重复且不可枚举。

与Set对象的主要区别是：

1.WeakSet中的值必须是对象类型，不可以是别的类型。

2.WeakSet的weak指的是，对集合中的对象，如果不存在其他引用，那么该对象将被垃圾回收掉。

### Proxy

#### 什么是代理模式

> 代理模式（英语：Proxy Pattern）是程序设计中的一种设计模式。

> 所谓的代理者是指一个类别可以作为其它东西的接口。代理者可以作任何东西的接口：网络连接、内存中的大对象、文件或其它昂贵或无法复制的资源。

> 著名的代理模式例子为引用计数（英语：reference counting）指针对象。

> 当一个复杂对象的多份副本须存在时，代理模式可以结合享元模式以减少内存用量。典型作法是创建一个复杂对象及多个代理者，每个代理者会引用到原本的复杂对象。而作用在代理者的运算会转送到原本对象。一旦所有的代理者都不存在时，复杂对象会被移除。

上面是维基百科中对代理模式的一个整体的定义.而在JavaScript中代理模式的具体表现形式就是ES6中的新增对象---**[Proxy](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy)**

#### 什么是Proxy对象

在MDN上对于`Proxy`的解释是:

> Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

  简单来说:`Proxy`对象就是可以让你去对JavaScript中的一切合法对象的基本操作进行自定义.然后用你自定义的操作去覆盖其对象的基本操作.也就是当一个对象去执行一个基本操作时,其执行的过程和结果是你自定义的,而不是对象的.

😓好吧,用文字表达可能太复杂了.我们还是直接上代码吧.

首先Proxy的语法是:

```
let p = new Proxy(target, handler);
复制代码
```

其中:

- `target`是你要代理的对象.它可以是JavaScript中的任何合法对象.如: (数组, 对象, 函数等等)
- `handler`是你要自定义操作方法的一个集合.
- `p`是一个被代理后的新对象,它拥有`target`的一切属性和方法.只不过其行为和结果是在`handler`中自定义的.

然后让我们来看这段代码:

```
let obj = {
  a: 1,
  b: 2,
}

const p = new Proxy(obj, {
  get(target, key, value) {
    if (key === 'c') {
      return '我是自定义的一个结果';
    } else {
      return target[key];
    }
  },

  set(target, key, value) {
    if (value === 4) {
      target[key] = '我是自定义的一个结果';
    } else {
      target[key] = value;
    }
  }
})

console.log(obj.a) // 1
console.log(obj.c) // undefined
console.log(p.a) // 1
console.log(p.c) // 我是自定义的一个结果

obj.name = '李白';
console.log(obj.name); // 李白
obj.age = 4;
console.log(obj.age); // 4

p.name = '李白';
console.log(p.name); // 李白
p.age = 4;
console.log(p.age); // 我是自定义的一个结果
复制代码
```

从上面这段代码中,我可以很清楚的看到`Proxy`对象的作用.即是之前所受的**用于定义基本操作的自定义行为**.同样的`get`和`set`操作.没有没代理的对象所得的结果是其JavaScript本身的执行机制运行计算后所得到的.而被代理了的对象的结果则是我们自定义的.

#### Proxy所能代理的范围--handler

在上面代码中,我们看到了构造一个代理对象时所传的第二个参数`handler`,这个`handler`对象是由`get`和`set`两个函数方法组成的.这两个方法会在一个对象被`get`和`set`时被调用执行,以代替原生对象上的操作.那么为什么在`handler`,定义`get`和`set`这两个函数名之后就代理对象上的`get`和`set`操作了呢?

实际上`handler`本身就是ES6所新设计的一个对象.它的作用就是用来**自定义代理对象的各种可代理操作**。它本身一共有13中方法,每种方法都可以代理一种操作.其13种方法如下:

```
handler.getPrototypeOf()

// 在读取代理对象的原型时触发该操作，比如在执行 Object.getPrototypeOf(proxy) 时。

handler.setPrototypeOf()

// 在设置代理对象的原型时触发该操作，比如在执行 Object.setPrototypeOf(proxy, null) 时。

handler.isExtensible()

// 在判断一个代理对象是否是可扩展时触发该操作，比如在执行 Object.isExtensible(proxy) 时。

handler.preventExtensions()

// 在让一个代理对象不可扩展时触发该操作，比如在执行 Object.preventExtensions(proxy) 时。

handler.getOwnPropertyDescriptor()

// 在获取代理对象某个属性的属性描述时触发该操作，比如在执行 Object.getOwnPropertyDescriptor(proxy, "foo") 时。

handler.defineProperty()

// 在定义代理对象某个属性时的属性描述时触发该操作，比如在执行 Object.defineProperty(proxy, "foo", {}) 时。

handler.has()

// 在判断代理对象是否拥有某个属性时触发该操作，比如在执行 "foo" in proxy 时。

handler.get()

// 在读取代理对象的某个属性时触发该操作，比如在执行 proxy.foo 时。

handler.set()

// 在给代理对象的某个属性赋值时触发该操作，比如在执行 proxy.foo = 1 时。

handler.deleteProperty()

// 在删除代理对象的某个属性时触发该操作，比如在执行 delete proxy.foo 时。

handler.ownKeys()

// 在获取代理对象的所有属性键时触发该操作，比如在执行 Object.getOwnPropertyNames(proxy) 时。

handler.apply()

// 在调用一个目标对象为函数的代理对象时触发该操作，比如在执行 proxy() 时。

handler.construct()

// 在给一个目标对象为构造函数的代理对象构造实例时触发该操作，比如在执行new proxy() 时。
复制代码
```

#### Proxy的作用

对于代理模式`Proxy`的作用主要体现在三个方面:

1、 拦截和监视外部对对象的访问

2、 降低函数或类的复杂度

2、 在复杂操作前对操作进行校验或对所需资源进行管理

而对于这三个使用方面的具体表现大家可以参考这篇文章--[实例解析ES6 Proxy使用场景](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3cplus.com%2Fjavascript%2Fuse-cases-for-es6-proxies.html)

#### Object.defineProperty

讲 `proxy` 之前，先回顾下 `Object.defineProperty` 。大家都知道，`vue2.x` 以及之前的版本是使用 `Object.defineProperty` 实现数据的双向绑定的，至于是怎样绑定的呢？下面简单实现一下

```
function observer(obj) {
    if (typeof obj ==='object') {
        for (let key in obj) {
            if(obj.hasOwnProperty(key)){
                defineReactive(obj, key, obj[key])
            }
        }
    }
}

function defineReactive(obj, key, value) {
    //针对value是对象，递归检测
    observer(value)
    //劫持对象的key
    Object.defineProperty(obj, key, {
        get() {
            console.log('获取：'+key)
            return value
        },
        set(val) {
            //针对所设置的val是对象
            observer(val)
            console.log(key+"-数据改变了")
            value = val
        }
    })
}

let obj={
    name:'守候',
    flag:{
        book:{
            name:'js',
            page:325
        },
        interest:['火锅','旅游'],
    }
}

observer(obj)
复制代码
```

在浏览器的 `console` 执行一下，似乎能正常运行



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/9/172986d83af55adf~tplv-t2oaga2asx-watermark.awebp)



但是实际上，`Object.defineProperty` 问题有以下几个

问题1.删除或者增加对象属性无法监听到

比如增加一个属性 `gender` ，由于在执行 `observer(obj)` 的时候，没有这个属性，所以这个无法监听到。删除的属性也是无法监听到

> 增加属性的时候， `vue` 需要使用 `$set` 进行操作，`$set` 的内部也是使用 `Object.defineProperty` 进行操作



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/9/17298793b66f1648~tplv-t2oaga2asx-watermark.awebp)



问题2.数组的变化无法监听到



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/9/17298747c6d2fcf5~tplv-t2oaga2asx-watermark.awebp)



由上图得知，虽然数组属性实际上是修改成功了，但是不能被监听到

问题3. 由于是使用递归遍历对象，使用 `Object.defineProperty`  劫持对象的属性，如果遍历的对象层级比较深，花的时间比较久，甚至有性能的问题

#### proxy

对于 `proxy` ，在 mdn 上的描述是： 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）

简单来说就是，可以在对目标对象设置一层拦截。无论对目标对象进行什么操作，都要经过这层拦截

听上去似乎，`proxy` 比 `Object.defineProperty` 要好用，并且简单很多，实际上就是如此。下面用 proxy 对上面的代码进行改写试下

```
function observerProxy(obj){
    let handler = {
      get (target, key, receiver) {
        console.log('获取：'+key)
        // 如果是对象，就递归添加 proxy 拦截
        if (typeof target[key] === 'object' && target[key] !== null) {
          return new Proxy(target[key], handler)
        }
        return Reflect.get(target, key, receiver)
      },
      set (target, key, value, receiver) {
        console.log(key+"-数据改变了")
        return Reflect.set(target, key, value, receiver)
      }
    }
    return new Proxy(obj, handler)
}


let obj={
    name:'守候',
    flag:{
        book:{
            name:'js',
            page:325
        },
        interest:['火锅','旅游'],
    }
}

let objTest=observerProxy(obj)
复制代码
```

也是一样的效果



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/11/172a1e45c4579975~tplv-t2oaga2asx-watermark.awebp)



而且，能做到 `Object.defineProperty` 做不到的事情，比如增加一个属性 `gender`，能够监听到



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729d16add1ff90a~tplv-t2oaga2asx-watermark.awebp)



操作数组，也能监听到



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729d19fea522197~tplv-t2oaga2asx-watermark.awebp)



最后敲一下黑板，简单总结一下两者的区别

1.`Object.defineProperty` 拦截的是对象的属性，会改变原对象。`proxy` 是拦截整个对象，通过 new 生成一个新对象，不会改变原对象。

2.`proxy` 的拦截方式，除了上面的 get 和 set ，还有 11 种。选择的方式很多 [Proxy](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy)，也可以监听一些  `Object.defineProperty` 监听不到的操作，比如监听数组，监听对象属性的新增，删除等。

#### proxy 使用场景

关于 `proxy` 的使用场景，受限于篇幅，这里就简单列举几个，更多的可以移步 [mdn](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy)。

看到这里，两者的区别，和 `proxy` 的优势已经知道个大概了。但是在开发上，有哪些场景可以使用到 `proxy` 呢，下面列举个可能会遇上的情况

#### 负索引数组

在使用 `splice(-1)`，`slice(-1)` 等 API 的时候，当输入负数的时候，会定位到数组的最后一项，但是在普通数组上，并不能使用负数。 `[1,2,3][-1]` 这个代码并不能输出 3 。要让上面的代码输出 3 ， 也可以使用 `proxy` 实现。

```
let ecArrayProxy = {
  get (target, key, receiver) {
    let _index=key<0?target.length+Number(key):key
    return Reflect.get(target, _index, receiver)
  }
}
let arr=new Proxy([1,2,3],ecArrayProxy)
复制代码
```



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/11/172a1f210474c77a~tplv-t2oaga2asx-watermark.awebp)



#### 表单校验

在对表单的值进行改动的时候，可以在 `set` 里面进行拦截，判断值是否合法

```
let ecValidate = {
  set (target, key, value, receiver) {
    if (key === 'age') {
      //如果值小于0，或者不是正整数
      if (value<0||!Number.isInteger(value)) {
        throw new TypeError('请输入正确的年龄');
      }
    }
    return Reflect.set(target, key, value, receiver)
  }
}

let obj=new Proxy({age:18},ecValidate)
obj.age=16
obj.age='少年'
复制代码
```



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/11/172a1e78e5280925~tplv-t2oaga2asx-watermark.awebp)



#### 增加附加属性

比如有一个需求，保证用户输入正确身份证号码之后，把出生年月，籍贯，性别都添加进用户信息里面

> 众所周知，身份证号码第一和第二位代表所在省（自治区，直辖市，特别行政区），第三和第四位代表所在市（地级市、自治州、盟及国家直辖市所属市辖区和县的汇总码）。第七至第十四位是出生年月日。低17位代表性别，男单女双。

```
const PROVINCE_NUMBER={
    44:'广东省',
    46:'海南省'
}
const CITY_NUMBER={
    4401:'广州市',
    4601:'海口市'
}

let ecCardNumber = {
  set (target, key, value, receiver) {
    if(key === 'cardNumber'){
        Reflect.set(target, 'hometown', PROVINCE_NUMBER[value.substr(0,2)]+CITY_NUMBER[value.substr(0,4)], receiver)
        Reflect.set(target, 'date', value.substr(6,8), receiver)
        Reflect.set(target, 'gender', value.substr(-2,1)%2===1?'男':'女', receiver)
    }
    return Reflect.set(target, key, value, receiver)
  }
}
let obj=new Proxy({cardNumber:''},ecCardNumber)
复制代码
```



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/11/172a1ee0523b4af4~tplv-t2oaga2asx-watermark.awebp)



#### 数据格式化

比如有一个需求，需要传时间戳给到后端，但是前端拿到的是一个时间字符串，这个也可以用 `proxy` 进行拦截，当得到时间字符串之后，可以自动加上时间戳。

```
let ecDate = {
  set (target, key, value, receiver) {
    if(key === 'date'){
        Reflect.set(target, 'timeStamp', +new Date(value), receiver)
    }
    return Reflect.set(target, key, value, receiver)
  }
}
let obj=new Proxy({date:''},ecDate)
复制代码
```



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/11/172a1f0468a4562e~tplv-t2oaga2asx-watermark.awebp)




Proxy 用于许多库和某些浏览器框架。在本章中，我们将看到许多实际应用。

语法：

```
let proxy = new Proxy(target, handler)复制代码
```

- `target` —— 是要包装的对象，可以是任何东西，包括函数。
- `handler` —— 代理配置：带有“钩子”（“traps”，即拦截操作的方法）的对象。比如 `get` 钩子用于读取 `target` 属性，`set` 钩子写入 `target` 属性等等。

对 `proxy` 进行操作，如果在 `handler` 中存在相应的钩子，则它将运行，并且 Proxy 有机会对其进行处理，否则将直接对 target 进行处理。

首先，让我们创建一个没有任何钩子的代理：

```
let target = {};
let proxy = new Proxy(target, {}); // 空的handler对象

proxy.test = 5; // 写入 Proxy 对象 (1)
alert(target.test); // 返回 5，test属性出现在了 target 上！

alert(proxy.test); // 还是 5，我们也可以从 proxy 对象读取它 (2)

for(let key in proxy) alert(key); // 返回 test，迭代也正常工作！ (3)复制代码
```

由于没有钩子，所有对 `proxy` 的操作都直接转发给 `target`。

1. 写入操作 `proxy.test=` 会将值写入 `target`。
2. 读取操作 `proxy.test` 会从 `target` 返回对应的值。
3. 迭代 `proxy` 会从 `target` 返回对应的值。

我们可以看到，没有任何钩子，`proxy` 是一个 `target` 的透明包装.

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/14/170d948bfea2c89e~tplv-t2oaga2asx-watermark.awebp)

`Proxy` 是一种特殊的“奇异对象”。它没有自己的属性。如果 `handler` 为空，则透明地将操作转发给 `target`。

要激活更多功能，让我们添加钩子。

我们可以用它们拦截什么？

对于对象的大多数操作，JavaScript 规范中都有一个所谓的“内部方法”，它描述了最底层的工作方式。 例如 `[[Get]]`，用于读取属性的内部方法， `[[Set]]`，用于写入属性的内部方法，等等。这些方法仅在规范中使用，我们不能直接通过方法名调用它们。

Proxy 钩子会拦截这些方法的调用。它们在[代理规范](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-proxy-object-internal-methods-and-internal-slots)和下表中列出。

对于每个内部方法，此表中都有一个钩子：可用于添加到 `new Proxy` 时的 `handler` 参数中以拦截操作的方法名称：

| 内部方法                | Handler 方法               | 何时触发                                                     |
| ----------------------- | -------------------------- | ------------------------------------------------------------ |
| `[[Get]]`               | `get`                      | 读取属性                                                     |
| `[[Set]]`               | `set`                      | 写入属性                                                     |
| `[[HasProperty]]`       | `has`                      | `in` 运算符                                                  |
| `[[Delete]]`            | `deleteProperty`           | `delete` 操作                                                |
| `[[Call]]`              | `apply`                    | proxy 对象作为函数被调用                                     |
| `[[Construct]]`         | `construct`                | `new` 操作                                                   |
| `[[GetPrototypeOf]]`    | `getPrototypeOf`           | [Object.getPrototypeOf](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FgetPrototypeOf) |
| `[[SetPrototypeOf]]`    | `setPrototypeOf`           | [Object.setPrototypeOf](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FsetPrototypeOf) |
| `[[IsExtensible]]`      | `isExtensible`             | [Object.isExtensible](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FisExtensible) |
| `[[PreventExtensions]]` | `preventExtensions`        | [Object.preventExtensions](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FpreventExtensions) |
| `[[DefineOwnProperty]]` | `defineProperty`           | [Object.defineProperty](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FdefineProperty), [Object.defineProperties](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FdefineProperties) |
| `[[GetOwnProperty]]`    | `getOwnPropertyDescriptor` | [Object.getOwnPropertyDescriptor](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FgetOwnPropertyDescriptor), `for..in`, `Object.keys/values/entries` |
| `[[OwnPropertyKeys]]`   | `ownKeys`                  | [Object.getOwnPropertyNames](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FgetOwnPropertyNames), [Object.getOwnPropertySymbols](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FgetOwnPropertySymbols), `for..in`, `Object/keys/values/entries` |

Invariants

JavaScript 强制执行某些不变式————当必须由内部方法和钩子来完成操作时。

其中大多数用于返回值：

- `[[Set]]` 如果值已成功写入，则必须返回 `true`，否则返回 `false`。
- `[[Delete]]` 如果已成功删除该值，则必须返回 `true`，否则返回 `false`。
- ……依此类推，我们将在下面的示例中看到更多内容。

还有其他一些不变量，例如：

- `[[GetPrototypeOf]]`, 应用于代理对象的，必须返回与 `[[GetPrototypeOf]]` 应用于被代理对象相同的值。换句话说，读取代理对象的原型必须始终返回被代理对象的原型。

钩子可以拦截这些操作，但是必须遵循这些规则。

不变量确保语言功能的正确和一致的行为。完整的不变量列表在[规范](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-proxy-object-internal-methods-and-internal-slots)。如果您不做奇怪的事情，就不会违反它们。

让我们看看实际示例中的工作原理。

#### 带 “get” 钩子的默认值

最常见的钩子是用于读取/写入属性。

要拦截读取操作，`handler` 应该有 `get(target, property, receiver)` 方法。

读取属性时触发该方法，参数如下：

- `target` —— 是目标对象，该对象作为第一个参数传递给 `new Proxy`，
- `property` —— 目标属性名,
- `receiver` —— 如果目标属性是一个 getter 访问器属性，则 `receiver` 就是本次读取属性所在的 `this` 对象。通常，这就是 `proxy` 对象本身（或者，如果我们从代理继承，则是从该代理继承的对象）。现在我们不需要此参数，因此稍后将对其进行详细说明。

让我们用 `get` 实现对象的默认值。

我们将创建一个对不存在的数组项返回0的数组。

通常，当人们尝试获取不存在的数组项时，他们会得到 `undefined`, 但是我们会将常规数组包装到代理中，以捕获读取操作并在没有此类属性的情况下返回 `0`：

```
let numbers = [0, 1, 2];

numbers = new Proxy(numbers, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 0; // 默认值
    }
  }
});

alert( numbers[1] ); // 1
alert( numbers[123] ); // 0 (没有这样的元素)复制代码
```

如我们所见，使用 `get` 钩子非常容易。

我们可以用 `Proxy` 来实现任何读取默认值的逻辑。

想象一下，我们有一本词典，上面有短语及其翻译：

```
let dictionary = {
  'Hello': 'Hola',
  'Bye': 'Adiós'
};

alert( dictionary['Hello'] ); // Hola
alert( dictionary['Welcome'] ); // undefined复制代码
```

现在，如果没有短语，从 `dictionary` 读取将返回 `undefined`。但实际上，返回一个未翻译短语通常比 `undefined` 要好。因此，让我们在这种情况下返回一个未翻译的短语，而不是 `undefined`。

为此，我们将包装 `dictionary` 进一个拦截读取操作的代理：

```
let dictionary = {
  'Hello': 'Hola',
  'Bye': 'Adiós'
};

dictionary = new Proxy(dictionary, {
  get(target, phrase) { // 拦截读取属性操作
    if (phrase in target) { //如果字典包含该短语
      return target[phrase]; // 返回译文
    } else {
      // 否则返回未翻译的短语
      return phrase;
    }
  }
});

// 在字典中查找任意短语！
// 最坏的情况也只是它们没有被翻译。
alert( dictionary['Hello'] ); // Hola
alert( dictionary['Welcome to Proxy']); // Welcome to Proxy复制代码
```

请注意代理如何覆盖变量：

```
dictionary = new Proxy(dictionary, ...);复制代码
```

代理应该在所有地方都完全替代了目标对象。目标对象被代理后，任何人都不应该再引用目标对象。否则很容易搞砸。

#### 使用 “set” 钩子进行验证

假设我们想要一个专门用于数字的数组。如果添加了其他类型的值，则应该抛出一个错误。

当写入属性时 `set` 钩子触发。

`set(target, property, value, receiver)`:

- `target` —— 是目标对象，该对象作为第一个参数传递给 `new Proxy`，
- `property` —— 目标属性名称，
- `value` —— 目标属性要设置的值，
- `receiver` —— 与 `get` 钩子类似，仅与 setter 访问器相关。

如果写入操作成功，`set` 钩子应该返回 `true`，否则返回 `false`（触发 `TypeError`）。

让我们用它来验证新值：

```
let numbers = [];

numbers = new Proxy(numbers, { // (*)
  set(target, prop, val) { // 拦截写入操作
    if (typeof val == 'number') {
      target[prop] = val;
      return true;
    } else {
      return false;
    }
  }
});

numbers.push(1); // 添加成功
numbers.push(2); // 添加成功
alert("Length is: " + numbers.length); // 2

numbers.push("test"); // TypeError （proxy 的 `set` 操作返回 false）

alert("This line is never reached (error in the line above)");复制代码
```

请注意：Array 的内建方法依然生效！ 值使用 `push` 方法添加入数组。添加值时，`length` 属性会自动增加。我们的代理对象 Proxy 不会破坏任何东西。

我们不必重写诸如 `push` 和 `unshift` 等添加元素的数组方法，就可以在其中添加检查，因为在内部它们使用代理所拦截的 `[[Set]]` 操作。

因此，代码简洁明了。

别忘了返回 `true`

如上所述，要保持不变式。

对于 `set`操作, 它必须在成功写入时返回 `true`。

如果我们忘记这样做或返回任何 falsy值，则该操作将触发 `TypeError`。

#### 使用 “ownKeys” 和 “getOwnPropertyDescriptor” 进行迭代

`Object.keys`，`for..in` 循环和大多数其他遍历对象属性的方法都使用 `[[OwnPropertyKeys]]`内部方法（由 `ownKeys` 钩子拦截) 来获取属性列表。

这些方法在细节上有所不同：

- `Object.getOwnPropertyNames(obj)` 返回非 Symbol 键。
- `Object.getOwnPropertySymbols(obj)` 返回 symbol 键。
- `Object.keys/values()` 返回带有 `enumerable` 标记的非 Symbol 键值对（属性标记在章节 属性标志和属性描述符 有详细描述).
- `for..in` 循环遍历所有带有 `enumerable` 标记的非 Symbol 键，以及原型对象的键。

……但是所有这些都从该列表开始。

在下面的示例中，我们使用 `ownKeys` 钩子拦截 `for..in` 对 `user` 的遍历，还使用 `Object.keys` 和 `Object.values` 来跳过以下划线 `_` 开头的属性：

```
let user = {
  name: "John",
  age: 30,
  _password: "***"
};

user = new Proxy(user, {
  ownKeys(target) {
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// "ownKeys" 过滤掉 _password
for(let key in user) alert(key); // name，然后是 age

// 对这些方法同样有效：
alert( Object.keys(user) ); // name,age
alert( Object.values(user) ); // John,30复制代码
```

到目前为止，它仍然有效。

虽然，如果我们返回对象中不存在的键，`Object.keys` 并不会列出该键：

```
let user = { };

user = new Proxy(user, {
  ownKeys(target) {
    return ['a', 'b', 'c'];
  }
});

alert( Object.keys(user) ); // <empty>复制代码
```

为什么？原因很简单：`Object.keys` 仅返回带有 `enumerable` 标记的属性。为了检查它， 该方法会对每个属性调用 `[[GetOwnProperty]]` 来获得属性描述符。在这里，由于没有属性，其描述符为空，没有 `enumerable` 标记，因此它将略过。

为了让 `Object.keys` 返回一个属性，我们要么需要将该属性及 `enumerable` 标记存入对象，或者我们可以拦截对它的调用 `[[GetOwnProperty]]` (钩子`getOwnPropertyDescriptor` 会执行此操作)，并返回描述符enumerable: true。

这是一个例子：

```
let user = { };

user = new Proxy(user, {
  ownKeys(target) { // 一旦被调用，就返回一个属性列表
    return ['a', 'b', 'c'];
  },

  getOwnPropertyDescriptor(target, prop) { // 被每个属性调用
    return {
      enumerable: true,
      configurable: true
      /* 其他属性，类似于 "value:..." */
    };
  }

});

alert( Object.keys(user) ); // a, b, c复制代码
```

让我们再次注意：如果该属性在对象中不存在，则我们只需要拦截 `[[GetOwnProperty]]`。

#### 具有 “deleteProperty” 和其他钩子的受保护属性

有一个普遍的约定，即下划线 `_` 前缀的属性和方法是内部的。不应从对象外部访问它们。

从技术上讲，这是可能的：

```
let user = {
  name: "John",
  _password: "secret"
};

alert(user._password); // secret复制代码
```

让我们使用代理来防止对以 `_` 开头的属性的任何访问。

我们需要以下钩子：

- `get` 读取此类属性时抛出错误，
- `set` 写入属性时抛出错误，
- `deleteProperty` 删除属性时抛出错误，
- `ownKeys` 在使用 `for..in` 和类似 `Object.keys` 的方法时排除以 `_` 开头的属性。

代码如下：

```
let user = {
  name: "John",
  _password: "***"
};

user = new Proxy(user, {
  get(target, prop) {
    if (prop.startsWith('_')) {
      throw new Error("Access denied");
    }
    let value = target[prop];
    return (typeof value === 'function') ? value.bind(target) : value; // (*)
  },
  set(target, prop, val) { // 拦截写入操作
    if (prop.startsWith('_')) {
      throw new Error("Access denied");
    } else {
      target[prop] = val;
      return true;
    }
  },
  deleteProperty(target, prop) { // 拦截属性删除
    if (prop.startsWith('_')) {
      throw new Error("Access denied");
    } else {
      delete target[prop];
      return true;
    }
  },
  ownKeys(target) { // 拦截读取属性列表
    return Object.keys(target).filter(key => !key.startsWith('_'));
  }
});

// “get” 不允许读取 _password
try {
  alert(user._password); // Error: Access denied
} catch(e) { alert(e.message); }

//  “set” 不允许写入 _password
try {
  user._password = "test"; // Error: Access denied
} catch(e) { alert(e.message); }

// “deleteProperty” 不允许删除 _password 属性
try {
  delete user._password; // Error: Access denied
} catch(e) { alert(e.message); }

// “ownKeys” 过滤排除 _password
for(let key in user) alert(key); // name复制代码
```

请注意在行 `(*)` 中 `get` 钩子的重要细节：

```
get(target, prop) {
  // ...
  let value = target[prop];
  return (typeof value === 'function') ? value.bind(target) : value; // (*)
}复制代码
```

为什么我们需要一个函数调用 `value.bind(target)`？

原因是对象方法（例如 `user.checkPassword()`）必须能够访问 `_password`：

```
user = {
  // ...
  checkPassword(value) {
    //对象方法必须能读取 _password
    return value === this._password;
  }
}复制代码
```

对 `user.checkPassword()` 的一个调用会调用代理对象 `user` 作为 `this`（点运算符之前的对象会成为 `this`），因此，当它尝试访问 `this._password` 时 `get` 钩子将激活（它在读取任何属性时触发）并抛出错误。

因此，我们在行 `(*)` 中将对象方法的上下文绑定到原始对象，`target`。然后，它们将来的调用将使用 `target` 作为 `this`，不触发任何钩子。

该解决方案通常可行，但并不理想，因为一种方法可能会将未代理的对象传递到其他地方，然后我们会陷入困境：原始对象在哪里，代理的对象在哪里？

此外，一个对象可能会被代理多次（多个代理可能会对该对象添加不同的“调整”），并且如果我们将未包装的对象传递给方法，则可能会产生意想不到的后果。

因此，在任何地方都不应使用这种代理。

类的私有属性

现代 Javascript 引擎原生支持私有属性，其以 `#` 作为前缀。这在章节 私有的和受保护的属性和方法 中有详细描述。Proxy并不是必需的。

但是，此类属性有其自身的问题。特别是，它们是不可继承的。

#### “In range” 及 “has” 钩子

让我们来看更多示例。

我们有一个 range 对象：

```
let range = {
  start: 1,
  end: 10
};复制代码
```

我们想使用 `in` 运算符来检查数字是否在 `range` 范围内。

该 `has` 钩子拦截 `in` 调用。

```
has(target, property)
```

- `target` —— 是目标对象，作为第一个参数传递给 `new Proxy`
- `property` —— 属性名称

示例如下

```
let range = {
  start: 1,
  end: 10
};

range = new Proxy(range, {
  has(target, prop) {
    return prop >= target.start && prop <= target.end
  }
});

alert(5 in range); // true
alert(50 in range); // false复制代码
```

漂亮的语法糖，不是吗？而且实现起来非常简单。

#### 包装函数："apply"

我们也可以将代理包装在函数周围。

`apply(target, thisArg, args)` 钩子能使代理以函数的方式被调用：

- `target` 是目标对象（函数是 JavaScript 中的对象）
- `thisArg` 是 `this` 的值
- `args` 是参数列表

例如，让我们回想一下 `delay(f, ms)` 装饰器，它是我们在 [装饰者模式，call/apply ](https://juejin.cn/post/6844904089680084999)一章中完成的。

在该章中，我们没有用 proxy 来实现它。调用 `delay(f, ms)` 返回一个函数，该函数会将在 `ms`毫秒后把所有调用转发到 `f`。

这是以前的基于函数的实现：

```
function delay(f, ms) {
  // 返回一个超时后调用 f 函数的包装器
  return function() { // (*)
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// 这次包装后，sayHi 在3秒后被调用
sayHi = delay(sayHi, 3000);

sayHi("John"); // Hello, John! （3秒后）复制代码
```

正如我们已经看到的那样，大多数情况下都是可行的。包装函数 `(*)` 在超时后执行调用。

但是包装函数不会转发属性读/写操作或其他任何操作。包装后，无法访问原有函数的属性，比如 `name`，`length`和其他：

```
function delay(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

alert(sayHi.length); // 1 （函数的 length 是其声明中的参数个数）

sayHi = delay(sayHi, 3000);

alert(sayHi.length); // 0 （在包装器声明中，参数个数为0)复制代码
```

`Proxy` 功能强大得多，因为它将所有东西转发到目标对象。

让我们使用 `Proxy` 而不是包装函数：

```
function delay(f, ms) {
  return new Proxy(f, {
    apply(target, thisArg, args) {
      setTimeout(() => target.apply(thisArg, args), ms);
    }
  });
}

function sayHi(user) {
  alert(`Hello, ${user}!`);
}

sayHi = delay(sayHi, 3000);

alert(sayHi.length); // 1 (*) proxy 转发“获取 length” 操作到目标对象

sayHi("John"); // Hello, John! （3秒后）复制代码
```

结果是相同的，但现在不仅调用，而且代理上的所有操作都转发到原始函数。所以sayHi.length在 `(*)` 行包装后正确返回结果(*)。

我们有一个“更丰富”的包装器。

还存在其他钩子：完整列表在本章的开头。它们的使用模式与上述类似。

#### Reflect

`Reflect` 是一个内置对象，可简化的创建 `Proxy`。

以前的内部方法，比如`[[Get]]`，`[[Set]]` 等等都只是规范，不能直接调用。

`Reflect` 对象使调用这些内部方法成为可能。它的方法是内部方法的最小包装。

这是 `Reflect` 执行相同操作和调用的示例：

| 操作                | `Reflect` 调用                      | 内部方法        |
| ------------------- | ----------------------------------- | --------------- |
| `obj[prop]`         | `Reflect.get(obj, prop)`            | `[[Get]]`       |
| `obj[prop] = value` | `Reflect.set(obj, prop, value)`     | `[[Set]]`       |
| `delete obj[prop]`  | `Reflect.deleteProperty(obj, prop)` | `[[Delete]]`    |
| `new F(value)`      | `Reflect.construct(F, value)`       | `[[Construct]]` |
| …                   | …                                   | …               |

例如：

```
let user = {};

Reflect.set(user, 'name', 'John');

alert(user.name); // John复制代码
```

尤其是，`Reflect` 允许我们使用函数（`Reflect.construct`，`Reflect.deleteProperty`，……）执行操作（`new`，`delete`，……）。这是一个有趣的功能，但是这里还有一点很重要。

**对于每个可被 `Proxy` 捕获的内部方法，`Reflect` 都有一个对应的方法 Reflect，其名称和参数与 `Proxy` 钩子相同。**

因此，我们可以用 `Reflect` 来将操作转发到原始对象。

在此示例中，钩子`get` 和 `set` 透明地（好像它们都不存在）将读/写操作转发到对象，并显示一条消息：

```
let user = {
  name: "John",
};

user = new Proxy(user, {
  get(target, prop, receiver) {
    alert(`GET ${prop}`);
    return Reflect.get(target, prop, receiver); // (1)
  },
  set(target, prop, val, receiver) {
    alert(`SET ${prop}=${val}`);
    return Reflect.set(target, prop, val, receiver); // (2)
  }
});

let name = user.name; // shows "GET name"
user.name = "Pete"; // shows "SET name=Pete"复制代码
```

这里:

- `Reflect.get` 读取一个对象属性
- `Reflect.set` 写入对象属性，成功返回 `true` ，否则返回 `false`

就是说，一切都很简单：如果钩子想要将调用转发给对象，则只需使用相同的参数调用 `Reflect.<method>` 就足够了。

在大多数情况下，我们可以不使用 `Reflect` 完成相同的事情，例如，使用`Reflect.get(target, prop, receiver)` 读取属性可以替换为 `target[prop]`。尽管有一些细微的差别。

#### 代理一个 getter

让我们看一个示例，说明为什么 `Reflect.get` 更好。我们还将看到为什么 `get/set` 有第四个参数 `receiver`，而我们以前没有使用过它。

我们有一个带有一个 `_name` 属性和一个 getter 的对象 `user`。

这是一个 Proxy：

```
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop];
  }
});

alert(userProxy.name); // Guest复制代码
```

该 `get` 钩子在这里是“透明的”，它返回原来的属性，不会做别的任何事情。对于我们的示例而言，这就足够了。

一切似乎都很好。但是让我们将示例变得更加复杂。

另一个对象 `admin`从 `user` 继承后，我们可以观察到错误的行为：

```
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]; // (*) target = user
  }
});

let admin = {
  __proto__: userProxy,
  _name: "Admin"
};

// Expected: Admin
alert(admin.name); // 输出：Guest （？！？）复制代码
```

读取 `admin.name` 应该返回 `"Admin"`，而不是 `"Guest"`！

怎么了？也许我们在继承方面做错了什么？

但是，如果我们删除代理，那么一切都会按预期进行。

问题实际上出在代理中，在 `(*)`行。

1. 当我们读取 `admin.name`，由于 `admin` 对象自身没有对应的的属性，搜索将转到其原型。

2. 原型是 `userProxy`。

3. 从代理读取 `name` 属性时，`get` 钩子会触发并从原始对象返回 `target[prop]` 属性，在 `(*)`行

   当调用 `target[prop]` 时，若 `prop` 是一个 getter，它将在 `this=target` 上下文中运行其代码。因此，结果是来自原始对象 `target` 的 `this._name` 即来自 `user`。

为了解决这种情况，我们需要 `get` 钩子的第三个参数 `receiver`。它保证传递正确的 `this` 给 getter。在我们的情况下是 `admin`。

如何为 getter 传递上下文？对于常规函数，我们可以使用 `call/apply`，但这是一个 getter，它不是“被调用”的，只是被访问的。

`Reflect.get` 可以做到的。如果我们使用它，一切都会正常运行。

这是更正后的变体：

```
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

let userProxy = new Proxy(user, {
  get(target, prop, receiver) { // receiver = admin
    return Reflect.get(target, prop, receiver); // (*)
  }
});


let admin = {
  __proto__: userProxy,
  _name: "Admin"
};

alert(admin.name); // Admin复制代码
```

现在 `receiver`，保留了对正确 `this` 的引用（即`admin`）的引用，该引用将在 `(*)` 行中使用`Reflect.get`传递给getter。

我们可以将钩子重写得更短：

```
get(target, prop, receiver) {
  return Reflect.get(...arguments);
}复制代码
```

`Reflect` 调用的命名方式与钩子完全相同，并且接受相同的参数。它们是通过这种方式专门设计的。

因此， `return Reflect...` 会提供一个安全的提示程序来转发操作，并确保我们不会忘记与此相关的任何内容。

#### Proxy 的局限

代理提供了一种独特的方法，可以在最底层更改或调整现有对象的行为。但是，它并不完美。有局限性。

#### 内置对象：内部插槽（Internal slots）

许多内置对象，例如 `Map`, `Set`, `Date`, `Promise` 等等都使用了所谓的 “内部插槽”。

它们类似于属性，但仅限于内部使用，仅用于规范目的。例如， `Map` 将项目存储在 `[[MapData]]`中。内置方法直接访问它们，而不通过 `[[Get]]/[[Set]]` 内部方法。所以 `Proxy` 不能拦截。

为什么要在意呢？他们是内部的！

好吧，这就是问题。在像这样的内置对象被代理后，代理对象没有这些内部插槽，因此内置方法将失败。

例如：

```
let map = new Map();

let proxy = new Proxy(map, {});

proxy.set('test', 1); // Error复制代码
```

在内部，一个 `Map` 将所有数据存储在其 `[[MapData]]` 内部插槽中。代理对象没有这样的插槽。[内建方法 `Map.prototype.set`](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-map.prototype.set) 方法试图访问内部属性 `this.[[MapData]]`，但由于 `this=proxy` 在 `proxy` 中不能找到它，只能失败。

幸运的是，有一种解决方法：

```
let map = new Map();

let proxy = new Proxy(map, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == 'function' ? value.bind(target) : value;
  }
});

proxy.set('test', 1);
alert(proxy.get('test')); // 1 (works!)复制代码
```

现在它可以正常工作，因为 `get` 钩子将函数属性（例如 `map.set`）绑定到目标对象（`map`）本身。

与前面的示例不同，`proxy.set(...)` 内部 `this` 的值并不是 `proxy`，而是原始对象 `map`。因此，当`set` 钩子的内部实现尝试访问 `this.[[MapData]]` 内部插槽时，它会成功。

`Array` 没有内部插槽

一个明显的例外：内置 `Array` 不使用内部插槽。那是出于历史原因，因为它出现于很久以前。

因此，代理数组时没有这种问题。

#### 私有字段

类的私有字段也会发生类似的情况。

例如，`getName()` 方法访问私有的 `#name` 属性并在代理后中断：

```
class User {
  #name = "Guest";

  getName() {
    return this.#name;
  }
}

let user = new User();

user = new Proxy(user, {});

alert(user.getName()); // Error复制代码
```

原因是专用字段是使用内部插槽实现的。JavaScript 访问它们时不使用 `[[Get]]/[[Set]]`。

在调用 `getName()` 时 `this` 的值是代理后的 `user`，它没有带私有字段的插槽。

再次，bind 方法的解决方案使它恢复正常：

```
class User {
  #name = "Guest";

  getName() {
    return this.#name;
  }
}

let user = new User();

user = new Proxy(user, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == 'function' ? value.bind(target) : value;
  }
});

alert(user.getName()); // Guest复制代码
```

该解决方案有缺点，如前所述：将原始对象暴露给该方法，可能使其进一步传递并破坏其他代理功能。

#### Proxy != target

代理和原始对象是不同的对象。很自然吧？

因此，如果我们使用原始对象作为键，然后对其进行代理，则找不到代理：

```
let allUsers = new Set();

class User {
  constructor(name) {
    this.name = name;
    allUsers.add(this);
  }
}

let user = new User("John");

alert(allUsers.has(user)); // true

user = new Proxy(user, {});

alert(allUsers.has(user)); // false复制代码
```

如我们所见，代理后，我们在 `allUsers` 中找不到 `user`，因为代理是一个不同的对象。

Proxy 无法拦截严格相等性测试 `===`

Proxy 可以拦截许多运算符，例如new（使用 `construct`），in（使用 `has`），delete（使用 `deleteProperty`）等。

但是没有办法拦截对象的严格相等性测试。一个对象严格只等于自身，没有其他值。

因此，比较对象是否相等的所有操作和内置类都会区分 target 和 proxy。这里没有透明的替代品。

#### 可取消的 Proxy

一个 

可撤销

 的代理是可以被禁用的代理。



假设我们有一个资源，并且想随时关闭对该资源的访问。

我们可以做的是将其包装成可撤销的代理，而没有任何钩子。这样的代理会将操作转发给对象，我们可以随时将其禁用。

语法为：

```
let {proxy, revoke} = Proxy.revocable(target, handler)复制代码
```

该调用返回一个带有 `proxy` 和 `revoke` 函数的对象以将其禁用。

这是一个例子：

```
let object = {
  data: "Valuable data"
};

let {proxy, revoke} = Proxy.revocable(object, {});

// proxy 正常工作
alert(proxy.data); // Valuable data

// 之后某处调用
revoke();

// proxy 不再工作（已吊销）
alert(proxy.data); // Error复制代码
```

调用 `revoke()` 会从代理中删除对目标对象的所有内部引用，因此不再连接它们。之后可以对目标对象进行垃圾回收。

我们还可以将 `revoke` 存储在 `WeakMap` 中，以便能够通过代理对象轻松找到它：

```
let revokes = new WeakMap();

let object = {
  data: "Valuable data"
};

let {proxy, revoke} = Proxy.revocable(object, {});

revokes.set(proxy, revoke);

// ..later in our code..
revoke = revokes.get(proxy);
revoke();

alert(proxy.data); // Error（已吊销）复制代码
```

这种方法的好处是我们不必随身携带revoke。我们可以在需要时从 map `proxy` 上获取它。

此处我们使用`WeakMap` 而不是 `Map` ，因为它不会阻止垃圾收集。如果代理对象变得“无法访问”（例如，没有变量再引用它），则 `WeakMap` 允许将其与 它的 `revoke` 对象一起从内存中擦除，因为我们不再需要它了。

#### 参考文献

- 规范: [Proxy](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-proxy-object-internal-methods-and-internal-slots).
- MDN: [Proxy](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy).

#### 总结

`Proxy` 是对象的包装，将代理上的操作转发到对象，并可以选择捕获其中的一些操作。

它可以包装任何类型的对象，包括类和函数。

语法为：

```
let proxy = new Proxy(target, {
  /* traps */
});复制代码
```

……然后，我们应该在所有地方使用 `proxy` 而不是 `target`。代理没有自己的属性或方法。如果提供了钩子，它将捕获操作，否则将其转发给 `target` 对象。

我们可以捕获：

- 读取（`get`），写入（`set`），删除（`deleteProperty`）属性（甚至是不存在的属性）。
- 函数调用（`apply` 钩子）。
- `new` 操作（`construct` 钩子）。
- 许多其他操作（完整列表在本文开头和 [docs](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy) 中）。

这使我们能够创建“虚拟”属性和方法，实现默认值，可观察对象，函数装饰器等等。

我们还可以将对象多次包装在不同的代理中，并用多个函数进行装饰。

该[Reflect](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FReflect) API旨在补充 [Proxy](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy)。对于任何 `Proxy` 钩子，都有一个带有相同参数的 `Reflect` 调用。我们应该使用它们将调用转发给目标对象。

Proxy 有一些局限：

- 内置对象具有“内部插槽”，对这些对象的访问无法被代理。请参阅上面的解决方法。
- 私有类字段也是如此，因为它们是在内部使用插槽实现的。因此，代理方法的调用必须具有目标对象 `this` 才能访问它们。
- 对象相等性测试 `===` 不能被拦截。
- 性能：基准测试取决于引擎，但通常使用最简单的代理访问属性所需的时间要长几倍。实际上，这仅对某些“瓶颈”对象重要。

#### 几个小实例任务

#### 读取不存在的属性时出错

通常，尝试读取不存在的属性会返回 `undefined`。

创建一个代理，在尝试读取不存在的属性时该代理抛出错误。

这可以帮助及早发现编程错误。

编写一个接受 `target` 对象，并返回添加此方面功能的 proxy 的 `wrap(target)` 函数。

应满足如下结果：

```
let user = {
  name: "John"
};

function wrap(target) {
  return new Proxy(target, {
      /* 你的代码 */
  });
}

user = wrap(user);

alert(user.name); // John
alert(user.age); // 错误：属性不存在复制代码
```

解决方案

```
let user = {
  name: "John"
};

function wrap(target) {
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      } else {
        throw new ReferenceError(`Property doesn't exist: "${prop}"`)
      }
    }
  });
}

user = wrap(user);

alert(user.name); // John
alert(user.age); // ReferenceError: Property doesn't exist复制代码
```

#### 用-1索引访问数组

在某些编程语言中，我们可以使用从结尾算起的负索引访问数组元素。

像这样：

```
let array = [1, 2, 3];

array[-1]; // 3，最后一个元素
array[-2]; // 2，从末尾开始向前移动一步
array[-3]; // 1，从末尾开始向前移动两步复制代码
```

换句话说，`array[-N]` 与 `array[array.length - N]` 相同。

创建一个 proxy 来实现该行为。

那应该是这样的：

```
let array = [1, 2, 3];

array = new Proxy(array, {
  /* your code */
});

alert( array[-1] ); // 3
alert( array[-2] ); // 2

// 其他数组也应该适用于这个功能复制代码
```

解决方案

```
let array = [1, 2, 3];

array = new Proxy(array, {
  get(target, prop, receiver) {
    if (prop < 0) {
      // even if we access it like arr[1]
      // prop is a string, so need to convert it to number
      prop = +prop + target.length;
    }
    return Reflect.get(target, prop, receiver);
  }
});


alert(array[-1]); // 3
alert(array[-2]); // 2复制代码
```

#### Observable

创建一个通过返回代理“使对象可观察”的 `makeObservable(target)` 函数。

它的工作方式如下：

```
function makeObservable(target) {
  /* your code */
}

let user = {};
user = makeObservable(user);

user.observe((key, value) => {
  alert(`SET ${key}=${value}`);
});

user.name = "John"; // alerts：设置 name 属性为 John复制代码
```

换句话说，`makeObservable` 返回的对象就像原始对象一样，但是也具有将 `handler` 函数设置为在任何属性更改时都被调用的方法 `observe(handler)` 。

每当属性更改时，都会使用属性的名称和值调用 `handler(key, value)` 。

P.S. 在此任务中，请仅注意写入属性。可以以类似方式实现其他操作。

解决方案

该解决方案包括两部分：

1. 无论 `.observe(handler)` 何时被调用，我们都需要在某个地方记住 handler，以便以后可以调用它。我们可以使用 Symbol 作为属性键，将 handler 直接存储在对象中。
2. 我们需要一个带 `set` 钩子的 proxy 来在发生任何更改时调用处理程序。

```
let handlers = Symbol('handlers');

function makeObservable(target) {
  // 1. 初始化 handler 存储数组
  target[handlers] = [];

  // 存储 handler 函数到数组中以便于未来调用
  target.observe = function(handler) {
    this[handlers].push(handler);
  };

  // 2. 创建代理以处理更改
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let success = Reflect.set(...arguments); // 转发写入操作到目标对象
      if (success) { // 如果设置属性的时候没有报错
        // 调用所有 handler
        target[handlers].forEach(handler => handler(property, value));
      }
      return success;
    }
  });
}

let user = {};

user = makeObservable(user);

user.observe((key, value) => {
  alert(`SET ${key}=${value}`);
});

user.name = "John";
```

## Promise

### 一、Promise 核心逻辑实现

我们先简单实现一下 Promise 的基础功能。先看原生 Promise 实现的 🌰，第一步我们要完成相同的功能。

原生🌰 👇

```js
const promise = new Promise((resolve, reject) => {
   resolve('success')
   reject('err')
})

promise.then(value => {
  console.log('resolve', value)
}, reason => {
  console.log('reject', reason)
})

// 输出 resolve success
复制代码
```

我们来分析一下**基本原理**：

> 1. Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行
> 2. Promise 会有三种状态
>    - Pending 等待
>    - Fulfilled 完成
>    - Rejected 失败
> 3. 状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
> 4. Promise 中使用 resolve 和 reject 两个函数来更改状态；
> 5. then 方法内部做但事情就是状态判断
>    - 如果状态是成功，调用成功回调函数
>    - 如果状态是失败，调用失败回调函数

**下面开始实现**：

#### 1. 新建 MyPromise 类，传入执行器 executor

```js
// 新建 MyPromise.js

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    executor() 
  }
}
复制代码
```

#### 2. executor 传入 resolve 和 reject 方法

```js
// MyPromise.js

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject) 
  }
  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 更改成功后的状态
  resolve = () => {}
  // 更改失败后的状态
  reject = () => {}
}
复制代码
```

#### 3. 状态与结果的管理

```js
// MyPromise.js

// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
    }
  }
}

复制代码
```

#### 4. then 的简单实现

```js
// MyPromise.js

then(onFulfilled, onRejected) {
  // 判断状态
  if (this.status === FULFILLED) {
    // 调用成功回调，并且把值返回
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    // 调用失败回调，并且把原因返回
    onRejected(this.reason);
  }
}
复制代码
```

#### 5. 使用 module.exports 对外暴露 MyPromise 类

```js
// MyPromise.js
module.exports = MyPromise;
复制代码
```

看一下我们目前实现的**完整代码**🥳

```js
// MyPromise.js

// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    executor(this.resolve, this.reject)
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
    }
  }

  then(onFulfilled, onRejected) {
    // 判断状态
    if (this.status === FULFILLED) {
      // 调用成功回调，并且把值返回
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      onRejected(this.reason);
    }
  }
}

module.exports = MyPromise
复制代码
```

使用我的手写代码执行一下上面那个🌰

```js
// 新建 test.js

// 引入我们的 MyPromise.js
const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
   resolve('success')
   reject('err')
})

promise.then(value => {
  console.log('resolve', value)
}, reason => {
  console.log('reject', reason)
})

// 执行结果：resolve success
复制代码
```

执行结果符合我们的预期，第一步完成了👏👏👏

### 二、在 Promise 类中加入异步逻辑

上面还没有经过异步处理，如果有异步逻辑加如来会带来一些问题，例如：

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000); 
})

promise.then(value => {
  console.log('resolve', value)
}, reason => {
  console.log('reject', reason)
})

// 没有打印信息！！！
复制代码
```

**分析原因**：

> 主线程代码立即执行，setTimeout 是异步代码，then 会马上执行，这个时候判断 Promise 状态，状态是 Pending，然而之前并没有判断等待这个状态

这里就需要我们处理一下 Pending 状态，我们改造一下之前的代码 🤔

#### 1. 缓存成功与失败回调

```js
// MyPromise.js

// MyPromise 类中新增
// 存储成功回调函数
onFulfilledCallback = null;
// 存储失败回调函数
onRejectedCallback = null;
复制代码
```

#### 2. then 方法中的 Pending 的处理

```js
// MyPromise.js

then(onFulfilled, onRejected) {
  // 判断状态
  if (this.status === FULFILLED) {
    // 调用成功回调，并且把值返回
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    // 调用失败回调，并且把原因返回
    onRejected(this.reason);
  } else if (this.status === PENDING) {
    // ==== 新增 ====
    // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
    // 等到执行成功失败函数的时候再传递
    this.onFulfilledCallback = onFulfilled;
    this.onRejectedCallback = onRejected;
  }
}
复制代码
```

#### 3. resolve 与 reject 中调用回调函数

```js
// MyPromise.js

// 更改成功后的状态
resolve = (value) => {
  // 只有状态是等待，才执行状态修改
  if (this.status === PENDING) {
    // 状态修改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // ==== 新增 ====
    // 判断成功回调是否存在，如果存在就调用
    this.onFulfilledCallback && this.onFulfilledCallback(value);
  }
}
复制代码
// MyPromise.js
// 更改失败后的状态
reject = (reason) => {
  // 只有状态是等待，才执行状态修改
  if (this.status === PENDING) {
    // 状态成功为失败
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // ==== 新增 ====
    // 判断失败回调是否存在，如果存在就调用
    this.onRejectedCallback && this.onRejectedCallback(reason)
  }
}
复制代码
```

我们再执行一下上面的🌰

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000); 
})

promise.then(value => {
  console.log('resolve', value)
}, reason => {
  console.log('reject', reason)
})

// 等待 2s 输出 resolve success
复制代码
```

目前已经可以简单处理异步问题了✌️

### 三、实现 then 方法多次调用添加多个处理函数

> Promise 的 then 方法是可以被多次调用的。这里如果有三个 then 的调用，如果是同步回调，那么直接返回当前的值就行；如果是异步回调，那么保存的成功失败的回调，需要用不同的值保存，因为都互不相同。之前的代码需要改进。

同样的先看一个🌰

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000); 
})

promise.then(value => {
  console.log(1)
  console.log('resolve', value)
})
 
promise.then(value => {
  console.log(2)
  console.log('resolve', value)
})

promise.then(value => {
  console.log(3)
  console.log('resolve', value)
})

// 3
// resolve success

复制代码
```

目前的代码只能输出：`3 resolve success`，怎么可以把 1、2 弄丢呢！

我们应该一视同仁，保证所有 then 中的回调函数都可以执行 🤔 继续改造

#### 1. MyPromise 类中新增两个数组

```js
// MyPromise.js

// 存储成功回调函数
// onFulfilledCallback = null;
onFulfilledCallbacks = [];
// 存储失败回调函数
// onRejectedCallback = null;
onRejectedCallbacks = [];
复制代码
```

#### 2. 回调函数存入数组中

```js
// MyPromise.js

then(onFulfilled, onRejected) {
  // 判断状态
  if (this.status === FULFILLED) {
    // 调用成功回调，并且把值返回
    onFulfilled(this.value);
  } else if (this.status === REJECTED) {
    // 调用失败回调，并且把原因返回
    onRejected(this.reason);
  } else if (this.status === PENDING) {
    // ==== 新增 ====
    // 因为不知道后面状态的变化，这里先将成功回调和失败回调存储起来
    // 等待后续调用
    this.onFulfilledCallbacks.push(onFulfilled);
    this.onRejectedCallbacks.push(onRejected);
  }
}
复制代码
```

#### 3. 循环调用成功和失败回调

```js
// MyPromise.js

// 更改成功后的状态
resolve = (value) => {
  // 只有状态是等待，才执行状态修改
  if (this.status === PENDING) {
    // 状态修改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // ==== 新增 ====
    // resolve里面将所有成功的回调拿出来执行
    while (this.onFulfilledCallbacks.length) {
      // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
      this.onFulfilledCallbacks.shift()(value)
    }
  }
}
复制代码
// MyPromise.js

// 更改失败后的状态
reject = (reason) => {
  // 只有状态是等待，才执行状态修改
  if (this.status === PENDING) {
    // 状态成功为失败
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // ==== 新增 ====
    // resolve里面将所有失败的回调拿出来执行
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(reason)
    }
  }
}
复制代码
```

再来运行一下，看看结果👇

```js
1
resolve success
2
resolve success
3
resolve success
复制代码
```

👏👏👏 完美，继续

### 四、实现 then 方法的链式调用

> then 方法要链式调用那么就需要返回一个 Promise 对象
>  then 方法里面 return 一个返回值作为下一个 then 方法的参数，如果是 return 一个 Promise 对象，那么就需要判断它的状态

举个栗子 🌰

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  // 目前这里只处理同步的问题
  resolve('success')
})

function other () {
  return new MyPromise((resolve, reject) =>{
    resolve('other')
  })
}
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  return other()
}).then(value => {
  console.log(2)
  console.log('resolve', value)
})
复制代码
```

用目前的手写代码运行的时候会报错 😣 无法链式调用

```js
}).then(value => {
  ^

TypeError: Cannot read property 'then' of undefined
复制代码
```

接着改 💪

```js
// MyPromise.js

class MyPromise {
  ......
  then(onFulfilled, onRejected) {
    // ==== 新增 ====
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      // 这里的内容在执行器中，会立即执行
      if (this.status === FULFILLED) {
        // 获取成功回调函数的执行结果
        const x = onFulfilled(this.value);
        // 传入 resolvePromise 集中处理
        resolvePromise(x, resolve, reject);
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    }) 
    
    return promise2;
  }
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}
复制代码
```

执行一下，结果👇

```js
1
resolve success
2
resolve other
复制代码
```

em... 符合预期 😎

### 五、then 方法链式调用识别 Promise 是否返回自己

> 如果 then 方法返回的是自己的 Promise 对象，则会发生循环调用，这个时候程序会报错

例如下面这种情况👇

```js
// test.js

const promise = new Promise((resolve, reject) => {
  resolve(100)
})
const p1 = promise.then(value => {
  console.log(value)
  return p1
})
复制代码
```

使用原生 Promise 执行这个代码，会报类型错误

```js
100
Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
复制代码
```

我们在 MyPromise 实现一下

```js
// MyPromise.js

class MyPromise {
  ......
  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        const x = onFulfilled(this.value);
        // resolvePromise 集中处理，将 promise2 传入
        resolvePromise(promise2, x, resolve, reject);
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    }) 
    
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise) {
    x.then(resolve, reject)
  } else{
    resolve(x)
  }
}
复制代码
```

执行一下，竟然报错了 😱

```js
        resolvePromise(promise2, x, resolve, reject);
                       ^

ReferenceError: Cannot access 'promise2' before initialization
复制代码
```

为啥会报错呢？从错误提示可以看出，我们必须要等 promise2 完成初始化。这个时候我们就要用上宏微任务和事件循环的知识了，这里就需要创建一个异步函数去等待 promise2 完成初始化，前面我们已经确认了创建微任务的技术方案 --> `queueMicrotask`

```js
// MyPromise.js

class MyPromise {
  ......
  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // ==== 新增 ====
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        })  
      } else if (this.status === REJECTED) {
      ......
    }) 
    
    return promise2;
  }
}
复制代码
```

执行一下

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
    resolve('success')
})
 
// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
const p1 = promise.then(value => {
   console.log(1)
   console.log('resolve', value)
   return p1
})
 
// 运行的时候会走reject
p1.then(value => {
  console.log(2)
  console.log('resolve', value)
}, reason => {
  console.log(3)
  console.log(reason.message)
})
复制代码
```

这里得到我们的结果 👇

```js
1
resolve success
3
Chaining cycle detected for promise #<Promise>
复制代码
```

哈哈，搞定 😎 开始下一步

### 六、捕获错误及 then 链式调用其他状态代码补充

目前还缺少重要的一个环节，就是我们的错误捕获还没有处理

#### 1. 捕获执行器错误

> 捕获执行器中的代码，如果执行器中有代码错误，那么 Promise 的状态要变为失败

```js
// MyPromise.js

constructor(executor){
  // ==== 新增 ====
  // executor 是一个执行器，进入会立即执行
  // 并传入resolve和reject方法
  try {
    executor(this.resolve, this.reject)
  } catch (error) {
    // 如果有错误，就直接执行 reject
    this.reject(error)
  }
}
复制代码
```

验证一下：

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
    // resolve('success')
    throw new Error('执行器错误')
})
 
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
}, reason => {
  console.log(2)
  console.log(reason.message)
})
复制代码
```

执行结果 👇

```js
2
执行器错误
复制代码
```

OK，通过 😀

#### 2. then 执行的时错误捕获

```js
// MyPromise.js

then(onFulfilled, onRejected) {
  // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
  const promise2 = new MyPromise((resolve, reject) => {
    // 判断状态
    if (this.status === FULFILLED) {
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        // ==== 新增 ====
        try {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        }  
      })  
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      onRejected(this.reason);
    } else if (this.status === PENDING) {
      // 等待
      // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  }) 
  
  return promise2;
}
复制代码
```

验证一下：

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
    resolve('success')
    // throw new Error('执行器错误')
 })
 
// 第一个then方法中的错误要在第二个then方法中捕获到
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  throw new Error('then error')
}, reason => {
  console.log(2)
  console.log(reason.message)
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})
复制代码
```

执行结果 👇

```js
1
resolve success
4
then error
复制代码
```

这里成功打印了1中抛出的错误 `then error`

### 七、参考 fulfilled 状态下的处理方式，对 rejected 和 pending 状态进行改造

**改造内容包括：**

> 1. 增加异步状态下的链式调用
> 2. 增加回调函数执行结果的判断
> 3. 增加识别 Promise 是否返回自己
> 4. 增加错误捕获

```js
// MyPromise.js

then(onFulfilled, onRejected) {
  // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
  const promise2 = new MyPromise((resolve, reject) => {
    // 判断状态
    if (this.status === FULFILLED) {
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        } 
      })  
    } else if (this.status === REJECTED) { 
      // ==== 新增 ====
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 调用失败回调，并且把原因返回
          const x = onRejected(this.reason);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        } 
      }) 
    } else if (this.status === PENDING) {
      // 等待
      // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.onFulfilledCallbacks.push(() => {
        // ==== 新增 ====
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = onFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      });
      this.onRejectedCallbacks.push(() => {
        // ==== 新增 ====
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = onRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      });
    }
  }) 
  
  return promise2;
}
复制代码
```

### 八、then 中的参数变为可选

上面我们处理 then 方法的时候都是默认传入 onFulfilled、onRejected 两个回调函数，但是实际上原生 Promise 是可以选择参数的单传或者不传，都不会影响执行。

例如下面这种 👇

```js
// test.js

const promise = new Promise((resolve, reject) => {
  resolve(100)
})

promise
  .then()
  .then()
  .then()
  .then(value => console.log(value))

// 输出 100
复制代码
```

所以我们需要对 then 方法做一点小小的调整

```js
// MyPromise.js

then(onFulfilled, onRejected) {
  // 如果不传，就使用默认函数
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

  // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
  const promise2 = new MyPromise((resolve, reject) => {
  ......
}

复制代码
```

改造完自然是需要验证一下的

**先看情况一**：resolve 之后

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  resolve('succ')
})
 
promise.then().then().then(value => console.log(value))

// 打印 succ
复制代码
```

**先看情况一**：reject 之后

```js
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  reject('err')
})
 
promise.then().then().then(value => console.log(value), reason => console.log(reason))

// 打印 err
复制代码
```

写到这里，麻雀版的 Promise 基本完成了，鼓掌 👏👏👏

### 九、实现 resolve 与 reject 的静态调用

就像开头挂的那道面试题使用 `return Promise.resolve` 来返回一个 Promise 对象，我们用现在的手写代码尝试一下

```js
const MyPromise = require('./MyPromise')

MyPromise.resolve().then(() => {
    console.log(0);
    return MyPromise.resolve(4);
}).then((res) => {
    console.log(res)
})
复制代码
```

结果它报错了 😥

```js
MyPromise.resolve().then(() => {
          ^

TypeError: MyPromise.resolve is not a function
复制代码
```

除了 Promise.resolve 还有 Promise.reject 的用法，我们都要去支持，接下来我们来实现一下

```js
// MyPromise.js

MyPromise {
  ......
  // resolve 静态方法
  static resolve (parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}
复制代码
```

这样我们再测试上面的 🌰 就不会有问题啦

执行结果 👇

```js
0
4
```

到这里手写工作就基本完成了，前面主要为了方便理解，所以有一些冗余代码，我规整一下

```js
// MyPromise.js

// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor){
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 存储成功回调函数
  onFulfilledCallbacks = [];
  // 存储失败回调函数
  onRejectedCallbacks = [];

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () =>  {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = realOnFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        })  
      }

      const rejectedMicrotask = () => { 
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = realOnRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      }
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask() 
      } else if (this.status === REJECTED) { 
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    }) 
    
    return promise2;
  }

  // resolve 静态方法
  static resolve (parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise;
复制代码
```

### Promise.all和Promise.race的介绍

- 相似点:
  - 这两个都是`Promise`的方法，并且传入的参数都是一个`Promise`的数组。
  - 都会返回一个`Promise`实例
- 区别:
  - all: 传入的所有`Promise`最终都转化为**fulfilled**态时，则会执行**resolve**回调，并将返回值是的所有的`Promise`的`resolve`的回调的**value**的数组。其中一个任何`Promise`为**reject**状态时，则返回的`Promise`的状态更改为**rejected**。
  - race: 传入的所有`Promise`其中任何一个有状态转化为**fulfilled**或者**rejected**，则将执行对应的回调。

##### 使用场景

当用户想要得到的是多个异步结果合并到一起时应该使用`all` 当我们想要控制某一个异步操作的时间时，就可以用定时器和`race`来进行实现。

##### 传入空数组

当我们的`all`和`race`传入的是空数组时，会有出现什么状况呢?

- all: 感谢楼下评论的提醒，后来去看了MDN上promise.all的讲解，发现是返回一个状态是resovle的promise对象。
- race: 返回的`Promise`会一直保持在**pending**状态。

### 实现Promise.all

```
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
```

### 实现Promise.race

```
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
```

### 基础版Promise

```
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";
let PromiseA = function(fn){
    this.status = PENDING;
    this.value = null;
    this.resolveds = [];
    this.rejecteds = [];
    fn(this.doResolve.bind(this), this.doReject.bind(this))
}
PromiseA.prototype.doResolve = function(value){
    setTimeout(() => {
        if (this.status == PENDING) {
            this.status = RESOLVED;
            this.value = value;
            this.resolveds.map(resolve => resolve(this.value))
        }
    }, 0)
}
PromiseA.prototype.doReject = function(){
    setTimeout(() => {
        if (this.status == PENDING) {
            this.status = RESOLVED;
            this.value = value;
            this.rejecteds.map(reject => reject(this.value))
        }
    }, 0)
}
PromiseA.prototype.then = function(resolve, reject){
    if (this.status == PENDING) {
        this.resolveds.push(resolve)
        this.rejecteds.push(reject)
    }
    if (this.status == RESOLVED) {
        return resolve(this.value)
    }
    if (this.status == REJECTED) {
        return reject(this.value)
    }
}
```

### Promise.finally 

```
// 终极方法finally finally其实就是一个promise的then方法的别名，在执行then方法之前，先处理callback函数
MyPromise.prototype.finally = function(cb) {
    return this.then(
        value => MyPromise.resolve(cb()).then(() => value)
        ,
        reason => MyPromise.reject(cb()).then(() => { throw reason })
    )
}
```

### ES6 Promise 并行执行和顺序执行

##### 1.Promise.all  并行执行promise

> getA和getB并行执行，然后输出结果。如果有一个错误，就抛出错误



```jsx
/**
 * 每一个promise都必须返回resolve结果才正确
 * 每一个promise都不处理错误
 */

const getA = new Promise((resolve, reject) => {
   //模拟异步任务
   setTimeout(function(){
     resolve(2);
   }, 1000) 
})
.then(result => result)


const getB = new Promise((resolve, reject) => {
   setTimeout(function(){
     // resolve(3);
     reject('Error in getB');
   }, 1000) 
})
.then(result => result)


Promise.all([getA, getB]).then(data=>{
    console.log(data)
})
.catch(e => console.log(e));
```

> getA和getB并行执行，然后输出结果。总是返回resolve结果



```jsx
/**
 * 每一个promise自己处理错误
 */

const getA = new Promise((resolve, reject) => {
   //模拟异步任务
   setTimeout(function(){
     resolve(2);
   }, 1000) 
})
.then(result => result)
.catch(e=>{

})


const getB = new Promise((resolve, reject) => {
   setTimeout(function(){
     // resolve(3);
     reject('Error in getB');
   }, 1000) 
})
.then(result => result)
.catch(e=>e)


Promise.all([getA, getB]).then(data=>{
    console.log(data)
})
.catch(e => console.log(e));
```

------

##### 2.顺序执行promise

> 先getA然后getB执行，最后addAB

- 2.1 方法一——连续使用then链式操作



```jsx
function getA(){
      return  new Promise(function(resolve, reject){ 
      setTimeout(function(){     
            resolve(2);
        }, 1000);
    });
}
 
function getB(){
    return  new Promise(function(resolve, reject){       
        setTimeout(function(){
            resolve(3);
        }, 1000);
    });
}
 
function addAB(a,b){
    return a+b
}

function getResult(){
    var  obj={};
    Promise.resolve().then(function(){
        return  getA() 
    })
    .then(function(a){
         obj.a=a;
    })
    .then(function(){
        return getB() 
    })
    .then(function(b){
         obj.b=b;
         return obj;
    })
    .then(function(obj){
       return  addAB(obj['a'],obj['b'])
    })
    .then(data=>{
        console.log(data)
    })
    .catch(e => console.log(e));

}
getResult();
```

- 2.2 方法二——使用promise构建队列



```jsx
function getResult(){
    var res=[];
    // 构建队列
    function queue(arr) {
      var sequence = Promise.resolve();
      arr.forEach(function (item) {
        sequence = sequence.then(item).then(data=>{
            res.push(data);
            return res
        })
      })
      return sequence
    }

    // 执行队列
    queue([getA,getB]).then(data=>{
        return addAB(data[0],data[1])
    })
    .then(data => {
        console.log(data)
    })
    .catch(e => console.log(e));

}

getResult();
```

- 2.3方法三——使用async、await实现类似同步编程



```jsx
function getResult(){
 async function queue(arr) {
  let res = []
  for (let fn of arr) {
    var data= await fn();
    res.push(data);
  }
  return await res
}

queue([getA,getB])
  .then(data => {
    return addAB(data[0],data[1])
  }).then(data=>console.log(data))

}
```

------

##### 3. 总结

实现异步队列函数的三种方式

> 方法一——连续使用then链式操作
>  方法二——使用promise构建队列
>  方法三——使用async、await实现类似同步编程，async函数内部实现同步

### Promise与callback函数处理 异步 对比

1，callback函数处理异步：代码逻辑复杂，可读性差----回调地狱；不可return；
 2，promise处理异步：
 对比callback，易读，可以return，不需要层层传递callback；
 处理多个异步等待合并
 3，async，await--ES2017 ，promise的语法糖

### Promise.allSettled()

该`Promise.allSettled()`方法返回一个在所有给定的promise都已经`fulfilled`或`rejected`后的promise，并带有一个对象数组，每个对象表示对应的promise结果。

### Promise.all()

Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入，并且只返回一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)实例， 那个输入的所有promise的resolve回调的结果是一个数组。这个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)的resolve回调执行是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候。它的reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息。

### Promise.any()

`Promise.any()` 接收一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)可迭代对象，只要其中的一个 `promise` 成功，就返回那个已经成功的 `promise` 。如果可迭代对象中没有一个 `promise` 成功（即所有的 `promises` 都失败/拒绝），就返回一个失败的 `promise `和[`AggregateError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)类型的实例，它是 [`Error`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error) 的一个子类，用于把单一的错误集合在一起。本质上，这个方法和[`Promise.all()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)是相反的。

### Promise.prototype.catch()

**catch()** 方法返回一个[Promise (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，并且处理拒绝的情况。它的行为与调用[`Promise.prototype.then(undefined, onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) 相同。 (事实上, calling `obj.catch(onRejected)` 内部calls `obj.then(undefined, onRejected)`).

### Promise.prototype.finally()

`finally()` 方法返回一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。这为在`Promise`是否成功完成后都需要执行的代码提供了一种方式。

这避免了同样的语句需要在[`then()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)和[`catch()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)中各写一次的情况。

### Promise.race()

**`Promise.race(iterable)`** 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。

### **promise构造函数是同步执行的，then方法是异步执行的**

### promise穿透是怎么实现的

**Promise方法链通过return传值，没有return就只是相互独立的任务而已**

### 把setTimeout封装成Promise

```
function timeout(delay){
    return new Promise(resolve => setTimeout(resolve, delay));
};


timeout(2000).then(()=>{
    console.log('2s');
    return timeout(2000).then(value =>{
        console.log('2s-');
    })
})
```

### Ajax是异步的返回一个promise，那你怎么使用XHR封装一个ajax？

```
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
```

### promise实现同一时间内限制并发请求数

#### 基于[Promise](https://so.csdn.net/so/search?q=Promise&spm=1001.2101.3001.7020)实现一个限制并发请求的函数

##### 1.首先模拟一下请求方法

```
let getRequestFn = function(time){
    return ()=>{
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                resolve(time)
            }, time);
        })
    }
} // 执行函数可返回一个自定义请求事件的函数，用来模拟请求
```

##### 2.实现一个限制并发数量的方法

> 首先我们可以思考一下如何可以限制并发，无非就是用一个循环来判断当前的执行个数，如果小于限制个数就再次发送请求，很多小伙伴可能会写出这样的代码，比如：

```
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
```

我们很容易忽略一个问题，js是单线程的，函数执行过程中如果遇到异步任务，那么这个异步任务会退出主线程，存放到任务队列中等待执行，当主线程任务为空时才会执行异步任务，所以我们可以看到，代码中的running --; 这个操做是无法被操作到的。因为while一直在运行，导致异步任务无法获得主线程的执行。

##### 使用递归实现限制并发数量的方法

```
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
```

我们使用一个next函数来保证每次可以有怕pool个请求函数在执行，并且超过两个时就可以退出循环，这样可以执行到异步任务，使得running--;并且再次执行next()用来执行请求的函数，最后当全部请求完毕以后返回results，当然本函数没有处理请求失败的问题，大家有兴趣以可以添加。

3.测试

```
//创建模拟请求任务
let tasks = [getRequestFn(4000),getRequestFn(2000),getRequestFn(2000),getRequestFn(2000)];
// 发送请求 并发数为2
console.time();
createRequest(tasks,2).then((value)=>{
    console.log(value)
    console.timeEnd();
})
// 输出
[ 2000, 4000, 2000, 2000 ]
default: 6.016s
// 可以看到执行了6s 因为同时只有两个请求可以发送 2000, 4000 =》 2000 结束以后 又执行一个2000的 最后 4000结束 执行2000的 一共6s
```

### promise的超时重新请求，参数（fn，times，interval）

```
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
```

## Generator

### async/await用法

其实你要实现一个东西之前，最好是先搞清楚这两样东西

- 这个东西有什么用？
- 这个东西是怎么用的？

#### 有什么用？

`async/await`的用处就是：**用同步方式，执行异步操作**，怎么说呢？举个例子

比如我现在有一个需求：先请求完`接口1`，再去请求`接口2`，我们通常会这么做

```js
function request(num) { // 模拟接口请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num * 2)
    }, 1000)
  })
}

request(1).then(res1 => {
  console.log(res1) // 1秒后 输出 2

  request(2).then(res2 => {
    console.log(res2) // 2秒后 输出 4
  })
})
复制代码
```

或者我现在又有一个需求：先请求完`接口1`，再拿`接口1`返回的数据，去当做`接口2`的请求参数，那我们也可以这么做

```js
request(5).then(res1 => {
  console.log(res1) // 1秒后 输出 10

  request(res1).then(res2 => {
    console.log(res2) // 2秒后 输出 20
  })
})
复制代码
```

其实这么做是没问题的，但是如果嵌套的多了，不免有点不雅观，这个时候就可以用`async/await`来解决了

```js
async function fn () {
  const res1 = await request(5)
  const res2 = await request(res1)
  console.log(res2) // 2秒后输出 20
}
fn()
复制代码
```

#### 是怎么用？

还是用刚刚的例子

需求一：

```js
async function fn () {
  await request(1)
  await request(2)
  // 2秒后执行完
}
fn()
复制代码
```

需求二：

```js
async function fn () {
  const res1 = await request(5)
  const res2 = await request(res1)
  console.log(res2) // 2秒后输出 20
}
fn()
复制代码
```

![截屏2021-09-11 下午9.57.58.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c63ae650b71144e2a1ba8dc2bdaceed3~tplv-k3u1fbpfcp-watermark.awebp)

其实就类似于生活中的`排队`，咱们生活中排队买东西，肯定是要上一个人买完，才轮到下一个人。而上面也一样，在`async`函数中，`await`规定了异步操作只能一个一个排队执行，从而达到**用同步方式，执行异步操作**的效果，这里注意了：**await只能在async函数中使用，不然会报错哦**

刚刚上面的例子`await`后面都是跟着异步操作`Promise`，那如果不接`Promise`会怎么样呢？

```js
function request(num) { // 去掉Promise
  setTimeout(() => {
    console.log(num * 2)
  }, 1000)
}

async function fn() {
  await request(1) // 2
  await request(2) // 4
  // 1秒后执行完  同时输出
}
fn()
复制代码
```

可以看出，如果`await`后面接的不是`Promise`的话，有可能其实是达不到`排队`的效果的

说完`await`，咱们聊聊`async`吧，`async`是一个位于function之前的前缀，只有`async函数`中，才能使用`await`。那`async`执行完是返回一个什么东西呢？

```js
async function fn () {}
console.log(fn) // [AsyncFunction: fn]
console.log(fn()) // Promise {<fulfilled>: undefined}
复制代码
```

可以看出，`async函数`执行完会自动返回一个状态为`fulfilled`的Promise，也就是成功状态，但是值却是undefined，那要怎么才能使值不是undefined呢？很简单，函数有`return`返回值就行了

```js
async function fn (num) {
  return num
}
console.log(fn) // [AsyncFunction: fn]
console.log(fn(10)) // Promise {<fulfilled>: 10}
fn(10).then(res => console.log(res)) // 10
复制代码
```

可以看出，此时就有值了，并且还能使用`then方法`进行输出

#### 总结

总结一下`async/await`的知识点

- await只能在async函数中使用，不然会报错
- async函数返回的是一个Promise对象，有无值看有无return值
- await后面最好是接Promise，虽然接其他值也能达到排队效果
- async/await作用是**用同步方式，执行异步操作**

### 什么是语法糖？

前面说了，`async/await`是一种`语法糖`，诶！好多同学就会问，啥是`语法糖`呢？我个人理解就是，`语法糖`就是一个东西，这个东西你就算不用他，你用其他手段也能达到这个东西同样的效果，但是可能就没有这个东西这么方便了。

- 举个生活中的例子吧：你走路也能走到北京，但是你坐飞机会更快到北京。
- 举个代码中的例子吧：ES6的`class`也是语法糖，因为其实用普通`function`也能实现同样效果

回归正题，`async/await`是一种`语法糖`，那就说明用其他方式其实也可以实现他的效果，我们今天就是讲一讲怎么去实现`async/await`，用到的是ES6里的`迭代函数——generator函数`

### generator函数

#### 基本用法

`generator函数`跟普通函数在写法上的区别就是，多了一个星号`*`，并且只有在`generator函数`中才能使用`yield`，什么是`yield`呢，他相当于`generator函数`执行的`中途暂停点`，比如下方有3个暂停点。而怎么才能暂停后继续走呢？那就得使用到`next方法`，`next方法`执行后会返回一个对象，对象中有`value 和 done`两个属性

- value：暂停点后面接的值，也就是yield后面接的值
- done：是否generator函数已走完，没走完为false，走完为true

```js
function* gen() {
  yield 1
  yield 2
  yield 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: undefined, done: true }
复制代码
```

可以看到最后一个是undefined，这取决于你generator函数有无返回值

```js
function* gen() {
  yield 1
  yield 2
  yield 3
  return 4
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: 4, done: true }
复制代码
```

![截屏2021-09-11 下午9.46.17.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d56e8dea0f204cc18a2d86d1ffcf51ef~tplv-k3u1fbpfcp-watermark.awebp)

#### yield后面接函数

yield后面接函数的话，到了对应暂停点yield，会马上执行此函数，并且该函数的执行返回值，会被当做此暂停点对象的`value`

```js
function fn(num) {
  console.log(num)
  return num
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) 
// 1
// { value: 1, done: false }
console.log(g.next())
// 2
//  { value: 2, done: false }
console.log(g.next()) 
// { value: 3, done: true }
复制代码
```

#### yield后面接Promise

前面说了，函数执行返回值会当做暂停点对象的value值，那么下面例子就可以理解了，前两个的value都是pending状态的Promise对象

```js
function fn(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num)
    }, 1000)
  })
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: 3, done: true }
复制代码
```

![截屏2021-09-11 下午10.51.38.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39a4a3ec5ecc4e9e88a9515be0bc7bb1~tplv-k3u1fbpfcp-watermark.awebp)

其实我们想要的结果是，两个Promise的结果`1 和 2`，那怎么做呢？很简单，使用Promise的then方法就行了

```js
const g = gen()
const next1 = g.next()
next1.value.then(res1 => {
  console.log(next1) // 1秒后输出 { value: Promise { 1 }, done: false }
  console.log(res1) // 1秒后输出 1

  const next2 = g.next()
  next2.value.then(res2 => {
    console.log(next2) // 2秒后输出 { value: Promise { 2 }, done: false }
    console.log(res2) // 2秒后输出 2
    console.log(g.next()) // 2秒后输出 { value: 3, done: true }
  })
})
复制代码
```

![截屏2021-09-11 下午10.38.37.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56134335085443e9a86da9c3a9c139b6~tplv-k3u1fbpfcp-watermark.awebp)

#### next函数传参

generator函数可以用`next方法`来传参，并且可以通过`yield`来接收这个参数，注意两点

- 第一次next传参是没用的，只有从第二次开始next传参才有用
- next传值时，要记住顺序是，先右边yield，后左边接收参数

```js
function* gen() {
  const num1 = yield 1
  console.log(num1)
  const num2 = yield 2
  console.log(num2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next(11111))
// 11111
//  { value: 2, done: false }
console.log(g.next(22222)) 
// 22222
// { value: 3, done: true }
复制代码
```

![截屏2021-09-11 下午10.53.02.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c49ec193e19249d2876fba7909f89acc~tplv-k3u1fbpfcp-watermark.awebp)

#### Promise+next传参

前面讲了

- yield后面接Promise
- next函数传参

那这两个组合起来会是什么样呢？

```js
function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1)
  const num2 = yield fn(num1)
  const num3 = yield fn(num2)
  return num3
}
const g = gen()
const next1 = g.next()
next1.value.then(res1 => {
  console.log(next1) // 1秒后同时输出 { value: Promise { 2 }, done: false }
  console.log(res1) // 1秒后同时输出 2

  const next2 = g.next(res1) // 传入上次的res1
  next2.value.then(res2 => {
    console.log(next2) // 2秒后同时输出 { value: Promise { 4 }, done: false }
    console.log(res2) // 2秒后同时输出 4

    const next3 = g.next(res2) // 传入上次的res2
    next3.value.then(res3 => {
      console.log(next3) // 3秒后同时输出 { value: Promise { 8 }, done: false }
      console.log(res3) // 3秒后同时输出 8

       // 传入上次的res3
      console.log(g.next(res3)) // 3秒后同时输出 { value: 8, done: true }
    })
  })
})
复制代码
```

![截屏2021-09-11 下午11.05.44.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8db7c759079a404ebab41b9aacc90c77~tplv-k3u1fbpfcp-watermark.awebp)

### 实现async/await

其实上方的`generator函数`的`Promise+next传参`，就很像`async/await`了，区别在于

- gen函数执行返回值不是Promise，asyncFn执行返回值是Promise
- gen函数需要执行相应的操作，才能等同于asyncFn的排队效果
- gen函数执行的操作是不完善的，因为并不确定有几个yield，不确定会嵌套几次

![截屏2021-09-11 下午11.53.41.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2465072c79684ecabd9b0377e22b05f8~tplv-k3u1fbpfcp-watermark.awebp)

那我们怎么办呢？我们可以封装一个高阶函数。什么是`高阶函数`呢？`高阶函数`的特点是：**参数是函数，返回值也可以是函数**。下方的`highorderFn`就是一个`高阶函数`

```js
function highorderFn(函数) {
    // 一系列处理
    
    return 函数
}
复制代码
```

我们可以封装一个高阶函数，接收一个generator函数，并经过一系列处理，返回一个具有async函数功能的函数

```js
function generatorToAsync(generatorFn) {
  // 经过一系列处理
  
  return 具有async函数功能的函数
}
复制代码
```

#### 返回值Promise

之前我们说到，async函数的执行返回值是一个Promise，那我们要怎么实现相同的结果呢

```js
function* gen() {

}

const asyncFn = generatorToAsync(gen)

console.log(asyncFn()) // 期望这里输出 Promise
复制代码
```

其实很简单，`generatorToAsync函数`里做一下处理就行了

```js
function* gen() {

}
function generatorToAsync (generatorFn) {
  return function () {
    return new Promise((resolve, reject) => {

    })
  }
}

const asyncFn = generatorToAsync(gen)

console.log(asyncFn()) // Promise
复制代码
```

#### 加入一系列操作

咱们把之前的处理代码，加入`generatorToAsync函数`中

```js
function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1)
  const num2 = yield fn(num1)
  const num3 = yield fn(num2)
  return num3
}
function generatorToAsync(generatorFn) {
  return function () {
    return new Promise((resolve, reject) => {
      const g = generatorFn()
      const next1 = g.next()
      next1.value.then(res1 => {

        const next2 = g.next(res1) // 传入上次的res1
        next2.value.then(res2 => {

          const next3 = g.next(res2) // 传入上次的res2
          next3.value.then(res3 => {

            // 传入上次的res3
            resolve(g.next(res3).value)
          })
        })
      })
    })
  }
}

const asyncFn = generatorToAsync(gen)

asyncFn().then(res => console.log(res)) // 3秒后输出 8
复制代码
```

可以发现，咱们其实已经实现了以下的`async/await`的结果了

```js
async function asyncFn() {
  const num1 = await fn(1)
  const num2 = await fn(num1)
  const num3 = await fn(num2)
  return num3
}
asyncFn().then(res => console.log(res)) // 3秒后输出 8
复制代码
```

#### 完善代码

上面的代码其实都是死代码，因为一个async函数中可能有2个await，3个await，5个await ，其实await的个数是不确定的。同样类比，generator函数中，也可能有2个yield，3个yield，5个yield，所以咱们得把代码写成活的才行

```js
function generatorToAsync(generatorFn) {
  return function() {
    const gen = generatorFn.apply(this, arguments) // gen有可能传参

    // 返回一个Promise
    return new Promise((resolve, reject) => {

      function go(key, arg) {
        let res
        try {
          res = gen[key](arg) // 这里有可能会执行返回reject状态的Promise
        } catch (error) {
          return reject(error) // 报错的话会走catch，直接reject
        }

        // 解构获得value和done
        const { value, done } = res
        if (done) {
          // 如果done为true，说明走完了，进行resolve(value)
          return resolve(value)
        } else {
          // 如果done为false，说明没走完，还得继续走

          // value有可能是：常量，Promise，Promise有可能是成功或者失败
          return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
        }
      }

      go("next") // 第一次执行
    })
  }
}

const asyncFn = generatorToAsync(gen)

asyncFn().then(res => console.log(res))
复制代码
```

这样的话，无论是多少个yield都会排队执行了，咱们把代码写成活的了

#### 示例

`async/await`版本

```js
async function asyncFn() {
  const num1 = await fn(1)
  console.log(num1) // 2
  const num2 = await fn(num1)
  console.log(num2) // 4
  const num3 = await fn(num2)
  console.log(num3) // 8
  return num3
}
const asyncRes = asyncFn()
console.log(asyncRes) // Promise
asyncRes.then(res => console.log(res)) // 8
复制代码
```

使用`generatorToAsync函数`的版本

```js
function* gen() {
  const num1 = yield fn(1)
  console.log(num1) // 2
  const num2 = yield fn(num1)
  console.log(num2) // 4
  const num3 = yield fn(num2)
  console.log(num3) // 8
  return num3
}

const genToAsync = generatorToAsync(gen)
const asyncRes = genToAsync()
console.log(asyncRes) // Promise
asyncRes.then(res => console.log(res)) // 8
复制代码
```

### Promise、Generator、Async有什么区别？

#### 前言

我们知道`Promise`与`Async/await`函数都是用来解决JavaScript中的异步问题的，从最开始的回调函数处理异步，到`Promise`处理异步，到`Generator`处理异步，再到`Async/await`处理异步，每一次的技术更新都使得JavaScript处理异步的方式更加优雅，从目前来看，`Async/await`被认为是异步处理的终极解决方案，让JS的异步处理越来越像同步任务。**异步编程的最高境界，就是根本不用关心它是不是异步**。

**如果这篇文章有帮助到你，❤️关注+点赞❤️鼓励一下作者，文章公众号首发，关注 `前端南玖` 第一时间获取最新的文章～**

#### 异步解决方案的发展历程

##### 1.回调函数

从早期的Javascript代码来看，在ES6诞生之前，基本上所有的异步处理都是基于回调函数函数实现的，你们可能会见过下面这种代码：

```js
ajax('aaa', () => {
    // callback 函数体
    ajax('bbb', () => {
        // callback 函数体
        ajax('ccc', () => {
            // callback 函数体
        })
    })
})
复制代码
```

没错，在ES6出现之前，这种代码可以说是随处可见。它虽然解决了异步执行的问题，可随之而来的是我们常听说的**回调地狱**问题：

- 没有顺序可言：嵌套函数执行带来的是调试困难，不利于维护与阅读
- 耦合性太强：一旦某一个嵌套层级有改动，就会影响整个回调的执行

**所以，为了解决这个问题，社区最早提出和实现了`Promise`，ES6将其写进了语言标准，统一了用法。**

#### 2.Promise

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它就是为了解决回调函数产生的问题而诞生的。

有了`Promise`对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，`Promise`对象提供统一的接口，使得控制异步操作更加容易。

所以上面那种回调函数的方式我们可以改成这样：(前提是ajax已用Promise包装)

```js
ajax('aaa').then(res=>{
  return ajax('bbb')
}).then(res=>{
  return ajax('ccc')
})
复制代码
```

通过使用`Promise`来处理异步，比以往的回调函数看起来更加清晰了，解决了回调地狱的问题，`Promise`的`then`的链式调用更能让人接受，也符合我们同步的思想。

**但Promise也有它的缺点：**

- Promise的内部错误使用`try catch`捕获不到，只能只用`then`的第二个回调或`catch`来捕获

```js
let pro
try{
    pro = new Promise((resolve,reject) => {
        throw Error('err....')
    })
}catch(err){
    console.log('catch',err) // 不会打印
}
pro.catch(err=>{
    console.log('promise',err) // 会打印
})
复制代码
```

- Promise一旦新建就会立即执行，无法取消

之前写过一篇[从如何使用到如何实现一个Promise](https://juejin.cn/post/7051364317119119396)，讲解了Promise如何使用以及内部实现原理。对Promise还不太理解的同学可以看看～

#### 3.Generator

`Generator` 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。`Generator` 函数将 JavaScript 异步编程带入了一个全新的阶段。

##### 声明

与函数声明类似，不同的是`function`关键字与函数名之间有一个星号，以及函数体内部使用`yield`表达式，定义不同的内部状态（`yield`在英语里的意思就是“产出”）。

```js
function* gen(x){
 const y = yield x + 6;
 return y;
}
// yield 如果用在另外一个表达式中,要放在()里面
// 像上面如果是在=右边就不用加()
function* genOne(x){
  const y = `这是第一个 yield 执行:${yield x + 1}`;
 return y;
}
复制代码
```

##### 执行

```js
const g = gen(1);
//执行 Generator 会返回一个Object,而不是像普通函数返回return 后面的值
g.next() // { value: 7, done: false }
//调用指针的 next 方法,会从函数的头部或上一次停下来的地方开始执行，直到遇到下一个 yield 表达式或return语句暂停,也就是执行yield 这一行
// 执行完成会返回一个 Object,
// value 就是执行 yield 后面的值,done 表示函数是否执行完毕
g.next() // { value: undefined, done: true }
// 因为最后一行 return y 被执行完成,所以done 为 true
复制代码
```

调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是`遍历器对象（Iterator Object）`。下一步，必须调用遍历器对象的`next`方法，使得指针移向下一个状态。

所以上面的回调函数又可以写成这样：

```js
function *fetch() {
    yield ajax('aaa')
    yield ajax('bbb')
    yield ajax('ccc')
}
let gen = fetch()
let res1 = gen.next() // { value: 'aaa', done: false }
let res2 = gen.next() // { value: 'bbb', done: false }
let res3 = gen.next() // { value: 'ccc', done: false }
let res4 = gen.next() // { value: undefined, done: true } done为true表示执行结束
复制代码
```

由于 Generator 函数返回的遍历器对象，只有调用`next`方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。`yield`表达式就是暂停标志。

遍历器对象的`next`方法的运行逻辑如下。

（1）遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。

（2）下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。

（3）如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。

（4）如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。

**`yield`表达式本身没有返回值，或者说总是返回`undefined`。`next`方法可以带一个参数，该参数就会被当作上一个`yield`表达式的返回值。**

怎么理解这句话？我们来看下面这个例子：

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
复制代码
```

由于`yield`没有返回值，所以（yield（x+1））执行后的值是`undefined`，所以在第二次执行`a.next()`是其实是执行的`2*undefined`，所以值是`NaN`，所以下面b的例子中，第二次执行`b.next()`时传入了12，它会当成第一次`b.next()`的执行返回值，所以b的例子中能够正确计算。**这里不能把next执行结果中的value值与yield返回值搞混了，它两不是一个东西**

##### yield与return的区别

相同点:

- 都能返回语句后面的那个表达式的值
- 都可以暂停函数执行

区别:

- 一个函数可以有多个 yield,但是只能有一个 return
- yield 有位置记忆功能,return 没有

#### 4.Async/await

`Async/await`其实就是上面`Generator`的语法糖，`async`函数其实就相当于`funciton *`的作用，而`await`就相当与`yield`的作用。而在`async/await`机制中，自动包含了我们上述封装出来的`spawn`自动执行函数。

所以上面的回调函数又可以写的更加简洁了：

```js
async function fetch() {
  	await ajax('aaa')
    await ajax('bbb')
    await ajax('ccc')
}
// 但这是在这三个请求有相互依赖的前提下可以这么写，不然会产生性能问题，因为你每一个请求都需要等待上一次请求完成后再发起请求，如果没有相互依赖的情况下，建议让它们同时发起请求，这里可以使用Promise.all()来处理
复制代码
```

`async`函数对`Generator`函数的改进，体现在以下四点：

- 内置执行器：`async`函数执行与普通函数一样，不像`Generator`函数，需要调用`next`方法，或使用`co`模块才能真正执行
- 语意化更清晰：`async`和`await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。
- 适用性更广：`co`模块约定，`yield`命令后面只能是 Thunk 函数或 Promise 对象，而`async`函数的`await`命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。
- 返回值是Promise：`async`函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用`then`方法指定下一步的操作。

##### async函数

async函数的返回值为Promise对象，所以它可以调用then方法

```js
async function fn() {
  return 'async'
}
fn().then(res => {
  console.log(res) // 'async'
})
复制代码
```

##### await表达式

**await** 右侧的表达式一般为 **promise** 对象, 但也可以是其它的值

1. 如果表达式是 promise 对象, await 返回的是 promise 成功的值
2. 如果表达式是其它值, 直接将此值作为 await 的返回值
3. await后面是Promise对象会阻塞后面的代码，Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果
4. 所以这就是await必须用在async的原因，async刚好返回一个Promise对象，可以异步执行阻塞

```js
function fn() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1000)
        }, 1000);
    })
}
function fn1() { return 'nanjiu' }
async function fn2() {
    // const value = await fn() // await 右侧表达式为Promise，得到的结果就是Promise成功的value
    // const value = await '南玖'
    const value = await fn1()
    console.log('value', value)
}
fn2() // value 'nanjiu'
复制代码
```

#### 异步方案比较

后三种方案都是为解决传统的回调函数而提出的，所以它们相对于回调函数的优势不言而喻。而`async/await`又是`Generator`函数的语法糖。

- Promise的内部错误使用`try catch`捕获不到，只能只用`then`的第二个回调或`catch`来捕获，而`async/await`的错误可以用`try catch`捕获
- `Promise`一旦新建就会立即执行，不会阻塞后面的代码，而`async`函数中await后面是Promise对象会阻塞后面的代码。
- `async`函数会隐式地返回一个`promise`，该`promise`的`reosolve`值就是函数return的值。
- 使用`async`函数可以让代码更加简洁，不需要像`Promise`一样需要调用`then`方法来获取返回值，不需要写匿名函数处理`Promise`的resolve值，也不需要定义多余的data变量，还避免了嵌套代码。

#### 说了这么多，顺便看个题吧～

```js
console.log('script start')
async function async1() {
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2 end')
}
async1()

setTimeout(function() {
    console.log('setTimeout')
}, 0)

new Promise(resolve => {
    console.log('Promise')
    resolve()
})
.then(function() {
    console.log('promise1')
})
.then(function() {
    console.log('promise2')
})
console.log('script end')
复制代码
```

**解析：**

打印顺序应该是：` script start -> async2 end -> Promise -> script end -> async1 end -> promise1 -> promise2 -> setTimeout`

老规矩，全局代码自上而下执行，先打印出`script start`，然后执行async1(),里面先遇到await async2(),执行async2,打印出`async2 end`，然后await后面的代码放入微任务队列，接着往下执行new Promise，打印出`Promise`,遇见了resolve，将第一个then方法放入微任务队列，接着往下执行打印出`script end`，全局代码执行完了，然后从微任务队列中取出第一个微任务执行，打印出`async1 end`,再取出第二个微任务执行，打印出`promise1`,然后这个then方法执行完了，当前Promise的状态为`fulfilled`,它也可以出发then的回调，所以第二个then这时候又被加进了微任务队列，然后再出微任务队列中取出这个微任务执行，打印出`promise2`,此时微任务队列为空，接着执行宏任务队列，打印出`setTimeout`。

**解题技巧：**

- 无论是then还是catch里的回调内容只要代码正常执行或者正常返回，则当前新的Promise实例为fulfilled状态。如果有报错或返回Promise.reject()则新的Promise实例为rejected状态。
- fulfilled状态能够触发then回调
- rejected状态能够触发catch回调
- 执行async函数，返回的是Promise对象
- await相当于Promise的then并且同一作用域下await下面的内容全部作为then中回调的内容
- 异步中先执行微任务，再执行宏任务

### async await 如何捕获异常

我们首先来看一下 `async/await`的解释：

如果你在代码中使用了异步函数，就会发现它的语法和结构会更像是标准的同步函数。

现在我们一般使用`promise`来解决异步编程的问题,相比之前刚开始使用回调的时候，`Promise`的`then`方法显得非常好用，清晰，易懂。但是当我们如果有多个相互依赖的请求。

有两个问题： 1.难以理解执行顺序 2.代码不太好读

所以就诞生了`async`和`await`。（`异步函数像是标准的同步函数`）。将人类大脑的负担减少。

`async` 函数返回的是一个`Promise`对象，如果函数中有返回值。则通过`Promise.resole()`封装成`Promise`对象，当然我们就可以使用`then()`就可以取出这个值。`async`只能配套和`await`使用，单独使用就会报错。

```
async function foo(){
  let bar = await test()
}
复制代码
```

`await` 后面接受一个`Promise` 对象。当`Promise`对象状态变化的时候，得到返回值。`async`函数完全可以看作多个异步操作，封装成的一个`Promise`对象，而`await`就是内部`then`命令的语法糖，用同步的书写方式实现异步代码。

### 错误处理

如果`await`后面的异步操作出错，那么等同于async函数返回的 `Promise` 对象被`reject`。

防止出错的方法就是我们将其放在`try/catch`代码块中。并且能够捕获异常。

```
async function fn(){
    try{
        let a = await Promise.reject('error')
    }catch(error){
        console.log(error)
    }
}
```

