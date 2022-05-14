---
title: 如何在js代码中消灭for循环实例详解
date: 2021-02-16 00:52:53
tags: JavaScript
---

转载自:https://www.jb51.net/article/144662.htm

补充一：看来很多人没看完文章就评论了。我在文章末尾说了，是不写 for 循环，不是不用 for 循环。简单陈述不写 for 循环的理由：for 循环易读性差，而且鼓励写指令式代码和执行副作用。更多参考[这篇文章](https://hackernoon.com/rethinking-javascript-death-of-the-for-loop-c431564c84a8)

1、for 循环性能最好。回应：微观层面的代码性能优化，不是你应该关注的。我在文章中演示了，对百万级数据的操作，reduce 只比 for 循环慢 8 ms，可忽略不计。如果你要操作更大的数据，要考虑下换语言了。

- [Fast code is NOT important](https://www.youtube.com/watch?v=PhUb7y9WZGs)
- [The Sad Tragedy of Micro-Optimization Theater](https://blog.codinghorror.com/the-sad-tragedy-of-micro-optimization-theater/)
- [Ditching the Micro-Optimization Fetish](https://www.simplethread.com/ditching-the-micro-optimization-fetish/)

2、不用 for 循环不能 break。回应：用递归。我在[这篇文章](https://www.jb51.net/article/144663.htm)里有解释怎样解决递归爆栈。

3、框架都用 for 循环！回应：框架考虑的场景和你不一样。React 和 Vue 还用 class 来创建对象呢。你该跟着学吗？事实上你应该用工厂函数。[Class vs Factory function: exploring the way forward](https://medium.freecodecamp.org/class-vs-factory-function-exploring-the-way-forward-73258b6a8d15)

**一，用好 filter，map，和其它 ES6 新增的高阶遍历函数**

问题一：

将数组中的空值去除

```javascript
const arrContainsEmptyVal = [3, 4, 5, 2, 3, undefined, null, 0, ""];
```

答案：

```javascript
const compact = arr => arr.filter(Boolean);
```

问题二：

将数组中的 VIP 用户余额加 10

```javascript
const VIPUsers = [
 { username: "Kelly", isVIP: true, balance: 20 },
 { username: "Tom", isVIP: false, balance: 19 },
 { username: "Stephanie", isVIP: true, balance: 30 }
];
```

答案：

```javascript
VIPUsers.map(
 user => (user.isVIP ? { ...user, balance: user.balance + 10 } : user)
);
```

问题三：

判断字符串中是否含有元音字母

```javascript
const randomStr = "hdjrwqpi";
```

答案：

```javascript
const isVowel = char => ["a", "e", "o", "i", "u"].includes(char);
const containsVowel = str => [...str].some(isVowel);
  
containsVowel(randomStr);
```

问题四：

判断用户是否全部是成年人

```javascript
const users = [
 { name: "Jim", age: 23 },
 { name: "Lily", age: 17 },
 { name: "Will", age: 25 }
];
```

答案：

```javascript
users.every(user => user.age >= 18);
```

问题五：

找出上面用户中的未成年人

答案：

```javascript
const findTeen = users => users.find(user => user.age < 18);
 
findTeen(users);
```

问题六：

将数组中重复项清除

```javascript
const dupArr = [1, 2, 3, 3, 3, 3, 6, 7];
```

答案：

```javascript
const uniq = arr => [...new Set(arr)];
 
uniq(dupArr);
```

问题七：

生成由随机整数组成的数组，数组长度和元素大小可自定义

答案：

```javascript
const genNumArr = (length, limit) =>
Array.from({ length }, _ => Math.floor(Math.random() * limit));
 
genNumArr(10, 100);
```

问题八：

不借助原生高阶函数，定义 reduce

答案：

```javascript
const reduce = (f, acc, arr) => {
 if (arr.length === 0) return acc;
 const [head, ...tail] = arr;
 return reduce(f, f(head, acc), tail);
};
```

问题九：

将多层数组转换成一层数组

```javascript
const nestedArr = [1, 2, [3, 4, [5, 6]]];
```

答案：

```javascript
const flatten = arr =>
 arr.reduce(
 (flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next),
 []
 );
```

问题十：

将下面数组转成对象，key/value 对应里层数组的两个值

```javascript
const objLikeArr = [["name", "Jim"], ["age", 18], ["single", true]];
```

答案：

```javascript
const fromPairs = pairs =>
 pairs.reduce((res, pair) => ((res[pair[0]] = pair[1]), res), {});
 
fromPairs(objLikeArr);

```

问题十一：

取出对象中的深层属性

```javascript
const deepAttr = { a: { b: { c: 15 } } };

```

答案：

```javascript
const pluckDeep = path => obj =>
 path.split(".").reduce((val, attr) => val[attr], obj);
 
pluckDeep("a.b.c")(deepAttr);

```

问题十二：

将用户中的男性和女性分别放到不同的数组里：

```javascript
const users = [
 { name: "Adam", age: 30, sex: "male" },
 { name: "Helen", age: 27, sex: "female" },
 { name: "Amy", age: 25, sex: "female" },
 { name: "Anthony", age: 23, sex: "male" },
];

```

答案：

```javascript
const partition = (arr, isValid) =>
 arr.reduce(
 ([pass, fail], elem) =>
 isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]],
 [[], []],
 );
  
const isMale = person => person.sex === "male";
 
const [maleUser, femaleUser] = partition(users, isMale);

```

问题十三：

reduce 的计算过程，在范畴论里面叫 catamorphism，即一种连接的变形。和它相反的变形叫 anamorphism。现在我们定义一个和 reduce 计算过程相反的函数 unfold（注：reduce 在 Haskell 里面叫 fold，对应 unfold）

```javascript
const unfold = (f, seed) => {
 const go = (f, seed, acc) => {
 const res = f(seed);
 return res ? go(f, res[1], acc.concat(res[0])) : acc;
 };
 return go(f, seed, []);
};

```

根据这个 unfold 函数，定义一个 Python 里面的 range 函数。

答案：

```javascript
const range = (min, max, step = 1) =>
 unfold(x => x < max && [x, x + step], min);

```

**三，用递归代替循环**

问题十四：

将两个数组每个元素一一对应相加

```javascript
const num1 = [3, 4, 5, 6, 7];
const num2 = [43, 23, 5, 67, 87];

```

答案：

```javascript
const zipWith = f => xs => ys => {
 if (xs.length === 0 || ys.length === 0) return [];
 const [xHead, ...xTail] = xs;
 const [yHead, ...yTail] = ys;
 return [f(xHead)(yHead), ...zipWith(f)(xTail)(yTail)];
};
 
const add = x => y => x + y;
 
zipWith(add)(num1)(num2);

```

问题十五：

将 Stark 家族成员提取出来。注意，目标数据在数组前面，使用 filter 方法遍历整个数组是浪费。

```javascript
const houses = [
 "Eddard Stark",
 "Catelyn Stark",
 "Rickard Stark",
 "Brandon Stark",
 "Rob Stark",
 "Sansa Stark",
 "Arya Stark",
 "Bran Stark",
 "Rickon Stark",
 "Lyanna Stark",
 "Tywin Lannister",
 "Cersei Lannister",
 "Jaime Lannister",
 "Tyrion Lannister",
 "Joffrey Baratheon"
];

```

答案：

```javascript
const takeWhile = f => ([head, ...tail]) =>
 f(head) ? [head, ...takeWhile(f)(tail)] : [];
 
const isStark = name => name.toLowerCase().includes("stark");
 
takeWhile(isStark)(houses);

```

**四，使用高阶函数遍历数组时可能遇到的陷阱**

问题十六：

从长度为 100 万的随机整数组成的数组中取出偶数，再把所有数字乘以 3

```javascript
// 用我们刚刚定义的辅助函数来生成符合要求的数组
const bigArr = genNumArr(1e6, 100);

```

能运行的答案：

```javascript
const isOdd = num => num % 2 === 0;
const triple = num => num * 3;
 
bigArr.filter(isOdd).map(triple);

```

```javascript
const results = [];
for (let i = 0; i < bigArr.length; i++) {
 if (isOdd(bigArr[i])) {
 results.push(triple(bigArr[i]));
 }
}
//这种写法叫 transduce。有很多工具库提供了 transducer 函数。比如 transducers-js。除了用 transducer 来遍历数组，还能用它来遍历对象和其它数据集。功能相当强大。
const pipe = (...fns) => (...args) => fns.reduce((fx, fy) => fy(fx), ...args);
bigNum.reduce(
 pipe(
 filter(isOdd),
 map(triple)
 )(pushReducer),
 []
);
```

**六，for 循环和 for ... of 循环的区别**

for ... of 循环是在 ES6 引入 Iterator 后，为了遍历 Iterable 数据类型才产生的。EcmaScript 的 Iterable 数据类型有数组，字符串，Set 和 Map。for ... of 循环属于重型的操作（具体细节我也没了解过），如果用 AirBNB 的 ESLint 规则，在代码中使用 for ... of 来遍历数组是会被禁止的。

那么，for ... of 循环应该在哪些场景使用呢？目前我发现的合理使用场景是遍历自定义的 Iterable。来看这个题目：

问题十七：

将 Stark 家族成员名字遍历，每次遍历暂停一秒，然后将当前遍历的名字打印来，遍历完后回到第一个元素再重新开始，无限循环。

```javascript
const starks = [
 "Eddard Stark",
 "Catelyn Stark",
 "Rickard Stark",
 "Brandon Stark",
 "Rob Stark",
 "Sansa Stark",
 "Arya Stark",
 "Bran Stark",
 "Rickon Stark",
 "Lyanna Stark"
];
```

答案：

```javascript
function* repeatedArr(arr) {
 let i = 0;
 while (true) {
 yield arr[i++ % arr.length];
 }
}
 
const infiniteNameList = repeatedArr(starks);
 
const wait = ms =>
 new Promise(resolve => {
 setTimeout(() => {
 resolve();
 }, ms);
 });
 
(async () => {
 for (const name of infiniteNameList) {
 await wait(1000);
 console.log(name);
 }
})();
```