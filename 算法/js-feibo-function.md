---
title: js实现斐波那契数列的几种方法
date: 2021-02-16 00:55:07
tags:
---

## 递归

### 方法一：普通递归

```javascript
function fibonacci(n) {
    if (n == 1 || n == 2) {
        return 1
    };
    return fibonacci(n - 2) + fibonacci(n - 1);
}
fibonacci(30)
```

### 方法二：改进递归-把前两位数字做成参数避免重复计算

```javascript
function fibonacci(n) {
    function fib(n, v1, v2) {
        if (n == 1)
            return v1;
        if (n == 2)
            return v2;
        else
            return fib(n - 1, v2, v1 + v2)
    }
    return fib(n, 1, 1)
}
fibonacci(30)
```

### 方法三：改进递归-利用闭包特性把运算结果存储在数组里，避免重复计算

```javascript
var fibonacci = function () {
    let memo = [0, 1];
    let fib = function (n) {
        if (memo[n] == undefined) {
            memo[n] = fib(n - 2) + fib(n - 1)
        }
        return memo[n]
    }
    return fib;
}()
fibonacci(30)
```

### 方法三1：改进递归-摘出存储计算结果的功能函数

```javascript
var memoizer = function (func) {
    let memo = [];
    return function (n) {
        if (memo[n] == undefined) {
            memo[n] = func(n)
        }
        return memo[n]
    }
};
var fibonacci=memoizer(function(n){
    if (n == 1 || n == 2) {
        return 1
    };
    return fibonacci(n - 2) + fibonacci(n - 1);
})
fibonacci(30)
```

### arguments.callee并不是很推荐使用

callee最广泛的用途就是在匿名函数里递归调用自身，但 ECMAScript 3 已允许有名字的函数表达式，且不会污染命名空间，所以在实现同样的功能时并不会变得不优雅。

arguments 是个很大的对象，每次递归调用时都需要重新创建（虽然 arguments.callee 是不变的，但是 arguments.caller 是不一样的，调用的参数也不一样的）。ECMAScript5的标准中Strict Mode禁止使用。

```javascript
var result = [];
function fn(n) { // 典型的斐波那契数列
    if (n == 0) {
        return 0;
    } else if (n == 1) {
        return 1;
    } else {
        if (result[n]) {
            return result[n];
        } else {
            result[n] = arguments.callee(n - 1) + arguments.callee(n - 2);
            return result[n];
        }
    }
}
```

## 循环

### 方法一：普通for循环

```javascript
function fibonacci(n) {
    var n1 = 1, n2 = 1, sum;
    for (let i = 2; i < n; i++) {
        sum = n1 + n2
        n1 = n2
        n2 = sum
    }
    return sum
}
fibonacci(30)
```

### 方法二：for循环+解构赋值

```javascript
var fibonacci = function (n) {
    let n1 = 1; n2 = 1;
    for (let i = 2; i < n; i++) {
        [n1, n2] = [n2, n1 + n2]
    }
    return n2
}
fibonacci(30)
```
