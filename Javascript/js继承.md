---
title: 可以了解一下的Javascript继承写法
date: 2021-02-16 01:09:39
tags: JavaScript
---

# 继承

**1、构造函数**

​    缺点：Child0无法继承Parent0的原型对象，并没有真正的实现继承（部分继承）

```
function Parent0() {

    this.name = "parent0";

    this.colors = ["red", "blue", "yellow"];

}

function Child0() {

    **Parent0****.call(this); // 或apply**

    this.type = "child0";

}



//Child0无法继承Parent0的原型对象，并没有真正的实现继承（部分继承）

Parent0.prototype.sex = "男";

Parent0.prototype.say = function () {

    console.log(" Oh,My God! ");

}

new Child0().sex; // undefined

// Uncaught TypeError: (intermediate value).say is not a function

new Child0().say();


```

**2、原型链继承**

​    缺点：子类会共用原型链上的属性或方法

```javascript
function Parent1() {

    this.name = "parent1";

    this.colors = ["red", "blue", "yellow"];

}

function Child1() {

    this.name = "child1";

}



**Child1.prototype = new Parent1();**



Parent1.prototype.sex = "男";

Parent1.prototype.say = function () {

    console.log(" Oh,My God! ");

}

new Child1().sex; // 男

new Child1().say(); // Oh,My God!



//子类会共用原型链上的属性或方法



var s1 = new Child1();

s1.colors.push("black");

var s2 = new Child1();

s1.colors; // (4) ["red", "blue", "yellow", "balck"]

s2.colors; // (4) ["red", "blue", "yellow", "balck"]


```


**3、原型式继承**

//对传入的对象执行一次浅复制

```javascript
function object(o){

      function F(){}

      F.prototype = o;

      return new F();

}

//例子

var Animal = {

      name:"cat",

      friend:["aaron","cassic"]

}

var cat=object(Animal);

cat.name="sss";

cat.friend.push("aseaff");

alert(cat.name);

alert(cat.friend);

![img](https://app.yinxiang.com/shard/s45/res/5ec0c9e4-2c3d-4979-96e7-40ae7052fc1d.png)


```

**4、组合式继承**

​    缺点： 父类的构造函数被执行了两次，第一次是Child2.prototype = new Parent2()，第二次是在实例化的时候，

```javascript
function Parent2() {

    this.name = "parent2";

    this.colors = ["red", "blue", "yellow"];

}

function Child2() {

    **Parent2****.****call****(****this****);**  // 第二次

    this.type = "child2";

}

**Child2****.****prototype** **=** **new** **Parent2****();**  // 第一次

var s1 = new Child2();

s1.colors.push("black");

var s2 = new Child2();

s1.colors; // (4) ["red", "blue", "yellow", "balck"]

s2.colors; // (3) ["red", "blue", "yellow"]


```

**5、组合式继承-优化**

​    缺点：无法区分实例对象是由父类还是子类实例化得到的。

```javascript
function Parent3() {

    this.name = "parent3";

    this.colors = ["red", "blue", "yellow"];

}

Parent3.prototype.sex = "男";

Parent3.prototype.say = function () {

    console.log("Oh, My God！")

}

function Child3() {

    **Parent3****.call(this);**

    this.type = "child3";

}

**Child3.prototype = Parent3.prototype;**

var s1 = new Child3();

var s2 = new Child3();

console.log(s1, s2);



// 但是，无法区分实例对象是由父类还是子类实例化得到的。

console.log(s1 instanceof Child3); // true

console.log(s1 instanceof Parent3); // true


```

**6、寄生组合式继承（最完美）**

```javascript
function Parent4() {

    this.name = "parent4";

    this.colors = ["red", "blue", "yellow"];

}

Parent4.prototype.sex = "男";

Parent4.prototype.say = function () {

    console.log("Oh, My God！")

}

function Child4() {

    **Parent4****.call(this);**

    this.type = "child4";

}

**Child4.prototype = Object.create(Parent4.prototype);**

**Child4.prototype.constructor = Child4;**

```

**7、ES6继承**

```javascript
class Parent { }

class Child1 extends Parent {

    constructor(x, y, colors) {

       super(x, y); // 调用父类的constructor(x, y)

        this.colors = colors;

    }

    toString() {

        return this.colors + ' ' + super.toString(); // 调用父类的toString()

    }

}
```

