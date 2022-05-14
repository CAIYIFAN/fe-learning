---
title: 2020年前端校招JavaScript面试总结
date: 2021-02-16 01:12:35
tags: JavaScript
---

## 1、实现bind，call、apply、bind的区别?

this 的指向，始终坚持一个原理：**this 永远指向最后调用它的那个对象**。

```
var name = "windowName";
function a(){
	var name ="Cherry";
	console.log(this.name);//windowName
	console.log("inner:"+this); //window
}
a();
console.log("outer:"+this);//window
```

```
var name = "windowName";
var a ={
	name:"Cherry",
	fn: function(){
		console.log(this.name);//"Cherry"
	}
}
a.fn();
```

```
var f =a.fn;
f();//window
```

```
var name = "windowName";
function fn(){
	var name = 'Cherry';
	innerFunction();
	function innerFunction(){
		console.log(this.name);
	}
}
fn();//windowName
```

```
var name = "windowName";
var a ={
	name:'Cherry',
	func1:function(){
		console.log(this.name);
	},
	func2:function(){
		setTimeout(function(){
			this.func1();
		},100);
	}
};
a.func2();//VM5360:9 Uncaught TypeError: this.func1 is not a function
```

```
var name = "windowName";
var a ={
	name:'Cherry',
	func1:function(){
		console.log(this.name);
	},
	func2:function(){
		setTimeout(function(){
			console.log(this.name);
		},100);
	}
};
a.func2();//windowName;
```

```
var name = "windowName";
var a ={
	name:'Cherry',
	func1:function(){
		console.log(this.name);
	},
	func2:function(){
			console.log(this.name);
	}
};
a.func2();//'Cherry'
```

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
  这看起来就像创建了新的函数，但实际上 JavaScript 函数是重新创建的对象：

##### Apply、call、bind的区别以及实现

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

## 2、简单的类型对比、数据类型的判断?怎样判断“值”属于哪种类型?typeof 是否能正确判断类型？instanceof 呢？instanceof 有什么作用？内部逻辑是如何实现的？

##### 1、严格相等 ===

全等操作符比较两个值是否相等，两个被比较的值在比较前都**不进行隐式转换**。如果两个被比较的值具有不同的类型，这两个值是不全等的。否则，如果两个被比较的值类型相同，值也相同，并且都不是 number 类型时，两个值全等。最后，如果两个值都是 number 类型，当两个都不是 NaN，并且数值相同，或是两个值分别为 +0 和 -0 时，两个值被认为是全等的。

##### 2、非严格相等 ==

相等操作符比较两个值是否相等，**在比较前将两个被比较的值转换为相同类型**。在转换后（等式的一边或两边都可能被转换），最终的比较方式等同于全等操作符 === 的比较方式。 相等操作符满足交换律。

![image-20190904004111430](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190904004111430.png)

同值相等由 Object.is 方法提供。

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

##### 3、instanceof

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

##### 4、Object.prototype.toString.call()

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

##### 5、typeof一元运算符

typeof一元运算符，用来返回操作数类型的字符串。
typeof只有一个实际应用场景，就是**用来检测一个对象是否已经定义或者是否已经赋值。**

##### 6、Array.isArray()

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

  ## 3、深浅拷贝，手写深拷贝

  1、实现一个对象的深拷贝函数，需要考虑对象的元素类型以及对应的解决方案：

  （1）基础类型：这种最简单，直接赋值即可

  （2）对象类型：递归调用拷贝函数

  （3）数组类型：因为数组中的元素可能是基础类型、对象还可能数组，因此要专门做一个函数来处理数组的深拷贝。

  ### 浅拷贝

  ​		浅拷贝只会将对象的各个属性进行依次复制，并不会进行递归复制，也就是说只会赋值目标对象的第一层属性。
  **对于目标对象第一层为基本数据类型的数据，就是直接赋值，即「传值」；**
  **而对于目标对象第一层为引用数据类型的数据，就是直接赋存于栈内存中的堆内存地址，即「传址」。**

  ### 深拷贝

  ​		深拷贝不同于浅拷贝，它不只拷贝目标对象的第一层属性，而是递归拷贝目标对象的所有属性。
  ​		一般来说，在JavaScript中考虑复合类型的深层复制的时候，往往就是指对于 Date 、Object 与 Array 这三个复合类型的处理。我们能想到的最常用的方法就是先创建一个空的新对象，然后递归遍历旧对象，直到发现基础类型的子节点才赋予到新对象对应的位置。
  ​	   不过这种方法会存在一个问题，就是 JavaScript 中存在着神奇的原型机制，并且这个原型会在遍历的时候出现，然后需要考虑原型应不应该被赋予给新对象。那么在遍历的过程中，我们可以考虑使用 **hasOwnProperty** 方法来判断是否过滤掉那些继承自原型链上的属性。

  #### 1、通过 JSON.parse(JSON.stringify(object)) 来解决

  * 会忽略 undefined
  * 会忽略 symbol
  * 不能序列化函数
  * 不能解决循环引用的对象

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



## 4、JS闭包的实现以及缺陷

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

* 1、应用闭包的主要场合是：设计私有的方法和变量。
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

* 2、模块模式（The Module Pattern）：为单例创建私有变量和方法。
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

* 3、函数作为返回值

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

  

* 4、函数作为参数传递

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

  ##### 内存泄漏

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

  

  ## 5、JS函数柯里化

  柯里化是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。
  Currying有哪些好处呢？

* 1、参数复用

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

  2、延迟运行

  ```
  function.prototype.bing = function(context){
      var _this = this;
      var args = Array.prototype.slice.call(arguments,1)
  return function(){
      return _this.apply(context,args);
    }
  }
  ```

  柯里化常见题

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

  

## 6、跨域，手写jsonp

url 哪些地方不同算作跨域？

* 协议
* 域名
* 端口

![image-20190904005023084](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190904005023084.png)

但是 HTML 中几个标签能逃避过同源策略——<script src="xxx">、<img src="xxxx"/>、<link href="xxxx">，这三个标签的src/href可以加载其他域的资源，不受同源策略限制。
因此，这使得这三个标签可以做一些特殊的事情。

* <img>可以做打点统计，因为统计方并不一定是同域的，在讲解 JS 基础知识异步的时候有过代码示例。除了能跨域之外，<img>几乎没有浏览器兼容问题，它是一个非常古老的标签。

* <script>和<link>可以使用 CDN，CDN 基本都是其他域的链接。

