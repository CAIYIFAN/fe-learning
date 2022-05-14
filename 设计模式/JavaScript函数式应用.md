### 闭包

#### 缓存

```javascript
var mult = (function(){
  var cache = {};
  var calculate = function() { // 封闭calculate函数
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
      a = a * arguments[i];
    }
    return a;
  };
  
  return function() {
    var args = Array.prototype.join.call( arguments, ',');
    if ( args in cache ) {
      return cache[args];
    } 
    return cache[args] = calculate.apply(null, arguments);
  }
})();
```

#### 延迟局部变量的寿命

```javascript
var report = (function() {
  var imgs =[];
  return function (src) {
    var img = new Image();
    imgs.push(img);
    img.src = src;
  }
})();
```

#### 闭包和面向对象

```javascript
var extent = function() {
  var value = 0;
  return {
    call: function () {
      value++;
      console.log(value);
    }
  }
};
var extent = extent();
extent.call(); // 输出: 1
extent.call(); // 输出: 2
extent.call(); // 输出: 3
```

#### 用闭包实现命令模式

```javascript
var Tv = {
  open: function() {
    console.log('打开电视机');
  },
  close: function() {
    console.log('关闭电视机');
  }
}

var createCommand = function (receiver) {
  var execute = function() {
    return receiver.open(); // 执行命令，打开电视机
  }
  
  var undo = function() {
    return receiver.close(); // 执行命令，关闭电视
  }
  
  return {
    execute: execute,
    undo: undo
  }
};

var setCommand = function( command ) {
  document.getElemntById('execute').onClick = function() {
    command.execute(); // 输出：打开电视机
  }
  document.getElemntById('undo').onClick = function() {
    command.undo(); // 输出：关闭电视机
  }
}

setCommand( createCommand( Tv ));
```

#### 判断数据的类型

```javascript
var Type = {};

for (var i = 0, type; type = ['String', 'Array', 'Number'][i++];) {
  Type['is' + type] = function( obj ){
      (function( type ) {
        Type['is' + type] = function( obj ) {
          return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        } 
      })(type)
    }
};

Type.isArray([]); // true
Type.isString("str"); // true
```

#### 高阶函数实现AOP

AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后，再通过“动态织入”的方式掺入业务逻辑模块中。这样做的好处首先是可以保持业务逻辑模块的纯净和高内聚性，其次是可以很方便地复用日志统计功能模块。

```javascript
Function.prototype.before = function(beforefn) {
  var __self = this; // 保存原函数的引用
  return function() { // 返回包含了原函数和新函数的“代理”函数
    beforefn.apply(this, arguments); // 执行新函数，修正this
    return __self.apply(this.arguments); // 执行原函数
  }
};

Function.prototype.after = function(afterfn) {
  var __self = this;
  return function() {
    var ret = __self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  }
}

var func = function() {
  console.log(2);
}

func = func.before(function() {
  console.log(1);
}).after(function(){
  console.log(3);
});

func();
```

#### 高阶函数的其他应用

##### 1.currying

```javascript
var cost = (function() {
  var args = [];
  
  return function() {
    if (arguments.length === 0) {
      var money = 0;
      for (var i = 0, l = args.length; i < l; i++) {
        money += args[i]
      }
      return money;
    } else {
      [].push.apply(args, arguments);
    }
  }
})();

cost(100);
cost(200);
cost(300);

cost() // 600
```

curry化函数

```javascript
var currying = function(fn) {
  var args = [];
  
  return function() {
    if (arguments.length === 0) {
      return fn.apply(this, apply);
    } else {
      [].push.apply(args, arguments);
      return arguments.callee;
    }
  }
};

var cost = (function() {
  var money = 0;
  return function() {
    for (var i = 0, l = arguments.length; i < l; i++) {
      money += arguments[i];
    }
    return money;
  }
})();

var cost = curry(cost);

cost(100);
cost(200);
cost(300);

cost() // 600
```

#### 2.uncurrying

```javascript
Function.prototype.uncurrying = function() {
  var self = this;
  return function() {
    var obj = Array.prototype.shift.call(arguments);
    return self.apply(obj, arguments);
  }
}
```

例子

```javascript
for (var i = 0, fn, ary = ['push', 'shift', 'forEach']; fn = ary[i++];) {
  Array[fn] = Array.prototype[fn].uncurrying();
}

var obj = {
  "length": 3,
  "0": 1,
  "1": 2,
  "2": 3
};

Array.push(obj, 4);
console.log(obj.length);

var first = Array.shift(obj);
console.log(first);
console.log(obj);

Array.forEach(obj, function(i, n) {
  console.log(n); // 分别输出: 0, 1, 2
})
```

#### 3.函数节流

```javascript
var throttle = function(fn, interval) {
  var __self = fn, // 保存需要被延迟执行的函数引用
      timer, // 定时器
      firstTime = true; // 是否是第一次调用
  
  return function() {
    var args = arguments,
        __me = this;
    
    if (firstTime) { // 如果是第一次调用，不需延迟执行
      __self.apply(__me, args);
      return firstTime = false;
    }
    
    if ( timer ) { // 如果定时器还在，说明前一次延迟执行还没有完成
      return false;
    }
    
    timer = setTimeout(function() { // 延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      __self.apply(__me, args);
    }, interval || 500);
  };
};


window.onresize = throttle(function() {
  console.log(1)
}, 500)
```

#### 4.分时函数

分批，分时执行 

```javascript
var timeChunk = function(ary, fn, count) {
  var obj, t;
  var len = ary.length;
  
  var start = function() {
    for(var i = 0; i < Math.min(count || 1, ary.length ); i++) {
      var obj = ary.shift();
      fn( obj );
    }
  };
  
  return function() {
    t = setInterval(function() {
      if (ary.length === 0) { // 如果全部节点都已经被创建好
        return clearInterval( t );
      }
      start();
    }, 200); // 分批执行的时间间隔，也可以用参数的形式传入
  };
};
```

#### 5.惰性加载函数

```javascript
var addEvent = function( elem, type, handler) {
  if ( window.addEventListener ) {
    addEvent = function(elem, type, handler) {
      elem.addEventListener(type, handler, false);
    }
  } else if ( window.attachEvent ) {
    addEvent = function( elem, type, handler) {
      elem.attachEvent('on' + type, handler)
    }
  }
  addEvent(elem, type, handler);
}

var div = documentt.getElementById('div1');

addEvent(div, 'click', function() {
  alert(1);
});

addEvemt(div, 'click', function() {
  alert(2);
});
```

