## JavaScript

1. JS数据类型，数据类型判断的方法？instanceof判断复杂数据类型的原理是什么？toString()和constructor有了解过吗？
2. new的原理？手写new
4. 构造函数，实例对象和原型对象是怎么挂载的
5. 作用域，看代码说输出，后修改成this指向
7. event loop 原理, 宏任务微任务, 你知道有哪些回调?
8. 讲对象循环引用分为哪几种情况
9. 手写：js实现类
10. js文件引入的方式？
13. this的指向规则
14. 讲讲异步编程方案，介绍一下自己常用的
15. call apply bind区别
16. 原型 获取原型的方法
21. JS编译的顺序，JS编译后的代码与原先的代码怎么转换?扯了扯我了解的js
25. 作用域，作用域链
26. 原型链，[]的原型链 说出来，讲讲原型链，原型链的终点，组合继承
27. 模块化
28. 怎么检测抛出错误
30. 怎么给没有生成的元素绑定事件
31. 数组的一些api
32. 数组和伪数组的区别？为什么要设置成伪数组？
33. 深拷贝?循环引用？
35. 闭包的定义？闭包的优点？你在哪些情况下用到了闭包？用闭包有什么弊端？、
36. 常用的继承及实现方式 优缺点
37. 怎么判断undifind 和null，怎么判断null 和Object
38. 如何去除字符串中的最后一个字符（substr，substring，lastindexof）
39. 对于原型的理解，原型链继承和class区别？简述 JavaScript 原型，原型链原理，如何基于原型链实现继承？
42. js异步处理发展史
43. typeof、 instanceof区别
44. 手写题：instanceof
45. 对象属性值的解构赋值
46. 说一下new的过程，如果构造函数返回一个对象，得到的是new的对象还是返回的对象
48. object.create的作用
49. 手写一个判断类型方法（希望用object.tostring方法）
50. arguments辨析
51. 数组打平的方式，array.flat存在什么问题？是怎么实现的
52. try catch和throw new error的区别
53. commonjs和es6模块化的区别
54. typeof判断
55. JS 执行上下文
56. splice和slice你能说说有啥用和区别吗？
57. [] + [] = ? , {} + [] = ? , + '123' = ?
58. ES6解构对象改变变量名、解构数组
59. 类和方法的基本用法，讲讲继承。
60. js隐式转换判断
61. 事件循环机制，渲染是在宏任务完成之后还是微任务完成之后，事件循环机制线程是独立吗
62. 原型链，proto与prototype的区别，原型链继承的原理，原型链添加函数实现字符串翻转
63. 匿名函数与包含它的函数的关系
64. 高阶函数
65. js作用域链 作用域链怎么工作？原形链有原型对象，作用域链有什么？
66. 如果用面向对象的思路去写js有什么优缺点
67. parseInt和number的区别
68. 0.1+0.2 浮点数存储 ==和===
69. js单线程 DOMContentloaded和window.onload
70. js如何监听一个元素的变化
71. bind实现
72. web worker
73. 继承方式以及缺点，super用法
74. 手写apply
75. 同步任务和异步任务区别
76. Array.map some forEach区别
77. json格式的数据校验？
78. 平时用if else 还是用switch？ 两者原理、区别和使用场景
79. js数组遍历的方法以及它们的性能比较
80. 实现一个apply函数
81. new一个对象的过程
82. 暂时性死区
83. var和function变量提升的优先级
84. 如何遍历对象自身的属性
85. js的精度
86. 如何去掉一个字符串的重复字符
87. 如何遍历字符串
88. charAt()知道么
89. setTimeout和setInterval差别,以及哪个定时更准
91. for循环中可以用const定义变量吗,
92. for in /for of
93. 还问了一些 隐式转换 和 其它数据类型 转 bool 的问题
94. 如何判断数组的数据类型，有哪几种方法
95. js里面有哪些可以改变this(默认绑定，隐式绑定，call,apply,bind,new绑定 (需要注意严格模式和绑定传入null的情况 -> window或者undefined))
96. 讲一下js单线程，如何处理异步的
97. 遍历数组最常用的方法有
98. 识别某个数组值小于0的元素会使用哪种遍历
99. 如果数组类有一个值小于0就return false，全部值大于0就return true，用哪种方法遍历
100. 既然es5已经有foreach，为什么es6还会出map for of
101. js 嵌套数组的最大深度
102. js url解析为对象
103. 怎么判断数组类型?(Array.isArray，toString，instanceof ) instanceof原理? (递归找原型链)
104. 为什么在 js 中0.1 + 0.2 !== 0.3, 名词解释什么叫定点和浮点, js 存储数字和 C 语言有什么区别?
105. number 类型表示整数的最大范围
106. 讲讲 js 原型链， 手写用Object.create()实现继承的代码
107. 简单数据类型和复杂数据类型的区别？
108. （事件代理）如果一个列表中有很多项，给每个项都绑定点击事件的话会有很大开销，怎么优化？浏览器的事件传播机制是怎样的？有考虑过为什么要有这样的事件流（传进来又传出去）吗？
109. 如果用new调用函数，而这个函数中有return，那它return出来的是什么？
110. 用new调用函数时怎么把新创建的对象与构造函数的原型联系起来的？（或者说实例对象、原型对象和构造函数三者的关系是怎样的？）
111. 静态作用域和动态作用域
112. 实现indexOf
113. 闭包的变量是怎么存储的?(不知道) 又问了垃圾回收机? 又问了js 的数据类型?
114. canvas 能不能识别出图片中的数字(验证码的识别)
115. 怎么判断一个变量是一个数组？怎么判断一个变量是null？
116. 实现String.prototype.indexOf，以及优化
117. 临时性死区
118. repeat(console.log, 4, 3000)函数实现
119. 闭包，利用闭包改造函数
120. 实现一个复杂度o(n)的数组去重，返回去重后的元素个数，不能使用任何数组相关的方法
122. postMessage、fetch是宏任务还是微任务，小程序调用JS Bridge 是宏任务还是微任务，区别微任务宏任务的标准是什么？
123. 如何实现一个 setTimeout
124. 你了解得数组遍历方式有哪些，你觉得那个性能最优那
125. 一个异步任务调度器，最多同时执行两个异步任务
126. 有哪些内置对象
127. null和undefined的区别
128. setTimeout,setInterval,requestAnimationFrame的区别
129. Ajax是异步的返回一个promise，那你怎么使用XHR封装一个ajax？
130. 手撕apply + 自己写测试
131. Object.defineProperty 与Proxy的区别？
132. {}、new Object()，Object.create({})的区别?
133. new做了什么？
134. js中if大括号包裹住的是否是块作用域
135. 限制输入只能由英文字母、||、&&、(、)、构成，判断输入是否符合规范，当括号多余时，需要去除多余括号
136. 手撕代码：继承的几种方式，给了一个场景，手撕寄生组合继承
137. object.create具体是做什么的
138. 计时器，顺带考了下[AMD](https://www.nowcoder.com/jump/super-jump/word?word=AMD)，UMD，ESM等规范的区别
139. 还问了如何不使用额外变量交换变量a,b的值
140. 用原生js给一个div添加点击事件怎么做
141. 原型链得关于原型链得new a(),说一下原型链到null
143. 常见隐式转换
144. 最大安全数字 Number.MAX_VALUE
145. +new Date为什么得到时间戳
146. 如何实现同步代码异步化(傻眼)
147. this理解
148. Array.prototype定义的考察
149. 函数和var变量的优先级
150. 原型链判断===

## ES

1. const,let,var的区别？
2. ES6 语法中的let/const 的实现
3. 箭头函数和普通函数的区别？
4. 基本数据类型里面的symbol的应用场景
5. 手写promise.all ，Promise的方法和api
6. Generator、Async之间的区别
7. proxy可以监听嵌套对象的变化吗
8. Map和weakMap的区别
9. 浅拷贝、深拷贝,深拷贝的api
10. promise穿透是怎么实现的
11. async和await的原理是什么
12. require和import的区别
13. 实现柯里化
14. Map和Set和Array区别
15. array自身的方法和外部方法区别
16. forEach性能和for let 性能比较
17. 数组reduce方法
18. JS 实现一个Promise类
19. es新特性
20. 讲讲promise，all里面有一个失败了返回什么，race第一个结束的失败了返回什么
21. 新建promise是同步还是异步
22. async await原理 generator每一步next返回什么
23. 手写promise.race()
24. 手写isPromise
25. 使用promise，实现一个sleep函数？
26. set和map的区别
27. sleep函数
28. promise.all和promise.race，promise.all有一个reject了，后面的还会执行吗，如何让后面的也执行（promise.allsettled），Promise.all是有一个错误就返回还是等所有promise都执行完，如果要等所有promise执行完再返回怎么办？手写题 promise的超时重新请求，参数（fn，times，interval）
29. 实现一个自己的reduce
30. ["1","2","3"].map(parseInt)结果，并解释原因，如何返回[1,2,3] 用你能想到的最简单的方案(要求使用[].map())
31. async await 如何捕获异常
32. Promise 用过吗？能实现 Promise.finally ？ 或者Promise.all ?
33. 变量提升 promise.all和race 箭头函数跟普通函数
34. Promise是解决什么问题的
35. set和map的区别？ map与object的区别？ 获取上面两种属性的个数？ 遍历上述两种属性？ map和object的key遍历顺序是怎样的？
36. 什么是promise？实现一个简单的promise？Promise.all和Promise.race，promise all重写实现失败数量限制,而不是一个失败就reject
37. common.js和其他的模块机制？
38. 为什么箭头函数不能new
39. 为什么会有promise，promise和callback的区别
40. 讲讲symbol和bigint
41. 用promise封装一个异步请求(代码题)
42. proxy的优缺点
43. map、 weakMap区别
44. Promise的构造函数是异步还是同步的
45. 实现forEach
46. const 一个数组 可以push和pop吗？为什么?
47. Promise.all和Promise.race , 能说说promise的几个状态吗，以及这些状态之间的改变
48. symbol介绍
49. map和weakmap区别(强引用，垃圾回收区别)
50. es6为什么加入class这个关键字？
51. es6为什么引入Promise对象？
52. Promise与es5中的callback编程有什么不同？
53. es6中的bigint
54. 实现一个模板字符串转义
55. 为什么const定义的变量不能被修改？复合类型为什么可以被修改？×
56. es6转换es5怎么处理for循环里面settimeout打印局部变量
57. 通过reduce来实现map函数
58. generator
59. 讲讲Object.definProperty() 和 ES6中的Proxy？或者说 Proxy有哪些好处？
60. 箭头函数如何拿到不定项参数
61. promise的串行和并行
62. promise实现同一时间内限制并发请求数
63. Map和Set的区别
64. 说一下proxy是什么模式
65. 手写promise.all(写的不好没考虑到catch)，就问了catch还有then第二个函数得关系
66. Promise的链式调用
67. 把setTimeout封装成Promise