* 另外<script>还可以实现 JSONP，能获取其他域接口的信息。
  第一：如果是协议和端口造成的跨域问题“前台”是无能为力的。
  第二：在跨域问题上，仅仅是通过“URL的首部”来识别而不会根据域名对应的IP地址是否相同来判断。“URL的首部”可以理解为“协议, 域名和端口必须匹配”。

  ##### 请求跨域了，那么请求到底发出去没有？

  ​		跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。你可能会疑问明明通过表单的方式可以发起跨域请求，为什么 Ajax 就不会?因为归根结底，跨域是为了阻止用户读取到另一个域名下的内容，**Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。**但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了。

  ### 1.jsonp

  ##### 1) JSONP原理

  利用 <script> 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP请求一定需要对方的服务器做支持才可以。

##### 2) JSONP和AJAX对比

  JSONP和AJAX相同，都是客户端向服务器端发送请求，从服务器端获取数据的方式。但AJAX属于同源策略，JSONP属于非同源策略（跨域请求）

  ##### 3) JSONP优缺点

  JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是**仅支持get方法**具有局限性,不安全可能**会遭受XSS攻击**。

  ##### 4) JSONP的实现流程

  1、声明一个回调函数，其函数名(如show)当做参数值，要传递给跨域请求数据的服务器，函数形参为要获取目标数据(服务器返回的data)。

  2、创建一个<script>标签，把那个跨域的API数据接口地址，赋值给script的src,还要在这个地址中向服务器传递该函数名（可以通过问号传参:?callback=show）。

  3、服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串,例如：传递进去的函数名是show，它准备好的数据是show('我不爱你')。

  4、最后服务器把准备的数据通过HTTP协议返回给客户端，客户端再调用执行之前声明的回调函数（show），对返回的数据进行操作。
  在开发中可能会遇到多个 JSONP 请求的回调函数名是相同的，这时候就需要自己封装一个 JSONP函数。

```
function jsonp({url,params,callback}){
    return new Promise((resolve,reject) =>{
        let script = document.createElement('script')
        window[callback] =function(data){
            resolve(data)
            document.body.removeChild(script);
        }
        params = {...params,callback} //wd=b&&callback=show
        let arrs = [];
        for(let key in params){
            arrs.push(`${key}=${params[key]}`)
        }
        script.src = `${url}?{arrs.join('&')}`
        document.body.appendChild(script);
    })
}
jsonp({
    url:'http://localhost:3000/say',
    params: {wd: 'Iloveyou'},
    callback: 'show'
}).then(data =>{
    console.log(data);
})
```



### 2.cors

​	CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。
​	 
虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为简单请求和复杂请求。

##### 1) 简单请求

只要同时满足以下两大条件，就属于简单请求
条件1：使用下列方法之一：1、GET 2、HEAD 3、POST
条件2：Content-Type 的值仅限于下列三者之一：

1、text/plain

2、multipart/form-data

3、application/x-www-form-urlencoded

##### 2) 复杂请求

不符合以上条件的请求就肯定是复杂请求了。 复杂请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"**预检**"请求,该请求是 option 方法的，**通过该请求来知道服务端是否允许跨域请求**。

### 3.postMessage

1、页面和其打开的新窗口的数据传递

2、多窗口之间消息传递

3、页面与嵌套的iframe消息传递

4、上面三个场景的跨域数据传递
postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。
otherWindow.postMessage(message, targetOrigin, [transfer]);

（1）message: 将要发送到其他 window的数据。

（2）targetOrigin:通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。

（3）transfer(可选)：是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。
window.onmessage = function(e) { console.log(e.data) //我爱你 e.source.postMessage('我不爱你', e.origin) }

### 4、Node中间件代理(两次跨域)

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。 代理服务器，需要做以下几个步骤：

* 接受客户端请求 。
* 将请求 转发给服务器。
* 拿到服务器 响应 数据。
* 将 响应 转发给客户端。

![image-20190904005237589](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190904005237589.png)

### 5、nginx反向代理

实现原理类似于Node中间件代理，需要你搭建一个中转nginx服务器，用于转发请求。
使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。
实现思路：通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。

### 6、window.name + iframe

window.name属性的独特之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。

### 7、location.hash + iframe

实现原理： a.html欲与c.html跨域相互通信，通过中间页b.html来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。
具体实现步骤：一开始a.html给c.html传一个hash值，然后c.html收到hash值后，再把hash值传递给b.html，最后b.html将结果放到a.html的hash值中。 同样的，a.html和b.html是同域的，都是http://localhost:3000;而c.html是http://localhost:4000

### 8、document.domain + iframe

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。 只需要给页面添加 document.domain ='test.com' 表示二级域名都相同就可以实现跨域。
实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。

### 总结

* CORS支持所有类型的HTTP请求，是跨域HTTP请求的根本解决方案
* JSONP只支持GET请求，JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。
* 不管是Node中间件代理还是nginx反向代理，主要是通过同源策略对服务器不加限制。
* 日常工作中，用得比较多的跨域方案是cors和nginx反向代理

## 7、手写flat（）

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



## 8、判断时区

![image-20190904005321115](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190904005321115.png)

## 9、 JS垃圾回收机制

### 新生代算法

在新生代空间中，内存空间分为两部分，分别为 From 空间和 To 空间。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象并复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了。

### 老生代算法

老生代中的对象一般存活时间较长且数量也多，使用了两个算法，分别是标记清除算法和标记压缩算法。

1、新生代中的对象是否已经经历过一次 Scavenge 算法，如果经历过的话，会将对象从新生代空间移到老生代空间中。
2、To 空间的对象占比大小超过 25 %。在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中。
老生代中的空间很复杂，有如下几个空间
在老生代中，以下情况会先启动标记清除算法：
（1）某一个空间没有分块的时候
（2）空间中被对象超过一定限制
（3）空间不能保证新生代中的对象移动到老生代中
		在这个阶段中，会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。在标记大型对内存时，可能需要几百毫秒才能完成一次标记。这就会导致一些性能上的问题。
​		清除对象后会造成堆内存出现碎片的情况，当碎片超过一定限制后会启动压缩算法。在压缩过程中，将活的对象像一端移动，直到所有对象都移动完成然后清理掉不需要的内存。

## 10、JS获取对象的key值的方式，for in，for of，foreach，map，reduce，fliter

##### 1、for...of循环：

​		具有 iterator 接口，就可以用for...of循环遍历它的成员(属性值)。for...of循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象、Generator 对象，以及字符串。for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。对于普通的对象，for...of结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。可以中断循环。

​		for...of 语句创建一个循环来迭代可迭代的对象。在 ES6 中引入的 for...of 循环，以替代 for...in 和 forEach() ，并支持新的迭代协议。for...of 允许你遍历 Arrays（数组）, Strings（字符串）, Maps（映射）, Sets（集合）等可迭代的数据结构等。

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



##### 2、for...in循环：

​		遍历对象自身的和继承的可枚举的属性, 不能直接获取属性值。可以中断循环。

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

##### 3、forEach:

​		只能遍历数组，不能中断，没有返回值(或认为返回值是undefined)。

```
forEach
[].forEach(function(value, index, array) {
  // ...
});
```

##### 4、map: 

​		只能遍历数组，不能中断，返回值是修改后的数组。

```
map
[].map(function(value, index, array) {
  // ...
});
```

##### 5、filter

```
var ages = [32, 33, 16, 40];

function checkAdult(age) {
    return age >= 18;
}

function myFunction() {
    document.getElementById("demo").innerHTML = ages.filter(checkAdult);
}
```

##### 6、Some

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

##### 7、every

```
if(scroes.every(higherThanCurrent)){
    console.log(1);
}else{
    console.log(2);
}
```

##### 8、reduce

```
var sum = [1, 2, 3, 4].reduce(function (previous, current, index, array) {
  return previous + current;
});
console.log(sum); // 10
```





## 11、JS继承

```
1、原型链继承
function Parent(name){
    this.name = name;
}
function Child(name){
    this.name = name;
}
Parent.prototype.sayName = function(){
    console.log('parent name:',this.name);
}
Child.protoType = new Parent('father');
Child.protoType.constructor = Child;
Child.protoType.sayName = function(){
    console.log('child name:',this.name);
}
var child = new Child('son');
child.sayName();
//此种继承的缺点：子类无法给父类传递参数，并且Child.protoType 要写在new Parent后面
```

```
2、构造函数继承
function Parent(name){
    this.name = name;
}
Parent.protoType.sayName = function(){
    console.log('parent name:',this.name);
}
Parent.protoType.doSomeThing = function(){
    console.log('parent doSomeThing');
}
function Child(name,fatherName){
    Parent.call(this,faterName);
    this.name = name;
}
Child.protoType.sayNmae =  function(){
    console.log('child name:',this.name);
}
var child = new Child('son','father');
child.sayName();
child.doSomeThing();
//此方案的缺点：没有原型，每次创建一个Child实例对象的时候都要执行一遍Parent函数
```

```
3、组合式继承
function Parent(name){
    this.name = name;
}
Parent.protoType.sayName = function(){
    console.log('parent name:',this.name);
}
Parent.protoType.doSomeThing = function(){
    console.log('parent doSomeThing');
}
function Child(name,fatherName){
    Parent.call(this,faterName);
    this.name = name;
}
Child.protoType = Parent.protoType;
Child.protoType.constructor = Child;
Child.protoType.sayNmae =  function(){
    console.log('child name:',this.name);
}
var child = new Child('son');
child.sayName();
child.doSomeThing();
//通过原型链实现对象属性和方法的继承，而通过构造函数来实现实例属性的继承。
```

```
4、原型式继承
function Parent(name){
    this.name = name;
}
Parent.protoType.sayName = function(){
    console.log('parent name:',this.name);
}
Parent.protoType.doSomeThing = function(){
    console.log('parent doSomeThing');
}
function Child(name,fatherName){
    Parent.call(this,faterName);
    this.name = name;
}
function create(proto){
    function F(){}
    F.proto=proto;
    return new F();
}
Child.protoType = create(Parent.protoType);
Child.protoType.sayNmae =  function(){
    console.log('child name:',this.name);
}
Child.protoType.constructor = Child;
//用F（）{}去替代父类执行构造函数
```

```
5、ES6继承
Class Parent{
    constructor(name){
        this.name = name;
    }
    doSomething(){
        console.log('parent do sometthing!');
    }
    sayName(){
        console.log('parent name:',this.name);
    }
}
class Child extend Parent{
    constructor(name,parentName){
        super(parentName);
        this.name =name;
    }
    sayName(){
        console.log('child name:',this.name);
    }
}
//ES6继承 
```




## 12、babel

Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）。

* 解析
  将代码解析成抽象语法树（AST），每个js引擎（比如Chrome浏览器中的V8引擎）都有自己的AST解析器，而Babel是通过Babylon实现的。在解析过程中有两个阶段：词法分析和语法分析，词法分析阶段把字符串形式的代码转换为令牌（tokens）流，令牌类似于AST中节点；而语法分析阶段则会把一个令牌流转换成 AST的形式，同时这个阶段会把令牌中的信息转换成AST的表述结构。
* 转换
  在这个阶段，Babel接受得到AST并通过babel-traverse对其进行深度优先遍历，在此过程中对节点进行添加、更新及移除操作。这部分也是Babel插件介入工作的部分。
* 生成
  将经过转换的AST通过babel-generator再转换成js代码，过程就是深度优先遍历整个AST，然后构建可以表示转换后代码的字符串。

## 13、JS实现大数相加

![image-20190904005629192](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190904005629192.png)

## 14、节流、防抖

防抖（debounce）
所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。

```
function debounce(func,wait){
    let timeout;
    return function(){
        let context = this;
        let args = arguments;
        
    if(timeout) clearTimeout(timeout);
    timeout = setTimeout(()=>{
        func.apply(context,args)
    },wait);
	}
}
```

节流（throttle）
所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。 节流会稀释函数的执行频率。

时间戳版本

```
function throttle(func,wait){
    var previous = 0;
    return fucntion(){
        let now = Date.now();
        let context = this;
        let args = arguments;
        if(now -previous > wait){
            func.apply(context,args);
            previous = now;
        }
    }
}
```

## 15、严格模式的限制？

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

## 16、NaN 是什么？有什么特别之处？

NaN 属性是代表非数字值的特殊值。该属性用于指示某个值不是数字。可以把 Number 对象设置为该值，来指示其不是数字值。

## 17、对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？

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
const a = []
对于常量 a 来说，假设内存地址（指针）为 #001，那么在地址 #001 的位置存放了值 []，常量 a存放了地址（指针） #001，再看以下代码
const a = []
const b = a
b.push(1)
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

## 18、谈谈你对 JS 执行上下文栈和作用域链的理解？

执行上下文就是当前 JavaScript 代码被解析和执行时所在环境, JS执行上下文栈可以认为是一个存储函数调用的栈结构，遵循先进后出的原则。

* JavaScript执行在单线程上，所有的代码都是排队执行。

* 一开始浏览器执行全局的代码时，首先创建全局的执行上下文，压入执行栈的顶部。

* 每当进入一个函数的执行就会创建函数的执行上下文，并且把它压入执行栈的顶部。当前函数执行-完成后，当前函数的执行上下文出栈，并等待垃圾回收。

* 浏览器的JS执行引擎总是访问栈顶的执行上下文。

* 全局上下文只有唯一的一个，它在浏览器关闭时出栈。
  作用域链: 无论是 LHS 还是 RHS 查询，都会在当前的作用域开始查找，如果没有找到，就会向上级作用域继续查找目标标识符，每次上升一个作用域，一直到全局作用域为止。

* 如果查找的目的是对变量进行赋值，那么就会使用LHS 查询；如果目的是获取变量的值，就会使用RHS 查询

```
  		RHS 查询与简单地查找某个变量的值别无二致，而LHS 查询则是试图找到变量的容器本身，从而可以对其赋值。
  		LHS查询指的是找到变量的容器本身，从而可以对其进行赋值。也就是找到赋值操作的目标。
    	LHS查询的时候会沿着作用域链进行查询，找到的话就会将值赋值给这个变量，如果到达作用域顶端仍然找不到，就会在作用域链顶端创建这个变量。
```

  ## 19、去重

```
Array.prototype.unique =function(){
    const newArray=[];
    let isRepeat;
    for(let i=0;i<this.length;i++){
        isRepeat =false;
        for(let j=i+1;i<this.length;j++){
            if(this[i]===this[j]){
                isRepeat = true;
                break;
            }
        }
        if(!isRepeat){
            newArray.push(this[i]);
        }
    }
    return newArray;
}
```

```
let arr =[1,2,3,22,233,22,2,233,'a',3,'b','a'];
Array.prototype.unique = function(){
    const newArray = [];
    this.forEach(item =>{
        if(newArray.indexOf(item)===-1){
            newArray.push(item);
        }
    });
    return newArray;
}
```

```
Array.prototype.unique = function(){
    const newArray = [];
    this.sort();
    for(let i=0;i<this.length;i++){
        if(this[i] !== newArray[newArray.length -1]){
            newArray.push(this[i]);
        }
    }
    return newArray;
}
```

```
Array.prototype.unique = function(){
    return [...new Set(this)];
}
```

## 21、实现一个 reduce 函数，作用和原生的 reduce 类似下面的例子。

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

## 22、new 的原理是什么？通过 new 的方式创建对象和通过字面量创建有什么区别？Object.create 有什么作用？

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

<img src="/Users/caiyifan/Library/Application Support/typora-user-images/image-20190905101338749.png" alt="image-20190905101338749" style="zoom:50%;" />

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

## 23、为数组添加Math方法

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



## 24、setTimeout 倒计时为什么会出现误差？

setTimeout() 只是将事件插入了“任务队列”，必须等当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码消耗时间很长，也有可能要等很久，所以并没办法保证回调函数一定会在 setTimeout() 指定的时间执行。所以， setTimeout() 的第二个参数表示的是最少时间，并非是确切时间。
HTML5标准规定了 setTimeout() 的第二个参数的最小值不得小于4毫秒，如果低于这个值，则默认是4毫秒。在此之前。老版本的浏览器都将最短时间设为10毫秒。

```
console.log("script start");
Promise.resolve().then(function(){
	console.log("promise1")
})
setTimeout(function(){
    console.log("setTimeout")
},0);
Promise.resolve().then(function(){
	console.log("promise2")
})
console.log("script end");

//输出
//script start
//script end
//promise1
//promise2
//setTimeout
```

![image-20190905112622848](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190905112622848.png)

## 25、Event Loop 是什么

> JavaScript的事件分两种，**宏任务(macro-task)**和**微任务(micro-task)**

- **宏任务**：包括整体代码script，setTimeout，setInterval
- **微任务**：Promise.then(非new Promise)，process.nextTick(node中)
- 事件的执行顺序，`是先执行宏任务，然后执行微任务`，这个是基础，任务可以有同步任务和异步任务，同步的进入主线程，异步的进入Event Table并注册函数，异步事件完成后，会将回调函数放入Event Queue中(`宏任务和微任务是不同的Event Queue`)，同步任务执行完成后，会从Event Queue中读取事件放入主线程执行，回调函数中可能还会包含不同的任务，因此会循环执行上述操作。

## ES6:

## 1、let、var、const,块作用域的实现，ES6和ES5不同的实现方法。

1、let 和 const 定义的变量不会出现变量提升，而 var 定义的变量会提升。

2、let 和 const 是JS中的块级作用域

3、let 和 const 不允许重复声明(会抛出错误)

4、let 和 const 定义的变量在定义语句之前，如果使用会抛出错误(形成了暂时性死区)，而 var 不会。

5、const 声明一个只读的常量。一旦声明，常量的值就不能改变(如果声明是一个对象，那么不能改变的是对象的引用地址)
		变量提升就是变量在声明之前就可以使用，值为undefined。
		在代码块内，使用 let/const 命令声明变量之前，该变量都是不可用的(会抛出错误)。这在语法上，称为“暂时性死区”。暂时性死区也意味着 typeof 不再是一个百分百安全的操作。
		暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

## 2、箭头函数与function的区别

箭头函数没有自己的 this, 它的this继承于上一层代码块的this。
箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：
1、函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。
2、不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
3、不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
4、不可以使用 new 命令，因为：没有自己的 this，无法调用 call，apply。

​		没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 __proto__

![image-20190904010313775](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190904010313775.png)

## 3、迭代器Generator、Iterator

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

## 4、Promise.all()和race()、finally的实现

promise构造函数是同步执行的，then方法是异步执行的

```
all(list) {
        return new Promise((resolve, reject) => {
            let resValues = [];
            let counts = 0;
            for (let [i, p] of list) {
                resolve(p).then(res => {
                    counts++;
                    resValues[i] = res;
                    if (counts === list.length) {
                        resolve(resValues)
                    }
                }, err => {
                    reject(err)
                })
            }
        })
    }
    
Promise._race = promises => new Promise((resolve, reject) => {
        promises.forEach(promise => {
                promise.then(resolve, reject)
        })
})

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```



## 5、setTimeout、Promise、Async/Await 的区别

1. setTimeout

   ```
   console.log('script start')    //1. 打印 script start
   setTimeout(function(){
     console.log('settimeout')   // 4. 打印 settimeout
   })      // 2. 调用 setTimeout 函数，并定义其完成后执行的回调函数
   console.log('script end')       //3. 打印 script start
   // 输出顺序：script start->script end->settimeout
   ```

   

2. Promise
   Promise本身是同步的立即执行函数， 当在executor中执行resolve或者reject的时候, 此时是异步操作， 会先执行then/catch等，当主栈完成后，才会去调用resolve/reject中存放的方法执行，打印p的时候，是打印的返回结果，一个Promise实例。

   ```
   console.log('script start')
   let promise1 = new Promise(function (resolve) {
     console.log('promise1')
     resolve()
     console.log('promise1 end')
   }).then(function () {
     console.log('promise2')
   })
   setTimeout(function(){
     console.log('settimeout')
   })
   console.log('script end')
   // 输出顺序: script start->promise1->promise1 end->script end->promise2->settimeout
   ```

   当JS主线程执行到Promise对象时，

   当JS主线程执行到Promise对象时，

* promise1.then() 的回调就是一个 task
* promise1 是 resolved或rejected: 那这个 task 就会放入当前事件循环回合的 microtask queue
* promise1 是 pending: 这个 task 就会放入 事件循环的未来的某个(可能下一个)回合的 microtask queue 中
* setTimeout 的回调也是个 task ，它会被放入 macrotask queue 即使是 0ms 的情况

3. async/await

   ```
   async function async1(){
    console.log('async1 start');
     await async2();
     console.log('async1 end')
   }
   async function async2(){
     console.log('async2')
   }
   console.log('script start');
   async1();
   console.log('script end')
   ```

   

   // 输出顺序：script start->async1 start->async2->script end->async1 end
   async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。
   举个例子：

   ```
   async function func1() {
     return 1
   }
   console.log(func1())
   ```

   

![image-20190904010428300](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190904010428300.png)

很显然，func1的运行结果其实就是一个Promise对象。因此我们也可以使用then来处理后续逻辑。
func1().then(res => {
  console.log(res);  // 30
})
await的含义为等待，也就是 async 函数需要等待await后的函数执行完成并且有了返回结果（Promise对象）之后，才能继续执行下面的代码。await通过返回一个Promise对象来实现同步的效果。
我觉得这题主要是考察这三者在事件循环中的区别，事件循环中分为宏任务队列和微任务队列。
其中settimeout的回调函数放到宏任务队列里，等到执行栈清空以后执行；
promise.then里的回调函数会放到相应宏任务的微任务队列里，等宏任务里面的同步代码执行完再执行；async函数表示函数里面可能会有异步方法，await后面跟一个表达式，async方法执行时，遇到await会立即执行表达式，然后把表达式后面的代码放到微任务队列里，让出执行栈让同步代码先执行。

## 9、Proxy

## 10、Set 和 Map

Set 和 Map 主要的应用场景在于 数据重组 和 数据储存
Set 是一种叫做集合的数据结构，Map 是一种叫做字典的数据结构

1. 集合（Set）
   ES6 新增的一种新的数据结构，类似于数组，但成员是唯一且无序的，没有重复的值。
   Set 本身是一种构造函数，用来生成 Set 数据结构。
   new Set([iterable])
   举个例子：

   ```
   const s = new Set()
   
   [1, 2, 3, 4, 3, 2, 1].forEach(x => s.add(x))
   for (let i of s) {
     console.log(i)    // 1 2 3 4
   }
   
   // 去重数组的重复对象
   let arr = [1, 2, 3, 2, 1, 1]
   [... new Set(arr)]    // [1, 2, 3]
   ```

   

   Set 对象允许你储存任何类型的唯一值，无论是原始值或者是对象引用。
   向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是**NaN等于自身，而精确相等运算符认为NaN不等于自身。**

   

   ```
   let set = new Set();
   let a = NaN;
   let b = NaN;
   set.add(a);
   set.add(b);
   set // Set {NaN}
   let set1 = new Set()
   set1.add(5)
   set1.add('5')
   console.log([...set1])        // [5, "5"]
   ```

   

* Set 实例属性

  * constructor： 构造函数
  * size：元素数量
    let set = new Set([1, 2, 3, 2, 1])
    console.log(set.length)      // undefined
    console.log(set.size)        // 3

* Set 实例方法

  * 操作方法

    * add(value)：新增，相当于 array里的push
    * delete(value)：存在即删除集合中value
    * has(value)：判断集合中是否存在 value
    * clear()：清空集合
      let set = new Set()
      set.add(1).add(2).add(1)
      set.has(1)     // true
      set.has(3)     // false
      set.delete(1)  
      set.has(1)     // false
      Array.from 方法可以将 Set 结构转为数组
      const items = new Set([1, 2, 3, 2])
      const array = Array.from(items)
      console.log(array)    // [1, 2, 3]
      // 或
      const arr = [...items]
      console.log(arr)      // [1, 2, 3]

    ### 遍历方法（遍历顺序为插入顺序）

    * keys()：返回一个包含集合中所有键的迭代器
    * values()：返回一个包含集合中所有值得迭代器

  * entries()：返回一个包含Set对象中所有元素得键值对迭代器

  * forEach(callbackFn, thisArg)：用于对集合成员执行callbackFn操作，如果提供了 thisArg 参数，回调中的this会是这个参数，没有返回值
    let set = new Set([1, 2, 3])
    console.log(set.keys())      // SetIterator {1, 2, 3}
    console.log(set.values())    // SetIterator {1, 2, 3}
    console.log(set.entries())   // SetIterator {1, 2, 3}
    for (let item of set.keys()) {
    console.log(item);
    }       // 1        2        3
    for (let item of set.entries()) {
    console.log(item);
    }       // [1, 1]   [2, 2]  [3, 3]
    set.forEach((value, key) => {
    console.log(key + ' : ' + value)
    })      // 1 : 1    2 : 2   3 : 3
    console.log([...set]) // [1, 2, 3]
    Set 可默认遍历，默认迭代器生成函数是 values() 方法
    Set.prototype[Symbol.iterator] === Set.prototype.values // true
    所以， Set可以使用 map、filter 方法
    let set = new Set([1, 2, 3])
    set = new Set([...set].map(item => item * 2))
    console.log([...set]) // [2, 4, 6]
    set = new Set([...set].filter(item => (item >= 4)))
    console.log([...set]) //[4, 6]
    因此，Set 很容易实现交集（Intersect）、并集（Union）、差集（Difference）
    let set1 = new Set([1, 2, 3])
    let set2 = new Set([4, 3, 2])
    let intersect = new Set([...set1].filter(value => set2.has(value)))
    let union = new Set([...set1, ...set2])
    let difference = new Set([...set1].filter(value => !set2.has(value)))
    console.log(intersect)        // Set {2, 3}
      console.log(union)            // Set {1, 2, 3, 4}
      console.log(difference)       // Set {1}

2. WeakSet
   WeakSet 对象允许你将弱引用对象储存在一个集合中
   WeakSet 与 Set 的区别：

* WeakSet 只能储存对象引用，不能存放值，而 Set 对象都可以
* WeakSet 对象中储存的对象值都是被弱引用的，即垃圾回收机制不考虑 WeakSet 对该对象的应用，如果没有其他的变量或属性引用这个对象值，则这个对象将会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），所以，WeakSet 对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，遍历结束之后，有的成员可能取不到了（被垃圾回收了），WeakSet 对象是无法被遍历的（ES6 规定 WeakSet 不可遍历），也没有办法拿到它包含的所有元素
  属性：
* constructor：构造函数，任何一个具有 Iterable 接口的对象，都可以作参数
  const arr = [[1, 2], [3, 4]]
  const weakset = new WeakSet(arr)
  console.log(weakset)
  方法：
* add(value)：在WeakSet 对象中添加一个元素value
* has(value)：判断 WeakSet 对象中是否包含value
* delete(value)：删除元素 value
* clear()：清空所有元素，注意该方法已废弃
  var ws = new WeakSet()
  var obj = {}
  var foo = {}
  ws.add(window)
  ws.add(obj)
  ws.has(window) // true
  ws.has(foo)    // false
  ws.delete(window)      // true
  ws.has(window) // false

3. 字典（Map）
   集合 与 字典 的区别：

* 共同点：集合、字典 可以储存不重复的值
* 不同点：集合 是以 [value, value]的形式储存元素，字典 是以 [key, value] 的形式储存
  const m = new Map()
  const o = {p: 'haha'}
  m.set(o, 'content')
  m.get(o)       // content
  m.has(o)       // true
  m.delete(o)    // true
  m.has(o)       // false
  任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数，例如：
  const set = new Set([
  ['foo', 1],
  ['bar', 2]
  ]);
  const m1 = new Map(set);
  m1.get('foo') // 1
  const m2 = new Map([['baz', 3]]);
  const m3 = new Map(m2);
  m3.get('baz') // 3
  如果读取一个未知的键，则返回undefined。
  new Map().get('asfddfsasadf')
  // undefined
  注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。
  const map = new Map();
  map.set(['a'], 555);
  map.get(['a']) // undefined
  上面代码的set和get方法，表面是针对同一个键，但实际上这是两个值，内存地址是不一样的，因此get方法无法读取该键，返回undefined。
  由上可知，**Map 的键实际上是跟内存地址绑定的**，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。
  如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，undefined和null也是两个不同的键。虽然NaN不严格相等于自身，但 Map 将其视为同一个键。
  let map = new Map();
  map.set(-0, 123);
  map.get(+0) // 123
  map.set(true, 1);
  map.set('true', 2);
  map.get(true) // 1
  map.set(undefined, 3);
  map.set(null, 4);
  map.get(undefined) // 3
  map.set(NaN, 123);
  map.get(NaN) // 123
  Map 的属性及方法
  属性：
* constructor：构造函数
* size：返回字典中所包含的元素个数
  const map = new Map([
  ['name', 'An'],
  ['des', 'JS']
  ]);
  map.size // 2
  操作方法：
* set(key, value)：向字典中添加新元素
* get(key)：通过键查找特定的数值并返回
* has(key)：判断字典中是否存在键key
* delete(key)：通过键 key 从字典中移除对应的数据
* clear()：将这个字典中的所有元素删除
  遍历方法
* Keys()：将字典中包含的所有键名以迭代器形式返回
* values()：将字典中包含的所有数值以迭代器形式返回
* entries()：返回所有成员的迭代器
* forEach()：遍历字典的所有成员
  const map = new Map([
            ['name', 'An'],
            ['des', 'JS']
        ]);
  console.log(map.entries())   // MapIterator {"name" => "An", "des" => "JS"}
  console.log(map.keys()) // MapIterator {"name", "des"}
  Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法。
  map[Symbol.iterator] === map.entries
  // true
  Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。
  对于 forEach ，看一个例子
  const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
  };
  let map = new Map([
    ['name', 'An'],
    ['des', 'JS']
  ])
  map.forEach(function(value, key, map) {
  this.report(key, value);
  }, reporter);
  // Key: name, Value: An
  // Key: des, Value: JS
  在这个例子中， forEach 方法的回调函数的 this，就指向 reporter
  与其他数据结构的相互转换

1. Map 转 Array
   const map = new Map([[1, 1], [2, 2], [3, 3]])
   console.log([...map]) // [[1, 1], [2, 2], [3, 3]]
2. Array 转 Map
   const map = new Map([[1, 1], [2, 2], [3, 3]])
   console.log(map)      // Map {1 => 1, 2 => 2, 3 => 3}
3. Map 转 Object
   因为 Object 的键名都为字符串，而Map 的键名为对象，所以转换的时候会把非字符串键名转换为字符串键名。
   function mapToObj(map) {
     let obj = Object.create(null)
     for (let [key, value] of map) {
         obj[key] = value
     }
     return obj
   }
   const map = new Map().set('name', 'An').set('des', 'JS')
   mapToObj(map)  // {name: "An", des: "JS"}
4. Object 转 Map
   function objToMap(obj) {
     let map = new Map()
     for (let key of Object.keys(obj)) {
         map.set(key, obj[key])
     }
     return map
   }
   objToMap({'name': 'An', 'des': 'JS'}) // Map {"name" => "An", "des" => "JS"}
5. Map 转 JSON
   function mapToJson(map) {
     return JSON.stringify([...map])
   }
   let map = new Map().set('name', 'An').set('des', 'JS')
   mapToJson(map)        // [["name","An"],["des","JS"]]
6. JSON 转 Map
   function jsonToStrMap(jsonStr) {
   return objToMap(JSON.parse(jsonStr));
   }
   jsonToStrMap('{"name": "An", "des": "JS"}') // Map {"name" => "An", "des" => "JS"}
7. WeakMap
   WeakMap 对象是一组键值对的集合，其中的键是弱引用对象，而值可以是任意。
   注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。
   WeakMap 中，每个键对自己所引用对象的引用都是弱引用，在没有其他引用和该键引用同一对象，这个对象将会被垃圾回收（相应的key则变成无效的），所以，WeakMap 的 key 是不可枚举的。
   属性：

* constructor：构造函数
  方法：
* has(key)：判断是否有 key 关联对象
* get(key)：返回key关联对象（没有则则返回 undefined）
* set(key)：设置一组key关联对象
* delete(key)：移除 key 的关联对象
  let myElement = document.getElementById('logo');
  let myWeakmap = new WeakMap();
  myWeakmap.set(myElement, {timesClicked: 0});
  myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
  }, false);

5. 总结

* Set
  * 成员唯一、无序且不重复
  * [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
  * 可以遍历，方法有：add、delete、has
* WeakSet
  * 成员都是对象
  * 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
  * 不能遍历，方法有add、delete、has
* Map
  * 本质上是键值对的集合，类似集合
  * 可以遍历，方法很多可以跟各种数据格式转换
* WeakMap
  * 只接受对象作为键名（null除外），不接受其他类型的值作为键名
  * 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
  * 不能遍历，方法有get、set、has、delete

6. 扩展：Object与Set、Map
7. Object 与 Set
   // Object
   const properties1 = {
     'width': 1,
     'height': 1
   }
   console.log(properties1['width']? true: false) // true
   // Set
   const properties2 = new Set()
   properties2.add('width')
   properties2.add('height')
   console.log(properties2.has('width')) // true
8. Object 与 Map
   JS 中的对象（Object），本质上是键值对的集合（hash 结构）
   const data = {};
   const element = document.getElementsByClassName('App');
   data[element] = 'metadata';
   console.log(data['[object HTMLCollection]']) // "metadata"
   但当以一个DOM节点作为对象 data 的键，对象会被自动转化为字符串[Object HTMLCollection]，所以说，Object 结构提供了 字符串-值 对应，Map则提供了 值-值 的对应

## 11、JS 异步解决方案的发展历程以及优缺点

1. 回调函数（callback）
   setTimeout(() => {
     // callback 函数体
   }, 1000)
   缺点：回调地狱，不能用 try catch 捕获错误，不能 return

回调地狱的根本问题在于：

缺乏顺序性： 回调地狱导致的调试困难，和大脑的思维方式不符
嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身，即（控制反转）
嵌套函数过多的多话，很难处理错误

```
ajax('XXX1', () => {
    // callback 函数体
    ajax('XXX2', () => {
        // callback 函数体
        ajax('XXX3', () => {
            // callback 函数体
        })
    })
})
```

优点：解决了同步的问题（只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。）

2. Promise
   Promise就是为了解决callback的问题而产生的。

Promise 实现了链式调用，也就是说每次 then 后返回的都是一个全新 Promise，如果我们在 then 中 return ，return 的结果会被 Promise.resolve() 包装

优点：解决了回调地狱的问题

```
ajax('XXX1')
  .then(res => {
      // 操作逻辑
      return ajax('XXX2')
  }).then(res => {
      // 操作逻辑
      return ajax('XXX3')
  }).then(res => {
      // 操作逻辑
  })
```

缺点：无法取消 Promise ，错误需要通过回调函数来捕获

3. Generator
   特点：可以控制函数的执行，可以配合 co 函数库使用

```
function *fetch() {
    yield ajax('XXX1', () => {})
    yield ajax('XXX2', () => {})
    yield ajax('XXX3', () => {})
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()
```


4. Async/await
   async、await 是异步的终极解决方案

优点是：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题

缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。

```
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch('XXX1')
  await fetch('XXX2')
  await fetch('XXX3')
}
```

下面来看一个使用 await 的例子：

```
let a = 0
let b = async () => {
  a = a + await 10
  console.log('2', a) // -> '2' 10
}
b()
a++
console.log('1', a) // -> '1' 1
```

对于以上代码你可能会有疑惑，让我来解释下原因

首先函数 b 先执行，在执行到 await 10 之前变量 a 还是 0，因为 await 内部实现了 generator ，generator 会保留堆栈中东西，所以这时候 a = 0 被保存了下来
因为 await 是异步操作，后来的表达式不返回 Promise 的话，就会包装成 Promise.reslove(返回值)，然后会去执行函数外的同步代码
同步代码执行完毕后开始执行异步代码，将保存下来的值拿出来使用，这时候 a = 0 + 10
上述解释中提到了 await 内部实现了 generator，其实 await 就是 generator 加上 Promise的语法糖，且内部实现了自动执行 generator。如果你熟悉 co 的话，其实自己就可以实现这样的语法糖。



## 12、实现一个 sleep 函数，比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现 ？

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



## 13、为什么普通 for 循环的性能远远高于 forEach 的性能，请解释其中的原因？

- for 循环没有任何额外的函数调用栈和上下文；
- forEach函数签名实际上是

```
array.forEach(function(currentValue, index, arr), thisValue)
```

它不是普通的 for 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能。

## 为什么Object.defineProperty监听不到数组长度等变化

数组的index和length属性没有绑定 get和 set方法（性能问题）。

## promise封装ajax

```
var getJSON = url=>{
var promise = new Promise((resolve,reject)=>{
  var client = new   XMLHttpRequest()
  client.open("GET"，url);
  client.onreadystatechange = hander;
  client.responseType = "json"
  client.setRequesHeader("Accept","application/json");
  client.send()
  function handler(){
    if(this.readyState!==4){
    return ;
	}
	if(this.status===200){
  	resolve(this.response)
	}else {
  	reject(new Error(this.statusText))
	}
	}
})
return promise；
}

getJSON("/posts.json").then((json)=>{
    console.log(json)
},(error)=>{
  console.log(error)
})
```

## promise如何取消？ 

```
let promise = new Promise(function(resolve, reject){
    resolve('第一次成功')
})

promise.then(function(val) {
    // 两种方法意思都代表报错，【中断下一步，直接报错】
　　//第一种方法
    throw new error()
　　// 第二种方法
　　return Promise.reject()

}).then(function(val) {
    console.log('被跳过的方法')
}).catch(function(val) {
    console.log('返回失败')
})
```

## typeof null为什么是object

typeof源码没有明确检查`null`

## new一个构造函数的过程 return的东西是啥？new和super的具体过程？

系统会在内部创建一个this对象，将__proto__转到构造函数的prototype上面，最后再隐式的把this对象return出来，所以person就是一个this对象

super()相当于`Parent.prototype.constructor.call(this)`

![image-20190916214438346](/Users/caiyifan/Library/Application Support/typora-user-images/image-20190916214438346.png)

## fetch了解过什么？

浏览器现在支持Fetch API，可以无须其他库就能实现Ajax，Fetch你想获取资源，Fetch会返回Promise，所以在获取资源后，可以使用.then方法做你想做的。

第一个参数是设置请求方法（如post、put或del），Fetch会自动设置方法为get。

第二个参数是设置头部。因为一般使用JSON数据格式，所以设置ContentType为application/json。

第三个参数是设置包含JSON内容的主体。因为JSON内容是必须的，所以当设置主体时会调用JSON.stringify。

## map，foreach 不同点

```
var array = [10,34,57,43,76];  
var res = array.forEach(function (item,index,input) {  
       input[index] = item*10;  
})  
console.log(res);//--> undefined;  
console.log(array);//--> 通过数组索引改变了原数组；
```

```
var array = [10,34,57,43,76];  
var res = array.map(function (item,index,input) {  
       return item*10;   
})  
console.log(res);
console.log(array);//不变
```

## 模拟实现 new 操作符

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

## onready事件和onload事件

```
//window.onload函数在页面所有内容加载完成后触发，只能执行最后一个window.onload函数
$(window).load(function(){         //等价于window.onload = function
    alert("加载完成");
});
 
//ready函数在DOM树加载完成后触发，可以同时执行多个ready函数。
$(document).ready(function(){      
//$(document)可以简写成$()，  $(document).ready函数可以简写成$(function(){})
    alert("加载完成");
});
```

##  **sort()的原理？**

sort() 方法用于对数组的元素进行排序，并返回数组。

默认排序顺序是根据字符串UniCode码。

因为排序是按照字符串UniCode码的顺序进行排序的，所以首先应该把数组元素都转化成字符串（如有必要），以便进行比较。

## **JS中substr与substring的区别？**

js中substr和substring都是截取字符串中子串，非常相近，可以有一个或两个参数。

语法：substr(start [，length]) 第一个字符的索引是0，start必选 length可选

　　　substring(start [, end]) 第一个字符的索引是0，start必选 end可选

##  **javascript中childNodes与children的区别？**

children是Element的属性，childNodes是Node的属性 

## function func（）{}和var b=function（）{}的区别

1  var func =function(){}  ，即和 var 变量的特性 一样。 func 变量名提前，但是不会初始化，直到执行到初始化代码。

2  function func(){}      变量名 和方法体  都会提前到 顶部执行。

## webworker

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

## 创建对象create与{}区别

Object.create()方法接受两个参数:Object.create(obj,propertiesObject) ;

{}继承自Object；

## NaN 是什么？有什么特别之处？

NaN 属性是代表非数字值的特殊值。该属性用于指示某个值不是数字。可以把 Number 对象设置为该值，来指示其不是数字值。

## 谈谈你对 JS 执行上下文栈和作用域链的理解？

执行上下文就是当前 JavaScript 代码被解析和执行时所在环境, JS执行上下文栈可以认为是一个存储函数调用的栈结构，遵循先进后出的原则。

- JavaScript执行在单线程上，所有的代码都是排队执行。
- 一开始浏览器执行全局的代码时，首先创建全局的执行上下文，压入执行栈的顶部。
- 每当进入一个函数的执行就会创建函数的执行上下文，并且把它压入执行栈的顶部。当前函数执行-完成后，当前函数的执行上下文出栈，并等待垃圾回收。
- 浏览器的JS执行引擎总是访问栈顶的执行上下文。
- 全局上下文只有唯一的一个，它在浏览器关闭时出栈。
  作用域链: 无论是 LHS 还是 RHS 查询，都会在当前的作用域开始查找，如果没有找到，就会向上级作用域继续查找目标标识符，每次上升一个作用域，一直到全局作用域为止。
- 如果查找的目的是对变量进行赋值，那么就会使用LHS 查询；如果目的是获取变量的值，就会使用RHS 查询

```
  		RHS 查询与简单地查找某个变量的值别无二致，而LHS 查询则是试图找到变量的容器本身，从而可以对其赋值。
  		LHS查询指的是找到变量的容器本身，从而可以对其进行赋值。也就是找到赋值操作的目标。
    	LHS查询的时候会沿着作用域链进行查询，找到的话就会将值赋值给这个变量，如果到达作用域顶端仍然找不到，就会在作用域链顶端创建这个变量。
```

## 将字符串转换成数组

```
['1','2','3'] => [1,2,3]
['1','2','3'].map(Number) // [1,2,3]
['1','2','3'].map((value)=>{ 
	return parseInt(value) 
	}) // [1,2,3] 
JSON.parse('[' + String(['1', '2', '3']) + ']') // [1,2,3] 
eval('[' + String(['1', '2', '3']) + ']') // [1,2,3]
```

## for in 与 for of的区别

```
let arr = [3,5,7]
arr.foo = "hello";

for(let i in arr){
	console.log(i); // 输出"0","1","2","foo"
}

for(let i of arr) {
	console.log(i); // 输出 "3","5","7"
}

//注意 for...of 的输出没有出现 "hello"
```

## object与map的比较

相同点：

1.都通过kv进行存储

2.结构上相似

不同点：

1.Object的key只能是String/Symbol

2.Object用在OO中

3.Map具有size属性

4.Map可以使用forEach遍历

## WeakMap对象

WeakMap的键必须是对象类型，值可以是任意类型。他的键被弱保持，也就是说当其键所指的对象没有其他地方引用的时候就会被GC回收掉。

WeakMap不可枚举。

## WeakSet对象

WeakSet对象不重复且不可枚举。

与Set对象的主要区别是：

1.WeakSet中的值必须是对象类型，不可以是别的类型。

2.WeakSet的weak指的是，对集合中的对象，如果不存在其他引用，那么该对象将被垃圾回收掉。