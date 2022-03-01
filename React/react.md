## React

### react中class组件和函数组件的区别

#### 一、类组件

类组件，顾名思义，也就是通过使用ES6类的编写形式去编写组件，该类必须继承React.Component

如果想要访问父组件传递过来的参数，可通过this.props的方式去访问

在组件中必须实现render方法，在return中返回React对象，如下：

```jsx
class Welcome extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

#### 二、函数组件

函数组件，顾名思义，就是通过函数编写的形式去实现一个React组件，是React中定义组件最简单的方式

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

函数第一个参数为props用于接收父组件传递过来的参数

#### 三、区别

##### 编写形式

两者最明显的区别在于编写形式的不同，同一种功能的实现可以分别对应类组件和函数组件的编写形式

函数组件：

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

类组件：

```jsx
class Welcome extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

##### 状态管理

在hooks出来之前，函数组件就是无状态组件，不能保管组件的状态，不像类组件中调用setState

如果想要管理state状态，可以使用useState，如下：

```jsx
const FunctionalComponent = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div>
            <p>count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Click</button>
        </div>
    );
};
```

在使用hooks情况下，一般如果函数组件调用state，则需要创建一个类组件或者state提升到你的父组件中，然后通过props对象传递到子组件

##### 生命周期

在函数组件中，并不存在生命周期，这是因为这些生命周期钩子都来自于继承的React.Component

所以，如果用到生命周期，就只能使用类组件

但是函数组件使用useEffect也能够完成替代生命周期的作用，这里给出一个简单的例子：

```jsx
const FunctionalComponent = () => {
    useEffect(() => {
        console.log("Hello");
    }, []);
    return <h1>Hello, World</h1>;
};
```

上述简单的例子对应类组件中的componentDidMount生命周期

如果在useEffect回调函数中return一个函数，则return函数会在组件卸载的时候执行，正如componentWillUnmount

```jsx
const FunctionalComponent = () => {
 React.useEffect(() => {
   return () => {
     console.log("Bye");
   };
 }, []);
 return <h1>Bye, World</h1>;
};
```

##### 调用方式

如果是一个函数组件，调用则是执行函数即可：

```jsx
// 你的代码 
function SayHi() { 
    return <p>Hello, React</p> 
} 
// React内部 
const result = SayHi(props) // » <p>Hello, React</p>
```

如果是一个类组件，则需要将组件进行实例化，然后调用实例对象的render方法：

```jsx
// 你的代码 
class SayHi extends React.Component { 
    render() { 
        return <p>Hello, React</p> 
    } 
} 
// React内部 
const instance = new SayHi(props) // » SayHi {} 
const result = instance.render() // » <p>Hello, React</p>
```

##### 获取渲染的值

首先给出一个示例

函数组件对应如下：

```jsx
function ProfilePage(props) {
  const showMessage = () => {
    alert('Followed ' + props.user);
  }

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  }

  return (
    <button onClick={handleClick}>Follow</button>
  )
}
```

类组件对应如下：

```jsx
class ProfilePage extends React.Component {
  showMessage() {
    alert('Followed ' + this.props.user);
  }

  handleClick() {
    setTimeout(this.showMessage.bind(this), 3000);
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Follow</button>
  }
}
```

两者看起来实现功能是一致的，但是在类组件中，输出this.props.user，Props在 React中是不可变的所以它永远不会改变，但是 this 总是可变的，以便您可以在 render 和生命周期函数中读取新版本

因此，如果我们的组件在请求运行时更新。this.props 将会改变。showMessage方法从“最新”的 props 中读取 user

而函数组件，本身就不存在this，props并不发生改变，因此同样是点击，alert的内容仍旧是之前的内容

##### 小结

两种组件都有各自的优缺点

函数组件语法更短、更简单，这使得它更容易开发、理解和测试

而类组件也会因大量使用 this而让人感到困惑

### 生命周期

**React 16.8+的生命周期分为三个阶段，分别是挂载阶段、更新阶段、卸载阶段。**

#### [挂载](https://so.csdn.net/so/search?q=挂载&spm=1001.2101.3001.7020)阶段

- constructor: 构造函数，最先被执行,我们通常在构造函数里初始化`state`对象或者给自定义方法绑定`this`
- getDerivedStateFromProps: `static getDerivedStateFromProps(nextProps, prevState)`，这是个静态方法,当我们接收到新的属性想去修改`state`，可以使用`getDerivedStateFromProps`
- render: `render`函数是纯函数，只返回需要渲染的东西，不应该包含其它的业务逻辑,可以返回原生的DOM、React组件、Fragment、Portals、字符串和数字、Boolean和null等内容
- componentDidMount: 组件装载之后调用，此时可以获取到DOM节点并操作，比如对canvas，svg的操作，服务器请求，订阅都可以写在这个里面，但是记得在`componentWillUnmount`中取消订阅。

#### 更新阶段

- getDerivedStateFromProps: 此方法在更新个挂载阶段都可能会调用
- shouldComponentUpdate: `shouldComponentUpdate(nextProps, nextState)`，有两个参数`nextProps`和`nextState`，表示新的属性和变化之后的`state`，返回一个布尔值，`true`表示会触发重新渲染，`false`表示不会触发重新渲染，默认返回`true`,我们通常利用此生命周期来优化React程序性能
- render: 更新阶段也会触发此生命周期
- getSnapshotBeforeUpdate: `getSnapshotBeforeUpdate(prevProps, prevState)`，这个方法在`render`之后，`componentDidUpdate`之前调用，有两个参数`prevProps`和`prevState`，表示之前的属性和之前的`state`，这个函数有一个返回值，会作为第三个参数传给`componentDidUpdate`，如果你不想要返回值，可以返回null，此生命周期必须与`componentDidUpdate`搭配使用
- componentDidUpdate: `componentDidUpdate(prevProps, prevState, snapshot)`，该方法在`getSnapshotBeforeUpdate`方法之后被调用，有三个参数`prevProps`，`prevState`，`snapshot`，表示之前的props，之前的state，和snapshot。第三个参数是`getSnapshotBeforeUpdate`返回的,如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至`getSnapshotBeforeUpdate`，然后在 `componentDidUpdate`中统一触发回调或更新状态。

#### 卸载阶段

- componentWillUnmount: 当组件被卸载或者销毁了就会调用，我们可以在这个函数里去清除一些定时器，取消网络请求，清理无效的DOM元素等垃圾清理工作。
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210515113558981.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE2NTI1Mjc5,size_16,color_FFFFFF,t_70#pic_center)

#### getDerivedStateFromProps(nextProps, prevState)

它应该返回一个对象来更新状态，或者返回null来不更新任何内容

代替componentWillReceiveProps()。老版本中的componentWillReceiveProps()方法判断前后两个 props 是否相同，如果不同再将新的 props 更新到相应的 state 上去。这样做一来会破坏 state 数据的单一数据源，导致组件状态变得不可预测，另一方面也会增加组件的重绘次数。在 componentWillReceiveProps 中，我们一般会做以下两件事，一是根据 props 来更新 state，二是触发一些回调，如动画或页面跳转等。

在老版本的 React 中，这两件事我们都需要在 componentWillReceiveProps 中去做。而在新版本中，官方将更新 state 与触发回调重新分配到了 getDerivedStateFromProps 与 componentDidUpdate 中，使得组件整体的更新逻辑更为清晰。而且在getDerivedStateFromProps 中还禁止了组件去访问 this.props，强制让开发者去比较 nextProps 与 prevState 中的值，以确保当开发者用到 getDerivedStateFromProps 这个生命周期函数时，就是在根据当前的 props 来更新组件的 state，而不是去做其他一些让组件自身状态变得更加不可预测的事情

#### getSnapshotBeforeUpdate(prevProps, prevState)

代替componentWillUpdate。常见的 componentWillUpdate 的用例是在组件更新前，读取当前某个 DOM 元素的状态，并在 componentDidUpdate 中进行相应的处理。

#### 这两者的区别在于：

在 React 开启异步渲染模式后，在 render 阶段读取到的 DOM 元素状态并不总是和 commit 阶段相同，这就导致在componentDidUpdate 中使用 componentWillUpdate 中读取到的 DOM 元素状态是不安全的，因为这时的值很有可能已经失效了。
getSnapshotBeforeUpdate 会在最终的 render 之前被调用，也就是说在 getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证与 componentDidUpdate 中一致的。
此生命周期返回的任何值都将作为参数传递给componentDidUpdate()。

#### 可以获取dom的生命周期

componentDidMount

componentDidUpdate

#### 可以修改state的生命周期

getDerivedStateFromProps

componentDidMount

shouldComponentUpdate

getSnapshotBeforeUpdate

componentDidUpdate

#### 组件生命周期的执行次数是什么样子的？


只执行一次： constructor、componentDidMount

执行多次：render 、getDerivedStateFromProps、getSnapshotBeforeUpdate、shouldComponentUpdate、componentDidUpdate

有条件的执行：componentWillUnmount（页面离开，组件销毁时）


#### 父子组件生命周期顺序

假设组件嵌套关系是 App里有parent组件，parent组件有child组件。
![img](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180830111120627-1774037102.png)

**如果不涉及到setState更新，第一次渲染的顺序如下：**
![img](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180830111229956-69121477.png)

```javascript
App：   constructor --> getDerivedStateFromProps -->  render --> 
parent: constructor --> getDerivedStateFromProps -->  render --> 
child:    constructor --> getDerivedStateFromProps -->  render  --> 
componentDidMount (child) -->  componentDidMount (parent) --> componentDidMount (App)
```

**这时候触发App的setState事件**

![img](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180830111331526-1907166573.png)

```javascript
App：   getDerivedStateFromProps --> shouldComponentUpdate --> render --> 
parent: getDerivedStateFromProps --> shouldComponentUpdate --> render --> 
child:    getDerivedStateFromProps --> shouldComponentUpdate --> render -->
getSnapshotBeforeUpdate(child) --> componentDidUpdate (child) -->  getSnapshotBeforeUpdate(parent) --> componentDidUpdate (parent) --> getSnapshotBeforeUpdate(App) -->  componentDidUpdate (App)
```

**那如果是触发parent的setState呢？**

![img](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180830111503596-744353039.png)

```javascript
parent： getDerivedStateFromProps --> shouldComponentUpdate -->  render --> 
child:     getDerivedStateFromProps --> shouldComponentUpdate -->  render --> 
getSnapshotBeforeUpdate(child) --> componentDidUpdate (child) -->  getSnapshotBeforeUpdate(parent) --> componentDidUpdate (parent) --> 
```

**那如果是只是触发了child组件自身的setState呢？**

![img](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180830111543126-1591848462.png)

```javascript
child:     getDerivedStateFromProps --> shouldComponentUpdate -->  render --> 
getSnapshotBeforeUpdate(child) --> componentDidUpdate (child) -->
```

##### 结论：

1. 如图：完成前的顺序是从根部到子部，完成时时从子部到根部。（类似于事件机制）
2. 每个组件的红线（包括初次和更新）生命周期时一股脑执行完毕以后再执行低一级别的红线生命周期。

![img](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180830111612245-37028468.png)

1. 第一级别的组件setState是不能触发其父组件的生命周期更新函数，只能触发更低一级别的生命周期更新函数。

总结起来就如下图：

![img](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180830111656526-534965409.png)

16后的版本

**父子组件生命周期函数执行顺序：**

进入页面：parent-constructor -> parent-getDerivedStateFromProps -> parent-render -> child-constructor -> child-getDerivedStateFromProps -> child-render -> child-componentDidMount -> parent-componentDidMount

更新页面：parent-getDerivedStateFromProps -> parent-shouldComponentUpdate -> parent-render -> child-getDerivedStateFromProps -> child-shouldComponentUpdate -> child-render -> child-componentDidUpdate -> parent-componentDidUpdate

销毁页面：parent-componentWillUnmount -> child-componentWillUnmount

### Hooks
####  Hooks 如何模拟类组件生命周期

| class 组件               | Hooks 组件                |
| ------------------------ | ------------------------- |
| constructor              | useState                  |
| getDerivedStateFromProps | useState 里面 update 函数 |
| shouldComponentUpdate    | useMemo                   |
| render                   | 函数本身                  |
| componentDidMount        | useEffect空数组或固定值   |
| componentDidUpdate       | useEffect                 |
| componentWillUnmount     | useEffect 里面返回的函数  |
| componentDidCatch        | 无                        |
| getDerivedStateFromError | 无                        |

#### **fiber概述**

在现有React中，更新过程是同步的，这可能会导致性能问题。

当React决定要加载或者更新组件树时，会做很多事，比如调用各个组件的生命周期函数，计算和比对Virtual DOM，最后更新DOM树，这整个过程是同步进行的，也就是说只要一个加载或者更新过程开始，那React就会一鼓作气运行到底，中途绝不停歇。在此过程中浏览器渲染引擎处于挂起的状态，无法进行任何渲染，浏览器无法执行任何其他的任务，调用栈如下图

![img](https://pic3.zhimg.com/80/v2-15a6f7dc1c1ee369442e30eb1575ee5a_1440w.jpg)

破解javascript中同步操作时间过长的方法其实很简单——分片。

把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会。

React Fiber把更新过程碎片化，执行过程如下面的图所示，每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

有了分片之后，更新过程的调用栈如下图所示，中间每一个波谷代表深入某个分片的执行过程，每个波峰就是一个分片执行结束交还控制权的时机。

![img](https://pic2.zhimg.com/80/v2-5e49d551d11f37d637d241fff80434a5_1440w.jpg)

维护每一个分片的数据结构，就是Fiber。其数据结构的定义如下：

```js
Fiber = {
  tag, // 标记不同的组件类型
  key, // ReactElement里面的key
  elementType, // ReactElement.type，也就是我们调用`createElement`的第一个参数
  type, // 一般是`function`或者`class`
  stateNode, // 在浏览器环境，就是DOM节点

  return, // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  child, // 单链表树结构，指向自己的第一个子节点
  sibling, // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点
  index,
  ref, // ref属性

  pendingProps, // 即将更新的props
  memoizedProps, // 更新props
  memoizedState, // 当前状态
  dependencies, // 一个列表，存放这个Fiber依赖的context

  flags, // Effect，用来记录当前fiber的tag，插入、删除、更新的状态
  subtreeFlags,
  deletions,
  updateQueue, // 该Fiber对应的组件产生的Update会存放在这个队列里面
  nextEffect, // 单链表用来快速查找下一下side effect
  firstEffect, // 自述中第一个side effect
  lastEffect, // 子树中最后一个side effect

  lanes, // 当前Fiber更新的优先级
  childLanes,
  // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  // 在渲染完成之后他们会交换位置
  alternate,

  // 用来描述当前Fiber和他子树的`Bitfield`
  // 共存的模式表示这个子树是否默认是异步渲染的
  // Fiber被创建的时候他会继承父Fiber
  // 其他的标识也可以在创建的时候被设置
  // 但是在创建之后不应该再被修改，特别是他的子Fiber创建之前
  mode,
  // 其余为调试相关的，收集每个Fiber和子树渲染时间的
  //...
}
```

在react-hooks源码解析中我们主要涉及到memoizedState、updateQueue、flags字段。

#### **react工作流程**

React16架构可以分为三层：

调度阶段 —— 调度任务的优先级，高优任务优先进入render阶段
render阶段 —— 负责找出变化的组件，生成effectList
commit阶段 —— 根据effectList，将变化的组件渲染到页面上，并且执行生命周期、useEffect、useLayoutEffect回调函数等。

#### **函数组件执行的时机**

函数组件是在**render阶段**执行的，而每次更新渲染都会进入render阶段，所以每次更新的时候，都会执行函数组件，类似class的render方法。

#### **useState**

##### **示例解析**

```js
import React, { useState } from 'react'
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div>{count}</div>
      <div onClick={() => {
        setCount(1);
        setCount((state) => count + 2);
        setCount((state) => count + 3);
      }}>加</div>
    </div>
  )
}
export default App;
```

对于上面的示例，我们需要关注的点是第一次调用函数组件时做了什么事情（**首次渲染**）？**setCount**时执行了什么事情？再次执行函数组件时做了什么事情（**再次渲染**）？这里先概括一下：

1）**首次渲染**主要是初始化hook，将初始值存入hook内，将hook插入到fiber.memoizedState的末尾。

2）**setCount**主要是将更新信息插入到hook.queue.penging的末尾。**这里注意一下为什么没有直接更新hook.memoizedState呢？**答案是react是批量更新的，需要将更新信息先存储下来，等到合适的时机统一计算更新。

3）**再次渲染**主要是根据setCount存储的更新信息来计算最新的state。

**（1）首次渲染**

我们知道hook可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。所以hook很大一个功能是存储state。在class组件中我们的state是存储在fiber.memoizedState字段的，是一个对象。同理在函数组件内hook（所有的hook，不止是useState）的信息也是存储在fiber.memoizedState字段.的。以上示例中，当我们第一次执行 **const [count, setCount] = useState(0)** 时，我们得到的fiber.memoizedState的数据结构如图所示：

```js
function mountState( initialState ) {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  });
  const dispatch = queue.dispatch = dispatchAction.bind(
    null, currentlyRenderingFiber, queue,
  );
  return [hook.memoizedState, dispatch];
}
```

字段释义：

**baseState**：每次更新时的基准state，大部分情况下和**memoizedState一致，有异步更新时会有差别**

**memoizedState**：保存本hook的信息，不同的hook存储的结构不一致，在useState上代表的是state值，在上例中就是0

**queue**：记录更新的信息

**dispatchAction**：在setCount时候所执行的方法

**lastRenderedReducer**：每次计算新state时候的方法

**lastRenderedState**：上一次state的值

**pending**：存储更新，setCount再讲一下其结构

**baseQueue**：表示上一次计算新state之后，剩下的优先级低的更新，结构同queue.pending

hook是这个结构，useReducer和useState完全一样，其他的hook只用到了memoizedState字段。

**（2）setCount**

当我们点击按钮，在执行

setCoun(1)

setCount((state) => state + 2)

setCount((state) => state + 3)

时，我们得到的fiber的数据结构如图所示，其中hook.queue.pengding为环状链表：

![img](https://pic1.zhimg.com/80/v2-675f9477743944ba6e7baf9038029cd0_1440w.jpg)

解读一下queue.pending的数据结构
action：要更新的信息，可以是function、变量

eagetReducer：如果是第一个更新，在dispatchAction的时候就计算出来存储在这里

eagetReducer：如果是第一个更新，在dispatchAction的时候就存储reducer

lane：优先级

next: 指向下一个更新

**Q：关于更新队列为什么是环状？**

**A**：这是因为方便定位到链表的第一个元素。pending指向它的最后一个update，pending.next指向它的第一个update。

试想一下，若不使用环状链表，pending指向最后一个元素，需要遍历才能获取链表首部。即使将pending指向第一个元素，那么新增update时仍然要遍历到尾部才能将新增的接入链表。而环状链表，只需记住尾部，无需遍历操作就可以找到首部。

**（3）再次渲染**

执行了setCount之后，react会再次进入render阶段，执行我们的函数组件所对应的方法，再次渲染，react计算出来了最新的值。计算的方法就是看传递给setCount的参数是不是一个方法，是的话就执行（参数为上一次计算出来的最新的state）计算新值，否则传进来的参数给新值。将新值赋值在memoizedState上。

我们的例子中，setCount(1)，新值为1；setCount((state) => state + 2)，新值为1+2=3；setCount((state) => state + 3)，新值为3+3=6。新值6赋值给memoizedState，得到fiber结构如下图所示：

![img](https://pic1.zhimg.com/80/v2-240275b4e6f389d3c5690d0a1324ac34_1440w.jpg)

##### **原理解析**

当函数组件进入**render阶段** 时，会调用renderWithHooks方法，该方法内部会**执行函数组件对应函数（即App()）**。你可以在**[这里](https://zhuanlan.zhihu.com/p/443264124/edit#L415)** 看到这段逻辑。

我们来看一个流程图，对 **首次渲染-setCount-再次渲染** 进行分析：

![img](https://pic1.zhimg.com/80/v2-c56001ef1f9d18b6b41668854b4b9acc_1440w.jpg)

##### **源码实现**

**（1）首次渲染**

首次渲染主要是初始化hook，插入到fiber.memoizedState的末尾。

```js
function mountState( initialState ) {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  });
  const dispatch = queue.dispatch = dispatchAction.bind(
    null, currentlyRenderingFiber, queue,
  );
  return [hook.memoizedState, dispatch];
}
```

basicStateReducer是计算更新的方法，实现如下：

```js
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}
```

**（2）setCount**

在调用setCount的时候，真正调用了dispatchAction方法。主要做的事情是hook.queue.pending插入更新，并且进入调度。实现如下：

```js
function dispatchAction( fiber, queue, action ) {
  // 创建一个update
  const eventTime = requestEventTime();
  const lane = requestUpdateLane(fiber);
  const update = { lane, action, eagerReducer: null, eagerState: null, next: null };
  // 将此update插入到hook.queue.pending的最后一个
  const pending = queue.pending;
  if (pending === null) {// 这是第一个update，创建一个环状链表
    update.next = update;
  } else {// 将此update插入到hook.update.pending链表内
    update.next = pending.next;
    pending.next = update;
  }
  // queue.pending指向最新的update，意为最后一个，在循环的时候从first= queue.pending.next开始，到queue.pending.next止
  queue.pending = update;

  const alternate = fiber.alternate;
  // ... 优化容错相关
  // 进入调度
  scheduleUpdateOnFiber(fiber, lane, eventTime);
  // ..
}
```

**（3）再次渲染**

再次渲染主要是根据setCount存储的更新信息来计算最新的state。
源码实现如下：

```js
function updateReducer( reducer, initialArg, init ) {
    const hook = updateWorkInProgressHook();
    const queue = hook.queue;
    queue.lastRenderedReducer = reducer;
    const current = currentHook;
    let baseQueue = current.baseQueue;
  
    // 将queue.pending合并到baseQueue，清空queue.pending
    const pendingQueue = queue.pending;
    if (pendingQueue !== null) {
      if (baseQueue !== null) {
        // Merge the pending queue and the base queue.
        const baseFirst = baseQueue.next;
        const pendingFirst = pendingQueue.next;
        baseQueue.next = pendingFirst;
        pendingQueue.next = baseFirst;
      }
      current.baseQueue = baseQueue = pendingQueue;
      queue.pending = null;
    }
  
    // 遍历baseQueue，依次计算state的值，得到最终的newState， newState赋值给memoizedState，清空baseQueue等字段
    if (baseQueue !== null) { 
      let newState = current.baseState;
      do {
        const updateLane = update.lane;
        const action = update.action;
        newState = reducer(newState, action);
        update = update.next;
      } while (update !== null && update !== first);
      hook.memoizedState = newState;
    }
    const dispatch = queue.dispatch;
    return [hook.memoizedState, dispatch];
  }
```

#### useState的注意事项

##### 1. 不能局部更新

如果state是一个对象，里边有多个属性。在setUser的时候，如果只修改其中一个属性，会导致另一个变成undefined。**因为setState不会自动合并属性。**

##### 2. 不能在原地址上修改

```
const onClick = ()=>{
user.age=30
setUser(user)
}
```

比如说，我想修改user.age，先把user.age赋一个新值，在set这个user。会发现，点击按钮，UI并没有更新。

因为React发现user的地址没变，就认为数据没变，就不会去更新UI。

所以要给一个新的地址，给set里传一个对象就可以了，这样就不是同一个地址了。

##### 3. useState也可以接受函数

```
const [state, setState] = useState(()=>{
return initialState
})
```

返回一个初始值，效果和直接把初始值传进去一样。接受函数的好处是如果这个初始值的计算比较复杂，函数形式只会执行一次，也就只会在第一次计算。如果是直接传初始值，每次进来都要计算一次。（但是我们一般直接传初始值）

##### 4. setState也可以接受函数

使用场景：我想先把n+1，再把n+2。如果像下边这样写，预期效果是点击按钮后，页面上的n 是3

```
function App() {
const [n, setN] = useState(0)
const onClick = ()=>{
setN(n+1)
setN(n+2)
}
return (
<div className="App">
<h1>n: {n}</h1>
<button onClick={onClick}>+3</button>
</div>
);
}
```

可是点击按钮，发现n变成了2。

因为我们之前说过，setN(n+1)不会改变n，它会生成一个新的n。即，执行了第一行`setN(n+1)`，此时n还是0，如果接下来又对这个n操作，`setN(n+2)`，意思是把n加2，就是把0加2，那么结果就是2。不管setN有多少行，都只相当于执行最后一行。

**如果想对一个state连续操作，就可以使用函数**

```
const onClick = ()=>{
setN(i=>i+1)
setN(i=>i+2)
}
```

setN里没有n这个变量。只有一个函数，这个函数代表了一个操作，+1操作，+2操作。并没说把n加1。只是用了占位符`i`表示了一种操作。

React看到这两行，先把n+1，第二行再把新的值也就是n=1按照+2操作进行。所以页面上n变3

#### **useReducer vs useState**

上面讲解了useState，有一个和他作用比较相似的hook，它就是useReducer，也是用来存储状态的，不同的是，计算新的状态的时候，是用户自己计算的，可以支持更复杂的场景，我们先来看一下它的用法。

##### **示例**

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

我们看到在用法上，useReducer和useState的返回值是一致的，区别是useReducer

第一个参数是一个function，是用于计算新的state所执行的方法，对标useState的basicStateReducer。
第二个参数是初始值
第三个参数是计算初始值的方法，其执行时候的参数是第二个参数

#### **useEffect vs useLayoutEffect**

上面讲了存储状态相关的两个hook，接下来讲解下类比class组件生命周期的两个hook，useEffect和useLayoutEffect相当于class组件的以下生命周期:componentDidMount、componentDidUpdate、componentWillUnMount，二者使用方式完全一样，不同的点是调用的时机不同，以useEffect为示例来说明一下：

##### **示例解析**

```js
import React, { useState, useEffect } from 'react'
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('useEffect:', count);
    return () => {
      console.log('useEffect destory:', count);
    }
  }, [count])

  return (
    <div>
      <div>{count}</div>
      <div onClick={() => setCount(count + 1) }>加1</div>
    </div>
  )
}
export default App;
```

上面的示例，我们需要关注的是useEffect的回调函数和其返回的函数，是什么时机执行的？又是通过什么机制来判定要不要执行呢？fiber的结构又是怎么变化的呢？这里先概括一下：

useEffect的实现，是在render阶段给fiber和hook设置标志位，在commit阶段根据标志位来执行回调函数和销毁函数，后面将按照 **render阶段 - commit阶段** 来进行讲解，commit阶段又分为3个阶段，分别是**before mutation阶段**(执行dom操作前)、**mutation阶段**（执行dom操作）、**layout阶段**（执行dom操作后）

上述示例中首次渲染执行到useEffect之后，挂载到fiber.memoizedState的数据结构如下：

![img](https://pic2.zhimg.com/80/v2-8fc745dc497b83be13e5013b74616755_1440w.jpg)

再次渲染结果，此时destory是有值的，其他不变。结果如下：

![img](https://pic4.zhimg.com/80/v2-01b21a294626cbe70e0ea0d20dfd3da7_1440w.jpg)

数据结构解读：

create：useEffect和useLayoutEffect的回调函数

destory：useEffect和useLayoutEffect的回调函数的返回值

deps：依赖数组

tag：hook的标志位，commit阶段会根据这个标志来决定是不是要执行

next: 指向下一个effect

在commit阶段就是根据fiber.flags和hook.tag来判断是否执行create或者destory。

##### **原理解析**

每个阶段分别作了什么事情，我们来看一下，render阶段流程图：

![img](https://pic4.zhimg.com/80/v2-4c8cadadfcee3fa13c20a93778ba9bd7_1440w.jpg)

commit阶段流程图：

![img](https://pic2.zhimg.com/80/v2-c165926eb11b5529b7acab272341331d_1440w.jpg)

划一下重点：

（**1）render阶段**

A、首次渲染

l 给fiber设置标志位

l 将生成的effect = {tag, create, destroy: undefined, deps, netx: null}，插入到fiber.updateQueue末尾

l 将effect插入到hook.memoizedState末尾

B、再次渲染

l 与首次渲染的区别是在设置标志位之前，需要先比较一下上一次的依赖项和本次的依赖项是否一致，不一致和一致设置的标志位不一样。

**（2）commit阶段**

A、befor before mutation阶段（执行DOM操作前）

l 异步调度useEffect

B、mutation阶段（执行DOM操作）

l 根据flags分别处理，对dom进行插入、删除、更新等操作

l flags为Update时，function函数组件执行useLayoutEffect的销毁函数

l flags为Deletion，class组件调用componentWillUnmount，function组件调度useEffect的销毁函数

C、layout阶段

l class组件调用componentDidMount或componentDidUpdate

l function组件调用useLayoutEffect的回调函数

**异步调度的原理**：如下图左，需要注意的是GUI线程和js引擎线程是互斥的，当js引擎执行时，GUI线程会被挂起，相当于被冻结了，GUI更新会被保存在一个队列中，等js引擎空闲时（可以理解js运行完后）立即被执行。

![img](https://pic4.zhimg.com/80/v2-3732af80d575060bd0572795aa1b1fcb_1440w.png)



<img src="https://pic4.zhimg.com/80/v2-1e3ba98d0c3979ab9895dc5f65f3246f_1440w.jpg" alt="img" style="zoom:25%;" />

当commit阶段整个执行完毕之后，浏览器会启动 GUI渲染引擎 进行一次绘制，绘制完毕之后，浏览器会取出一个宏任务来执行（react会保证我们异步调度的useEffect的函数会在下一次更新之前执行完毕）。
因此，在这个mutaiton阶段，我们已经把发生的变化映射到真实 DOM 上了，但由于 JS 线程和浏览器渲染线程是互斥的，因为 JS 虚拟机还在运行，即使内存中的真实 DOM 已经变化，浏览器也没有立刻绘制到屏幕上。

commit 阶段是不可打断的，会一次性把所有需要 commit 的节点全部 commit 完，至此 react 更新完毕，JS 停止执行

浏览器渲染线程把发生变化的 DOM 绘制到屏幕上，到此为止 react 把所有需要更新的 DOM 节点全部更新完成。

绘制完成后，浏览器通知 react 自己处于空闲阶段，react 开始执行自己调度队列中的任务，此时才开始执行 useEffect(create, deps) 的产生的函数。

##### **源码实现**

（1）render阶段

useEffectLayout vs useEffect 标志位情况如下：

|                 | 时机             | fiber.flags                            | hook.memoizedState                                  |
| --------------- | ---------------- | -------------------------------------- | --------------------------------------------------- |
| useEffect       | 首次渲染         | flags \| UpdateEffect \| PassiveEffect | tag: HookHasEffect \| HookPassive,destory:undefined |
| useEffect       | 再次渲染deps相同 | flags \| UpdateEffect \| PassiveEffect | tag: HookPassive,destory                            |
| useEffect       | 再次渲染deps不同 | flags \| UpdateEffect \| PassiveEffect | tag: HookHasEffect \| HookPassive, destory          |
| useLayoutEffect | 首次渲染         | flags \| UpdateEffect                  | tag: HookHasEffect \| HookLayout,destory:undefined  |
| useLayoutEffect | 再次渲染deps相同 | flags \| UpdateEffect                  | tag:HookLayout,destory                              |
| useLayoutEffect | 再次渲染deps不同 | flags \| UpdateEffect                  | tag: HookHasEffect \| HookLayout,destory            |

其中这几个标志位是二进制，如下：

```js
// flags相关
export const UpdateEffect = 0b000000000000000100;
export const PassiveEffect = 0b000000001000000000;
export const PassiveStaticEffect = 0b001000000000000000;
export const MountLayoutDevEffect = 0b010000000000000000;
export const MountPassiveDevEffect = 0b100000000000000000;

// hook相关
export const HookHasEffect = 0b001;
export const HookPassive = 0b100;
export const HookLayout =  0b010;
export const NoHookEffect = 0b000;
```

我们看到，在设置标志位的时候，都是用的逻辑或，即是在某一位上添加上1，在判断的时候，我们只需要判断fiber或者hook上在某一位上是不是1即可，这时候应该用逻辑与来判断。

（2）commit阶段

**A、before mutation阶段**

a、before mutation异步调度实现：

```js
if ((flags & Passive) !== NoFlags) {
    scheduleCallback(NormalSchedulerPriority, () => {
      flushPassiveEffects();
      return null;
    });
}
```

**B、mutation阶段**

a、根据effectTag分别处理，对dom进行插入、删除、更新等操作

b、effectTag为Deletion，class组件调用componentWillUnmount，function组件异步调度useEffect的销毁函数，以下为异步调度的方法同**A.a**。

c、effectTag为Update时，function函数组件执行useLayoutEffect的销毁函数。

**C、layout阶段**

a、class组件调用componentDidMount 或componentDidUpdate

b、function组件调用useLayoutEffect的回调函数。

**那么useEffect是怎样异步执行的呢？我们来看一下**

（1）在beforeMutation和mutation阶段异步调度flushPassiveEffects。

（2）flushPassiveEffects实现在[这里](https://zhuanlan.zhihu.com/p/443264124/edit#L2154)。遍历root.current，依次执行。

##### **使用场景**

**useEffect**: 适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，不会在函数中执行阻塞浏览器更新屏幕的操作。

**useLayoutEffect**: 适用于在浏览器执行下一次绘制前，用户可见的 DOM 变更就必须同步执行，这样用户才不会感觉到视觉上的不一致。

#### usememo和usecallback的区别

##### 区别概览

| -        | useCallBack                                                  | useMemo                                                      |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 返回值   | 一个缓存的回调函数                                           | 一个缓存的值                                                 |
| 参数     | 需要缓存的函数，依赖项                                       | 需要缓存的值(也可以是个计算然后再返回值的函数) ，依赖项      |
| 使用场景 | 父组件更新时，通过props传递给子组件的函数也会重新创建，然后这个时候使用 useCallBack 就可以缓存函数不使它重新创建 | 组件更新时，一些计算量很大的值也有可能被重新计算，这个时候就可以使用 useMemo 直接使用上一次缓存的值 |

##### useCallback

把内联回调函数及依赖项数组作为参数传入useCallback，它将返回该回调函数的memorized版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染(例如shouldComponentUpdate)的子组件时，它将非常有用。

```jsx
import React, { useCallback, useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);

  // 使用 useCallBack 缓存
  const handleCountAddByCallBack = useCallback(() => {
    setCount((count) => count + 1);
  }, []);

  // 不缓存，每次 count 更新时都会重新创建
  const handleCountAdd = () => {
    setCount((count) => count + 1);
  };

  return (
    <div className="App">
      <h3>CountAddByChild1: {count}</h3>
      <Child1 addByCallBack={handleCountAddByCallBack} add={handleCountAdd} />
    </div>
  );
}

const Child1 = React.memo(function (props) {
  const { add, addByCallBack } = props;
  
  // 没有缓存，由于每次都创建，memo 认为两次地址都不同，属于不同的函数，所以会触发 useEffect
  useEffect(() => {
    console.log("Child1----addFcUpdate", props);
  }, [add]);

  // 有缓存，memo 判定两次地址都相同，所以不触发 useEffect
  useEffect(() => {
    console.log("Child1----addByCallBackFcUpdate", props);
  }, [addByCallBack]);

  return (
    <div>
      <button onClick={props.add}>+1</button>
      <br />
      <button onClick={props.addByCallBack}>+1(addByCallBack)</button>
    </div>
  );
});
```

##### useMemo 

把“创建”函数和依赖项数组作为参数传入`useMemo`，它仅会在某个依赖项改变时才会重新计算memorized值。这种优化有助于避免在每次渲染时都进行高开销的计算

```jsx
import { useState, useMemo } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  // 没有使用 useMemo，即使是更新 total, countToString 也会重新计算
  const countToString = (() => {
    console.log("countToString 被调用");
    return count.toString();
  })();

  // 使用了 useMemo, 只有 total 改变，才会重新计算
  const totalToStringByMemo = useMemo(() => {
    console.log("totalToStringByMemo 被调用");
    return total + "";
  }, [total]);

  return (
    <div className="App">
      <h3>countToString: {countToString}</h3>
      <h3>countToString: {totalToStringByMemo}</h3>
      <button
        onClick={() => {
          setCount((count) => count + 1);
        }}
      >
        Add Count
      </button>
      <br />
      <button
        onClick={() => {
          setTotal((total) => total + 1);
        }}
      >
        Add Total
      </button>
    </div>
  );
}
```

##### 小结

- useCallBack 针对可能重新创建的函数进行优化，使得函数被缓存，React.memo 认定两次地址是相同就可以避免子组件冗余的更新。
- useMemo 针对不必要的计算进行优化，避免了当前组件中一些的冗余计算操作。
- `useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

##### **useMemo源码实现**

###### **A、首次渲染**

```js
function mountMemo(  nextCreate, deps ) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

###### **B、再次渲染**

```js
function updateMemo<T>( nextCreate, deps ) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

##### 实现 useMemo

```
let hookState = [];
let hookIndex = 0;
function useMemo(callBack, dependencies) {
     if (hookState[hookIndex]) {
       const [oldData, odlDependencies] = hookState[hookIndex];
       // 空数组every为true
       let same  = odlDependencies.every((item,index)=>item===odlDependencies[index])
       if(same) {
         hookIndex++
         return oldData
       }else{
          const newData = callBack()
          hookState[hookIndex++] = [newData, dependencies];
       }
       //  非首次渲染
     } else {
       // 首次渲染
       const newData = callBack();
       hookState[hookIndex++] = [newData, dependencies];
     }
  }
```

#### useContext

`useContext` hook 与其它几个有点不一样，但它在特定场景下还是很有用的。

React 的 `Context API` 是一种在应用程序中深入传递数据的方法，而无需手动一个一个在多个父子孙之间传递 `prop`。当咱们需要的只是传递数据时，它可以作为像`Redux`这样的工具的一个很好的替代。



![img](https://pic4.zhimg.com/80/v2-3a27823968d65c9ca507b71fe42f0447_1440w.jpg)



使用 `Context` ,首先顶层先声明 `Provier` 组件，并声明 `value` 属性，接着在后代组件中声明 `Consumer` 组件，这个 `Consumer` 子组件，只能是唯一的一个函数，函数参数即是 `Context` 的负载。如果有多个 `Context` ,`Provider` 和 `Consumer` 任意的顺序嵌套即可。

此外我们还可以针对任意一个 `Context` 使用 `contextType` 来简化对这个 `Context` 负载的获取。但在一个组件中，即使消费多个 `Context`,`contextType` 也只能指向其中一个。



![img](https://pic3.zhimg.com/80/v2-61295fce92493fed5e471806def77d26_1440w.jpg)



在 `Hooks` 环境中，依旧可以使用 `Consumer`，但是 `ContextType` 作为类静态成员肯定是用不了。Hooks 提供了 `useContext`,不但解决了 `Consumer` 难用的问题同时也解决了　`contextType` 只能使用一个 `context` 的问题。

**唯一需要注意**的是你必须将整个上下文对象传递给`useContext` - 而不仅仅是`Consumer`， 当然如果忘记了，`React`会给出警告。

###### 嵌套的 Consumers

你可能遇到这样的情况，咱们的组件需要从多个父上下文中接收数据，从而导致这样的代码

```text
function HeaderBar() {
  return (
    <CurrentUser.Consumer>
      {user =>
        <Notifications.Consumer>
          {notifications =>
            <header>
              Welcome back, {user.name}!
              You have {notifications.length} notifications.
            </header>
          }
      }
    </CurrentUser.Consumer>
  );
}
```

这种大量嵌套只是为了接收两个值。下面是使用`useContext`时的效果：

```text
function HeaderBar() {
  const user = useContext(CurrentUser);
  const notifications = useContext(Notifications);

  return (
    <header>
      Welcome back, {user.name}!
      You have {notifications.length} notifications.
    </header>
  );
}
```

###### 总结

`useContext` 接收一个 `context` 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。当前的 `context` 值由上层组件中距离当前组件最近的 `<CountContext.Provider>` 的 `value` prop 决定。

当组件上层最近的 `<CountContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `CountContext provider` 的 context `value` 值。

别忘记 `useContext` 的参数必须是 `context` 对象本身：

- 正确： useContext(MyContext)
- 错误： useContext(MyContext.Consumer)
- 错误： useContext(MyContext.Provider)

调用了 `useContext` 的组件总会在 `context` 值变化时重新渲染。如果重渲染组件的开销较大，你可以 通过使用 `memoization` 来优化。

#### hook缺点

##### 一、响应式的`useEffect`

写函数组件时，你不得不改变一些写法习惯。你必须清楚代码中`useEffect`和`useCallbac`k等api的第二个参数“依赖项数组”的改变时机，并且掌握上下文的`useEffect`的触发时机。当逻辑较复杂的时候，`useEffect`触发的次数，可能会被你预想的多。对比`componentDidmount`和`componentDidUpdate`，`useEffect`带来的心智负担更大。

##### 二、状态不同步

这绝对是最大的缺点。函数的运行是独立的，每个函数都有一份独立的作用域。函数的变量是保存在运行时的作用域里面，当我们有异步操作的时候，经常会碰到异步回调的变量引用是之前的，也就是旧的（这里也可以理解成闭包）。

#### 怎么避免`react hooks`的常见问题

1. 不要在`useEffect`里面写太多的依赖项，划分这些依赖项成多个单一功能的`useEffect`。其实这点是遵循了软件设计的“单一职责模式”。
2. 如果你碰到状态不同步的问题，可以考虑下手动传递参数到函数。如：

```go
// showCount的count来自父级作用域 
const [count,setCount] = useState(xxx); 
function showCount(){ 
  console.log(count) 
} 

// showCount的count来自参数 
const [count,setCount] = useState(xxx); 
function showCount(c){ 
  console.log(c) 
}
```

但这个也只能解决一部分问题，很多时候你不得不使用上述的`useRef`方案。

1. 重视`eslint-plugin-react-hooks`插件的警告。
2. 复杂业务的时候，使用Component代替`hooks`。

#### hooks为什么不能在条件判断循环里写

我们可以在单个组件中使用多个 State Hook 或 Effect Hook

```
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

那么 React 怎么知道哪个 state 对应哪个 `useState`？答案是 React 靠的是 Hook 调用的顺序。因为我们的示例中，Hook 的调用顺序在每次渲染中都是相同的，所以它能够正常工作：

```
// ------------
// 首次渲染
// ------------
useState('Mary')           // 1. 使用 'Mary' 初始化变量名为 name 的 state
useEffect(persistForm)     // 2. 添加 effect 以保存 form 操作
useState('Poppins')        // 3. 使用 'Poppins' 初始化变量名为 surname 的 state
useEffect(updateTitle)     // 4. 添加 effect 以更新标题

// -------------
// 二次渲染
// -------------
useState('Mary')           // 1. 读取变量名为 name 的 state（参数被忽略）
useEffect(persistForm)     // 2. 替换保存 form 的 effect
useState('Poppins')        // 3. 读取变量名为 surname 的 state（参数被忽略）
useEffect(updateTitle)     // 4. 替换更新标题的 effect

// ...
```

只要 Hook 的调用顺序在多次渲染之间保持一致，React 就能正确地将内部 state 和对应的 Hook 进行关联。但如果我们将一个 Hook (例如 `persistForm` effect) 调用放到一个条件语句中会发生什么呢？

```
  // 🔴 在条件语句中使用 Hook 违反第一条规则
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

在第一次渲染中 `name !== ''` 这个条件值为 `true`，所以我们会执行这个 Hook。但是下一次渲染时我们可能清空了表单，表达式值变为 `false`。此时的渲染会跳过该 Hook，Hook 的调用顺序发生了改变：

```
useState('Mary')           // 1. 读取变量名为 name 的 state（参数被忽略）
// useEffect(persistForm)  // 🔴 此 Hook 被忽略！
useState('Poppins')        // 🔴 2 （之前为 3）。读取变量名为 surname 的 state 失败
useEffect(updateTitle)     // 🔴 3 （之前为 4）。替换更新标题的 effect 失败
```

React 不知道第二个 `useState` 的 Hook 应该返回什么。React 会以为在该组件中第二个 Hook 的调用像上次的渲染一样，对应的是 `persistForm` 的 effect，但并非如此。从这里开始，后面的 Hook 调用都被提前执行，导致 bug 的产生。

#### 怎样实现useEffect第一次render不触发，在第二次触发，或者在给定次数触发（自定义hook useRef）

```coffeescript
const firstUpdate = useRef(true);
useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
       else {
            handleChange(tagValue);
        }
    }, [tagValue]);
```

#### React 是如何把对 Hook 的调用和组件联系起来的？

React 保持对当前渲染中的组件的追踪。多亏了 [Hook 规范](https://zh-hans.reactjs.org/docs/hooks-rules.html)，我们得知 Hook 只会在 React 组件中被调用（或自定义 Hook —— 同样只会在 React 组件中被调用）。

每个组件内部都有一个「记忆单元格」列表。它们只不过是我们用来存储一些数据的 JavaScript 对象。当你用 `useState()` 调用一个 Hook 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），然后把指针移动到下一个。这就是多个 `useState()` 调用会得到各自独立的本地 state 的原因。

#### Hook 会因为在渲染时创建函数而变慢吗？

不会。在现代浏览器中，闭包和类的原始性能只有在极端场景下才会有明显的差别。

除此之外，可以认为 Hook 的设计在某些方面更加高效：

- Hook 避免了 class 需要的额外开支，像是创建类实例和在构造函数中绑定事件处理器的成本。
- **符合语言习惯的代码在使用 Hook 时不需要很深的组件树嵌套**。这个现象在使用高阶组件、render props、和 context 的代码库中非常普遍。组件树小了，React 的工作量也随之减少。

传统上认为，在 React 中使用内联函数对性能的影响，与每次渲染都传递新的回调会如何破坏子组件的 `shouldComponentUpdate` 优化有关。Hook 从三个方面解决了这个问题。

- [`useCallback`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback) Hook 允许你在重新渲染之间保持对相同的回调引用以使得 `shouldComponentUpdate` 继续工作：

  ```
  // 除非 `a` 或 `b` 改变，否则不会变
  const memoizedCallback = useCallback(() => {  doSomething(a, b);
  }, [a, b]);
  ```

- [`useMemo`](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations) Hook 使得控制具体子节点何时更新变得更容易，减少了对纯组件的需要。

- 最后，[`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) Hook 减少了对深层传递回调的依赖，正如下面解释的那样。

#### 如何避免向下传递回调？

我们已经发现大部分人并不喜欢在组件树的每一层手动传递回调。尽管这种写法更明确，但这给人感觉像错综复杂的管道工程一样麻烦。

在大型的组件树中，我们推荐的替代方案是通过 context 用 [`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) 往下传一个 `dispatch` 函数：

```
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 提示：`dispatch` 不会在重新渲染之间变化  const [todos, dispatch] = useReducer(todosReducer);
  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

`TodosApp` 内部组件树里的任何子节点都可以使用 `dispatch` 函数来向上传递 actions 到 `TodosApp`：

```
function DeepChild(props) {
  // 如果我们想要执行一个 action，我们可以从 context 中获取 dispatch。  const dispatch = useContext(TodosDispatch);
  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

总而言之，从维护的角度来这样看更加方便（不用不断转发回调），同时也避免了回调的问题。像这样向下传递 `dispatch` 是处理深度更新的推荐模式。

注意，你依然可以选择将应用的 *state* 作为 props（更显明确）向下传递或者使用 context（对很深的更新而言更加方便）向下传递。如果你选择使用 context 来向下传递 state，请使用两种不同的 context 类型传递 state 和 dispatch —— 由于 `dispatch` context 永远不会变，因此读取它的组件不需要重新渲染，除非这些组件也需要用到应用程序的 state。

#### Hook 能否覆盖 class 的所有使用场景？

我们给 Hook 设定的目标是尽早覆盖 class 的所有使用场景。目前暂时还没有对应不常用的 `getSnapshotBeforeUpdate`，`getDerivedStateFromError` 和 `componentDidCatch` 生命周期的 Hook 等价写法，但我们计划尽早把它们加进来。

#### Hook 会替代 render props 和高阶组件吗？

通常，render props 和高阶组件只渲染一个子节点。我们认为让 Hook 来服务这个使用场景更加简单。这两种模式仍有用武之地，（例如，一个虚拟滚动条组件或许会有一个 `renderItem` 属性，或是一个可见的容器组件或许会有它自己的 DOM 结构）。但在大部分场景下，Hook 足够了，并且能够帮助减少嵌套。

#### 有类似实例变量的东西吗？

有！[`useRef()`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref) Hook 不仅可以用于 DOM refs。「ref」 对象是一个 `current` 属性可变且可以容纳任意值的通用容器，类似于一个 class 的实例属性。

你可以在 `useEffect` 内部对其进行写入:

```
function Timer() {
  const intervalRef = useRef();
  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

如果我们只是想设定一个循环定时器，我们不会需要这个 ref（`id` 可以是在 effect 本地的），但如果我们想要在一个事件处理器中清除这个循环定时器的话这就很有用了：

```
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);  }
  // ...
```

从概念上讲，你可以认为 refs 就像是一个 class 的实例变量。除非你正在做 [懒加载](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily)，否则避免在渲染期间设置 refs —— 这可能会导致意外的行为。相反的，通常你应该在事件处理器和 effects 中修改 refs。

#### 我应该使用单个还是多个 state 变量？

如果你之前用过 class，你或许会试图总是在一次 `useState()` 调用中传入一个包含了所有 state 的对象。如果你愿意的话你可以这么做。这里有一个跟踪鼠标移动的组件的例子。我们在本地 state 中记录它的位置和尺寸：

```
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

现在假设我们想要编写一些逻辑以便在用户移动鼠标时改变 `left` 和 `top`。注意到我们是如何必须手动把这些字段合并到之前的 state 对象的：

```
// ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // 展开 「...state」 以确保我们没有 「丢失」 width 和 height      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));    }
    // 注意：这是个简化版的实现
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

这是因为当我们更新一个 state 变量，我们会 *替换* 它的值。这和 class 中的 `this.setState` 不一样，后者会把更新后的字段 *合并* 入对象中。

如果你还怀念自动合并，你可以写一个自定义的 `useLegacyState` Hook 来合并对象 state 的更新。然而，**我们推荐把 state 切分成多个 state 变量，每个变量包含的不同值会在同时发生变化。**

举个例子，我们可以把组件的 state 拆分为 `position` 和 `size` 两个对象，并永远以非合并的方式去替换 `position`：

```
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });    }
    // ...
```

把独立的 state 变量拆分开还有另外的好处。这使得后期把一些相关的逻辑抽取到一个自定义 Hook 变得容易，比如说:

```
function Box() {
  const position = useWindowPosition();  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

注意看我们是如何做到不改动代码就把对 `position` 这个 state 变量的 `useState` 调用和相关的 effect 移动到一个自定义 Hook 的。如果所有的 state 都存在同一个对象中，想要抽取出来就比较难了。

把所有 state 都放在同一个 `useState` 调用中，或是每一个字段都对应一个 `useState` 调用，这两方式都能跑通。当你在这两个极端之间找到平衡，然后把相关 state 组合到几个独立的 state 变量时，组件就会更加的可读。如果 state 的逻辑开始变得复杂，我们推荐 [用 reducer 来管理它](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)，或使用自定义 Hook。

#### 我可以只在更新时运行 effect 吗？

这是个比较罕见的使用场景。如果你需要的话，你可以 [使用一个可变的 ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables) 手动存储一个布尔值来表示是首次渲染还是后续渲染，然后在你的 effect 中检查这个标识。（如果你发现自己经常在这么做，你可以为之创建一个自定义 Hook。）

#### 如何获取上一轮的 props 或 state？

目前，你可以 [通过 ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables) 来手动实现：

```
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;  });
  const prevCount = prevCountRef.current;
  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

这或许有一点错综复杂，但你可以把它抽取成一个自定义 Hook：

```
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

注意看这是如何作用于 props， state，或任何其他计算出来的值的。

```
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count + 100;
  const prevCalculation = usePrevious(calculation);  // ...
```

考虑到这是一个相对常见的使用场景，很可能在未来 React 会自带一个 `usePrevious` Hook。

#### 为什么我会在我的函数中看到陈旧的 props 和 state ？

组件内部的任何函数，包括事件处理函数和 effect，都是从它被创建的那次渲染中被「看到」的。例如，考虑这样的代码：

```
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

如果你先点击「Show alert」然后增加计数器的计数，那这个 alert 会显示**在你点击『Show alert』按钮时**的 `count` 变量。这避免了那些因为假设 props 和 state 没有改变的代码引起问题。

如果你刻意地想要从某些异步回调中读取 *最新的* state，你可以用 [一个 ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables) 来保存它，修改它，并从中读取。

最后，你看到陈旧的 props 和 state 的另一个可能的原因，是你使用了「依赖数组」优化但没有正确地指定所有的依赖。举个例子，如果一个 effect 指定了 `[]` 作为第二个参数，但在内部读取了 `someProp`，它会一直「看到」 `someProp` 的初始值。解决办法是要么移除依赖数组，要么修正它。 这里介绍了 [你该如何处理函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)，而这里介绍了关于如何减少 effect 的运行而不必错误的跳过依赖的 [一些常见策略](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)。

> 注意
>
> 我们提供了一个 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint 规则作为 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 包的一部分。它会在依赖被错误指定时发出警告，并给出修复建议。

#### 我该如何实现 `getDerivedStateFromProps`？

尽管你可能 [不需要它](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)，但在一些罕见的你需要用到的场景下（比如实现一个 `<Transition>` 组件），你可以在渲染过程中更新 state 。React 会立即退出第一次渲染并用更新后的 state 重新运行组件以避免耗费太多性能。

这里我们把 `row` prop 上一轮的值存在一个 state 变量中以便比较：

```
function ScrollView({row}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row 自上次渲染以来发生过改变。更新 isScrollingDown。
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

初看这或许有点奇怪，但渲染期间的一次更新恰恰就是 `getDerivedStateFromProps` 一直以来的概念。

#### 有类似 forceUpdate 的东西吗？

如果前后两次的值相同，`useState` 和 `useReducer` Hook [都会放弃更新](https://zh-hans.reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update)。原地修改 state 并调用 `setState` 不会引起重新渲染。

通常，你不应该在 React 中修改本地 state。然而，作为一条出路，你可以用一个增长的计数器来在 state 没变的时候依然强制一次重新渲染：

```
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

可能的话尽量避免这种模式。

#### 我可以引用一个函数组件吗？

尽管你不应该经常需要这么做，但你可以通过 [`useImperativeHandle`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle) Hook 暴露一些命令式的方法给父组件。

#### 我该如何测量 DOM 节点？

获取 DOM 节点的位置或是大小的基本方式是使用 [callback ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#callback-refs)。每当 ref 被附加到一个另一个节点，React 就会调用 callback。这里有一个 [小 demo](https://codesandbox.io/s/l7m0v5x4v9):

```
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {    if (node !== null) {      setHeight(node.getBoundingClientRect().height);    }  }, []);
  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

在这个案例中，我们没有选择使用 `useRef`，因为当 ref 是一个对象时它并不会把当前 ref 的值的 *变化* 通知到我们。使用 callback ref 可以确保 [即便子组件延迟显示被测量的节点](https://codesandbox.io/s/818zzk8m78) (比如为了响应一次点击)，我们依然能够在父组件接收到相关的信息，以便更新测量结果。

注意到我们传递了 `[]` 作为 `useCallback` 的依赖列表。这确保了 ref callback 不会在再次渲染时改变，因此 React 不会在非必要的时候调用它。

在此示例中，当且仅当组件挂载和卸载时，callback ref 才会被调用，因为渲染的 `<h1>` 组件在整个重新渲染期间始终存在。如果你希望在每次组件调整大小时都收到通知，则可能需要使用 [`ResizeObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 或基于其构建的第三方 Hook。

如果你愿意，你可以 [把这个逻辑抽取出来作为](https://codesandbox.io/s/m5o42082xy) 一个可复用的 Hook:

```
function MeasureExample() {
  const [rect, ref] = useClientRect();  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```

#### 在依赖列表中省略函数是否安全？

一般来说，不安全。

```
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 这样不安全（它调用的 `doSomething` 函数使用了 `someProp`）}
```

要记住 effect 外部的函数使用了哪些 props 和 state 很难。这也是为什么 **通常你会想要在 effect \*内部\* 去声明它所需要的函数。** 这样就能容易的看出那个 effect 依赖了组件作用域中的哪些值：

```
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);    }

    doSomething();
  }, [someProp]); // ✅ 安全（我们的 effect 仅用到了 `someProp`）}
```

如果这样之后我们依然没用到组件作用域中的任何值，就可以安全地把它指定为 `[]`：

```
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ 在这个例子中是安全的，因为我们没有用到组件作用域中的 *任何* 值
```

根据你的用例，下面列举了一些其他的办法。

> 注意
>
> 我们提供了一个 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint 规则作为 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 包的一部分。它会帮助你找出无法一致地处理更新的组件。

让我们来看看这有什么关系。

如果你指定了一个 [依赖列表](https://zh-hans.reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) 作为 `useEffect`、`useLayoutEffect`、`useMemo`、`useCallback` 或 `useImperativeHandle` 的最后一个参数，它必须包含回调中的所有值，并参与 React 数据流。这就包括 props、state，以及任何由它们衍生而来的东西。

**只有** 当函数（以及它所调用的函数）不引用 props、state 以及由它们衍生而来的值时，你才能放心地把它们从依赖列表中省略。下面这个案例有一个 Bug：

```
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product/' + productId); // 使用了 productId prop    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 这样是无效的，因为 `fetchProduct` 使用了 `productId`  // ...
}
```

**推荐的修复方案是把那个函数移动到你的 effect \*内部\***。这样就能很容易的看出来你的 effect 使用了哪些 props 和 state，并确保它们都被声明了：

```
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 把这个函数移动到 effect 内部后，我们可以清楚地看到它用到的值。    async function fetchProduct() {      const response = await fetch('http://myapi/product/' + productId);      const json = await response.json();      setProduct(json);    }
    fetchProduct();
  }, [productId]); // ✅ 有效，因为我们的 effect 只用到了 productId  // ...
}
```

这同时也允许你通过 effect 内部的局部变量来处理无序的响应：

```
  useEffect(() => {
    let ignore = false;    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);    }

    fetchProduct();
    return () => { ignore = true };  }, [productId]);
```

我们把这个函数移动到 effect 内部，这样它就不用出现在它的依赖列表中了。

> 提示
>
> 看看 [这个小 demo](https://codesandbox.io/s/jvvkoo8pq3) 和 [这篇文章](https://www.robinwieruch.de/react-hooks-fetch-data/) 来了解更多关于如何用 Hook 进行数据获取。

**如果出于某些原因你无法把一个函数移动到 effect 内部，还有一些其他办法：**

- **你可以尝试把那个函数移动到你的组件之外**。那样一来，这个函数就肯定不会依赖任何 props 或 state，并且也不用出现在依赖列表中了。
- 如果你所调用的方法是一个纯计算，并且可以在渲染时调用，你可以 **转而在 effect 之外调用它，** 并让 effect 依赖于它的返回值。
- 万不得已的情况下，你可以 **把函数加入 effect 的依赖但 \*把它的定义包裹\*** 进 [`useCallback`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback) Hook。这就确保了它不随渲染而改变，除非 *它自身* 的依赖发生了改变：

```
function ProductPage({ productId }) {
  // ✅ 用 useCallback 包裹以避免随渲染发生改变  
  const fetchProduct = useCallback(() => {    // ... Does something with productId ...  }, [productId]); 
  // ✅ useCallback 的所有依赖都被指定了
  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct }) {
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ useEffect 的所有依赖都被指定了
  // ...
}
```

注意在上面的案例中，我们 **需要** 让函数出现在依赖列表中。这确保了 `ProductPage` 的 `productId` prop 的变化会自动触发 `ProductDetails` 的重新获取。

#### 如果我的 effect 的依赖频繁变化，我该怎么办？

有时候，你的 effect 可能会使用一些频繁变化的值。你可能会忽略依赖列表中 state，但这通常会引起 Bug：

```
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 这个 effect 依赖于 `count` state    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` 没有被指定为依赖
  return <h1>{count}</h1>;
}
```

传入空的依赖数组 `[]`，意味着该 hook 只在组件挂载时运行一次，并非重新渲染时。但如此会有问题，在 `setInterval` 的回调中，`count` 的值不会发生变化。因为当 effect 执行时，我们会创建一个闭包，并将 `count` 的值被保存在该闭包当中，且初值为 `0`。每隔一秒，回调就会执行 `setCount(0 + 1)`，因此，`count` 永远不会超过 1。

指定 `[count]` 作为依赖列表就能修复这个 Bug，但会导致每次改变发生时定时器都被重置。事实上，每个 `setInterval` 在被清除前（类似于 `setTimeout`）都会调用一次。但这并不是我们想要的。要解决这个问题，我们可以使用 [`setState` 的函数式更新形式](https://zh-hans.reactjs.org/docs/hooks-reference.html#functional-updates)。它允许我们指定 state 该 *如何* 改变而不用引用 *当前* state：

```
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 在这不依赖于外部的 `count` 变量    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ 我们的 effect 不使用组件作用域中的任何变量
  return <h1>{count}</h1>;
}
```

（`setCount` 函数的身份是被确保稳定的，所以可以放心的省略掉）

此时，`setInterval` 的回调依旧每秒调用一次，但每次 `setCount` 内部的回调取到的 `count` 是最新值（在回调中变量命名为 `c`）。

在一些更加复杂的场景中（比如一个 state 依赖于另一个 state），尝试用 [`useReducer` Hook](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) 把 state 更新逻辑移到 effect 之外。[这篇文章](https://adamrackis.dev/state-and-use-reducer/) 提供了一个你该如何做到这一点的案例。 **`useReducer` 的 `dispatch` 的身份永远是稳定的** —— 即使 reducer 函数是定义在组件内部并且依赖 props。

万不得已的情况下，如果你想要类似 class 中的 `this` 的功能，你可以 [使用一个 ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables) 来保存一个可变的变量。然后你就可以对它进行读写了。举个例子：

```
function Example(props) {
  // 把最新的 props 保存在一个 ref 中  
  const latestProps = useRef(props);  
  useEffect(() => {    latestProps.current = props;  });
  useEffect(() => {
    function tick() {
      // 在任何时候读取最新的 props      console.log(latestProps.current);    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // 这个 effect 从不会重新执行}
```

仅当你实在找不到更好办法的时候才这么做，因为依赖于变更会使得组件更难以预测。如果有某些特定的模式无法很好地转化成这样，[发起一个 issue](https://github.com/facebook/react/issues/new) 并配上可运行的实例代码以便，我们会尽可能帮助你。

#### 我该如何实现 `shouldComponentUpdate`?

你可以用 `React.memo` 包裹一个组件来对它的 props 进行浅比较：

```
const Button = React.memo((props) => {
  // 你的组件
});
```

这不是一个 Hook 因为它的写法和 Hook 不同。`React.memo` 等效于 `PureComponent`，但它只比较 props。（你也可以通过第二个参数指定一个自定义的比较函数来比较新旧 props。如果函数返回 true，就会跳过更新。）

`React.memo` 不比较 state，因为没有单一的 state 对象可供比较。但你也可以让子节点变为纯组件，或者 [用 `useMemo` 优化每一个具体的子节点](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations)。

#### 如何记忆计算结果？

[`useMemo`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo) Hook 允许你通过「记住」上一次计算结果的方式在多次渲染的之间缓存计算结果：

```
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

这行代码会调用 `computeExpensiveValue(a, b)`。但如果依赖数组 `[a, b]` 自上次赋值以来没有改变过，`useMemo` 会跳过二次调用，只是简单复用它上一次返回的值。

记住，传给 `useMemo` 的函数是在渲染期间运行的。不要在其中做任何你通常不会在渲染期间做的事。举个例子，副作用属于 `useEffect`，而不是 `useMemo`。

**你可以把 `useMemo` 作为一种性能优化的手段，但不要把它当做一种语义上的保证。**未来，React 可能会选择「忘掉」一些之前记住的值并在下一次渲染时重新计算它们，比如为离屏组件释放内存。建议自己编写相关代码以便没有 `useMemo` 也能正常工作 —— 然后把它加入性能优化。（在某些取值必须 *从不* 被重新计算的罕见场景，你可以 [惰性初始化](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily) 一个 ref。）

方便起见，`useMemo` 也允许你跳过一次子节点的昂贵的重新渲染：

```
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

注意这种方式在循环中是无效的，因为 Hook 调用 [不能](https://zh-hans.reactjs.org/docs/hooks-rules.html) 被放在循环中。但你可以为列表项抽取一个单独的组件，并在其中调用 `useMemo`。

#### 如何惰性创建昂贵的对象？

如果依赖数组的值相同，`useMemo` 允许你 [记住一次昂贵的计算](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations)。但是，这仅作为一种提示，并不 *保证* 计算不会重新运行。但有时候需要确保一个对象仅被创建一次。

**第一个常见的使用场景是当创建初始 state 很昂贵时：**

```
function Table(props) {
  // ⚠️ createRows() 每次渲染都会被调用
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

为避免重新创建被忽略的初始 state，我们可以传一个 **函数** 给 `useState`：

```
function Table(props) {
  // ✅ createRows() 只会被调用一次
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React 只会在首次渲染时调用这个函数。参见 [`useState` API 参考](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)。

**你或许也会偶尔想要避免重新创建 `useRef()` 的初始值。**举个例子，或许你想确保某些命令式的 class 实例只被创建一次：

```
function Image(props) {
  // ⚠️ IntersectionObserver 在每次渲染都会被创建
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **不会** 像 `useState` 那样接受一个特殊的函数重载。相反，你可以编写你自己的函数来创建并将其设为惰性的：

```
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver 只会被惰性创建一次
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // 当你需要时，调用 getObserver()
  // ...
}
```

这避免了我们在一个对象被首次真正需要之前就创建它。如果你使用 Flow 或 TypeScript，你还可以为了方便给 `getObserver()` 一个不可为 null 的类型。

### 通信

#### 组件之间通信方式

##### 父组件 => 子组件

###### props

父组件利用props把值或者函数传给子组件，子组件通过this.props.xx去获取；

```jsx
import React from "react";
import PropTypes from 'prop-types';

class Child extends React.Component{
	static propTypes = {
	    data: PropTypes.string
	}；
	static defaultProps = {
	   data: '子组件默认数据',
	 }; 
    render(){
         return(
           <div>{Tthis.props.data}</div>
         )
     } 
}

class Parent extends React.Component {
    state = {
       data: '我是父组件的数据'
    }
    render() {
        return (
            <Child data={this.state.data} />
        )
    }
}
```

##### 子组件 => 父组件

###### 方法一：Instance Methods（实例方法）

原理和前面的非受控组件一样，就是父组件可以通过使用refs来直接调用子组件实例的方法；

```jsx
import React from "react";

class Child extends React.Component{
	click = () => {
	  return '我是子组件的数据'
	}
    render(){
         return(
           <div>{Tthis.props.name}</div>
         )
     } 
}

class Parent extends React.Component {
    componentDidMount(){
      var data = this.child.click()  //  我是子组件的数据
    }
    render() {
        return (
            <Child ref={a => this.child = a} />
        )
    }
}
```

###### 方法二：Callback Functions（回调函数）

子组件通过调用父组件传来的回调函数，从而将数据传给父组件；

```jsx
import React from "react";
import PropTypes from 'prop-types';

class Child extends React.Component{
	static propTypes = {
	    onClick: PropTypes.fun
	}；	
    render(){
         return(
           <div onClick={() => this.props.onClick('zach')}>Click Me</div>
         )
     } 
}

class Parent extends React.Component {
    handleClick = (data) => {
        console.log("父组件从子组件接受的数据是: " + data)
    }
    render() {
        return (
            <Child onClick={this.handleClick} />
        )
    }
}
```

###### 方法三：Event Bubbling（事件冒泡）

巧妙的利用下事件冒泡机制，我们就可以很方便的在父组件的元素上接收到来自子组件元素的点击事件

```jsx
class Parent extends React.Component {
  handleClick = () => {
    console.log('clicked')
  }
  render() {
    return (
      <div onClick={this.handleClick}>
         <Child />
      </div>
    );
  }
}

function Child {
  return (
    <button>Click</button>
  );    
}
```

##### 兄弟组件之间

###### 借助父组件

首先我们可以看看它们是否是兄弟组件，即它们是否在同一个父组件下。如果不是的话，考虑下用一个组件把它们包裹起来从而变成兄弟组件是否合适。这样一来，它们就可以通过父组件作为中间层来实现数据互通了。

```jsx
class Parent extends React.Component {
  state = {count: 0}
  setCount = () => {
    this.setState({count: this.state.count + 1})
  }
  render() {
    return (
      <div>
        <SiblingA
          count={this.state.count}
        />
        <SiblingB
          onClick={this.setCount}
        />
      </div>
    );
  }
}
```

##### 不相干的组件之间

###### 方法一：Context

一种组件通信的方式，常用于祖组件与后代组件之间的通信；
我们上一章详细的讲过Context的使用方式，这里我们直接放个案例，如果想详细了解可以去上一张看一下；

```jsx
const MyContext = React.createContext()
const {Provider,Consumer} = MyContext 

//祖组件
class A extends React.Component{
 state = {
   useName:'A组件'
 }
 render(){ 
  const {useName} = this.state
   return(
     <div> 
       <h2>我是A组件，用户名为：{useName}</h2>
       <Provider value={useName}>
         <B/>
       </Provider>
     </div>
   )
 }
}

//子组件
class B extends React.Component{
 render(){
   return(
     <div> 
        <C />
        <D />
        <h2>我是B组件</h2>
        <h2>我从A组件接收到的用户名是：{}</h2>
     </div>
   )
 }
}

//孙组件（类组件）
class C extends React.Component{
static contextType = MyContext //声明需要接收context
 render(){
   return(
     <div> 
        <h2>我是C组件</h2>
        <h2>我从A组件接收到的用户名是：{this.context}</h2>
     </div>
   )
 }
}

//孙组件（函数组件）
function D(){ 
  return(
    <div>
       <div> 
        <h2>我是D组件</h2>
        <h2>我从A组件接收到的用户名是：
          <Consumer>
            {
              value => {
                retrun `${value.useName}`
              }
            }
          <Consumer/>
        </h2>
     </div>
    </div>
  )
}
```

###### 方法二：Observer Pattern（观察者模式）

观察者模式是软件设计模式里很常见的一种，它提供了一个订阅模型，假如一个对象订阅了某个事件，当那个事件发生的时候，这个对象将收到通知。

这种模式对于我们前端开发者来说是最不陌生的了，因为我们经常会给某些元素添加绑定事件，会写很多的event handlers，比如给某个元素添加一个点击的响应事件elm.addEventListener(‘click’, handleClickEvent)，每当elm元素被点击时，这个点击事件会通知elm元素，然后我们的回调函数handleClickEvent会被执行。这个过程其实就是一个观察者模式的实现过程。

那这种模式跟我们讨论的react组件通信有什么关系呢？当我们有两个完全不相关的组件想要通信时，就可以利用这种模式，其中一个组件负责订阅某个消息，而另一个元素则负责发送这个消息。javascript提供了现成的api来发送自定义事件: CustomEvent，我们可以直接利用起来。

首先，在ComponentA中，我们负责接受这个自定义事件：

```jsx
class ComponentA extends React.Component {
    componentDidMount() {
        document.addEventListener('myEvent', this.handleEvent)
    }
    componentWillUnmount() {
        document.removeEventListener('myEvent', this.handleEvent)
    }
    
    handleEvent = (e) => {
        console.log(e.detail.log)  //i'm zach
    }
}
```

然后，ComponentB中，负责在合适的时候发送该自定义事件：

```jsx
class ComponentB extends React.Component {
    sendEvent = () => {
        document.dispatchEvent(new CustomEvent('myEvent', {
          detail: {
             log: "i'm zach"
          }
        }))
    }
    
    render() {
        return <button onClick={this.sendEvent}>Send</button>
    }
}
```

这样我们就用观察者模式实现了两个不相关组件之间的通信。当然现在的实现有个小问题，我们的事件都绑定在了document上，这样实现起来方便，但很容易导致一些冲突的出现，所以我们可以小小的改良下，独立一个小模块EventBus专门这件事：

```jsx
class EventBus {
    constructor() {
        this.bus = document.createElement('fakeelement');
    }

    addEventListener(event, callback) {
        this.bus.addEventListener(event, callback);
    }

    removeEventListener(event, callback) {
        this.bus.removeEventListener(event, callback);
    }

    dispatchEvent(event, detail = {}){
        this.bus.dispatchEvent(new CustomEvent(event, { detail }));
    }
}

export default new EventBus
```

然后我们就可以愉快的使用它了，这样就避免了把所有事件都绑定在document上的问题：

```jsx
import EventBus from './EventBus'
class ComponentA extends React.Component {
    componentDidMount() {
        EventBus.addEventListener('myEvent', this.handleEvent)
    }
    componentWillUnmount() {
        EventBus.removeEventListener('myEvent', this.handleEvent)
    }
    
    handleEvent = (e) => {
        console.log(e.detail.log)  //i'm zach
    }
}

class ComponentB extends React.Component {
    sendEvent = () => {
        EventBus.dispatchEvent('myEvent', {log: "i'm zach"}))
    }
    
    render() {
        return <button onClick={this.sendEvent}>Send</button>
    }
}
```

#### 方法三：pubsub-js（消息的发布与订阅插件）

点击[pubsub-js](https://github.com/mroderick/PubSubJS)可到GitHup学习，有详细的讲解和使用案例，这里就不做过多讲解；

#### 方法四：Redux

### 原理

#### React设计思想

##### 声明式

React 使创建交互式 UI 变得轻而易举。为你应用的每一个状态设计简洁的视图，当数据变动时 React 能高效更新并渲染合适的组件。

以声明式编写 UI，可以让你的代码更加可靠，且方便调试。

##### 组件化

构建管理自身状态的封装组件，然后对其组合以构成复杂的 UI。

由于组件逻辑使用 JavaScript 编写而非模板，因此你可以轻松地在应用中传递数据，并保持状态与 DOM 分离。

#### 高阶组件

##### 什么是高阶组件

在解释什么是高阶组件之前，可以先了解一下什么是 **高阶函数**，因为它们的概念非常相似，下面是 **高阶函数** 的定义：

> 如果一个函数 **接受一个或多个函数作为参数或者返回一个函数** 就可称之为 **高阶函数**。

下面就是一个简单的高阶函数：

```js
function withGreeting(greeting = () => {}) {
    return greeting;
}
```

**高阶组件** 的定义和 **高阶函数** 非常相似：

> 如果一个函数 **接受一个或多个组件作为参数并且返回一个组件** 就可称之为 **高阶组件**。

下面就是一个简单的高阶组件：

```js
function HigherOrderComponent(WrappedComponent) {
    return <WrappedComponent />;
}
```

所以你可能会发现，当高阶组件中返回的组件是 **无状态组件（Stateless Component）** 时，该高阶组件其实就是一个 **高阶函数**，因为 **无状态组件** 本身就是一个纯函数。

> 无状态组件也称函数式组件。

##### React 中的高阶组件

React 中的高阶组件主要有两种形式：**属性代理** 和 **反向继承**。

###### 属性代理（Props Proxy）

最简单的属性代理实现：

```js
// 无状态
function HigherOrderComponent(WrappedComponent) {
    return props => <WrappedComponent {...props} />;
}
// or
// 有状态
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
```

可以发现，属性代理其实就是 **一个函数接受一个** **`WrappedComponent`** **组件作为参数传入，并返回一个继承了** **`React.Component`** **组件的类，且在该类的** **`render()`** **方法中返回被传入的** **`WrappedComponent`** **组件**。

那我们可以利用属性代理类型的高阶组件做一些什么呢？

因为属性代理类型的高阶组件返回的是一个标准的 `React.Component` 组件，所以在 React 标准组件中可以做什么，那在属性代理类型的高阶组件中就也可以做什么，比如：

- 操作 `props`
- 抽离 `state`
- 通过 `ref` 访问到组件实例
- 用其他元素包裹传入的组件 `WrappedComponent`

###### 操作 props

为 `WrappedComponent` 添加新的属性：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        render() {
            const newProps = {
                name: '大板栗',
                age: 18,
            };
            return <WrappedComponent {...this.props} {...newProps} />;
        }
    };
}
```

###### 抽离 state

利用 `props` 和回调函数把 `state` 抽离出来：

```js
function withOnChange(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                name: '',
            };
        }
        onChange = () => {
            this.setState({
                name: '大板栗',
            });
        }
        render() {
            const newProps = {
                name: {
                    value: this.state.name,
                    onChange: this.onChange,
                },
            };
            return <WrappedComponent {...this.props} {...newProps} />;
        }
    };
}
```

如何使用：

```js
const NameInput = props => (<input name="name" {...props.name} />);
export default withOnChange(NameInput);
```

这样就将 `input` 转化成受控组件了。

###### 通过 ref 访问到组件实例

有时会有需要访问 DOM element （使用第三方 `DOM` 操作库）的时候就会用到组件的 `ref` 属性。它只能声明在 Class 类型的组件上，而无法声明在函数（无状态）类型的组件上。

`ref` 的值可以是字符串（**不推荐使用**）也可以是一个回调函数，如果是回调函数的话，它的执行时机是：

- 组件被挂载后（`componentDidMount`），回调函数立即执行，回调函数的参数为该组件的实例。
- 组件被卸载（`componentDidUnmount`）或者原有的 `ref` 属性本身发生变化的时候，此时回调函数也会立即执行，且回调函数的参数为 `null`。

如何在 **高阶组件** 中获取到 `WrappedComponent` 组件的实例呢？答案就是可以通过 `WrappedComponent` 组件的 `ref` 属性，该属性会在组件 `componentDidMount` 的时候执行 `ref` 的回调函数并传入该组件的实例：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        executeInstanceMethod = (wrappedComponentInstance) => {
            wrappedComponentInstance.someMethod();
        }
        render() {
            return <WrappedComponent {...this.props} ref={this.executeInstanceMethod} />;
        }
    };
}
```

**注意：不能在无状态组件（函数类型组件）上使用** **`ref`** **属性，因为无状态组件没有实例。**

###### 用其他元素包裹传入的组件 `WrappedComponent`

给 `WrappedComponent` 组件包一层背景色为 `#fafafa` 的 `div` 元素：

```js
function withBackgroundColor(WrappedComponent) {
    return class extends React.Component {
        render() {
            return (
                <div style={{ backgroundColor: '#fafafa' }}>
                    <WrappedComponent {...this.props} {...newProps} />
                </div>
            );
        }
    };
}
```

###### 反向继承（Inheritance Inversion）

最简单的反向继承实现：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            return super.render();
        }
    };
}
```

反向继承其实就是 **一个函数接受一个** **`WrappedComponent`** **组件作为参数传入，并返回一个继承了该传入** **`WrappedComponent`** **组件的类，且在该类的** **`render()`** **方法中返回** **`super.render()`** **方法**。

会发现其属性代理和反向继承的实现有些类似的地方，都是返回一个继承了某个父类的子类，只不过属性代理中继承的是 `React.Component`，反向继承中继承的是传入的组件 `WrappedComponent`。

反向继承可以用来做什么：

- 操作 `state`
- 渲染劫持（Render Highjacking）

###### 操作 state

高阶组件中可以读取、编辑和删除 `WrappedComponent` 组件实例中的 `state`。甚至可以增加更多的 `state` 项，但是 **非常不建议这么做** 因为这可能会导致 `state` 难以维护及管理。

```js
function withLogging(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            return (
                <div>
                    <h2>Debugger Component Logging...</h2>
                    <p>state:</p>
                    <pre>{JSON.stringify(this.state, null, 4)}</pre>
                    <p>props:</p>
                    <pre>{JSON.stringify(this.props, null, 4)}</pre>
                    {super.render()}
                </div>
            );
        }
    };
}
```

在这个例子中利用高阶函数中可以读取 `state` 和 `props` 的特性，对 `WrappedComponent` 组件做了额外元素的嵌套，把 `WrappedComponent` 组件的 `state` 和 `props` 都打印了出来，

###### 渲染劫持

之所以称之为 **渲染劫持** 是因为高阶组件控制着 `WrappedComponent` 组件的渲染输出，通过渲染劫持我们可以：

- 有条件地展示元素树（`element tree`）
- 操作由 `render()` 输出的 React 元素树
- 在任何由 `render()` 输出的 React 元素中操作 `props`
- 用其他元素包裹传入的组件 `WrappedComponent` （同 **属性代理**）

###### 条件渲染

通过 `props.isLoading` 这个条件来判断渲染哪个组件。

```js
function withLoading(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            if(this.props.isLoading) {
                return <Loading />;
            } else {
                return super.render();
            }
        }
    };
}
```

###### 修改由 render() 输出的 React 元素树

修改元素树：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            const tree = super.render();
            const newProps = {};
            if (tree && tree.type === 'input') {
                newProps.value = 'something here';
            }
            const props = {
                ...tree.props,
                ...newProps,
            };
            const newTree = React.cloneElement(tree, props, tree.props.children);
            return newTree;
        }
    };
}
```

##### 高阶组件存在的问题

- 静态方法丢失
- `refs` 属性不能透传
- 反向继承不能保证完整的子组件树被解析

###### 静态方法丢失

因为原始组件被包裹于一个容器组件内，也就意味着新组件会没有原始组件的任何静态方法：

```js
// 定义静态方法
WrappedComponent.staticMethod = function() {}
// 使用高阶组件
const EnhancedComponent = HigherOrderComponent(WrappedComponent);
// 增强型组件没有静态方法
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

所以必须将静态方法做拷贝：

```js
function HigherOrderComponent(WrappedComponent) {
    class Enhance extends React.Component {}
    // 必须得知道要拷贝的方法
    Enhance.staticMethod = WrappedComponent.staticMethod;
    return Enhance;
}
```

但是这么做的一个缺点就是必须知道要拷贝的方法是什么，不过 React 社区实现了一个库 `hoist-non-react-statics` 来自动处理，它会 **自动拷贝所有非 React 的静态方法**：

```js
import hoistNonReactStatic from 'hoist-non-react-statics';

function HigherOrderComponent(WrappedComponent) {
    class Enhance extends React.Component {}
    hoistNonReactStatic(Enhance, WrappedComponent);
    return Enhance;
}
```

###### refs 属性不能透传

一般来说高阶组件可以传递所有的 `props` 给包裹的组件 `WrappedComponent`，但是有一种属性不能传递，它就是 `ref`。与其他属性不同的地方在于 React 对其进行了特殊的处理。

如果你向一个由高阶组件创建的组件的元素添加 `ref` 引用，那么 `ref` 指向的是最外层容器组件实例的，而不是被包裹的 `WrappedComponent` 组件。

那如果有一定要传递 `ref` 的需求呢，别急，React 为我们提供了一个名为 `React.forwardRef` 的 API 来解决这一问题（在 React 16.3 版本中被添加）：

```js
function withLogging(WrappedComponent) {
    class Enhance extends WrappedComponent {
        componentWillReceiveProps() {
            console.log('Current props', this.props);
            console.log('Next props', nextProps);
        }
        render() {
            const {forwardedRef, ...rest} = this.props;
            // 把 forwardedRef 赋值给 ref
            return <WrappedComponent {...rest} ref={forwardedRef} />;
        }
    };

    // React.forwardRef 方法会传入 props 和 ref 两个参数给其回调函数
    // 所以这边的 ref 是由 React.forwardRef 提供的
    function forwardRef(props, ref) {
        return <Enhance {...props} forwardRef={ref} />
    }

    return React.forwardRef(forwardRef);
}
const EnhancedComponent = withLogging(SomeComponent);
```

###### 反向继承不能保证完整的子组件树被解析

React 组件有两种形式，分别是 class 类型和 function 类型（无状态组件）。

我们知道反向继承的渲染劫持可以控制 `WrappedComponent` 的渲染过程，也就是说这个过程中我们可以对 `elements tree`、`state`、`props` 或 `render()` 的结果做各种操作。

但是如果渲染 `elements tree` 中包含了 function 类型的组件的话，这时候就不能操作组件的子组件了。

##### 高阶组件的约定

高阶组件带给我们极大方便的同时，我们也要遵循一些 **约定**：

- `props` 保持一致
- 你不能在函数式（无状态）组件上使用 `ref` 属性，因为它没有实例
- 不要以任何方式改变原始组件 `WrappedComponent`
- 透传不相关 `props` 属性给被包裹的组件 `WrappedComponent`
- 不要再 `render()` 方法中使用高阶组件
- 使用 `compose` 组合高阶组件
- 包装显示名字以便于调试

###### props 保持一致

高阶组件在为子组件添加特性的同时，要尽量保持原有组件的 `props` 不受影响，也就是说传入的组件和返回的组件在 `props` 上尽量保持一致。

###### 不要改变原始组件 WrappedComponent

不要在高阶组件内以任何方式修改一个组件的原型，思考一下下面的代码：

```js
function withLogging(WrappedComponent) {
    WrappedComponent.prototype.componentWillReceiveProps = function(nextProps) {
        console.log('Current props', this.props);
        console.log('Next props', nextProps);
    }
    return WrappedComponent;
}
const EnhancedComponent = withLogging(SomeComponent);
```

会发现在高阶组件的内部对 `WrappedComponent` 进行了修改，一旦对原组件进行了修改，那么就失去了组件复用的意义，所以请通过 **纯函数（相同的输入总有相同的输出）** 返回新的组件：

```js
function withLogging(WrappedComponent) {
    return class extends React.Component {
        componentWillReceiveProps() {
            console.log('Current props', this.props);
            console.log('Next props', nextProps);
        }
        render() {
            // 透传参数，不要修改它
            return <WrappedComponent {...this.props} />;
        }
    };
}
```

这样优化之后的 `withLogging` 是一个 **纯函数**，并不会修改 `WrappedComponent` 组件，所以不需要担心有什么副作用，进而达到组件复用的目的。

###### 透传不相关 props 属性给被包裹的组件 WrappedComponent

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        render() {
            return <WrappedComponent name="name" {...this.props} />;
        }
    };
}
```

###### 不要在 render() 方法中使用高阶组件

```js
class SomeComponent extends React.Component {
    render() {
        // 调用高阶函数的时候每次都会返回一个新的组件
        const EnchancedComponent = enhance(WrappedComponent);
        // 每次 render 的时候，都会使子对象树完全被卸载和重新
        // 重新加载一个组件会引起原有组件的状态和它的所有子组件丢失
        return <EnchancedComponent />;
    }
}
```

###### 使用 compose 组合高阶组件

```js
// 不要这么使用
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))；
// 可以使用一个 compose 函数组合这些高阶组件
// lodash, redux, ramda 等第三方库都提供了类似 `compose` 功能的函数
const enhance = compose(withRouter, connect(commentSelector))；
const EnhancedComponent = enhance(WrappedComponent)；
```

因为按照 **约定** 实现的高阶组件其实就是一个纯函数，如果多个函数的参数一样（在这里 `withRouter` 函数和 `connect(commentSelector)` 所返回的函数所需的参数都是 `WrappedComponent`），所以就可以通过 `compose` 方法来组合这些函数。

> 使用 compose 组合高阶组件使用，可以显著提高代码的可读性和逻辑的清晰度。

###### 包装显示名字以便于调试

高阶组件创建的容器组件在 React Developer Tools 中的表现和其它的普通组件是一样的。为了便于调试，可以选择一个显示名字，传达它是一个高阶组件的结果。

```js
const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';
function HigherOrderComponent(WrappedComponent) {
    class HigherOrderComponent extends React.Component {/* ... */}
    HigherOrderComponent.displayName = `HigherOrderComponent(${getDisplayName(WrappedComponent)})`;
    return HigherOrderComponent;
}
```

实际上 `recompose` 库实现了类似的功能，懒的话可以不用自己写：

```js
import getDisplayName from 'recompose/getDisplayName';
HigherOrderComponent.displayName = `HigherOrderComponent(${getDisplayName(BaseComponent)})`;
// Or, even better:
import wrapDisplayName from 'recompose/wrapDisplayName';
HigherOrderComponent.displayName = wrapDisplayName(BaseComponent, 'HigherOrderComponent');
```

##### 高阶组件的应用场景

不谈场景的技术就是在耍流氓，所以接下来说一下如何在业务场景中使用高阶组件。

###### 权限控制

利用高阶组件的 **条件渲染** 特性可以对页面进行权限控制，权限控制一般分为两个维度：**页面级别** 和 **页面元素级别**，这里以页面级别来举一个栗子：

```js
// HOC.js
function withAdminAuth(WrappedComponent) {
    return class extends React.Component {
        state = {
            isAdmin: false,
        }
        async componentWillMount() {
            const currentRole = await getCurrentUserRole();
            this.setState({
                isAdmin: currentRole === 'Admin',
            });
        }
        render() {
            if (this.state.isAdmin) {
                return <WrappedComponent {...this.props} />;
            } else {
                return (<div>您没有权限查看该页面，请联系管理员！</div>);
            }
        }
    };
}
```

然后是两个页面：

```js
// pages/page-a.js
class PageA extends React.Component {
    constructor(props) {
        super(props);
        // something here...
    }
    componentWillMount() {
        // fetching data
    }
    render() {
        // render page with data
    }
}
export default withAdminAuth(PageA);

// pages/page-b.js
class PageB extends React.Component {
    constructor(props) {
        super(props);
        // something here...
    }
    componentWillMount() {
        // fetching data
    }
    render() {
        // render page with data
    }
}
export default withAdminAuth(PageB);
```

使用高阶组件对代码进行复用之后，可以非常方便的进行拓展，比如产品经理说，PageC 页面也要有 Admin 权限才能进入，我们只需要在 `pages/page-c.js` 中把返回的 PageC 嵌套一层 `withAdminAuth` 高阶组件就行，就像这样 `withAdminAuth(PageC)`。是不是非常完美！非常高效！！但是。。第二天产品经理又说，PageC 页面只要 VIP 权限就可以访问了。你三下五除二实现了一个高阶组件 `withVIPAuth`。第三天。。。

其实你还可以更高效的，就是在高阶组件之上再抽象一层，无需实现各种 `withXXXAuth` 高阶组件，因为这些高阶组件本身代码就是高度相似的，所以我们要做的就是实现一个 **返回高阶组件的函数**，把 **变的部分（Admin、VIP）** 抽离出来，保留 **不变的部分**，具体实现如下：

```js
// HOC.js
const withAuth = role => WrappedComponent => {
    return class extends React.Component {
        state = {
            permission: false,
        }
        async componentWillMount() {
            const currentRole = await getCurrentUserRole();
            this.setState({
                permission: currentRole === role,
            });
        }
        render() {
            if (this.state.permission) {
                return <WrappedComponent {...this.props} />;
            } else {
                return (<div>您没有权限查看该页面，请联系管理员！</div>);
            }
        }
    };
}
```

可以发现经过对高阶组件再进行了一层抽象后，前面的 `withAdminAuth` 可以写成 `withAuth('Admin')` 了，如果此时需要 VIP 权限的话，只需在 `withAuth` 函数中传入 `'VIP'` 就可以了。

有没有发现和 `react-redux` 的 `connect` 方法的使用方式非常像？没错，`connect` 其实也是一个 **返回高阶组件的函数**。

###### 组件渲染性能追踪

借助父组件子组件生命周期规则捕获子组件的生命周期，可以方便的对某个组件的渲染时间进行记录：

```js
class Home extends React.Component {
    render() {
        return (<h1>Hello World.</h1>);
    }
}
function withTiming(WrappedComponent) {
    return class extends WrappedComponent {
        constructor(props) {
            super(props);
            this.start = 0;
            this.end = 0;
        }
        componentWillMount() {
            super.componentWillMount && super.componentWillMount();
            this.start = Date.now();
        }
        componentDidMount() {
            super.componentDidMount && super.componentDidMount();
            this.end = Date.now();
            console.log(`${WrappedComponent.name} 组件渲染时间为 ${this.end - this.start} ms`);
        }
        render() {
            return super.render();
        }
    };
}

export default withTiming(Home);
```



![img](https://pic3.zhimg.com/80/v2-c5243c95ae50efddb4a3b0629fbb9fee_1440w.jpg)



`withTiming` 是利用 **反向继承** 实现的一个高阶组件，功能是计算被包裹组件（这里是 `Home` 组件）的渲染时间。

###### 页面复用

假设我们有两个页面 `pageA` 和 `pageB` 分别渲染两个分类的电影列表，普通写法可能是这样：

```js
// pages/page-a.js
class PageA extends React.Component {
    state = {
        movies: [],
    }
    // ...
    async componentWillMount() {
        const movies = await fetchMoviesByType('science-fiction');
        this.setState({
            movies,
        });
    }
    render() {
        return <MovieList movies={this.state.movies} />
    }
}
export default PageA;

// pages/page-b.js
class PageB extends React.Component {
    state = {
        movies: [],
    }
    // ...
    async componentWillMount() {
        const movies = await fetchMoviesByType('action');
        this.setState({
            movies,
        });
    }
    render() {
        return <MovieList movies={this.state.movies} />
    }
}
export default PageB;
```

页面少的时候可能没什么问题，但是假如随着业务的进展，需要上线的越来越多类型的电影，就会写很多的重复代码，所以我们需要重构一下：

```js
const withFetching = fetching => WrappedComponent => {
    return class extends React.Component {
        state = {
            data: [],
        }
        async componentWillMount() {
            const data = await fetching();
            this.setState({
                data,
            });
        }
        render() {
            return <WrappedComponent data={this.state.data} {...this.props} />;
        }
    }
}

// pages/page-a.js
export default withFetching(fetching('science-fiction'))(MovieList);
// pages/page-b.js
export default withFetching(fetching('action'))(MovieList);
// pages/page-other.js
export default withFetching(fetching('some-other-type'))(MovieList);
```

会发现 `withFetching` 其实和前面的 `withAuth` 函数类似，把 **变的部分（fetching(type)）** 抽离到外部传入，从而实现页面的复用。

##### 装饰者模式？高阶组件？AOP？

可能你已经发现了，高阶组件其实就是装饰器模式在 React 中的实现：通过给函数传入一个组件（函数或类）后在函数内部对该组件（函数或类）进行功能的增强（不修改传入参数的前提下），最后返回这个组件（函数或类），即允许向一个现有的组件添加新的功能，同时又不去修改该组件，属于 **包装模式(Wrapper Pattern)** 的一种。

什么是装饰者模式：**在不改变对象自身的前提下在程序运行期间动态的给对象添加一些额外的属性或行为**。

> 相比于使用继承，装饰者模式是一种更轻便灵活的做法。

使用装饰者模式实现 **AOP**：

> 面向切面编程（AOP）和面向对象编程（OOP）一样，只是一种编程范式，并没有规定说要用什么方式去实现 AOP。

```js
// 在需要执行的函数之前执行某个新添加的功能函数
Function.prototype.before = function(before = () => {}) {
    return () => {
        before.apply(this, arguments);
        return this.apply(this, arguments);
    };
}
// 在需要执行的函数之后执行某个新添加的功能函数
Function.prototype.after = function(after = () => {}) {
    return () => {
        const result = after.apply(this, arguments);
        this.apply(this, arguments);
        return result;
    };
}
```

可以发现其实 `before` 和 `after` 就是一个 **高阶函数**，和高阶组件非常类似。

面向切面编程（**AOP**）主要应用在 **与核心业务无关但又在多个模块使用的功能比如权限控制、日志记录、数据校验、异常处理、统计上报等等领域**。

类比一下 **AOP** 你应该就知道高阶组件通常是处理哪一类型的问题了吧。

##### 总结

React 中的 **高阶组件** 其实是一个非常简单的概念，但又非常实用。在实际的业务场景中合理的使用高阶组件，**可以提高代码的复用性和灵活性**。

最后的最后，再对高阶组件进行一个小小的总结：

- 高阶组件 **不是组件**，**是** 一个把某个组件转换成另一个组件的 **函数**
- 高阶组件的主要作用是 **代码复用**
- 高阶组件是 **装饰器模式在 React 中的实现**

#### 单页面应用（SPA） ：

通俗点说就是指 只有一个主页面的应用，浏览器一开始要加载所有必须的 html,css,js。所有的页面内容都包含在这个所谓的主页中。但是写的时候，还是会分开写（页面片段），然后在交互的时候由 路由动态载入，单页面的页面跳转，仅刷新局部资源。多应用于 PC 端。

#### 多页面应用 （MPA）：

一个应用中有 多个页面，页面跳转的时候是 整页进行刷新。

#### 单页面（SPA）和多页面（MPA）的对比 ：

组成 ：      SPA 一个外壳页面和多个页面片段组成。MPA 多个完整页面构成。
资源共用（css,js）：SPA 共用，只需在外壳部分加载。MPA 不共用，每个页面都需要加载。
刷新方式：SPA 页面局部刷新或更改。MPA 整页刷新。
url模式：   SPA a.com/#/pageone;a.com/#/pagetwo。MPA a.com/pageone.html;a.com/pagetwo.html。
用户体验：SPA 页面片段间的切换快，用户体验良好。MPA 页面切换加载缓慢，流畅度不够，用户体验比较差。
转场动画：SPA 容易实现。MPA 无法实现。
数据传递：SPA 容易。MPA 依赖url传参，或者cookie,localStorage等。
搜索引擎优化（SEO）：SPA 需要单独的方案，实现比较困难，不利于SEO检索，可以利用服务器端渲染（SSR）优化。MPA 实现方法简易。
试用范围：SPA 高要求的体验度，追求界面流畅的应用。MPA 适用于追求高度支持搜索引擎的应用。
开发成本：SPA 较高，需要借助专业的框架。MPA 较低，但页面重复代码多。
维护成本：SPA 相对容易。MPA 相对复杂。

##### 单页面的优点 ：

用户体验好，响应快，内容的改变不需要加载整个页面，基于这一点 SPA 对服务器压力较小。
前后端分离。
 页面效果会比较炫酷（比如切换页面内容时的专场动画）。

##### 单页面的缺点 ：

不利于 SEO。(搜索引擎排名)（可利用 SSR，服务器端渲染，进行优化）。
导航不可用，如果一定要导航需要自行实现前进、后退。（由于是单页面不能用浏览器的前进后退功能，所以需要自己建立堆栈管理）。
初次加载时耗时多。（首屏加载速度慢）
页面复杂度提高很多。

#### SSR

##### 一、什么是浏览器端渲染 (CSR)？

CSR是Client Side Render简称；页面上的内容是我们加载的js文件渲染出来的，js文件运行在浏览器上面，服务端只返回一个html模板。

![img](https://pic3.zhimg.com/80/v2-38d189b470279c5ac795b259930e3762_1440w.jpg)CSR加载图

##### 二、什么是服务器端渲染 (SSR)？

SSR是Server Side Render简称；页面上的内容是通过服务端渲染生成的，浏览器直接显示服务端返回的html就可以了。

![img](https://pic1.zhimg.com/80/v2-3ee48624b904cbb1bf0ff34ed2c766b8_1440w.jpg)SSR加载图



本文以Vue.js 做为演示框架来区分SSR和CSR。默认情况下，Vue.js可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行。

##### 三、不同渲染方式在浏览器解析情况

从输入页面URL到页面渲染完成大致流程为：

- 解析URL
- 浏览器本地缓存
- DNS解析
- 建立TCP/IP连接
- 发送HTTP请求
- 服务器处理请求并返回HTTP报文
- 浏览器根据深度遍历的方式把html节点遍历构建DOM树
- 遇到CSS外链，异步加载解析CSS，构建CSS规则树
- **遇到script标签，如果是普通JS标签则同步加载并执行，阻塞页面渲染，如果标签上有defer / async属性则异步加载JS资源**
- 将dom树和CSS DOM树构造成render树
- 渲染render树

![img](https://pic4.zhimg.com/80/v2-3f8a4075ffa636a7dfe8a2733621d97f_1440w.jpg)performance.timing

![img](https://pic4.zhimg.com/80/v2-f6f3e83b3246bb29b7f7bf29224a628b_1440w.jpg)CSR-浏览器performance情况

![img](https://pic1.zhimg.com/80/v2-16dd9c7e3a4648b1056746aee5d2b844_1440w.jpg)SSR-浏览器performance情况

- **FP**：首次绘制。用于标记导航之后浏览器在屏幕上渲染像素的时间点。这个不难理解，就是浏览器开始请求网页到网页首帧绘制的时间点。这个指标表明了网页请求是否成功。
- **FCP**：首次内容绘制。FCP 标记的是浏览器渲染来自 DOM 第一位内容的时间点，该内容可能是文本、图像、SVG 甚至 `<canvas>` 元素。
- **FMP**：首次有效绘制。这是一个很主观的指标。根据业务的不同，每一个网站的有效内容都是不相同的，有效内容就是网页中"主角元素"。对于视频网站而言，主角元素就是视频。对于搜索引擎而言，主角元素就是搜索框。
- **TTI**：可交互时间。用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点。应用可能会因为多种原因而无法响应用户输入：①页面组件运行所需的JavaScript尚未加载完成。②耗时较长的任务阻塞主线程

根据上图devtool时间轴的结果，虽然CSR配合预渲染方式（loading、骨架图）可以提前FP、FCP从而减少白屏问题，但无法提前FMP；SSR将FMP提前至js加载前触发，提前显示网页中的"主角元素"。SSR不仅可以减少白屏时间还可以大幅减少首屏加载时间。

#### React 异步组件

```jsx
import React from 'react'

const AsynchronousComp = React.lazy(() => { import('../React_JSX') })

class ReactComp extends React.Component {

  render() {

    /**
     * 1. 使用 React.Lazy 和 import() 来引入组件
     * 2. 使用<React.Suspense></React.Suspense>来做异步组件的父组件，并使用 fallback 来实现组件未加载完成时展示信息
     * 3. fallback 可以传入html，也可以自行封装一个统一的提示组件
     */

    return (
      <div>
        <p>异步加载</p>
        <p>---------------------</p>
        <React.Suspense
          fallback={
            <div>loading...</div>
          }
        >
          <AsynchronousComp />
        </React.Suspense>
      </div>
    )
  }
}

export default ReactComp;
```

#### React Jsx转换成真实DOM过程？

一、是什么
react通过将组件编写的JSX映射到屏幕，以及组件中的状态发生了变化之后 React会将这些「变化」更新到屏幕上

在前面文章了解中，JSX通过babel最终转化成React.createElement这种形式，例如：

```
<div>
  <img src="avatar.png" className="profile" />
  <Hello />
</div>
```

会被bebel转化成如下：

```
React.createElement(
  "div",
  null,
  React.createElement("img", {
    src: "avatar.png",
    className: "profile"
  }),
  React.createElement(Hello, null)
);
```

在转化过程中，babel在编译时会判断 JSX 中组件的首字母：

当首字母为小写时，其被认定为原生 DOM 标签，createElement 的第一个变量被编译为字符串

当首字母为大写时，其被认定为自定义组件，createElement 的第一个变量被编译为对象

最终都会通过RenderDOM.render(...)方法进行挂载，如下：

```
ReactDOM.render(<App />,  document.getElementById("root"));
```

二、过程
在react中，节点大致可以分成四个类别：

原生标签节点

文本节点

函数组件

类组件

如下所示：

```
class ClassComponent extends Component {
  static defaultProps = {
    color: "pink"
  };
  render() {
    return (
      <div className="border">
        <h3>ClassComponent</h3>
        <p className={this.props.color}>{this.props.name}</p>
      </div>
    );
  }
}

function FunctionComponent(props) {
  return (
    <div className="border">
      FunctionComponent
      <p>{props.name}</p>
    </div>
  );
}

const jsx = (

  <div className="border">
    <p>xx</p>
    <a href="https://www.xxx.com/">xxx</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" color="red" />
  </div>

);
```

这些类别最终都会被转化成React.createElement这种形式

React.createElement其被调用时会传⼊标签类型type，标签属性props及若干子元素children，作用是生成一个虚拟Dom对象，如下所示：

```
function createElement(type, config, ...children) {
    if (config) {
        delete config.__self;
        delete config.__source;
    }
    // ! 源码中做了详细处理，⽐如过滤掉key、ref等
    const props = {
        ...config,
        children: children.map(child =>
   typeof child === "object" ? child : createTextNode(child)
  )
    };
    return {
        type,
        props
    };
}
function createTextNode(text) {
    return {
        type: TEXT,
        props: {
            children: [],
            nodeValue: text
        }
    };
}
export default {
    createElement
};
```

createElement会根据传入的节点信息进行一个判断：

如果是原生标签节点， type 是字符串，如div、span

如果是文本节点， type就没有，这里是 TEXT

如果是函数组件，type 是函数名

如果是类组件，type 是类名

虚拟DOM会通过ReactDOM.render进行渲染成真实DOM，使用方法如下：

```
ReactDOM.render(element, container[, callback])
```

当首次调用时，容器节点里的所有 DOM 元素都会被替换，后续的调用则会使用 React 的 diff算法进行高效的更新

如果提供了可选的回调函数callback，该回调将在组件被渲染或更新之后被执行

render大致实现方法如下：

```
function render(vnode, container) {
    console.log("vnode", vnode); // 虚拟DOM对象
    // vnode _> node
    const node = createNode(vnode, container);
    container.appendChild(node);
}

// 创建真实DOM节点
function createNode(vnode, parentNode) {
    let node = null;
    const {type, props} = vnode;
    if (type === TEXT) {
        node = document.createTextNode("");
    } else if (typeof type === "string") {
        node = document.createElement(type);
    } else if (typeof type === "function") {
        node = type.isReactComponent
            ? updateClassComponent(vnode, parentNode)
        : updateFunctionComponent(vnode, parentNode);
    } else {
        node = document.createDocumentFragment();
    }
    reconcileChildren(props.children, node);
    updateNode(node, props);
    return node;
}

// 遍历下子vnode，然后把子vnode->真实DOM节点，再插入父node中
function reconcileChildren(children, node) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (Array.isArray(child)) {
            for (let j = 0; j < child.length; j++) {
                render(child[j], node);
            }
        } else {
            render(child, node);
        }
    }
}
function updateNode(node, nextVal) {
    Object.keys(nextVal)
        .filter(k => k !== "children")
        .forEach(k => {
        if (k.slice(0, 2) === "on") {
            let eventName = k.slice(2).toLocaleLowerCase();
            node.addEventListener(eventName, nextVal[k]);
        } else {
            node[k] = nextVal[k];
        }
    });
}

// 返回真实dom节点
// 执行函数
function updateFunctionComponent(vnode, parentNode) {
    const {type, props} = vnode;
    let vvnode = type(props);
    const node = createNode(vvnode, parentNode);
    return node;
}

// 返回真实dom节点
// 先实例化，再执行render函数
function updateClassComponent(vnode, parentNode) {
    const {type, props} = vnode;
    let cmp = new type(props);
    const vvnode = cmp.render();
    const node = createNode(vvnode, parentNode);
    return node;
}
export default {
    render
};
```

三、总结
在react源码中，虚拟Dom转化成真实Dom整体流程如下图所示：


其渲染流程如下所示：

使用React.createElement或JSX编写React组件，实际上所有的 JSX 代码最后都会转换成React.createElement(...) ，Babel帮助我们完成了这个转换的过程。

createElement函数对key和ref等特殊的props进行处理，并获取defaultProps对默认props进行赋值，并且对传入的孩子节点进行处理，最终构造成一个虚拟DOM对象

ReactDOM.render将生成好的虚拟DOM渲染到指定容器上，其中采用了批处理、事务等机制并且对特定浏览器进行了性能优化，最终转换为真实DOM

#### React 中 getDerivedStateFromProps 的用法和反模式

本文将重点介绍 getDerivedStateFromProps 这个生命周期。要注意的是，React 16.3 的版本中 getDerivedStateFromProps 的触发范围是和 16.4^ 是不同的，主要区别是在 `setState` 和 `forceUpdate` 时会不会触发，具体可以看这个[生命全周期图](https://links.jianshu.com/go?to=http%3A%2F%2Fprojects.wojtekmaj.pl%2Freact-lifecycle-methods-diagram%2F) 。
 **该方法替换了 componentwillmount 和 componentwilllUpdate 使用时需要考虑好**

##### 用法

> getDerivedStateFromProps exists for only one purpose. It enables a component to update its internal state as the result of changes in props.

从上边这句话中，我们可以清晰知道 getDerivedStateFromProps 的作用就是为了让 props 能更新到组件内部 state 中。所以它可能的使用场景有两个：

- 无条件的根据 prop 来更新内部 state，也就是只要有传入 prop 值， 就更新 state
- 只有 prop 值和 state 值不同时才更新 state 值。

我们接下来看几个例子。

假设我们有个一个表格组件，它会根据传入的列表数据来更新视图。

```jsx
class Table extends React.Component {
    state = {
        list: []
    }
    static getDerivedStateFromProps (props, state) {
        return {
            list: props.list
        }
    }
    render () {
        .... // 展示 list
    }
}
```

上面的例子就是第一种使用场景，但是无条件从 prop 中更新 state，我们完全没必要使用这个生命周期，直接对 prop 值进行操作就好了，无需用 state 值类保存。

在看一个例子，这个例子是一个颜色选择器，这个组件能选择相应的颜色并显示，同时它能根据传入 prop 值显示颜色。

```jsx
Class ColorPicker extends React.Component {
    state = {
        color: '#000000'
    }
    static getDerivedStateFromProps (props, state) {
        if (props.color !== state.color) {
            return {
                color: props.color
            }
        }
        return null
    }
    ... // 选择颜色方法
    render () {
        .... // 显示颜色和选择颜色操作
    }
}
```

现在我们可以这个颜色选择器来选择颜色，同时我们能传入一个颜色值并显示。但是这个组件有一个 bug，如果我们传入一个颜色值后，再使用组件内部的选择颜色方法，我们会发现颜色不会变化，一直是传入的颜色值。

这是使用这个生命周期的一个常见 bug。为什么会发生这个 bug 呢？在开头有说到，在 React 16.4^ 的版本中 `setState` 和 `forceUpdate` 也会触发这个生命周期，所以内部 state 变化后，又会走 getDerivedStateFromProps 方法，并把 state 值更新为传入的 prop。

接下里我们来修复这个bug。

```jsx
Class ColorPicker extends React.Component {
    state = {
        color: '#000000',
        prevPropColor: ''
    }
    static getDerivedStateFromProps (props, state) {
        if (props.color !== state.prevPropColor) {
            return {
                color: props.color
                prevPropColor: props.color
            }
        }
        return null
    }
    ... // 选择颜色方法
    render () {
        .... // 显示颜色和选择颜色操作
    }
}
```

通过保存一个之前 prop 值，我们就可以在只有 prop 变化时才去修改 state。这样就解决上述的问题。

这里小结下 getDerivedStateFromProps 方法使用的注意点：

- 在使用此生命周期时，要注意把传入的 prop 值和之前传入的 prop 进行比较。
- 因为这个生命周期是静态方法，同时要保持它是纯函数，不要产生副作用。

上述的情况在大多数情况下都是适用，但是这边还是会有产生 bug 的风险。具体可以官网提供这个[例子](https://links.jianshu.com/go?to=https%3A%2F%2Fcodesandbox.io%2Fs%2Fmz2lnkjkrx)。在 One 和 Two 的默认账号都相同的情况下，使用同一个输入框组件，在切换到 Two，并不会显示成 Two 的默认账号。

这边解决方法有四种：

第一种是将组件改成完全可控组件（也是状态值和方法全由父类控制）；

第二种是改成完全不可控组件（也就是组件不接受在 getDerivedStateFromProps 中通过 prop 值来改变内部状态），然后通过设置在构造函数中把 prop 传给 state 和设置 key 值来处理，因为 key 变化的时候 React 会重新渲染组件，而不是去更新组件。

第三种还是保持上述组件模式，然后通过一个唯一 ID 来判断是否更新，而不是通过 color 值来判断。

第四种不使用 getDerivedStateFromProps，通过 ref 来把改变邮箱的方法暴露出去。

##### 反模式

常见的反模式有两种，上边也有提到过。

- 无条件地根据 prop 值来更新 state 值
- 当 prop 值变化并且和 state 不一样时就更新 state （会造成内部变化无效，上述也提到过）。

##### 总结

我们应该谨慎地使用 getDerivedStateFromProps 这个生命周期。我个人使用情况来说，使用时要注意下面几点：

- 因为这个生命周期是静态方法，同时要保持它是纯函数，不要产生副作用。
- 在使用此生命周期时，要注意把传入的 prop 值和之前传入的 prop 进行比较（这个 prop 值最好有唯一性，或者使用一个唯一性的 prop 值来专门比较）。
- 不使用 getDerivedStateFromProps，可以改成组件保持完全不可控模式，通过初始值和 key 值来实现 prop 改变 state 的情景。

#### [react如何通过shouldComponentUpdate来减少重复渲染](https://segmentfault.com/a/1190000016494335)

在react开发中，经常会遇到组件重复渲染的问题，父组件一个state的变化，就会导致以该组件的所有子组件都重写render，尽管绝大多数子组件的props没有变化

##### render什么时候会触发

首先，先上一张react生命周期图：

![life cycle](https://segmentfault.com/img/bVbeoGH?w=1200&h=1300)

这张图将react的生命周期分为了三个阶段：生成期、存在期、销毁期，这样在create、props、state、unMount状态变化时我们可以清楚的看到reacte触发了哪些生命周期钩子以及什么时候会render。

如果我们需要更改root的一个state，使绿色组件视图更改

![render1](https://segmentfault.com/img/bVbhm5e?w=400&h=250)

如果你写过vue，你会发现组件更新是如上图那样的（视图指令已编译为修改视图的函数存放在绑定的state里的属性里，所以能够做到靶向修改），而react会以组件为根，重新渲染整个组件子树，如下图（绿色是期望的render路径，橙色是无用render）：

![render3](https://segmentfault.com/img/bVbhm5p?w=502&h=250)

所以在react里，我们探讨的render性能优化是react调用render的路径如下：

![render2](https://segmentfault.com/img/bVbhm5u?w=500&h=250)

##### 如何避免这些不必要的render：

###### shouldComponentUpdate

```reasonml
shouldComponentUpdate(nextProps, nextState)
```

使用shouldComponentUpdate()以让React知道当前状态或属性的改变是否不影响组件的输出，默认返回ture，返回false时不会重写render，而且该方法并不会在初始化渲染或当使用forceUpdate()时被调用，我们要做的只是这样：

```stylus
shouldComponentUpdate(nextProps, nextState) {
  return nextState.someData !== this.state.someData
}
```

但是，state里的数据这么多，还有对象，还有复杂类型数据，react的理念就是拆分拆分再拆分，这么多子组件，我要每个组件都去自己一个一个对比吗？？不存在的，这么麻烦，要知道我们的终极目标是不劳而获-_-

###### React.PureComponent

React.PureComponent 与 React.Component 几乎完全相同，但 React.PureComponent 通过props和state的浅对比来实现 shouldComponentUpate()。如果对象包含复杂的数据结构，它可能会因深层的数据不一致而产生错误的否定判断(表现为对象深层的数据已改变视图却没有更新）

> 关注点：

- 无论组件是否是 PureComponent，如果定义了 shouldComponentUpdate()，那么会调用它并以它的执行结果来判断是否 update。在组件未定义 shouldComponentUpdate() 的情况下，会判断该组件是否是 PureComponent，如果是的话，会对新旧 props、state 进行 shallowEqual 比较，一旦新旧不一致，会触发 update。
- 浅判等 只会比较到两个对象的 ownProperty 是否符合 [Object.js()](https://link.segmentfault.com/?enc=dF21o0H8Sain9nBIDsBpNg%3D%3D.RVBCE6TfdKgMUBlSBxc0R%2FZxPrjphhnDBsUdvuQTs%2BUYHmfCzkLpf0bW7yvcESx7Ls37ydkTsUt%2Fz6Wh1ApBHH3sSN%2B8mywf1xM5az5uU%2BWe6oeptcmfhWwGem1cqvJSq8kQhyouFde1eihVUBB4eKn0ywgcno7bBBl6shYpXyo%3D) 判等，不会递归地去深层比较---[源码](https://link.segmentfault.com/?enc=VXm0qsoY9R%2FKuBVcwUr4Bg%3D%3D.NIwNakHijVfJCgfnSyqkC3JMCdy9Ve7WtZpaKTjtsW1KP4%2FVlZKQ0PaiF0TMhvyrkJ236DwZULq5m4G8U5%2BWblUwEJJzmwSCsDKqCJigOAAgreu25H4SH5Ub3a0CKwcIenPQj4ALRmkfi71uHzVUTSxJqTBDghx8B1pYNTLn2yk%3D)

```actionscript
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x: mixed, y: mixed): boolean {
  // SameValue algorithm
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
```

- 至于复杂数据结构，用Object.key()获取下key，然后key和对应的value都是基础类型数据，就是算是简单数据结构，不然就是复杂

针对以上规则我们在项目开发种可以做出如下优化：

> 尽量将复杂类型数据（ArrayList）所关联的视图单独拆成PureComonent有助于提高渲染性能，比如表单、文本域和复杂列表在同一个 render() 中，表单域的输入字段改变会频繁地触发 setState() 从而导致 组件 重新 render()。而用于渲染复杂列表的数据其实并没有变化，但由于重新触发 render()，列表还是会重新渲染。

##### [react-immutable-render-mixin](https://link.segmentfault.com/?enc=GpoVpbYx2kwzQGuzjMDB1w%3D%3D.tqVv1XL0DAHbi%2FwzhytJMGRc2BlSgUBKdDQL05ieZHSSzmvf9IovHp7vnVQ8dt041zlFW9wvjr%2FW7%2FT%2B8ctovg%3D%3D)

我想复杂数组没变化时也不要render(), 那你用[react-immutable-render-mixin](https://link.segmentfault.com/?enc=ruY4wFW5LhvjsjUZ8%2Fd4sw%3D%3D.ruKidsm4qxhQIFKfpKPMqdrQOE1KJ%2FOlW1Sm7dsVySAAZryy2brntY5COf2SA0WpXLAP1mkY2qr0K75s9VtIEQ%3D%3D)，来，我们看看插件的介绍：

> Users are urged to use PureRenderMixin with facebook/immutable-js. If performance is still an issue an examination of your usage of Immutable.js should be your first path towards a solution. This library was created from experimentations with Immutable that were ultimately erroneous; improper usage of Immutable.js 💩. Users should be able to achieve maximum performance simply using PureRenderMixin.
>
> ------
>
> 译：不能以正确的姿势来使用immutable-js做优化，你就不要瞎折腾了，用它react-immutable-render-mixin就行了

它和ProComponent原理一样，唯一的区别就是新旧数据的对比，react-immutable-render-mixin用了[immutable-js](https://link.segmentfault.com/?enc=v9FaAPULN4%2FYHt8F%2BnjVvA%3D%3D.PGvW4b2OObk%2Bt9mBlG0rMLB%2F7ixlwZOliU%2ByA%2FGg3U0gGRsdPGp8hXXUj3CUsBug) 的is()方法去做对比，性能强，复杂类型数据也能对比（这里不对immutable-js做讨论，一篇很不错的文章[Immutable 详解及 React 中实践](https://link.segmentfault.com/?enc=GEeRoKVCVycBm8TdOeT4wA%3D%3D.NYGLIDzOLUnnyHDU0vG87SSniEWQQd3ZmI2jr6O0kZXiCW2ULL3rzwFISYL2XPcm)）,相比于React.PureComponent更方便---[源码](https://link.segmentfault.com/?enc=aI66DAiJ6ipifn3Q426pNQ%3D%3D.uar24mugtvwiilikLOlZw%2Fkg5vL02KZ4C1a%2FuB%2BzrpnWjr2u2jtePjt6owWlwLZstqd5KcG4HAU%2Bifcev%2FsH9UfDM7Rzlh8pNo2MrUpsM52pyPRVTWTNcW8Q7v%2FW1ki4eSSaIi4XFw8e3WRVLwVURQ%3D%3D)

```javascript
import Immutable from 'immutable';

const is = Immutable.is.bind(Immutable);

export default function shallowEqualImmutable(objA, objB) {
  if (objA === objB || is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (let i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}
```

用法很多，我喜欢Decorator：

```scala
import React from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

@immutableRenderDecorator
class Test extends React.Component {
  render() {
    return <div></div>;
  }
}
```

#### React 的 PureComponent Vs Component

##### 一.它们几乎完全相同，但是PureComponent通过prop和state的浅比较来实现shouldComponentUpdate，某些情况下可以用PureComponent提升性能

1.所谓`浅比较`(shallowEqual)，即react源码中的一个函数，然后根据下面的方法进行是不是`PureComponent`的判断，帮我们做了本来应该我们在`shouldComponentUpdate`中做的事情

```javascript
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(inst.state, nextState);
}
```

而本来我们做的事情如下，这里判断了`state`有没有发生变化（prop同理），从而决定要不要重新渲染，这里的函数在一个继承了`Component`的组件中，而这里`this.state.person`是一个对象，你会发现，在这个对象的引用没有发生变化的时候是不会重新`render`的（即下面提到的第三点），所以我们可以用`shouldComponentUpdate`进行优化，这个方法如果返回`false`，表示不需要重新进行渲染，返回`true`则重新渲染，默认返回`true`

```javascript
  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.person !== this.state.person);
  }
```

2.上面提到的某些情况下可以使用`PureComponent`来提升性能，那具体是哪些情况可以，哪些情况不可以呢，实践出真知

3.如下显示的是一个`IndexPage`组件，设置了一个`state`是`isShow`，通过一个按钮点击可以改变它的值，结果是：初始化的时候输出的是`constructor`，`render`，而第一次点击按钮，会输出一次render，即重新渲染了一次，界面也会从显示`false`变成显示`true`，但是当这个组件是继承自`PureComponent`的时候，再点击的时，不会再输出`render`，即不会再重新渲染了，而当这个组件是继承自`Component`时，还是会输出`render`，还是会重新渲染，这时候就是`PureComponent`内部做了优化的体现

4.同理也适用于`string`，`number`等基本数据类型，因为基本数据类型，值改变了就算改变了

```javascript
import React, { PureComponent } from 'react';

class IndexPage extends PureComponent{
  constructor() {
    super();
    this.state = {
      isShow: false
    };
    console.log('constructor');
  }
  changeState = () => {
    this.setState({
      isShow: true
    })
  };
  render() {
    console.log('render');
    return (
      <div>
        <button onClick={this.changeState}>点击</button>
        <div>{this.state.isShow.toString()}</div>
      </div>
    );
  }
}
```

5.当这个`this.state.arr`是一个数组时，且这个组件是继承自`PureComponent`时，初始化依旧是输出`constructor`和`render`，但是当点击按钮时，界面上没有变化，也没有输出`render`，证明没有渲染，但是我们可以从下面的注释中看到，每点击一次按钮，我们想要修改的`arr`的值已经改变，而这个值将去修改`this.state.arr`,但是因为在`PureComponent`中`浅比较`这个数组的引用没有变化所以没有渲染，`this.state.arr`也没有更新，因为在`this.setState()`以后，值是在`render`的时候更新的，这里涉及到`this.setState()`的知识

6.但是当这个组件是继承自`Component`的时候，初始化依旧是输出`constructor`和`render`，但是当点击按钮时，界面上出现了变化，即我们打印处理的`arr`的值输出，而且每点击一次按钮都会输出一次`render`，证明已经重新渲染，`this.state.arr`的值已经更新，所以我们能在界面上看到这个变化

```javascript
import React, { PureComponent } from 'react';

class IndexPage extends PureComponent{
  constructor() {
    super();
    this.state = {
      arr:['1']
    };
    console.log('constructor');
  }
  changeState = () => {
    let { arr } = this.state;
    arr.push('2');
    console.log(arr);
    // ["1", "2"]
    // ["1", "2", "2"]
    // ["1", "2", "2", "2"] 
    // ....
    this.setState({
      arr
    })
  };
  render() {
    console.log('render');
    return (
      <div>
        <button onClick={this.changeState}>点击</button>
        <div>
          {this.state.arr.map((item) => {
            return item;
          })}
        </div>
      </div>
    );
  }
}
```

7.下面的例子用`扩展运算符`产生新数组，使`this.state.arr`的引用发生了变化，所以初始化的时候输出`constructor`和`render`后，每次点击按钮都会输出`render`，界面也会变化，不管该组件是继承自`Component`还是`PureComponent`的

```javascript
import React, { PureComponent } from 'react';

class IndexPage extends PureComponent{
  constructor() {
    super();
    this.state = {
      arr:['1']
    };
    console.log('constructor');
  }
  changeState = () => {
    let { arr } = this.state;
    this.setState({
      arr: [...arr, '2']
    })
  };
  render() {
    console.log('render');
    return (
      <div>
        <button onClick={this.changeState}>点击</button>
        <div>
          {this.state.arr.map((item) => {
            return item;
          })}
          </div>
      </div>
    );
  }
}
```

8.上面的情况同样适用于`对象`的情况

##### 二.PureComponent不仅会影响本身，而且会影响子组件，所以PureComponent最佳情况是展示组件

1.我们让`IndexPage`组件里面包含一个子组件`Example`来展示`PureComponent`是如何影响子组件的

2.父组件继承`PureComponent`，子组件继承`Component`时：下面的结果初始化时输出为`constructor`，`IndexPage render`，`example render`，但是当我们点击按钮时，界面没有变化，因为这个`this.state.person`对象的引用没有改变，只是改变了它里面的属性值所以尽管子组件是继承`Component`的也没有办法渲染，因为父组件是`PureComponent`，父组件根本没有渲染，所以子组件也不会渲染

3.父组件继承`PureComponent`，子组件继承`PureComponent`时：因为渲染在父组件的时候就没有进行，相当于被拦截了，所以子组件是`PureComponent`还是`Component`根本不会影响结果，界面依旧没有变化

4.父组件继承`Component`，子组件继承`PureComponent`时：结果和我们预期的一样，即初始化是会输出`constructor`，`IndexPage render`，`example render`，但是点击的时候只会出现`IndexPage render`，因为父组件是`Component`，所以父组件会渲染，但是
 当父组件把值传给子组件的时候，因为子组件是`PureComponent`，所以它会对`prop`进行浅比较，发现这个`person`对象的引用没有发生变化，所以不会重新渲染，而界面显示是由子组件显示的，所以界面也不会变化

5.父组件继承`Component`，子组件继承`Component`时：初始化是会输出`constructor`，`IndexPage render`，`example render`，当我们第一次点击按钮以后，界面发生变化，后面就不再改变，因为我们一直把它设置为sxt2，但是每点击一次都会输出`IndexPage render`，`example render`，因为每次不管父组件还是子组件都会渲染

6.所以正如下面第四条说的，如果`state`和`prop`一直变化的话，还是建议使用`Component`，并且`PureComponent`的最好作为展示组件

```javascript
//父组件
import React, { PureComponent, Component } from 'react';
import Example from "../components/Example";

class IndexPage extends PureComponent{
  constructor() {
    super();
    this.state = {
      person: {
        name: 'sxt'
      }
    };
    console.log('constructor');
  }
  changeState = () => {
    let { person } = this.state;
    person.name = 'sxt2';
    this.setState({
      person
    })
  };
  render() {
    console.log('IndexPage render');
    const { person } = this.state;
    return (
      <div>
        <button onClick={this.changeState}>点击</button>
        <Example person={person} />
      </div>
    );
  }
}
//子组件
import React, { Component } from 'react';

class Example extends Component {

  render() {
    console.log('example render');
    const { person } = this.props;
    return(
      <div>
        {person.name}
      </div>
    );
  }
}
```

##### 三.若是数组和对象等引用类型，则要引用不同，才会渲染

##### 四.如果prop和state每次都会变，那么PureComponent的效率还不如Component，因为你知道的，进行浅比较也是需要时间

##### 五.若有shouldComponentUpdate，则执行它，若没有这个方法会判断是不是PureComponent，若是，进行浅比较

1.继承自`Component`的组件，若是`shouldComponentUpdate`返回`false`，就不会渲染了，继承自`PureComponent`的组件不用我们手动去判断`prop`和`state`，所以在`PureComponent`中使用`shouldComponentUpdate`会有如下警告:

**IndexPage has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.**

也是比较好理解的，就是不要在`PureComponent`中使用`shouldComponentUpdate`，因为根本没有必要

#### React的渲染流程

先上一张图，这是 React 团队作者 Dan Abramov 画的一张生命周期阶段图，可以看出 React 的生命周期主要分为两个阶段：render 阶段和 commit 阶段。

其中 commit 阶段又可以细分为 pre-commit 阶段和 commit 阶段；

![在这里插入图片描述](https://img-blog.csdnimg.cn/0debab1471234a80aba1058097a082dd.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAamllZ2lzZXIj,size_20,color_FFFFFF,t_70,g_se,x_16)

##### react 16 架构

React 16 是重构了 React 15 的一个大版本；其相比 React 15 架构增加了 Scheduler
React16 架构可以分为三层：

Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
Reconciler（协调器）—— 负责找出变化的组件
Renderer（渲染器）—— 负责将变化的组件渲染到页面上

##### Scheduler

Schedule 是根据浏览器是否有剩余时间作为任务中断的标准，当浏览器有剩余时间时通知我们。然后根据优先级进行调度执行任务；


其实部分浏览器已经实现了这个API，这就是 requestIdleCallback。但是由于以下因素，React 放弃使用：

###### 浏览器兼容性

触发频率不稳定，受很多因素影响。比如当我们的浏览器切换 tab 后，之前 tab 注册的 requestIdleCallback 触发的频率会变得很低
基于以上原因，React 实现了功能更完备的requestIdleCallback polyfill，这就是Scheduler。除了在空闲时触发回调的功能外，Scheduler还提供了多种调度优先级供任务设置。

render 与 commit 阶段统称为 work，即 React 在工作中。相对应的，如果任务正在 Scheduler 内调度，就不属于work。

##### Reconciler

Reconciliation 的内容主要是在 React 中如何去渲染和协调你的代码；Reconciler 采用 Fiber 架构，来实现异步可中断的更新；diff 算法就是发生在该阶段，为需要更新的 fiber 打上 effect tag；它主要有以下几个功能：

注册调度任务: 与调度中心(scheduler 包)交互, 注册调度任务 task, 等待任务回调.
执行任务回调: 在内存中构造出 fiber 树, 同时与与渲染器(react-dom)交互, 在内存中创建出与 fiber 对应的 DOM节点.
输出: 与渲染器(react-dom)交互, 渲染 DOM 节点
Reconciler 工作的阶段被称为 render 阶段。因为在该阶段会调用组件的 render 方法；

##### Render

Renderer 根据 Reconciler 构造的 Fiber 树结构，根据对应的 effect tag 同步执行对应的 DOM 操作。这里存在 mount 以及 update 的 render 阶段；后面会详细说这块；

Renderer 工作的阶段被称为 commit 阶段。

##### React 渲染流程图解

![img](https://pic4.zhimg.com/80/v2-850f1f4b6188a1fee38f89ac6f92bee3_1440w.jpg)

对于首次渲染，`React` 的主要工作就是将 `React.render` 接收到的 `VNode` 转化 `Fiber` 树，并根据 `Fiber` 树的层级关系，构建生成出 `DOM` 树并渲染至屏幕中。

而对于更新渲染时，`Fiber` 树已经存在于内存中了，所以 `React` 更关心的是计算出 `Fiber` 树中的各个节点的差异，并将变化更新到屏幕中。

##### React 中的基础概念

在进行流程解读之前，有一些关于 `React` 源码中的概念需要先了解一下。

###### 两个阶段

为了实现 `concurrent` 模式，`React` 将渲染更新的过程分为了两个阶段：

1. `render` 阶段，利用双缓冲技术，在内存中构造另一颗 `Fiber` 树，在其上进行协调计算，找到需要更新的节点并记录，这个过程会被重复中断恢复执行。
2. `commit` 阶段，根据 `render` 阶段的计算结果，执行更新操作，这个过程是同步执行的。

###### VNode(元素)

`JSX` 会被编译转换成 `React.createElement` 函数的调用，其返回值就是 `VNode`，`虚拟DOM` 节点的描述对象。

在 `React` 源码中称之为 `element`，为了避免和 `DOM元素` 的冲突，这里我就用大家比较熟悉的 `虚拟DOM` 来称呼了。

```text
{
  // DOM节点名称或类组件、函数组件
  type: 'div' | App,
  ref: null,
  key: null,
  props: null
}
```

##### Fiber

Fiber有两层含义：程序架构、数据结构

从程序架构的角度来看，为了实现 `concurrent` 模式，需要程序具备的可中断、可恢复的特性， 而之前 `VNode` 的树型结构很难完成这些操作，所以 `Fiber` 就应运而生了。

那 `Fiber` 究竟是如何实现可中断、可恢复的呢？这就要说说 `Fiber`的具体数据结构了。

`Fiber` 是一个链表结构，通过`child`、`sibling`、`return`三个属性记录了树型结构中的子节点、兄弟节点、父节点的关系信息，从而可以实现从任一节点出发，都可以访问其他节点的特性。

除了作为链表的结构之外，程序运行时还需要记录组件的各种状态、实例、真实DOM元素映射等等信息，这些都会被记录在 `Fiber` 这个对象身上。

```text
function FiberNode() {
  this.tag = tag
  this.key = key
  this.elementType = null
  this.type = null
  this.stateNode = null
  this.return = null
  this.child = null
  this.sibling = null
  this.index = 0
  this.ref = null
  this.pendingProps = pendingProps
  this.memoizedProps = null
  this.updateQueue = null
  this.memoizedState = null
  this.dependencies = null
  this.mode = mode
  this.effectTag = NoEffect
  this.nextEffect = null
  this.firstEffect = null
  this.lastEffect = null
  this.expirationTime = NoWork
  this.childExpirationTime = NoWork
  this.alternate = null
}
```

###### return、child、sibling

这三个属性主要用途是将每个 Fiber 节点连接起来，用链表的结构来描述树型结构的关系。

- child：指向第一个子节点
- sibling：指向第一个兄弟节点
- return：指向父节点

###### effectTag（flags）

副作用标记，标识了此 `Fiber`节点需要进行哪些操作，默认为 `NoEffect`。

标记了 `NoEffect`、`PerformedWork` 的节点在更新过程中会被跳过。

```text
// 源码位置：packages/shared/ReactSideEffectTags.js
// 作为 EffectTag 的初始值，或者用于 EffectTag 的比较判断，其值为 0 表示没有副作用，也就是不涉 及更新
export const NoEffect = 0b000000000000
// 由 React devtools 读取， NoEffect 和 PerformedWork 都不会被 commit，当创建 Effect List时，会跳过NoEffect 和 PerformedWork
export const PerformedWork = 0b000000000001
// 表示向树中插入新的子节点，对应的状态为 MOUNTING，当执行 commitPlacement 函数完成插入后， 清除该标志位
export const Placement = 0b000000000010
// 表示当 props、state、context 发生变化或者 forceUpdate 时，会标记为 Update ，检查到标记后，执行 mmitUpdate 函数进行属性更新，与其相关的生命周期函数为 componentDidMount 和 componentDidUpdate
export const Update = 0b000000000100
export const PlacementAndUpdate = 0b000000000110
// 标记将要卸载的结点，检查到标记后，执行 commitDeletion 函数对组件进行卸载，在节点树中删除对应对 节点，与其相关的生命周期函数为 componentWillUnmount
export const Deletion = 0b000000001000
export const ContentReset = 0b000000010000
export const Callback = 0b000000100000
export const DidCapture = 0b000001000000
export const Ref = 0b000010000000
export const Snapshot = 0b000100000000
export const Passive = 0b001000000000
export const LifecycleEffectMask = 0b001110100100
export const HostEffectMask = 0b001111111111
```

###### nextEffect、firstEffect、lastEffect

链表结构，保存了需要更新的后代节点，每个 `Fiber` 节点处理完自身后都会根据相应逻辑与父节点的 `lastEffect` 进行连接。

这样在 `commit` 阶段，只需要从根节点的 `firstEffect` 向下遍历，就可以将所有需要更新的节点进行相应处理了。

###### updateQueue

保存了同一事件循环中对组件的多次更新操作（多次调用 `setState` ）

###### tag

`tag` 描述了 `Fiber` 节点的类型

```text
// 源码位置:packages/shared/ReactWorkTags.js
export const FunctionComponent = 0 // 函数组件元素对应的 Fiber 结点
export const ClassComponent = 1 // Class组件元素对应的 Fiber 结点
export const IndeterminateComponent = 2 // 在不确定是 Class 组件元素还是函数组件元素时的取值 export const HostRoot = 3; // 对应 Fiber 树的根结点
export const HostPortal = 4 // 对应一颗子树，可以另一个渲染器的入口
export const HostComponent = 5 // 宿主组件元素(如div，button等)对应的 Fiber 结点
export const HostText = 6 // 文本元素(如div，button等)对应的 Fiber 结点
export const Fragment = 7
```

###### stateNode

`Fiber` 节点的 `stateNode` 属性存储的当前节点的最终产物

- `ClassComponent` 类型的节点则该属性指向的是当前 `Class` 组件的实例
- `HostComponent` 类型的节点则该属性指向的是当前节点的 `DOM` 实例
- `HostRoot` 类型的节点则该属性指向的是 `fiberRoot` 对象

###### FiberRootNode

`fiberRoot` 对象是整个 `Fiber架构` 的入口对象，其上记录了应用程序运行过程中需要保存的关键信息。

```text
function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag
  // current树
  this.current = null
  // 包含容器
  this.containerInfo = containerInfo
  this.pendingChildren = null
  this.pingCache = null
  this.finishedExpirationTime = NoWork
  // 存储工作循环(workLoop)结束后的副作用列表，用于commit阶段 
  this.finishedWork = null
  this.timeoutHandle = noTimeout
  this.context = null
  this.pendingContext = null
  this.hydrate = hydrate
  this.firstBatch = null
}
```

`containerInfo` 保存了 `React.render` 函数第二个参数，也就是程序的真实 `DOM` 容器。

`current` 属性既是应用程序中 `Fiber树` 的入口。

`current` 的值是一个 `HostRoot` 类型的 `Fiber` 节点，这个 `HostRoot` 的子节点就是程序的根组件（`App`）对应的 `Fiber` 节点。

在首次渲染调用 `React.render` 时，应用程序中其实只有一个 `HostRoot` 的 `Fiber` 节点，而在 `render` 过程中，才会将我们传入的 `App` 组件构建成 `HostRoot` 的子 `Fiber` 节点。

###### 双缓冲

双缓冲是指将需要变化的部分，先在内存中计算改变，计算完成后一次性展示给用户，这样用户就不会感知到明显的计算变化。离屏 `Canvas` 就是双缓冲的思想。

对于 `Concurrent` 模式来说，更新计算的过程会被频繁中断，如果不使用缓冲技术，那用户就会感知到明显的中断变化。

每个 `Fiber` 节点的 `alternate` 属性会指向另一个 `Fiber` 节点，这个 `Fiber` 节点就是「草稿」节点，当需要进行计算时，就会在这个节点上进行。计算完成后将两个节点进行互换，展示给用户。

作为已经计算完成并展示到视图中的 `Fiber` 树，在源码中称为 `current` 树。 而 `current` 树的 `alternate` 指向的另一棵树，就是用来计算变化的，称为 `WorkInProgress` 树（ `WIP` ）。

###### 组件

函数或者是类，最终产出 `VNode` 和定义生命周期钩子。

###### 组件实例

类组件实例化后的对象，其上记录了生命周期函数、组件自身状态、响应事件等。对于函数组件来说，没有实例对象，所以在 `hooks` 出现之前函数组件不能拥有自己的状态，而在 `hooks` 之后，函数组件通过调用 `hooks` 的产生状态被记录在组件对应的 `Fiber` 对象中。

###### update（更新对象）

包含过期时间、更新内容的对象。

###### updateList（更新队列）

`update` 的集合，链表结构。`React` 的更新操作都是异步执行的，在同一个宏任务中执行的更新操作都会被记录在此处，统一在下一个队列中执行。

##### 更新队列

不管是首次渲染还是更新渲染，都一定会经过以下步骤：

1. 创建更新对象
2. 加入更新队列
3. 遍历合并更新队列获取最终的状态值。

所以我们先来了解一下什么是更新对象和队列。

###### 更新队列的作用

主要是对同步的多次调用 `setState` 进行缓冲，避免冗余的渲染调用。

###### 多次触发更新（setState）

触发更新操作时，`React` 会从 `this`（类组件）或 `hooks` 返回的 `setter` 函数中找到对应的 `Fiber` 节点，然后根据传入 `setState` 的参数创建更新对象，并将更新对象保存在 `Fiber` 节点的 `updateQueue` 中。 这样我们在同一个事件循环中对组件的多次修改操作就可以记录下来，在下一个事件循环中统一进行处理。处理时就会遍历 `updateQueue` 中的修改，依次合并获取最终的 `state` 进行渲染。

###### 更新对象定义

```text
function createUpdate(expirationTime, suspenseConfig) {
 var update = {
    // 过期时间与任务优先级相关联
    expirationTime: expirationTime,
    suspenseConfig: suspenseConfig,
    // tag用于标识更新的类型如UpdateState，ReplaceState，ForceUpdate等
    tag: UpdateState,
    // 更新内容
    payload: null,
    // 更新完成后的回调
    callback: null,
    // 下一个更新（任务）
    next: null,
    // 下一个副作用
    nextEffect: null
  };
  {
    // 优先级会根据任务体系中当前任务队列的执行情况而定
    update.priority = getCurrentPriorityLevel()
  }
  return update
}
```

为了防止某个 `update` 因为优先级的问题一直被打断，`React` 给每个 `update` 都设置了过期时间（`expirationTime`），当时间到了就会强制执行改 `update`。

`expirationTime` 会根据任务的优先级计算得来

```text
// 源码位置：packages/scheduler/src/Scheduler.js
// 立即执行（可由饥饿任务转换），最高优先级
var ImmediatePriority = 1;
// 用户阻塞级别（如外部事件），次高优先级
var UserBlockingPriority = 2;
// 普通优先级
var NormalPriority = 3;
// 低优先级
var LowPriority = 4;
// 最低优先级，空闲时去执行
var IdlePriority = 5;
```

简单点说，具有 `UserBlockingPriority` 级别的多个更新，如果它们的时间间隔小于10ms，那么它们拥有相同的过期时间。

同样的方式可以推到出具有 `LowPriority` 级别的多个更新（一般为异步更新），如果它们的时间间隔小于25ms，那么它们也拥有相同的过期时间。

`React` 的过期时间机制保证了短时间内同一个 `Fiber` 节点的多个更新拥有相同的过期时间，最终会合并在一起执行。

###### 更新队列定义

```text
// 源码位置:packages/react-reconciler/src/ReactUpdateQueue.js
function createUpdateQueue(baseState) {
  var queue = {
    // 当前的state
    baseState: baseState,
    // 队列中第一个更新
    firstUpdate: null,
    // 队列中的最后一个更新 lastUpdate: null,
    // 队列中第一个捕获类型的update firstCapturedUpdate: null,
    // 队列中第一个捕获类型的update lastCapturedUpdate: null,
    // 第一个副作用
    firstEffect: null,
    // 最后一个副作用
    lastEffect: null,
    firstCapturedEffect: null,
    lastCapturedEffect: null,
  }
  return queue
}
```

##### 初始渲染流程

1. 根组件的 `JSX` 定义会被 `babel` 转换为 `React.createElement` 的调用，其返回值为 `VNode树`。
2. `React.render` 调用，实例化 `FiberRootNode`，并创建 `根Fiber` 节点 `HostRoot` 赋值给 `FiberRoot` 的 `current` 属性
3. 创建更新对象，其更新内容为 `React.render` 接受到的第一个参数 `VNode树`，将更新对象添加到 `HostRoot` 节点的 `updateQueue` 中
4. 处理更新队列，从 `HostRoot` 节点开始遍历，在其 `alternate` 属性中构建 `WIP` 树，在构建 `Fiber` 树的过程中会根据 `VNode` 的类型进行组件实例化、生命周期调用等工作，对需要操作视图的动作将其保存到 `Fiber` 节点的 `effectTag` 上面，将需要更新在DOM上的属性保存至 `updateQueue` 中，并将其与父节点的 `lastEffect` 连接。
5. 当整颗树遍历完成后，进入 `commit` 阶段，此阶段就是将 `effectList` 收集的 `DOM` 操作应用到屏幕上。
6. `commit` 完成将 `current` 替换为 `WIP` 树。

###### 构建WIP树

`React` 会先以 `current` 这个 `Fiber` 节点为基础，创建一个新的 `Fiber` 节点并赋值给 `current.alternate` 属性，然后在这个 `alternate` 节点上进行协调计算，这就是之前所说的 `WIP` 树。

协调时会在全局记录一个 `workInProgress` 指针，用来保存当前正在处理的节点，这样中断之后就可以在下一个事件循环中接着进行协调。

此时整个更新队列中只有 `HostRoot` 这一个 `Fiber` 节点，对当前节点处理完成之后，会调用 `reconcileChildren` 方法来获取子节点，并对子节点做同样的处理流程。

###### Fiber节点处理

1. 创建当前节点，并返回子节点
2. 如果子节点为空，则执行叶子节点逻辑
3. 否则，将子节点赋值给 `workInProgress` 指针，作为下一个处理的节点。

这里主要说一下三种主要节点：HostRoot、ClassComponent、HostComponent

- HostRoot

- - 对于 `HostRoot` 主要是处理其身上的更新队列，获取根组件的元素。

- ClassComponent

- - 解析完 `HostRoot` 后会返回其 `child` 节点，一般来说就是 `ClassComponent` 了。
  - 这种类型的 `Fiber` 节点是需要进行组件实例化的，实例会被保存在 `Fiber` 的 `stateNode` 属性上。
  - 实例化之后会调用 `render` 拿到其 `VNode` 再次进行构建过程。
  - 对于数组类型的 `VNode`，会使用 `sibling` 属性将其相连。

- HostComponent

- - `HostComponent` 就是原生的 `DOM` 类型了，会创建 `DOM` 对象并保存到 `stateNode` 属性上。

###### 叶子节点逻辑

简单思考一下，叶子节点必然是一个 `DOM` 类型的节点，也就是 `HostComponent`，所以对叶子节点的处理可以理解为将 `Fiber` 节点映射为 `DOM` 节点的过程。

当碰到叶子节点时，会创建相应的 `DOM` 元素，然后将其记录在 `Fiber` 的 `stateNode` 属性中，然后调用 `appendAllChildren` 将子节点创建好的的 `DOM` 添加到 `DOM` 结构中。

叶子节点处理完毕后

- 如果其兄弟节点存在，就将 `workInProgress` 指针指向其兄弟节点。
- 否则就将 `workInProgress` 指向其父节点。

###### 收集副作用

收集副作用的过程中主要有两种情况

1. 第一种情况是将当前节点的副作用链表添加到父节点中

- `returnFiber.lastEffect.nextEffect = workInProgress.firstEffect`

1. 第二种情况就是如果当前节点也有副作用标识，则将当前节点连接到父节点的副作用链表中

- `returnFiber.lastEffect.nextEffect = workInProgress`

###### 处理副作用

从根节点的 `firstEffect` 开始向下遍历

1. `before mutation`：遍历 `effectList`，执行生命周期函数 `getSnapshotBeforeUpdate`，使用 `scheduleCallback` 异步调度 `flushPassiveEffects`方法（ `useEffect` 逻辑）
2. `mutation`：第二次遍历，根据 `Fiber` 节点的 `effectTag` 对 `DOM` 进行插入、删除、更新等操作；将 `effectList` 赋值给 `rootWithPendingPassiveEffects`
3. `layout`：从头再次遍历，执行生命周期函数，如 `componentDidMount`、`DidUpdate` 等，同时会将 `current` 替换为 `WIP` 树，置空 `WIP` 树；`scheduleCallback` 触发 `flushPassiveEffects`，`flushPassiveEffects` 内部遍历 `rootWithPendingPassiveEffects`

###### 渲染完成

至此整个 `DOM` 树就被创建并插入到了 `DOM` 容器中，整个应用程序也展示到了屏幕上，初次渲染流程结束。

##### 更新渲染流程

1. 组件调用 `setState` 触发更新，`React` 通过 `this` 找到组件对应的 `Fiber` 对象，使用 `setState` 的参数创建更新对象，并将其添加进 `Fiber` 的更新队列中，然后开启调度流程。
2. 从根 `Fiber` 节点开始构建 `WIP` 树，此时会重点处理新旧节点的差异点，并尽可能复用旧的 `Fiber` 节点。
3. 处理 `Fiber` 节点，检查 `Fiber` 节点的更新队列是否有值，`context` 是否有变化，如果没有则跳过。

- 处理更新队列，拿到最新的 `state`，调用 `shouldComponentUpdate` 判断是否需要更新。

1. 调用 `render` 方法获取 `VNode`，进行 `diff` 算法，标记 `effectTag`，收集到 `effectList` 中。

- 对于新元素，标记插入 `Placement`
- 旧 `DOM` 元素，判断属性是否发生变化，标记 `Update`
- 对于删除的元素，标记删除 `Deletion`

1. 遍历处理 `effectList`，调用生命周期并更新 `DOM`。

##### Fiber Diff

###### 单个节点

当 `key` 和 `type` 都相同时，会复用之前的 `Fiber` 节点，否则则会新建并将旧节点标记删除。

###### 多个节点

##### 任务与调度

###### 时间切片

在 `Concurrent` 模式下，任务以 `Fiber` 为单位进行执行，当 `Fiber` 处理完成，或者 `shouldYield` 返回值为 `true` 时，就会暂停执行，让出线程。

```text
while (workInProgress !== null && !shouldYield()) {
  performUnitOfWork(workInProgress)
}
```

在 `shouldYield` 中会判断当前时间与当前切片的过期时间，如果过期了，就会返回 `true`，而当前时间的过期时间则是根据不同的优先级进行计算得来。

###### 与浏览器通信 - MessageChannel

对于浏览器而言，如果我们想要让出js线程，那就是只能把当前的宏任务执行完成。等到下一个宏任务中再接着执行。当浏览器执行完一个宏任务后就会切换只渲染进程进行视图的渲染工作。MessageChannel可以创建一个宏任务，其优先级比setTimeout(0)高。

#### fiber机制

参考：https://react.iamkasong.com/#%E7%AB%A0%E8%8A%82%E5%88%97%E8%A1%A8

#### fiber如何实现可中断更新

##### 基本原理

1 .大量分配很多任务，他的处理速度就下降，但是如果把很多相同的任务放在一起。把一个长时间的任务打散，分解成很多小任务，可以执行非常快。
 1.1 .一次执行插入10000个节点的插入操作，花费0.1s，但是分批插入，每次操作100个节点，一共100次，性能异常的好
 2 .fiber算法分为两个阶段，第一段就是创建dom，并且标记各种任务，第二阶段才执行任务
 3 .执行任务时候，先进行优先插入dom或移动操作，然后时属性样式操作，等其他比较花费时间的操作
 4 .dom插入操作移除变成批处理，样式属性也变成批处理，然后还有一个异步模式的时间调度器

5 .本来的eventloop会在繁忙的状态下让页面卡顿，所以这里做了一个时间调度器
 6 .requestidCallbac会根据参数的不同，再有限时间内安排一定量的js任务，从而不影响视图，事件回调，也可以强制在浏览器不段更新视图的时候，强制中断这个行为，立即插入我们的react js逻辑
 7 .所以可以在requerstidCallback中中加入一个Workloop的方法，他每接触一个fiber,就判断一下当前时间，看是否有空闲时间让他执行下一个操作，如果没有时间就把他放到队列中去，把控制权让渡给视图渲染，下次requestidCallback唤起时，就将队列从刚才那个fiber取出来，执行工作。

8 .浏览器是单线程，将GUI描绘，时间器处理，js执行，远程资源加载统统放在一起，只有当他做完一件事才会继续下一件事，如果有足够的时间，浏览器是会对我们的代码进行编译优化的，一些dom操作也会进行reflow操作
 9 .本质就是渲染-执行任务--渲染-执行任务--渲染--执行任务
 10 .其中有很多任务我们是可以控制的，有的任务不可控制。比如setTiemout,资源加载时间不可控制，但是有的js我们是可以控制的，可以让他分派执行，task的时间不宜过长，这样浏览器就有足够的时间来优化js代码与修正reflow
 11 .总之就是让浏览器休息好，浏览器就能跑的更快

##### 如何让代码断开并重启,也就是冻结任务，然后再拉起来任务

1 .react之前的代码时栈调度器，但是他的坏处不能随机break，continue掉。如果我们break后我们还要重新执行，我们需要一种链表的结构，而不是栈
 2 .链表是对异步非常友好的，链表再循环的时候不用每次进入递归函数，重新生成之心法国上下文，变量对象，激活对象

3 .如何决定每次更新的数量

```css
1 .react15的时候，每次更新都是从根组件或state后的组件开始，更新整个子树，我们唯一能做的就是再某个节点中使用SCU断开一部分的更新，或者是优化SCU的比较效率
2 .react16则是将虚拟dom转化成fiber节点，首先规定一定时间内，再这个时间内可以转换多少个fiberNode，就更新多少个
3 .因此第一阶段就是将虚拟dom转换为fiber，fiber转换成组件实例或者真实DOM，fiber转换成后两者会明显消耗时间，需要计算还剩下多少时间，并且转换实例还需要一些钩子函数，
4 .总的来说就是每次会算出两个时间端，一个是自己的，一个是浏览器的，requestAnimationFrame能帮助我们解决第二个时间段，从而保证整体都是60帧或者75帧流畅运行
```

![img](https:////upload-images.jianshu.io/upload_images/4927035-d63e84d4d95fcc4a.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/968/format/webp)

5 .任务系统还有另一个存在意义，保证一些任务优先执行，某些任务是在另一些任务之前。我们称之为任务分拣。这就像快递的仓库管理一样，有了归类才好进行优化。比如说，元素虚拟DOM的插入移动操作必须在所有任务之前执行，移除操作必须在componentWillUnmount后执行。这些任务之所以是这个顺序，因为这样做才合理，都经过高手们的严密推敲，经过React15时代的大众验证

##### React Fiber

1 .一次更新将被分成多片完成。所以完全有可能一个更新任务还没有完成，就被另一个更高优先级的更新打断。这时候，优先级高得更新任务会优先处理完。而低级更新任务所作的工作则会完全作废，然后等待机会从头再来。componentWillUpdate函数会被在调用一次
 2 .render phase ,commmit phase
 3 .在render phase中，react fiber就会找出需要更新哪些dom,这个阶段是可以被打断的，而到了第二阶段commit phase，就一鼓作气把dom更新完，绝不会被打断
 4 .这两个阶段的分界点就是render函数。
 5 .之前的react函数中，每个生命周期函数在一个加载或者更新过程中绝对只会被调用一次。在react fiber中，不再是这样了，第一阶段中的生命周期函数在一次加载和更新过程中可能被多次调用

#### React的diff算法？

##### diff算法

###### 传统diff 对比 react diff：

传统的diff算法追求的是“完全”以及“最小”，而react diff则是放弃了这两种追求

在传统的diff算法下，对比前后两个节点，如果发现节点改变了，会继续去比较节点的子节点，一层一层去对比。就这样循环递归去进行对比，复杂度就达到了o(n³)，n是树的节点数，想象一下如果这棵树有1000个节点，得执行上十亿次比较，这种量级的对比次数，时间基本要用秒来做计数单位。

其实 React 的 virtual dom 的性能好也离不开它本身特殊的diff算法。传统的diff算法时间复杂度达到o(n³)，而 react 的 diff算法 时间复杂度只是o(n)，react的 diff 能减少到o(n)依靠的是react diff的三大策略。

##### 三大策略

###### 1、tree diff：

Web UI 中DOM节点跨层级的移动操作特别少，可以忽略不计

React 对 Virtual DOM树 进行层级控制，只会对 相同层级的DOM节点进行比较，即同一个父元素下的所有子节点，当发现节点已经不存在了，则会删除掉该节点下所有的子节点，不会再进行比较。这样只需要对DOM树进行一次遍历，就可以完成整个树的比较。复杂度变为O(n)

如果DOM节点出现了跨层级操作，diff处理方式：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e7c075a452074243acc92579a4f51a5a.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAWXVMb25nflc=,size_20,color_FFFFFF,t_70,g_se,x_16)

如下图所示，A节点及其子节点被整个移动到D节点下面去，由于React只会简单的考虑同级节点的位置变换，而对于不同层级的节点，只有 创建和删除 操作，所以当根节点发现A节点消失了，就会删除A节点及其子节点，当D发现多了一个子节点A，就会创建新的A作为其子节点。

由此可以发现，当出现节点跨层级移动时，并不会出现想象中的 移动 操作，而是会进行删除，重新创建的动作，这是一种很影响React性能的操作。

因此官方也不建议进行DOM节点跨层级的操作。可以通过 CSS隐藏、显示节点，而不是真正地移除、添加DOM节点。

###### 2、component diff：

拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构

最核心的策略还是 看结构是否发生改变。React是基于组件构建应用的，对于组件间的比较所采用的策略也是非常简洁和高效的

如果是 同一个类型 的组件，则按照原策略进行Virtual DOM比较。
如果是 不同类型 的组件，则将其判断为dirty component，从而替换整个组价下的所有子节点。
如果是 同一个类型 的组件，有可能经过一轮Virtual DOM比较下来，并没有发生变化。如果能够提前确切知道这一点，那么就可以省下大量的diff运算时间。因此，React允许用户通过shouldComponentUpdate() 来判断该组件是否需要进行 diff算法分析。
如下图所示，当组件D变为组件G时，哪怕这两个组件结构相似，一旦React判断D和G是不用类型的组件，就不会比较两者的结构，而是直接删除组件D，重新创建组件G及其子节点。也就是说，如果当两个组件是不同类型但结构相似时，其实进行diff算法分析会影响性能，但是毕竟不同类型的组件存在相似DOM树的情况在实际开发过程中很少出现，因此这种极端因素很难在实际开发过程中造成重大影响。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c2f14888743942e097fd4091718cc4ff.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAWXVMb25nflc=,size_20,color_FFFFFF,t_70,g_se,x_16)

###### 3、element diff：

对于同一层级的一组子节点，它们可以通过 唯一id或者key 进行区分

当节点属于同一层级时，diff提供了3种节点操作，分别为 INSERT_MARKUP(插入)， MOVE_EXISTING(移动)，REMOVE_NODE(删除)

操作	描述
插入	新节点不存在于旧集合当中，即全新的节点，就会执行插入操作
移动	新节点在旧集合中存在，并且只做了位置上的更新，就会复用之前的节点，做移动操作，可以复用以前的DOM节点。
删除	新节点在旧集合中存在，但节点做出了更改不能直接复用，做出删除操作。或者旧节点不在新集合里的，也需要执行删除操作

###### key的作用

问题：react中的 key 有什么作用？（key的内部原理是什么？）

###### 虚拟DOM中key的作用：

简单的说: key是虚拟DOM对象的标识, 在更新显示时key起着极其重要的作用
详细的说: 当状态中的数据发生变化时，react会根据【新数据】生成【新的虚拟DOM】，随后React进行 【新虚拟DOM】与【旧虚拟DOM】的diff比较，比较规则如下：
1、 旧虚拟DOM中找到与新虚拟DOM相同的key：
若虚拟DOM中内容没变, 直接使用之前的真实DOM
若虚拟DOM中内容变了,则生成新的真实DOM，随后替换掉页面中之前的真实DOM
2、 旧虚拟DOM中未找到与新虚拟DOM相同的key：
根据数据创建新的真实DOM，随后渲染到到页面

#### react和vue在虚拟DOM的diff算法有什么不同

vue和react的diff算法，都是忽略跨级比较，只做同级比较。vue diff时调动patch函数，参数是vnode和oldVnode，分别代表新旧节点。

vue比对节点，当节点元素类型相同，但是className不同，认为是不同类型元素，删除重建，而react会认为是同类型节点，只是修改节点属性

vue的列表比对，采用从两端到中间的比对方式，而react则采用从左到右依次比对的方式。当一个集合，只是把最后一个节点移动到了第一个，react会把前面的节点依次移动，而vue只会把最后一个节点移动到第一个。总体上，vue的对比方式更高效。

#### React合成事件

##### React合成事件特点

React自己实现了一套高效的事件注册，存储，分发和重用逻辑，在DOM事件体系基础上做了很大改进，减少了内存消耗，简化了事件逻辑，并最大化的解决了IE等浏览器的不兼容问题。与DOM事件体系相比，它有如下特点

1. React组件上声明的事件最终绑定到了document这个DOM节点上，而不是React组件对应的DOM节点。故只有document这个节点上面才绑定了DOM原生事件，其他节点没有绑定事件。这样简化了DOM原生事件，减少了内存开销
2. React以队列的方式，从触发事件的组件向父组件回溯，调用它们在JSX中声明的callback。也就是React自身实现了一套事件冒泡机制。我们没办法用event.stopPropagation()来停止事件传播，应该使用event.preventDefault()
3. React有一套自己的合成事件SyntheticEvent，不同类型的事件会构造不同的SyntheticEvent
4. React使用对象池来管理合成事件对象的创建和销毁，这样减少了垃圾的生成和新对象内存的分配，大大提高了性能

那么这些特性是如何实现的呢，下面和大家一起一探究竟。

##### React事件系统

浏览器事件（如用户点击了某个button）触发后，DOM将event传给ReactEventListener，它将事件分发到当前组件及以上的父组件。然后由ReactEventEmitter对每个组件进行事件的执行，先构造React合成事件，然后以queue的方式调用JSX中声明的callback进行事件回调。

涉及到的主要类如下

ReactEventListener：负责事件注册和事件分发。React将DOM事件全都注册到document这个节点上，这个我们在事件注册小节详细讲。事件分发主要调用dispatchEvent进行，从事件触发组件开始，向父元素遍历。我们在事件执行小节详细讲。

ReactEventEmitter：负责每个组件上事件的执行。

EventPluginHub：负责事件的存储，合成事件以对象池的方式实现创建和销毁，大大提高了性能。

SimpleEventPlugin等plugin：根据不同的事件类型，构造不同的合成事件。如focus对应的React合成事件为SyntheticFocusEvent

##### 事件注册

JSX中声明一个React事件十分简单，比如

```js
render() {
  return (
    <div onClick = {
            (event) => {console.log(JSON.stringify(event))}
        } 
    />
  );
}
```

那么它是如何被注册到React事件系统中的呢？

还是先得从组件创建和更新的入口方法mountComponent和updateComponent说起。在这两个方法中，都会调用到_updateDOMProperties方法，对JSX中声明的组件属性进行处理。源码如下

```js
_updateDOMProperties: function (lastProps, nextProps, transaction) {
    ... // 前面代码太长，省略一部分
    else if (registrationNameModules.hasOwnProperty(propKey)) {
        // 如果是props这个对象直接声明的属性，而不是从原型链中继承而来的，则处理它
        // nextProp表示要创建或者更新的属性，而lastProp则表示上一次的属性
        // 对于mountComponent，lastProp为null。updateComponent二者都不为null。unmountComponent则nextProp为null
        if (nextProp) {
          // mountComponent和updateComponent中，enqueuePutListener注册事件
          enqueuePutListener(this, propKey, nextProp, transaction);
        } else if (lastProp) {
          // unmountComponent中，删除注册的listener，防止内存泄漏
          deleteListener(this, propKey);
        }
    }
}
```

下面我们来看enqueuePutListener，它负责注册JSX中声明的事件。源码如下

```js
// inst: React Component对象
// registrationName: React合成事件名，如onClick
// listener: React事件回调方法，如onClick=callback中的callback
// transaction: mountComponent或updateComponent所处的事务流中，React都是基于事务流的
function enqueuePutListener(inst, registrationName, listener, transaction) {
  if (transaction instanceof ReactServerRenderingTransaction) {
    return;
  }
  var containerInfo = inst._hostContainerInfo;
  var isDocumentFragment = containerInfo._node && containerInfo._node.nodeType === DOC_FRAGMENT_TYPE;
  // 找到document
  var doc = isDocumentFragment ? containerInfo._node : containerInfo._ownerDocument;
  // 注册事件，将事件注册到document上
  listenTo(registrationName, doc);
  // 存储事件,放入事务队列中
  transaction.getReactMountReady().enqueue(putListener, {
    inst: inst,
    registrationName: registrationName,
    listener: listener
  });
}
```

enqueuePutListener主要做两件事，一方面将事件注册到document这个原生DOM上（这就是为什么只有document这个节点有DOM事件的原因），另一方面采用事务队列的方式调用putListener将注册的事件存储起来，以供事件触发时回调。

注册事件的入口是listenTo方法, 它解决了不同浏览器间捕获和冒泡不兼容的问题。事件回调方法在bubble阶段被触发。如果我们想让它在capture阶段触发，则需要在事件名上加上capture。比如onClick在bubble阶段触发，而onCaptureClick在capture阶段触发。listenTo代码虽然比较长，但逻辑很简单，调用trapCapturedEvent和trapBubbledEvent来注册捕获和冒泡事件。trapCapturedEvent大家可以自行分析，我们仅分析trapBubbledEvent，如下

```js
  trapBubbledEvent: function (topLevelType, handlerBaseName, element) {
    if (!element) {
      return null;
    }
    return EventListener.listen(
      element,   // 绑定到的DOM目标,也就是document
      handlerBaseName,   // eventType
      ReactEventListener.dispatchEvent.bind(null, topLevelType));  // callback, document上的原生事件触发后回调
  },

  listen: function listen(target, eventType, callback) {
    if (target.addEventListener) {
      // 将原生事件添加到target这个dom上,也就是document上。
      // 这就是只有document这个DOM节点上有原生事件的原因
      target.addEventListener(eventType, callback, false);
      return {
        // 删除事件,这个由React自己回调,不需要调用者来销毁。但仅仅对于React合成事件才行
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      // attach和detach的方式
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },
```

在listen方法中，我们终于发现了熟悉的addEventListener这个原生事件注册方法。只有document节点才会调用这个方法，故仅仅只有document节点上才有DOM事件。这大大简化了DOM事件逻辑，也节约了内存。

##### 事件存储

事件存储由EventPluginHub来负责，它的入口在我们上面讲到的enqueuePutListener中的putListener方法，如下

```js
  /**
   * EventPluginHub用来存储React事件, 将listener存储到`listenerBank[registrationName][key]`
   *
   * @param {object} inst: 事件源
   * @param {string} listener的名字,比如onClick
   * @param {function} listener的callback
   */
  //
  putListener: function (inst, registrationName, listener) {

    // 用来标识注册了事件,比如onClick的React对象。key的格式为'.nodeId', 只用知道它可以标示哪个React对象就可以了
    var key = getDictionaryKey(inst);
    var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
    // 将listener事件回调方法存入listenerBank[registrationName][key]中,比如listenerBank['onclick'][nodeId]
    // 所有React组件对象定义的所有React事件都会存储在listenerBank中
    bankForRegistrationName[key] = listener;

    //onSelect和onClick注册了两个事件回调插件, 用于walkAround某些浏览器兼容bug,不用care
    var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
    if (PluginModule && PluginModule.didPutListener) {
      PluginModule.didPutListener(inst, registrationName, listener);
    }
  },

var getDictionaryKey = function (inst) {
  return '.' + inst._rootNodeID;
};
```

由上可见，事件存储在了listenerBank对象中，它按照事件名和React组件对象进行了二维划分，比如nodeId组件上注册的onClick事件最后存储在listenerBank.onclick[nodeId]中。

##### 事件执行

###### 事件分发

当事件触发时，document上addEventListener注册的callback会被回调。从前面事件注册部分发现，此时回调函数为ReactEventListener.dispatchEvent，它是事件分发的入口方法。下面我们来详细分析

```js
// topLevelType：带top的事件名，如topClick。不用纠结为什么带一个top字段，知道它是事件名就OK了
// nativeEvent: 用户触发click等事件时，浏览器传递的原生事件
dispatchEvent: function (topLevelType, nativeEvent) {
    // disable了则直接不回调相关方法
    if (!ReactEventListener._enabled) {
      return;
    }

    var bookKeeping = TopLevelCallbackBookKeeping.getPooled(topLevelType, nativeEvent);
    try {
      // 放入批处理队列中,React事件流也是一个消息队列的方式
      ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
    } finally {
      TopLevelCallbackBookKeeping.release(bookKeeping);
    }
}
```

可见我们仍然使用批处理的方式进行事件分发，handleTopLevelImpl才是事件分发的真正执行者，它是事件分发的核心，体现了React事件分发的特点，如下

```js
// document进行事件分发,这样具体的React组件才能得到响应。因为DOM事件是绑定到document上的
function handleTopLevelImpl(bookKeeping) {
  // 找到事件触发的DOM和React Component
  var nativeEventTarget = getEventTarget(bookKeeping.nativeEvent);
  var targetInst = ReactDOMComponentTree.getClosestInstanceFromNode(nativeEventTarget);

  // 执行事件回调前,先由当前组件向上遍历它的所有父组件。得到ancestors这个数组。
  // 因为事件回调中可能会改变Virtual DOM结构,所以要先遍历好组件层级
  var ancestor = targetInst;
  do {
    bookKeeping.ancestors.push(ancestor);
    ancestor = ancestor && findParent(ancestor);
  } while (ancestor);

  // 从当前组件向父组件遍历,依次执行注册的回调方法. 我们遍历构造ancestors数组时,是从当前组件向父组件回溯的,故此处事件回调也是这个顺序
  // 这个顺序就是冒泡的顺序,并且我们发现不能通过stopPropagation来阻止'冒泡'。
  for (var i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i];
    ReactEventListener._handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
  }
}
```

从上面的事件分发中可见，React自身实现了一套冒泡机制。从触发事件的对象开始，向父元素回溯，依次调用它们注册的事件callback。

###### 事件callback调用

事件处理由_handleTopLevel完成。它其实是调用ReactBrowserEventEmitter.handleTopLevel() ，如下

```js
  // React事件调用的入口。DOM事件绑定在了document原生对象上,每次事件触发,都会调用到handleTopLevel
  handleTopLevel: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    // 采用对象池的方式构造出合成事件。不同的eventType的合成事件可能不同
    var events = EventPluginHub.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
    // 批处理队列中的events
    runEventQueueInBatch(events);
  }
```

handleTopLevel方法是事件callback调用的核心。它主要做两件事情，一方面利用浏览器回传的原生事件构造出React合成事件，另一方面采用队列的方式处理events。先看如何构造合成事件。

构造合成事件

```js
  // 构造合成事件
  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events;
    // EventPluginHub可以存储React合成事件的callback,也存储了一些plugin,这些plugin在EventPluginHub初始化时就注册就来了
    var plugins = EventPluginRegistry.plugins;
    for (var i = 0; i < plugins.length; i++) {
      var possiblePlugin = plugins[i];
      if (possiblePlugin) {
        // 根据eventType构造不同的合成事件SyntheticEvent
        var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
        if (extractedEvents) {
          // 将构造好的合成事件extractedEvents添加到events数组中,这样就保存了所有plugin构造的合成事件
          events = accumulateInto(events, extractedEvents);
        }
      }
    }
    return events;
  },
```

EventPluginRegistry.plugins默认包含五种plugin，他们是在EventPluginHub初始化阶段注入进去的，且看代码

```js
  // 将eventPlugin注册到EventPluginHub中
  ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin
  });
```

不同的plugin针对不同的事件有特殊的处理，此处我们不展开讲了，下面仅分析SimpleEventPlugin中方法即可。

我们先看SimpleEventPlugin如何构造它所对应的React合成事件。

```js
  // 根据不同事件类型,比如click,focus构造不同的合成事件SyntheticEvent, 如SyntheticKeyboardEvent SyntheticFocusEvent
extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;

   // 根据事件类型，采用不同的SyntheticEvent来构造不同的合成事件
    switch (topLevelType) {
      ... // 省略一些事件，我们仅以blur和focus为例
      case 'topBlur':
      case 'topFocus':
        EventConstructor = SyntheticFocusEvent;
        break;
      ... // 省略一些事件
    }

    // 从event对象池中取出合成事件对象,利用对象池思想,可以大大降低对象创建和销毁的时间,提高性能。这是React事件系统的一大亮点
    var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
},
```

这里我们看到了event对象池这个重大特性，采用合成事件对象池的方式，可以大大降低销毁和创建合成事件带来的性能开销。

对象创建好之后，我们还会将它添加到events这个队列中，因为事件回调的时候会用到这个队列。添加到events中使用的是accumulateInto方法。它思路比较简单，将新创建的合成对象的引用添加到之前创建好的events队列中即可，源码如下

```js
function accumulateInto(current, next) {

  if (current == null) {
    return next;
  }

  // 将next添加到current中,返回一个包含他们两个的新数组
  // 如果next是数组,current不是数组,采用push方法,否则采用concat方法
  // 如果next不是数组,则返回一个current和next构成的新数组
  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }
    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    return [current].concat(next);
  }

  return [current, next];
}
```

###### 批处理合成事件

我们上面分析过了，React以队列的形式处理合成事件。方法入口为runEventQueueInBatch，如下

```js
  function runEventQueueInBatch(events) {
    // 先将events事件放入队列中
    EventPluginHub.enqueueEvents(events);
    // 再处理队列中的事件,包括之前未处理完的。先入先处理原则
    EventPluginHub.processEventQueue(false);
  }

  /**
   * syntheticEvent放入队列中,等到processEventQueue再获得执行
   */
  enqueueEvents: function (events) {
    if (events) {
      eventQueue = accumulateInto(eventQueue, events);
    }
  },

  /**
   * 分发执行队列中的React合成事件。React事件是采用消息队列方式批处理的
   *
   * simulated：为true表示React测试代码，我们一般都是false 
   */
  processEventQueue: function (simulated) {
    // 先将eventQueue重置为空
    var processingEventQueue = eventQueue;
    eventQueue = null;
    if (simulated) {
      forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
    } else {
      // 遍历处理队列中的事件,
      // 如果只有一个元素,则直接executeDispatchesAndReleaseTopLevel(processingEventQueue)
      // 否则遍历队列中事件,调用executeDispatchesAndReleaseTopLevel处理每个元素
      forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
    }
    // This would be a good time to rethrow if any of the event handlers threw.
    ReactErrorUtils.rethrowCaughtError();
  },
```

合成事件处理也分为两步，先将我们要处理的events队列放入eventQueue中，因为之前可能就存在还没处理完的合成事件。然后再执行eventQueue中的事件。可见，如果之前有事件未处理完，这里就又有得到执行的机会了。

事件执行的入口方法为executeDispatchesAndReleaseTopLevel，如下

```js
var executeDispatchesAndReleaseTopLevel = function (e) {
  return executeDispatchesAndRelease(e, false);
};

var executeDispatchesAndRelease = function (event, simulated) {
  if (event) {
    // 进行事件分发,
    EventPluginUtils.executeDispatchesInOrder(event, simulated);

    if (!event.isPersistent()) {
      // 处理完,则release掉event对象,采用对象池方式,减少GC
      // React帮我们处理了合成事件的回收机制，不需要我们关心。但要注意，如果使用了DOM原生事件，则要自己回收
      event.constructor.release(event);
    }
  }
};

// 事件处理的核心
function executeDispatchesInOrder(event, simulated) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;

  if (Array.isArray(dispatchListeners)) {
    // 如果有多个listener,则遍历执行数组中event
    for (var i = 0; i < dispatchListeners.length; i++) {
      // 如果isPropagationStopped设成true了,则停止事件传播,退出循环。
      if (event.isPropagationStopped()) {
        break;
      }
      // 执行event的分发,从当前触发事件元素向父元素遍历
      // event为浏览器上传的原生事件
      // dispatchListeners[i]为JSX中声明的事件callback
      // dispatchInstances[i]为对应的React Component 
      executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
    }
  } else if (dispatchListeners) {
    // 如果只有一个listener,则直接执行事件分发
    executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
  }
  // 处理完event,重置变量。因为使用的对象池,故必须重置,这样才能被别人复用
  event._dispatchListeners = null;
  event._dispatchInstances = null;
}
```

executeDispatchesInOrder会先得到event对应的listeners队列，然后从当前元素向父元素遍历执行注册的callback。且看executeDispatch

```js
function executeDispatch(event, simulated, listener, inst) {
  var type = event.type || 'unknown-event';
  event.currentTarget = EventPluginUtils.getNodeFromInstance(inst);
  if (simulated) {
    // test代码使用,支持try-catch,其他就没啥区别了
    ReactErrorUtils.invokeGuardedCallbackWithCatch(type, listener, event);
  } else {
    // 事件分发,listener为callback,event为参数,类似listener(event)这个方法调用
    // 这样就回调到了我们在JSX中注册的callback。比如onClick={(event) => {console.log(1)}}
    // 这样应该就明白了callback怎么被调用的,以及event参数怎么传入callback里面的了
    ReactErrorUtils.invokeGuardedCallback(type, listener, event);
  }
  event.currentTarget = null;
}

// 采用func(a)的方式进行调用，
// 故ReactErrorUtils.invokeGuardedCallback(type, listener, event)最终调用的是listener(event)
// event对象为浏览器传递的DOM原生事件对象，这也就解释了为什么React合成事件回调中能拿到原生event的原因
function invokeGuardedCallback(name, func, a) {
  try {
    func(a);
  } catch (x) {
    if (caughtError === null) {
      caughtError = x;
    }
  }
}
```

##### 总结

React事件系统还是相当麻烦的，主要分为事件注册，事件存储和事件执行三大部分。了解了React事件系统源码，就能够轻松回答我们文章开头所列出的React事件几大特点了。

##### React合成事件和原生事件区别

React合成事件一套机制：React并不是将click事件直接绑定在dom上面，而是采用**事件冒泡**的形式冒泡到document上面，然后React将事件封装给正式的函数处理运行和处理。

事件机制：http://zhenhua-lee.github.io/react/react-event.html

#### setState是同步还是异步

先上一张图



![img](https:////upload-images.jianshu.io/upload_images/13128722-8597813ecf5583ab.png?imageMogr2/auto-orient/strip|imageView2/2/w/700/format/webp)



##### isBatchingUpdates

决定setState是否异步的属性`isBatchingUpdates`， 表示是否处于正处于更新阶段。
 `isBatchingUpdates`默认为`false`,也就是说，默认不会让setState异步执行。
 但是有一个方法`batchedUpdates`，这个方法会去修改`isBatchingUpdates`的值为`true`,而当React在调用事件处理函数之前就会调用这个`batchedUpdates`,从而使`isBatchingUpdates`变为`true`。

##### dirtyComponents

若正处于`isBatchingUpdates:true`阶段，`state`状态存储在`dirtyComponents`中，当`isBatchingUpdates:false`再批量执行。

那batchedUpdates方法是谁调用的呢？我们再往上追溯一层，原来是ReactMount.js中的_renderNewRootComponent方法。

也就是说，整个将React组件渲染到DOM的过程就处于一个大的事务中了。

##### 结论

在React中，如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用 setState 不会同步更新 this.state，除此之外的setState调用会同步执行this.state。

- 所谓“除此之外”，指的是绕过React通过 addEventListener 直接添加的事件处理函数，还有通过setTimeout || setInterval 产生的异步调用。
- 简单一点说， 就是经过React 处理的事件是不会同步更新 this.state的. 通过 addEventListener || setTimeout/setInterval 的方式处理的则会同步更新。

#### setState原理是什么 

##### 创建组件实例和fiber对象

事件处理函数中setState会异步更新，创建示例组件`Counter`：

```kotlin
class Counter extends Component {
  state = { count: 0 };
  handleIncrease() {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
  }
  render() {
    console.log(this.state.count);
    return this.state.count;
  }
}
```

当调用`handleIncrease`会输出`0 0 1`。

每个组件实例都会对应一个fiber对象, 同时fiber对象通过`stateNode` 指向组件实例；fiber对象的child属性指向子组件对应的fiber, return属性指向父组件对应的fiber对象，updateQueue属性用于存放更新数据，tag属性用于表明对应组件的类型。

组件类型`ReactWorkTags.js`：

```cpp
export const HostRoot = 3;
export const ClassComponent = 1;
```

创建组件实例及相应的fiber对象：

```dart
const counter = new Counter();
const counterFiber = { updateQueue: [], tag: ClassComponent };
counter._reactInternals = counterFiber;
counterFiber.stateNode = counter;
const rootFiber = { updateQueue: [], tag: HostRoot };

rootFiber.child = counterFiber;
counterFiber.return = rootFiber;

document.addEventListener("click", () => {
  counter.handleIncrease();
  // batchedUpdates(counter.handleIncrease);
});
```

##### Component

Component相关实现`ReactBaseClasses.js`。

调用setState方法，首先会创建`update`对象并把该对象放入对应fiber的updateQueue中，然后调用`scheduleUpdateOnFiber`进行调度。

```tsx
import { SyncLane } from "./ReactFiberLane.js";
import scheduleUpdateOnFiber from "./ReactFiberWorkLoop.js";
const classComponentUpdater = {
  enqueueUpdateSetState(inst, partialState) {
    const fiber = get(inst);
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);
    const update = createUpdate(eventTime, lane);
    update.payload = partialState;
    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber);
  },
};
export default class Component {
  constructor() {
    this.updater = classComponentUpdater;
  }
  setState(partialState) {
    this.updater.enqueueUpdateSetState(this, partialState);
  }
}
function get(inst) {
  return inst._reactInternals;
}

function enqueueUpdate(fiber, update) {
  fiber.updateQueue.push(update);
}

function createUpdate(eventTime, lane) {
  return { eventTime, lane };
}

function requestEventTime() {
  return performance.now();
}

function requestUpdateLane(fiber) {
  return SyncLane;
}
```

##### ReactFiberWorkLoop

给本次更新任务设置优先级，如果优先级和`root.callbackPriority`的优先级相同则把`flushSyncCallbackQueue`调度任务放入微任务队列。等所有同步方法都执行完成后即`handleIncrease`里的语句执行完，再执行微任务`performSyncWorkOnRoot`。如果`executeContext === NoContext`，则同步更新state即调用`flushSyncCallbackQueue`。

```jsx
const NoLanePriority = 1;
const SyncLanePriority = 12;
const syncQueue = [];

const NoContext = 0;
const BatchedContext = 1;
let executionContext = NoContext;

export default function scheduleUpdateOnFiber(fiber) {
  const root = markUpdateLaneFromFiberToRoot(fiber);
  isRootScheduled(root);
  if (executionContext === NoContext) {
    flushSyncCallbackQueue();
  }
}

export function batchedUpdates(fn) {
  let preExecuteContext = executionContext;
  executionContext = BatchedContext;
  fn();
  executionContext = preExecuteContext;
}

function isRootScheduled(root) {
  const newCallbackPriority = SyncLanePriority;
  const existingCallbackPriority = root.callbackPriority;
  if (newCallbackPriority === existingCallbackPriority) {
    return;
  }
  scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
  queueMicrotask(flushSyncCallbackQueue);
  root.callbackPriority = newCallbackPriority;
}

function markUpdateLaneFromFiberToRoot(fiber) {
  let parent = fiber.return;
  while (parent) {
    fiber = parent;
    parent = parent.return;
  }
  if (fiber.tag === HostRoot) {
    return fiber;
  }
  return null;
}

function performSyncWorkOnRoot(workInProgress) {
  let root = workInProgress;
  while (workInProgress) {
    if (workInProgress.tag === ClassComponent) {
      let inst = workInProgress.stateNode;
      inst.state = processUpdateQueue(inst, workInProgress);
      inst.render();
    }
    workInProgress = workInProgress.child;
  }
  commitRoot(root);
}

function commitRoot(root) {
  root.callbackPriority = NoLanePriority;
}

function processUpdateQueue(inst, fiber) {
  return fiber.updateQueue.reduce((state, { payload }) => {
    return { ...state, ...payload };
  }, inst.state);
}

function flushSyncCallbackQueue() {
  syncQueue.forEach((cb) => cb());
  syncQueue.length = 0;
}

function scheduleSyncCallback(cb) {
  syncQueue.push(cb);
}
```

`batchedUpdates`高阶函数首先会将`executionContext = BatchedContext`，然后再调用传入的函数，最后复原`executionContext`。React事件处理函数默认使用了`batchedUpdates`高阶函数，所以会异步更新。

setState方法运行流程如下：创建update对象并将其放入对应的fiber对象的updateQueue属性中，然后把调和任务放到微任务队列中，再然后判断如果`executeContext === NoContext`那么执行调度任务`flushSyncCallbackQueue()`，所有同步方法执行完成后执行微任务中的调和任务。

##### 总结

- 组件实例和fiber对象一一对应；
- setState会把待更新的对象放到对应fiber对象的updateQueue中；
- 把调和任务放入微任务队列中，从而实现setState的异步更新；
- `executionContext === BatchedContext` 批量更新，否则同步更新；
- Concurrent模式下默认都是批量更新。

#### react性能优化有哪些

见性能优化常见的手段有如下：

避免使用内联函数

使用 React Fragments 避免额外标记

使用 Immutable

懒加载组件

事件绑定方式

服务端渲染

##### 避免使用内联函数

如果我们使用内联函数，则每次调用render函数时都会创建一个新的函数实例，如下：

```
import React from "react";

export default class InlineFunctionComponent extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome Guest</h1>
        <input type="button" onClick={(e) => { this.setState({inputValue: e.target.value}) }} value="Click For Inline Function" />
      </div>
    )
  }
}
```

我们应该在组件内部创建一个函数，并将事件绑定到该函数本身。这样每次调用 render 时就不会创建单独的函数实例，如下：

```
import React from "react";

export default class InlineFunctionComponent extends React.Component {

  setNewStateData = (event) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  render() {
    return (
      <div>
        <h1>Welcome Guest</h1>
        <input type="button" onClick={this.setNewStateData} value="Click For Inline Function" />
      </div>
    )
  }
}
```

##### 使用 React Fragments 避免额外标记

用户创建新组件时，每个组件应具有单个父标签。父级不能有两个标签，所以顶部要有一个公共标签，所以我们经常在组件顶部添加额外标签div

这个额外标签除了充当父标签之外，并没有其他作用，这时候则可以使用fragement

其不会向组件引入任何额外标记，但它可以作为父级标签的作用，如下所示：

```
export default class NestedRoutingComponent extends React.Component {
    render() {
        return (
            <>
                <h1>This is the Header Component</h1>
                <h2>Welcome To Demo Page</h2>
            </>
        )
    }
}
```

##### 事件绑定方式

在事件绑定方式中，我们了解到四种事件绑定的方式

从性能方面考虑，在render方法中使用bind和render方法中使用箭头函数这两种形式在每次组件render的时候都会生成新的方法实例，性能欠缺

而constructor中bind事件与定义阶段使用箭头函数绑定这两种形式只会生成一个方法实例，性能方面会有所改善

##### 使用 Immutable

在理解Immutable中，我们了解到使用 Immutable可以给 React 应用带来性能的优化，主要体现在减少渲染的次数

在做react性能优化的时候，为了避免重复渲染，我们会在shouldComponentUpdate()中做对比，当返回true执行render方法

Immutable通过is方法则可以完成对比，而无需像一样通过深度比较的方式比较

##### 懒加载组件

从工程方面考虑，webpack存在代码拆分能力，可以为应用创建多个包，并在运行时动态加载，减少初始包的大小

而在react中使用到了Suspense和 lazy组件实现代码拆分功能，基本使用如下：

```
const johanComponent = React.lazy(() => import(/* webpackChunkName: "johanComponent" */ './myAwesome.component'));

export const johanAsyncComponent = props => (
  <React.Suspense fallback={<Spinner />}>
    <johanComponent {...props} />
  </React.Suspense>
);
```

##### 服务端渲染

采用服务端渲染端方式，可以使用户更快的看到渲染完成的页面

服务端渲染，需要起一个node服务，可以使用express、koa等，调用react的renderToString方法，将根组件渲染成字符串，再输出到响应中

例如：

```
import { renderToString } from "react-dom/server";
import MyPage from "./MyPage";
app.get("/", (req, res) => {
  res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body>");
  res.write("<div id='content'>");  
  res.write(renderToString(<MyPage/>));
  res.write("</div></body></html>");
  res.end();
});
```

客户端使用render方法来生成HTML

```
import ReactDOM from 'react-dom';
import MyPage from "./MyPage";
ReactDOM.render(<MyPage />, document.getElementById('app'));
```

其他
除此之外，还存在的优化手段有组件拆分、合理使用hooks等性能优化手段...

### Router

#### 一、什么是路由？

​	路由的概念起源于服务端，在以前前后端不分离的时候，由后端来控制路由，当接收到客户端发来的   `HTTP` 请求，就会根据所请求的相应 `URL`，来找到相应的映射函数，然后执行该函数，并将函数的返回值发送给客户端。对于最简单的静态资源服务器，可以认为，所有 `URL` 的映射函数就是一个文件读取操作。对于动态资源，映射函数可能是一个数据库读取操作，也可能是进行一些数据的处理等等。然后根据这些读取的数据，在服务器端就使用相应的模板来对页面进行渲染后，再返回渲染完毕的页面。它的好处与缺点非常明显：

- 好处：安全性好，`SEO` 好；
- 缺点：加大服务器的压力，不利于用户体验，代码冗合不好维护；

​	也正是由于后端路由还存在着自己的不足，前端路由才有了自己的发展空间。对于前端路由来说，路由的映射函数通常是进行一些 `DOM` 的显示和隐藏操作。这样，当访问不同的路径的时候，会显示不同的页面组件。前端路由主要有以下两种实现方案：

- `Hash`
- `History`

当然，前端路由也存在缺陷：使用浏览器的前进，后退键时会重新发送请求，来获取数据，没有合理地利用缓存。但总的来说，现在前端路由已经是实现路由的主要方式了，前端三大框架 `Angular`、`React`、`Vue` ，它们的路由解决方案 `angular/router`、`react-router`、`vue-router` 都是基于前端路由进行开发的，因此将前端路由进行了解和 掌握是很有必要的，下面我们分别对两种常见的前端路由模式 `Hash` 和 `History` 进行讲解。

#### 二、如何实现前端路由？

要实现前端路由，需要解决两个核心：

1. 如何更改URL却不引起页面刷新？
2. 如何检测URL变化了？

**哈希实现**

1. hash是URL中的hash（`#`）及后面的那部分，常用于锚点在页面内进行导航，更改URL中的hash部分不会引起页面刷新
2. 通过[hashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)事件监听URL的变化，改变URL的方式只有这几种：通过浏览器前进后退改变URL，通过``标签改变URL，通过`window.location`改变URL，这几种情况改变URL都会触发hashchange事件

**历史实现**

**历史实现**

1. 历史提供了pushState和replaceState两个方法，这两个方法更改URL的路径部分不会引起页面刷新
2. 历史提供类似hashchange事件的[popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)事件，但popstate事件有些不同：通过浏览器前进后退更改URL时会触发popstate事件，通过`pushState/replaceState`或``标签更改URL不会触发popstate事件。好在我们可以拦截`pushState/replaceState`的调用和``标签的点击事件来检测URL变化，所以监听URL变化可以实现，只是没有hashchange那么方便

#### 利用`URL`的`Hash(#)`

在 `H5` 还没有流行开来时，一般 `SPA` 都采用 `url` 的 `hash(#)` 作为锚点，获取到 # 之后的值，并监听其改变，再进行渲染对应的子页面。[网易云音乐官网](https://music.163.com)就是利用的此技术。

| 属性     | 描述                                |
| :------- | :---------------------------------- |
| hash     | 设置或返回从 # 开始的 URL （锚）    |
| host     | 设置或返回主机名和当前 URL 的端口号 |
| hostname | 设置或返回当前 URL 的主机名         |
| href     | 设置或返回完整的 URL                |
| pathname | 设置或返回当前 URL 的路径部分       |
| port     | 设置或返回当前 URL 的端口号         |
| protocol | 设置或返回当前 URL 的协议           |
| search   | 设置或返回从 ? 开始的 URL 部分      |

```
<body>
  <h1 id="id"></h1>
  <a href="#/id1">id1</a>
  <a href="#/id2">id2</a>
  <a href="#/id3">id3</a>
</body>

<script>
  window.addEventListener('hashchange', e => {
    e.preventDefault()
    document.querySelector('#id').innerHTML = location.hash
  })
</script>
```

##### `AJAX` 方式

定义一个 `HTML` 文件，名为 `demo2.html`，在里面写入一些内容（由于主页面已经有`head`，`body`等根标签，此文件只需写入需要替换的标签）：

```
<div>
  我是AJAX加载进来的HTML文件
</div>
```

```
<body>
  <h1 id="id"></h1>
  <a href="#/id1">id1</a>
  <a href="#/id2">id2</a>
  <a href="#/id3">id3</a>
</body>
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script type="module">
  // import demo1 from './demo1.js'
  // document.querySelector('#id').innerHTML = demo1
  $.ajax({
    url: './demo2.html',
    success: (res) => {
      document.querySelector('#id').innerHTML = res
    }
  })
  window.addEventListener('hashchange', e => {
    e.preventDefault()
    document.querySelector('#id').innerHTML = location.hash
  })
</script>
```

既然加载不同页面的内容都已经生效，那么只需要包装一下我们的监听，利用观察者模式封装路由的变化：

```
<body>
  <h1 id="id">我是空白页</h1>
  <a href="#/id1">id1</a>
  <a href="#/id2">id2</a>
  <a href="#/id3">id3</a>
</body>
<script type="module">
  import demo1 from './demo1.js'
  // 创建一个 newRouter 类
  class newRouter {
    // 初始化路由信息
    constructor() {
      this.routes = {};
      this.currentUrl = '';
    }
    // 传入 URL 以及 根据 URL 对应的回调函数
    route(path, callback = () => {}) {
      this.routes[path] = callback;
    }
    // 切割 hash，渲染页面
    refresh() {
      this.currentUrl = location.hash.slice(1) || '/';
      this.routes[this.currentUrl] && this.routes[this.currentUrl]();
    }
    // 初始化
    init() {
      window.addEventListener('load', this.refresh.bind(this), false);
      window.addEventListener('hashchange', this.refresh.bind(this), false);
    }
  }
  // new 一个 Router 实例
  window.Router = new newRouter();
  // 路由实例初始化
  window.Router.init();

  // 获取关键节点
  var content = document.querySelector('#id');

  Router.route('/id1', () => {
    content.innerHTML = 'id1'
  });
  Router.route('/id2', () => {
    content.innerHTML = demo1
  });
  Router.route('/id3', () => {
    $.ajax({
      url: './demo2.html',
      success: (res) => {
        content.innerHTML = res
      }
    })
  });
</script>
```

##### 利用 `H5` 新增方法 `History interface`

|     API     |                             说明                             |
| :---------: | :----------------------------------------------------------: |
|  `back()`   |     回退到上次访问的 `URL` （与浏览器点击后退按钮相同）      |
| `forward()` |     前进到回退之前的 `URL` （与浏览器点击向前按钮相同）      |
|   `go(n)`   | `n` 接收一个整数，移动到该整数指定的页面，比如`go(1)`相当于`forward()`，`go(-1)` 相当于 `back()`，`go(0)`相当于刷新当前页面 |

##### 往历史记录栈中添加记录：pushState(state, title, url)

浏览器支持度: `IE10+`

- state: 一个 `JS` 对象（不大于640kB），主要用于在 `popstate` 事件中作为参数被获取。如果不需要这个对象，此处可以填 `null`
- title: 新页面的标题，部分浏览器(比如 Firefox )忽略此参数，因此一般为 `null`
- url: 新历史记录的地址，**可为页面地址，也可为一个锚点值**，新 `url` 必须与当前 `url` 处于同一个域，否则将抛出异常，此参数若没有特别标注，会被设为当前文档 `url`

##### 改变当前的历史记录：replaceState(state, title, url)

浏览器支持度: `IE10+`

- 参数含义同 `pushstate`
- 改变当前的历史记录而不是添加新的记录
- 同样不会触发 `popstate`

##### history.state

浏览器支持度: `IE10+`

- 返回当前历史记录的 `state`。

##### popstate

定义：每当同一个文档的浏览历史（即 `history` 对象）出现变化时，就会触发 `popstate` 事件。

注意：若仅仅调用 `pushState` 方法或 `replaceState` 方法 ，并不会触发该事件，只有用户点击浏览器**倒退**按钮和**前进**按钮，或者使用 `JavaScript` 调用 `back` 、 `forward` 、 `go` 方法时才会触发。另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

##### 实现

```
<body>
  <h1 id="id">我是空白页</h1>
  <a class="route" href="/id1">id1</a>
  <a class="route" href="/id2">id2</a>
  <a class="route" href="/id3">id3</a>
</body>
```

```
import demo1 from './demo1.js'
  // 创建一个 newRouter 类
  class newRouter {
    // 初始化路由信息
    constructor() {
      this.routes = {};
      this.currentUrl = '';
    }
    route(path, callback) {
      this.routes[path] = (type) => {
        if (type === 1) history.pushState( { path }, path, path );
        if (type === 2) history.replaceState( { path }, path, path );
        callback()
      };
    }
    refresh(path, type) {
      this.routes[this.currentUrl] && this.routes[this.currentUrl](type);
    }
    init() {
      window.addEventListener('load', () => {
        // 获取当前 URL 路径
        this.currentUrl = location.href.slice(location.href.indexOf('/', 8))
        this.refresh(this.currentUrl, 2)
      }, false);
      window.addEventListener('popstate', () => {
        this.currentUrl = history.state.path
        this.refresh(this.currentUrl, 2)
      }, false);
      const links = document.querySelectorAll('.route')
      links.forEach((item) => {
        // 覆盖 a 标签的 click 事件，防止默认跳转行为
        item.onclick = (e) => {
          e.preventDefault()
          // 获取修改之后的 URL
          this.currentUrl = e.target.getAttribute('href')
          // 渲染
          this.refresh(this.currentUrl, 2)
        }
      })
    }
  }
  // new 一个 Router 实例
  window.Router = new newRouter();
  // 实例初始化
  window.Router.init();

  // 获取关键节点
  var content = document.querySelector('#id');

  Router.route('/id1', () => {
    content.innerHTML = 'id1'
  });
  Router.route('/id2', () => {
    content.innerHTML = demo1
  });
  Router.route('/id3', () => {
    $.ajax({
      url: './demo2.html',
      success: (res) => {
        content.innerHTML = res
      }
    })
  });
```

#### React版前端路由实现

##### 基于hash 实现

```
  <BrowserRouter>
    <ul>
      <li>
        <Link to="/home">home</Link>
      </li>
      <li>
        <Link to="/about">about</Link>
      </li>
    </ul>

    <Route path="/home" render={() => <h2>Home</h2>} />
    <Route path="/about" render={() => <h2>About</h2>} />
  </BrowserRouter>
```

BrowserRouter实现

```
export default class BrowserRouter extends React.Component {
  state = {
    currentPath: utils.extractHashPath(window.location.href)
  };

  onHashChange = e => {
    const currentPath = utils.extractHashPath(e.newURL);
    console.log("onHashChange:", currentPath);
    this.setState({ currentPath });
  };

  componentDidMount() {
    window.addEventListener("hashchange", this.onHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.onHashChange);
  }

  render() {
    return (
      <RouteContext.Provider value={{currentPath: this.state.currentPath}}>
        {this.props.children}
      </RouteContext.Provider>
    );
  }
}
```

Route 实现

```
export default ({ path, render }) => (
  <RouteContext.Consumer>
    {({currentPath}) => currentPath === path && render()}
  </RouteContext.Consumer>
);
```

Link 实现

```
export default ({ to, ...props }) => <a {...props} href={"#" + to} />;
```

##### 基于 history 实现

```
 <HistoryRouter>
    <ul>
      <li>
        <Link to="/home">home</Link>
      </li>
      <li>
        <Link to="/about">about</Link>
      </li>
    </ul>

    <Route path="/home" render={() => <h2>Home</h2>} />
    <Route path="/about" render={() => <h2>About</h2>} />
  </HistoryRouter>
```

HistoryRouter 实现

```
export default class HistoryRouter extends React.Component {
  state = {
    currentPath: utils.extractUrlPath(window.location.href)
  };

  onPopState = e => {
    const currentPath = utils.extractUrlPath(window.location.href);
    console.log("onPopState:", currentPath);
    this.setState({ currentPath });
  };

  componentDidMount() {
    window.addEventListener("popstate", this.onPopState);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.onPopState);
  }

  render() {
    return (
      <RouteContext.Provider value={{currentPath: this.state.currentPath, onPopState: this.onPopState}}>
        {this.props.children}
      </RouteContext.Provider>
    );
  }
}
```

Route 实现

```
export default ({ path, render }) => (
  <RouteContext.Consumer>
    {({currentPath}) => currentPath === path && render()}
  </RouteContext.Consumer>
);
```

Link 实现

```
export default ({ to, ...props }) => (
  <RouteContext.Consumer>
    {({ onPopState }) => (
      <a
        href=""
        {...props}
        onClick={e => {
          e.preventDefault();
          window.history.pushState(null, "", to);
          onPopState();
        }}
      />
    )}
  </RouteContext.Consumer>
);
```

#### Vue 版本前端路由实现

##### 基于 hash 实现

```
<div>
      <ul>
        <li><router-link to="/home">home</router-link></li>
        <li><router-link to="/about">about</router-link></li>
      </ul>
      <router-view></router-view>
    </div>
```

```
const routes = {
  '/home': {
    template: '<h2>Home</h2>'
  },
  '/about': {
    template: '<h2>About</h2>'
  }
}

const app = new Vue({
  el: '.vue.hash',
  components: {
    'router-view': RouterView,
    'router-link': RouterLink
  },
  beforeCreate () {
    this.$routes = routes
  }
})
```

router-view 实现

```
<template>
  <component :is="routeView" />
</template>

<script>
import utils from '~/utils.js'
export default {
  data () {
    return {
      routeView: null
    }
  },
  created () {
    this.boundHashChange = this.onHashChange.bind(this)
  },
  beforeMount () {
    window.addEventListener('hashchange', this.boundHashChange)
  },
  mounted () {
    this.onHashChange()
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.boundHashChange)
  },
  methods: {
    onHashChange () {
      const path = utils.extractHashPath(window.location.href)
      this.routeView = this.$root.$routes[path] || null
      console.log('vue:hashchange:', path)
    }
  }
}
</script>
```

router-link 实现

```
<template>
  <a @click.prevent="onClick" href=''><slot></slot></a>
</template>

<script>
export default {
  props: {
    to: String
  },
  methods: {
    onClick () {
      window.location.hash = '#' + this.to
    }
  }
}
</script>
```

##### 基于 history 实现

```
<div>
      <ul>
        <li><router-link to="/home">home</router-link></li>
        <li><router-link to="/about">about</router-link></li>
      </ul>
      <router-view></router-view>
    </div>
```

```
const routes = {
  '/home': {
    template: '<h2>Home</h2>'
  },
  '/about': {
    template: '<h2>About</h2>'
  }
}

const app = new Vue({
  el: '.vue.history',
  components: {
    'router-view': RouterView,
    'router-link': RouterLink
  },
  created () {
    this.$routes = routes
    this.boundPopState = this.onPopState.bind(this)
  },
  beforeMount () {
    window.addEventListener('popstate', this.boundPopState) 
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.boundPopState) 
  },
  methods: {
    onPopState (...args) {
      this.$emit('popstate', ...args)
    }
  }
})
```

router-view 实现：

```
<template>
  <component :is="routeView" />
</template>

<script>
import utils from '~/utils.js'
export default {
  data () {
    return {
      routeView: null
    }
  },
  created () {
    this.boundPopState = this.onPopState.bind(this)
  },
  beforeMount () {
    this.$root.$on('popstate', this.boundPopState)
  },
  beforeDestroy() {
    this.$root.$off('popstate', this.boundPopState)
  },
  methods: {
    onPopState (e) {
      const path = utils.extractUrlPath(window.location.href)
      this.routeView = this.$root.$routes[path] || null
      console.log('[Vue] popstate:', path)
    }
  }
}
</script>
```

router-link 实现

```
<template>
  <a @click.prevent="onClick" href=''><slot></slot></a>
</template>

<script>
export default {
  props: {
    to: String
  },
  methods: {
    onClick () {
      history.pushState(null, '', this.to)
      this.$root.$emit('popstate')
    }
  }
}
</script>
```

数据驱动的vue-router

```
new Router({
  id: 'router-view', // 容器视图
  mode: 'hash', // 模式
  routes: [
    {
      path: '/',
      name: 'home',
      component: '<div>Home</div>',
      beforeEnter: (next) => {
        console.log('before enter home')
        next()
      },
      afterEnter: (next) => {
        console.log('enter home')
        next()
      },
      beforeLeave: (next) => {
        console.log('start leave home')
        next()
      }
    },
    {
      path: '/bar',
      name: 'bar',
      component: '<div>Bar</div>',
      beforeEnter: (next) => {
        console.log('before enter bar')
        next()
      },
      afterEnter: (next) => {
        console.log('enter bar')
        next()
      },
      beforeLeave: (next) => {
        console.log('start leave bar')
        next()
      }
    },
    {
      path: '/foo',
      name: 'foo',
      component: '<div>Foo</div>'
    }
  ]
})
```

##### 思路整理

首先是数据驱动，所以我们可以通过一个`route`对象来表述当前路由状态，比如：

```
current = {
    path: '/', // 路径
    query: {}, // query
    params: {}, // params
    name: '', // 路由名
    fullPath: '/', // 完整路径
    route: {} // 记录当前路由属性
}
```

`current.route`内存放当前路由的配置信息，所以我们只需要监听`current.route`的变化来动态`render`页面便可。

接着我么需要监听不同的路由变化，做相应的处理。以及实现`hash`和`history`模式。

##### 数据驱动

这里我们延用`vue`数据驱动模型，实现一个简单的数据劫持，并更新视图。首先定义我们的`observer`

```
class Observer {
  constructor (value) {
    this.walk(value)
  }

  walk (obj) {
    Object.keys(obj).forEach((key) => {
      // 如果是对象，则递归调用walk，保证每个属性都可以被defineReactive
      if (typeof obj[key] === 'object') {
        this.walk(obj[key])
      }
      defineReactive(obj, key, obj[key])
    })
  }
}

function defineReactive(obj, key, value) {
  let dep = new Dep()
  Object.defineProperty(obj, key, {
    get: () => {
      if (Dep.target) {
        // 依赖收集
        dep.add()
      }
      return value
    },
    set: (newValue) => {
      value = newValue
      // 通知更新，对应的更新视图
      dep.notify()
    }
  })
}

export function observer(value) {
  return new Observer(value)
}
```

再接着，我们需要定义`Dep`和`Watcher`:

```
export class Dep {
  constructor () {
    this.deppend = []
  }
  add () {
    // 收集watcher
    this.deppend.push(Dep.target)
  }
  notify () {
    this.deppend.forEach((target) => {
      // 调用watcher的更新函数
      target.update()
    })
  }
}

Dep.target = null

export function setTarget (target) {
  Dep.target = target
}

export function cleanTarget() {
  Dep.target = null
}

// Watcher
export class Watcher {
  constructor (vm, expression, callback) {
    this.vm = vm
    this.callbacks = []
    this.expression = expression
    this.callbacks.push(callback)
    this.value = this.getVal()

  }
  getVal () {
    setTarget(this)
    // 触发 get 方法，完成对 watcher 的收集
    let val = this.vm
    this.expression.split('.').forEach((key) => {
      val = val[key]
    })
    cleanTarget()
    return val
  }

  // 更新动作
  update () {
    this.callbacks.forEach((cb) => {
      cb()
    })
  }
}
```

到这里我们实现了一个简单的订阅-发布器，所以我们需要对`current.route`做数据劫持。一旦`current.route`更新，我们可以及时的更新当前页面：

```
 // 响应式数据劫持
  observer(this.current)

  // 对 current.route 对象进行依赖收集，变化时通过 render 来更新
  new Watcher(this.current, 'route', this.render.bind(this))
```

恩....到这里，我们似乎已经完成了一个简单的响应式数据更新。其实`render`也就是动态的为页面指定区域渲染对应内容，这里只做一个简化版的`render`:

```
render() {
    let i
    if ((i = this.history.current) && (i = i.route) && (i = i.component)) {
      document.getElementById(this.container).innerHTML = i
    }
  }
```

#### hash 和 history

接下来是`hash`和`history`模式的实现，这里我们可以沿用`vue-router`的思想，建立不同的处理模型便可。来看一下我实现的核心代码：

```
this.history = this.mode === 'history' ? new HTML5History(this) : new HashHistory(this)
```

当页面变化时，我们只需要监听`hashchange`和`popstate`事件，做路由转换`transitionTo`:

```
 /**
   * 路由转换
   * @param target 目标路径
   * @param cb 成功后的回调
   */
  transitionTo(target, cb) {
    // 通过对比传入的 routes 获取匹配到的 targetRoute 对象
    const targetRoute = match(target, this.router.routes)
    this.confirmTransition(targetRoute, () => {
      // 这里会触发视图更新
      this.current.route = targetRoute
      this.current.name = targetRoute.name
      this.current.path = targetRoute.path
      this.current.query = targetRoute.query || getQuery()
      this.current.fullPath = getFullPath(this.current)
      cb && cb()
    })
  }

  /**
   * 确认跳转
   * @param route
   * @param cb
   */
  confirmTransition (route, cb) {
    // 钩子函数执行队列
    let queue = [].concat(
      this.router.beforeEach,
      this.current.route.beforeLeave,
      route.beforeEnter,
      route.afterEnter
    )
    
    // 通过 step 调度执行
    let i = -1
    const step = () => {
      i ++
      if (i > queue.length) {
        cb()
      } else if (queue[i]) {
        queue[i](step)
      } else {
        step()
      }

    }
    step(i)
  }
}
```

这样我们一方面通过`this.current.route = targetRoute`达到了对之前劫持数据的更新，来达到视图更新。另一方面我们又通过任务队列的调度，实现了基本的钩子函数`beforeEach`、`beforeLeave`、`beforeEnter`、`afterEnter`。 到这里其实也就差不多了，接下来我们顺带着实现几个API吧：

```
/**
   * 跳转，添加历史记录
   * @param location 
   * @example this.push({name: 'home'})
   * @example this.push('/')
   */
  push (location) {
    const targetRoute = match(location, this.router.routes)

    this.transitionTo(targetRoute, () => {
      changeUrl(this.router.base, this.current.fullPath)
    })
  }

  /**
   * 跳转，添加历史记录
   * @param location
   * @example this.replaceState({name: 'home'})
   * @example this.replaceState('/')
   */
  replaceState(location) {
    const targetRoute = match(location, this.router.routes)

    this.transitionTo(targetRoute, () => {
      changeUrl(this.router.base, this.current.fullPath, true)
    })
  }

  go (n) {
    window.history.go(n)
  }

  function changeUrl(path, replace) {
    const href = window.location.href
    const i = href.indexOf('#')
    const base = i >= 0 ? href.slice(0, i) : href
    if (replace) {
      window.history.replaceState({}, '', `${base}#/${path}`)
    } else {
      window.history.pushState({}, '', `${base}#/${path}`)
    }
  }
```

源码地址：https://github.com/muwoo/blogs/tree/master/src/router

#### 为什么history模式需要服务器支持

vue-router 的 [history模式](https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#html5-模式)，是为了地址栏看起来更加自然。但是需要在服务端进行一些额外的配置。

##### 为什么需要额外配置？

假设应用地址为`abc.com`，服务端不加额外的配置。当通过`abc.com`来访问时，是没有问题的，可以正常加载到html文件，之后通过route-link或者router.api来跳转也不会有问题，因为之后都不会刷新页面请求html，只是通过`history.pushState`或者`history.replaceState`来改变history记录，修改地址栏地址而已；

但是如果是直接访问子路由`abc.com/test`时就会有问题，`/test`是子路由名，但是服务器中并不存在该目录，就无法索引到html文件，此种情况下就会出现404，所以不管是访问什么路径，都应该加载根目录的html文件，因为`/xxx/yyy`对我们应用来讲是子路由路径而已。

##### 配置

官方提供了多种[配置方案](https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#服务器配置示例)，而在项目中我用到的是`nginx`配置，主要用的是[try_files](http://nginx.org/en/docs/http/ngx_http_core_module.html#try_files),其作用可以理解为是按照配置的顺序去找文件，并按找到的第一个去请求文件

```shell
        location / {
            # ...其他配置
            # /xxx/yyy/找不到，就去找 /index.html 
            try_files $uri $uri/ /index.html =404;
        }
```

加了上面的路径之后，不管通过何种子路由来直接访问，都能顺利拿到html

### Redux

#### redux原理

相信大部分熟悉react的同学一定对redux很熟悉了，本文将详细解析redux内部原理，相信阅读完后，对redux会有更加深刻的认识。

##### **预备知识**

先提出个疑问：我们为什么需要状态管理？

对于SPA应用来说，前端所需要管理的状态越来越多，需要查询、更新、传递的状态也越来越多，如果让每个组件都存储自身相关的状态，理论上来讲不会影响应用的运行，但在开发及后续维护阶段，我们将花费大量精力去查询状态的变化过程，在多组合组件通信或客户端与服务端有较多交互过程中，我们往往需要去更新、维护并监听每一个组件的状态，在这种情况下，如果有一种可以对状态做集中管理的地方是不是会更好呢？状态管理好比是一个集中在一处的配置箱，当需要更新状态的时候，我们仅对这个黑箱进行输入，而不用去关心状态是如何分发到每一个组件内部的，这可以让开发者将精力更好的放在业务逻辑上。

但状态管理并不是必需品，当你的UI层比较简单、没有较多的交互去改变状态的场景下，使用状态管理方式反倒会让你的项目变的复杂。例如Redux的发明者Dan Abramov 就说过这样一句话：“只有遇到 React 实在解决不了的问题，你才需要Redux”。

一般来讲，在以下场景下你或许需要使用状态管理机制去维护应用：

1. 用户操作较为繁琐，导致组件间需要有状态依赖关系，如根据多筛选条件来控制其他组件的功能。
2. 客户端权限较多且有不同的使用方式，如管理层、普通层级等。
3. 客户端与服务端有大量交互，例如请求信息实时性要求较高导致需要保证鲜活度。
4. 前端数据缓存部分较多，如记录用户对表单的提交前操作、分页控制等。


另外，本篇文章更关注业务模型层的数据流，业务模型是指所处领域的业务数据、规则、流程的集合。即使抛开所有展示层，这一层也可以不依赖于展示层而独立运行，这里要强调一点，Redux之类的状态管理库充当了一个应用的业务模型层，并不会受限于如React之类的View层。假如你已经明白了Redux的定位及应用场景的话，我们来对其原理一探究竟。

##### **数据流向**

我们先来看一下一个完整的Redux数据流是怎样的：

![img](https://pic1.zhimg.com/80/v2-0b716fd55e986163344ef8df174b99b0_1440w.jpg)


举个最简单的例子：

```js
//创建一个最基本的store
const store =createStore(reducers);

// subscribe() 返回一个函数用来注销监听器
const unsubscribe = store.subscribe(()=>console.log(store.getState()))

// 发起一系列 action
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
```

通过以上几句代码，我们已经实现了数据流从dispatch(action)->reducer->subscribe->view回调的整体流程(此处省略了middleWare的部分)，在这个例子中没有任何的UI层，redux也同样可以独立完成完整的数据流向。其中subscribe是对state变化更新的订阅功能，可以在回调函数中注册view渲染功能。

##### **使用规范**

**Redux应用的三大原则**

- 单一数据源
  我们可以把Redux的状态管理理解成一个全局对象，那么这个全局对象是唯一的，所有的状态都在全局对象store下进行统一”配置”，这样做也是为了做统一管理，便于调试与维护。
- State是只读的
  与React的setState相似，直接改变组件的state是不会触发render进行渲染组件的。同样，在Redux中唯一改变state的方法就是触发action，action是一个用于描述发生了什么的“关键词”，而具体使action在state上更新生效的是reducer，用来描述事件发生的详细过程，reducer充当了发起一个action连接到state的桥梁。这样做的好处是当开发者试图去修改状态时，Redux会记录这个动作是什么类型的、具体完成了什么功能等（更新、传播过程），在调试阶段可以为开发者提供完整的数据流路径。
- Reducer必须是一个纯函数
  Reducer用来描述action如何改变state，接收旧的state和action，返回新的state。Reducer内部的执行操作必须是无副作用的，不能对state进行直接修改，当状态发生变化时，需要返回一个全新的对象代表新的state。这样做的好处是，状态的更新是可预测的，另外，这与Redux的比较分发机制相关，阅读Redux判断状态更新的源码部分(combineReducers)，发现Redux是对新旧state直接用==来进行比较，也就是浅比较，如果我们直接在state对象上进行修改，那么state所分配的内存地址其实是没有变化的，“==”是比较对象间的内存地址，因此Redux将不会响应我们的更新。之所以这样处理是避免对象深层次比较所带来的性能损耗（需要递归遍历比较）。


在使用Redux时，我们只要严格按照以上三种约定，就可以避免大部分不必要的bug。

##### **核心源码剖析**

Redux官方代码库提供了以下几个模块文件：

- applyMiddleware.js
- bindActionCreators.js
- combineReducers.js
- compose.js
- createStore.js


针对以上模块，我们从易到难展开理解：

**compose.js**
从右到左进行函数式编程

```js
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
export default function compose(...funcs) {
    if (funcs.length ===0) {
        return arg => arg
    }
    if (funcs.length ===1) {
        return funcs[0]
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
} 
```


以上代码很好理解，当compose无参数时，返回一个空函数，参数为唯一函数时，直接将这个函数作为返回值，重点在于最后一部分：

```js
return funcs.reduce((a, b) => (...args) => a(b(...args))) 
```

对多个参数组合成的函数数组进行reduce操作，其实以上代码等同于：

```js
return funcs.reduceRight((composed, f) => f(composed));
```

相当于对数组内的所有函数，从右至左，将前一个函数作为后一个函数的入口参数依次返回，比如compose(fn1,fn2,fn3)最后返回的结果应该是这样子的：

```js
fn1(fn2(fn3))
```

**bindActionCreators.js**

bindActionCreator将值为actionCreator的对象转化成具有相同键值的对象，每一个actionCreator都会被dispatch所包裹调用，因此可以直接使用，简而言之，bindActionCreator可以让开发者在不直接接触dispacth的前提下进行更改state的操作，下面我们来看下它是如何实现的：

```js
import warning from'./utils/warning'

function bindActionCreator (actionCreator, dispatch) {
    return (...args) => dispatch(actionCreator(...args))
}

export default function bindActionCreators (actionCreators, dispatch) {
    if (typeof actionCreators ==='function') {
        return bindActionCreator(actionCreators, dispatch)
    }
    if (typeof actionCreators !=='object'|| actionCreators ===null) {
        throw new Error(`bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. ` + `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`)
    }
    const keys = Object.keys(actionCreators)
    const boundActionCreators ={}
    for (let i =0; i < keys.length; i++) {
        const key = keys[i]
        const actionCreator = actionCreators[key]
        if (typeof actionCreator ==='function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
        } else {
            warning(`bindActionCreators expected a function actionCreator for key '${key}', instead received type '${typeof actionCreator}'.`)
        }
    }
    return boundActionCreators
}
```

对于单个actionCreator，代码很简单，直接返回一个被dispatch包裹过的action而已，对于多个actionCreators，如果入口参数是一个function，说明只提供了一个actionCreator，直接调用bindActionCreator(actionCreators,dispatch)，对于以对象形式输入的多个actionCreators，对其遍历输出每一个bindActionCreator(actionCreators,dispatch)并封装在具有同名键值的boundActionCreators对象中，这样在我们需要调用action的地方直接boundActionCreators[actionCreate定义名]就可以了，是不是原理也很简单？这样我们就已经解锁两个模块了（别急，核心的东西在后面）。

**createStore.js**

CreateStore作为生成唯一store的函数，是Redux中最核心的API，我们先浏览源码感受一下(结合标明的注释)：

```js
//用于校验是否是纯对象
import isPlainObject from'lodash/isPlainObject'
//内部私有属性，暂时不做扩展
import $$observable from'symbol-observable'

//内部action,用于调用所有reducers生成初始state
export const ActionTypes ={INIT:'@@redux/INIT'}
export default function createStore(reducer, preloadedState, enhancer) {
    if (typeof preloadedState ==='function' && typeof enhancer ==='undefined') {
        enhancer = preloadedState
        preloadedState = undefined
    }
    if (typeof enhancer !=='undefined') {
        if (typeof enhancer !=='function') {
            throw new Error('Expected the enhancer to be a function.')
        }
        //函数柯里化，enhancer提供增强版(中间件扩展)的store
        return enhancer(createStore)(reducer, preloadedState) 
    }
    //reducer必须是一个function
    if (typeof reducer !=='function') {
        throw new Error('Expected the reducer to be a function.')
    }
    //store内部私有变量(外部无法直接访问)
    let currentReducer = reducer
    let currentState = preloadedState
    let currentListeners = []
    let nextListeners = currentListeners
    let isDispatching = false
    //为下一阶段监听器快照提供备份
    function ensureCanMutateNextListeners () {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()
        }
    }

    //获取最新state
    function getState() {
        return currentState
    }

    //用于订阅state的更新
    function subscribe(listener) {
        if (typeof listener !=='function') {
            throw new Error('Expected listener to be a function.')
        }
        //保证只有第一次执行unsubscribe()才是有效的，只取消注册当前listener
        let isSubscribed =true
        //为每次订阅提供快照备份nextListeners，主要防止在遍历执行currentListeners回调
        //过程中触发了订阅/取消订阅功能，若直接更新currentListeners将造成当前循环体逻辑混乱
        //因此所有订阅/取消订阅的listeners都是在nextListeners中存储的，并不会影响当前的dispatch(action)
        ensureCanMutateNextListeners()
        nextListeners.push(listener)
        //返回一个取消订阅的函数
        return function unsubscribe() {
            //保证当前listener只被取消注册一次
            if (!isSubscribed) { return }
            isSubscribed =false
            ensureCanMutateNextListeners()
            const index = nextListeners.indexOf(listener)
            nextListeners.splice(index,1)
        }
    }

    function dispatch(action) {
        //保证dispatch是个纯对象，即字面量对象或Object创建的对象
        //这是因为原始版的dispatch只支持同步action，约定的格式是纯对象
        //可以使用中间件来dispatch扩展功能，增加action的类型种类
        if (!isPlainObject(action)) {
            throw new Error('Actions must be plain objects. '+'Use custom middleware for async actions.')
        }
        //action必须要有key为type的动作类型
        if (typeof action.type ==='undefined') {
            throw new Error('Actions may not have an undefined "type" property. '+'Have you misspelled a constant?')
        }
        //判断在执行dispatch的过程中是否已存在dispatch的执行流
        //保证dispatch中对应的reducer不允许有其他dispatch操作
        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }
        try {
            //根据提供的action，执行根reducer从而更新整颗状态树
            isDispatching = true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }
        //通知所有之前通过subscribe订阅state更新的回调listener
        const listeners = currentListeners = nextListeners
        for(let i =0; i < listeners.length; i++) {
            const listener = listeners[i]listener()
        }
        return action
    }


    //替换当前reducers，如从其他文件引入了新的reducers进行热加载
    function replaceReducer (nextReducer) {
        if (typeof nextReducer !=='function') {
            throw new Error('Expected the nextReducer to be a function.')
        }
    }

    function observable () {
        const outerSubscribe = subscribe
        return {
            subscribe (observer) {
                if (typeof observer !=='object') {
                    throw new TypeError('Expected the observer to be an object.')
                }
            
                function observeState() {
                    if (observer.next) {
                        observer.next(getState())
                    }
                }
                observeState()
                const unsubscribe = outerSubscribe(observeState)
                return { unsubscribe }
            },
            [$$observable] () {
                return this
            }
        }
    }

    dispatch({ type: ActionTypes.INIT })
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable
    }
}
```

一眼望去，还是有些懵逼的，但如果我们把它划分为以下三个部分分别理解或许就简单多了。

- 入口参数：reducer、preloadState、enhancer
- 内部变量：currentReducer、currentState、currentListeners、nextListeners、isDispatching
- 输出：dispatch、subscribe、getState、replaceReducer


以下是CreateStore的整体架构：

![img](https://pic2.zhimg.com/80/v2-717bceafe1990d8195f4484fe8ff60d1_1440w.jpg)


现在阅读完我所标注的源码注释以及上述架构图，是不是一目了然(更加懵逼)了，首先请仔细阅读上述架构图每个入口参数、内部变量及返回的几个功能函数具体的含义，其中一些比较容易理解的地方我已经在注释中写的较详细了，现在我们着重来看下几个需要注意的地方。

**enhancer**

```js
if (typeof preloadedState ==='function' && typeof enhancer ==='undefined') {
    enhancer = preloadedState
    preloadedState = undefined
}

if (typeof enhancer !=='undefined') {
    if (typeof enhancer !=='function') {
        throw new Error('Expected the enhancer to be a function.')
    }
    //函数柯里化，enhancer提供增强版(中间件扩展)的store
    return enhancer(createStore)(reducer, preloadedState)
}
```

首先enhancer在缺省条件下判断如果preloadedState是个函数，则将其视为enhancer，这里enhancer本身是个引入中间件扩展功能的返回函数，enhancer(createStore)(reducer, preloadedState)实际上是输出一个增强了dispatch功能的store，稍后我们说到applyMiddleware再去探讨，这里只要记得它仅代表一个辅助函数就是了，没有它也不会影响我们的开发。
**nextListeners及currentListeners**

这两个变量用于存储subscribe订阅state更新时的回调函数，但我们可能会提出疑问：只用一个currentListeners存储不就好了吗？其实这里nextListeners是在dispatch的过程中起到一个快照暂存功能。如果只有currentListeners，在我们按部就班的流程下是不会出问题的，但当我们在遍历执行我们currentListeners中所有监听回调的过程中进行了subscribe或unsubscribe，比如以下的场景:

```js
for (let i =0; i < currentListeners.length; i++) {
    const listener = listeners[i]
    listener()
}
//其中有一个listener执行了以下操作:
listeners[3] = function() {
    subscribe() //会使currentListeners长度加1，影响当前遍历
}
```

上面只是个简单的例子，但完全可能发生。在这种场景下如果每次subscribe或unsubscribe都直接对currentListeners进行操作，那么将导致当前遍历执行的监听回调队列发生逻辑混乱。

**dispatch函数的实现:**

dispatch主要完成：调用对应reducer->通知所有listener更新状态。未加工的dispatch其实就完成了上面两个主要功能，首先必须要保证输入的action是一个纯对象，这样是保证未加工的dispatch功能专一，只处理同步action，若想增加action的输入类型，则必须引入applyMiddleWare模块。isDispatching提供了锁存机制，保证在当前dispatch执行流下不允许对应的reducer引入dispatch。试想一下如果我们在调用的reducer中触发了dispatch，那在新的dispatch又将引入对应reducer，最终将造成dispatch->reducer->dispatch的死循环，因此在调用dispatch时，我们先判断当前是否已经被调用过，将状态锁住，最后执行完对应reducer，再将isDispatching状态释放，以此来避免不必要的死循环问题。

**combineReducers.js**
combineReducers部分的源码相对冗杂，其中包括对生产环境/开发环境以及其他系列入参类型的校验，这里我们只关注它核心源码部分:

```js
return function combination (state ={}, action){
    let hasChanged = false
    const nextState ={}
    for (let i =0; i < finalReducerKeys.length; i++) {
        const key = finalReducerKeys[i]
        const reducer = finalReducers[key]
        //存储对应reducer的入参旧的state
        const previousStateForKey = state[key]
        const nextStateForKey = reducer(previousStateForKey, action)
        //reducer必须要有返回值
        if (typeof nextStateForKey ==='undefined') {
            const errorMessage = getUndefinedStateErrorMessage(key, action)
            throw newError(errorMessage)
        }
        nextState[key]= nextStateForKey
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey
 }
    return hasChanged ? nextState : state
}
 
```

使用变量nextState记录本次执行reducer返回的state。hasChanged用来记录前后state是否发生改变。循环遍历reducers，将对应的store的部分交给相关的reducer处理。最后根据hasChanged是否改变来决定返回nextState还是state,这样就保证了在不变的情况下仍然返回的是同一个对象，这就是之前要求reducer必须是纯函数的原因，combineReducers只对新旧state进行了浅比较，若直接更改旧的state，实则引用地址没有变，将不会触发view层的render。

**applyMiddleware.js**

在使用中间件部分之前，我们先来思考什么是AOP？

目前常规的应用都是面向对象编程，当需要对我们的逻辑增加扩展功能时（如发送请求前的校验、打印日志等），我们只能在所在功能模块添加额外的扩展功能，当然你可以选择共有类通过继承方式调用，但这将导致共有类的膨胀，否则你只能将其散落在你业务逻辑的各个角落，造成代码耦合。
AOP(面向切面编程)的出现就是为了解决代码冗余、耦合问题。我们将扩展功能代码单独放入一个切面，待执行的时候才将它载入到你需要扩展功能的位置也就是切点。这样做的好处是你并不需要更改你本身的业务逻辑代码，而这样的扩展功能通过串联的方式传递调用下去就是中间件的原理。

![img](https://pic1.zhimg.com/80/v2-73709cd54074bd1e9d635f12d991f854_1440w.jpg)


对于开发者而言，中间件暴露在业务层的只是个简单的dipatch(action)，只不过这个dispatch是带有扩展功能的如执行异步action、打印日志、错误校验等系列功能。而applyMiddleware模块就是把这样的思念串联执行下去但不影响原有业务状态，我们再来膜拜一下这部分的源码：

```js
export default function applyMiddleware (...middlewares) {
    return (next) => (reducer, initialState) => {
        var store = next(reducer, initialState);
        var dispatch = store.dispatch;
        var chain =[];
        var middlewareAPI = {
            getState: store.getState, 
            dispatch:(action)=>dispatch(action)
        };
        chain = middlewares.map(middleware =>middleware(middlewareAPI)); 
        dispatch = compose(...chain, store.dispatch);
        return {
            ...store,
            dispatch
        };
    };
}
```

说实话，笔者第一次看这部分源码的时候十分开心，以为这么几行代码花个几分钟就可以渗透了，然而...（还是年轻啊）我们先谨记上面提到过的部分：中间件的亮点在于在不破坏原有结构的接触上传递扩展功能而只暴露给开发者简单的API。

现在我们来一起一行一行分析上面短小精悍的源码，首先来看下它的声明方式：

```js
function applyMiddleware(...middlewares) {
    return (next) => (reducer, initialState) => {}
}
```

这类采用了函数柯里化的方式来化多参数为单一参数，我理解就是将固定的参数丢到闭包中，待引入作为单一入口参数时，结合闭包中存在的已有参数来执行功能函数，从一定角度来说提高了代码复用性。

接着执行 `var store = next(reducer,initialState)` 这里的next是增强store函数的第一个入参，也就是CreateStore，那这里的store就是返回一个纯天然未加工过的store(和未引入中间件的store一样)，这样做的原因是中间件的作用只是想扩展dispatch的能力而不影响其他属性及方法，我们只需要用带有扩展能力的dispatch去覆盖原有store的对应方法就可以了，接着，获取原始dispatch用来后续的加工处理。

chain是一个用来缓存中间件扩展功能的队列，通过对middlewares的遍历，队列中的每个元素是middleware(middlewareAPI)的结果。这时候我们可能还不知到一个middleware到底长啥样子，更别提它返回的结果了，现在让我们拿redux thunk中间件来举个 ：

```js
export default function thunkMiddleware({ dispatch, getState }) {
    return next => action => typeof action === ‘function’ ? action(dispatch, getState) : next(action);
}
```

可以看到中间件的定义方法又是一个经典的curry方式，那middleware(middlewareAPI)返回的结果就应该是next=>action=>{},现在我们只需要记住chain队列中缓存的每一个元素都长next=>action=>{}这个样子就可以了。

再抛出个疑问：为什么要定义一个middlewareAPI呢，并将其作为每个中间件函数的入参呢？

这是为了使middlewareAPI如getState及dispatch方法缓存在闭包当中，并将这两个方法传递到每一个中间件当中。当dispatch发生扩展更新时，由于它存在于闭包当中，所有中间件都可以取到最新的dispatch方法，在需要的时候也可以通过中间件将这些方法传递到reducer当中。例如上述的react thunk用来为action增加异步功能，当action是一个function时，将存在于闭包当中的dispatch和getState作为action的入参，而这时的dispatch就是最新的被扩展后的dispatch！

结合后面的compose，我们可以将这些扩展功能串联起来。还记得大明湖畔的compose吗——从右向左嵌套包裹函数。到这里我们来整理下我们的思路：chain队列中缓存的每一个中间件调用结果是next=>action=>{}，现在用compose将他们串联起来就是:

![img](https://pic2.zhimg.com/80/v2-eb3561d6e0188c4744df10d29411f401_1440w.jpg)


从最右边的dispatch开始，依次将前一个next=>action=>{}的执行结果(即action=>{})传递到后面next=>action=>{}中的入参next，也就是说，这里的next是串联所有中间件的关键一步，最后暴露最外层的(假设是funN)结果就是funN(funN-1(...dispatch)),结果是action=>{}形式的，最后将其作为新的dispatch并覆盖到原有store当中。

我们回过头再去看一下redux thunk的代码，当我们调用被中间件扩展后的dispatch(action)时，实际上执行的是中间件的action=>{}部分，当action是function类型即是异步动作时，将最新的dispatch通过action传递下去，这样在action函数执行完异步操作(如异步请求后)，后我们又有了dispatch的执行权以进行同步action或进一步的异步嵌套。

这里需要注意的是每个中间件都是通过next(action)来进行传递的，中间件在执行next(action)时，由于next中存储的是前一个中间件的action=>{}，因此会回调前一个中间件函数，依次向前执行，直到将action传递到最右侧的原始dispatch执行dispatch(action)，这就是中间件的精华所在：可以在不暴露额外api的前提下根据原有业务逻辑提供的参数进行扩展action，但又不直接在action进行改造，以此做到了action->reducer的分步劫持，回调方式如下。



<img src="https://pic3.zhimg.com/80/v2-abe0a04c51425cd96df7eba758dd7466_1440w.jpg" alt="img" style="zoom:50%;" />


另外，我个人理解中间件的next(action)代码位置决定了中间件扩展功能的执行顺序，如果放在中间件的顶部，则立刻去执行回调即前一个action=>{}，这样最终的执行顺序将是从右到左依次执行，相反，如果我们将next(action)操作放在最底部，中间件将执行完自身扩展功能再去回调前一个中间件，由于中间件的引入顺序和代码编写都是需要开发者自己提供，因此中间件的真正执行顺序也完全可以由开发者自己掌控。

#### Redux有什么性能问题，怎么优化

##### **考虑到性能和架构， Redux “可扩展性” 如何？**

没有一个明确的答案，在大多数情况下都不需要考虑该问题。

Redux 所做的工作可以分为以下几部分：在 middleware 和 reducer 中处理 action （包括对象复制及不可变更新）、 action 分发之后通知订阅者、根据 state 变化更新 UI 组件。虽然在一些复杂场景下，这些都 *可能*变成一个性能问题，但 Redux 本质上并没有任何慢或者低效的实现。实际上，React Redux 已经做了大量的优化工作减少不必要的重复渲染，React Redux v5 相比之前的版本有着显著的改进。

与其他库相比，Redux 可能没有那么快。为了更大限度的展示 React 的渲染性能，state 应该以规范化的结构存储，许多单独的组件应该直接连接到 store，连接的列表组件应该将项目 ID 传给子列表（允许列表项通过 ID 查找数据）。这使得要进行渲染的量最小化。使用带有记忆功能的 selector 函数也对性能有非常大的帮助。

考虑到架构方面，事实证据表明在各种项目及团队规模下，Redux 都表现出色。Redux 目前正被成百上千的公司以及更多的开发者使用着，NPM 上每月都有几十万的安装量。有一位开发者这样说：

> 规模方面，我们大约有500个 action 类型、400个 reducer、150个组件、5个 middleware、200个 action、2300个测试案例。

##### **补充资料**

**文档**

- [Recipes: Structuring Reducers - state 范式化](https://link.zhihu.com/?target=http%3A//cn.redux.js.org/docs/faq/docs/recipes/reducers/NormalizingStateShape.md)

**文章**

- [How to Scale React Applications ](https://link.zhihu.com/?target=https%3A//www.smashingmagazine.com/2016/09/how-to-scale-react-applications/)(accompanying talk: [Scaling React Applications](https://link.zhihu.com/?target=https%3A//vimeo.com/168648012))
- [High-Performance Redux](https://link.zhihu.com/?target=http%3A//somebody32.github.io/high-performance-redux/)
- [Improving React and Redux Perf with Reselect](https://link.zhihu.com/?target=http%3A//blog.rangle.io/react-and-redux-performance-with-reselect/)
- [Encapsulating the Redux State Tree](https://link.zhihu.com/?target=http%3A//randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/)
- [React/Redux Links: Performance - Redux](https://link.zhihu.com/?target=https%3A//github.com/markerikson/react-redux-links/blob/master/react-performance.md%23redux-performance)

**讨论**

- [#310: Who uses Redux？](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/310)
- [#1751: Performance issues with large collections](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/1751)
- [React Redux #269: Connect could be used with a custom subscribe method](https://link.zhihu.com/?target=https%3A//github.com/reactjs/react-redux/issues/269)
- [React Redux #407: Rewrite connect to offer an advanced API](https://link.zhihu.com/?target=https%3A//github.com/reactjs/react-redux/issues/407)
- [React Redux #416: Rewrite connect for better performance and extensibility](https://link.zhihu.com/?target=https%3A//github.com/reactjs/react-redux/issues/416)
- [Redux vs MobX TodoMVC Benchmark: #1](https://link.zhihu.com/?target=https%3A//github.com/mweststrate/redux-todomvc/pull/1)
- [Reddit: What's the best place to keep the initial state？](https://link.zhihu.com/?target=https%3A//www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)
- [Reddit: Help designing Redux state for a single page app](https://link.zhihu.com/?target=https%3A//www.reddit.com/r/reactjs/comments/48k852/help_designing_redux_state_for_a_single_page/)
- [Reddit: Redux performance issues with a large state object？](https://link.zhihu.com/?target=https%3A//www.reddit.com/r/reactjs/comments/41wdqn/redux_performance_issues_with_a_large_state_object/)
- [Reddit: React/Redux for Ultra Large Scale apps](https://link.zhihu.com/?target=https%3A//www.reddit.com/r/javascript/comments/49box8/reactredux_for_ultra_large_scale_apps/)
- [Twitter: Redux scaling](https://link.zhihu.com/?target=https%3A//twitter.com/NickPresta/status/684058236828266496)
- [Twitter: Redux vs MobX benchmark graph - Redux state shape matters](https://link.zhihu.com/?target=https%3A//twitter.com/dan_abramov/status/720219615041859584)
- [Stack Overflow: How to optimize small updates to props of nested components?](https://link.zhihu.com/?target=http%3A//stackoverflow.com/questions/37264415/how-to-optimize-small-updates-to-props-of-nested-component-in-react-redux)
- [Chat log: React/Redux perf - updating a 10K-item Todo list](https://link.zhihu.com/?target=https%3A//gist.github.com/markerikson/53735e4eb151bc228d6685eab00f5f85)
- [Chat log: React/Redux perf - single connection vs many connections](https://link.zhihu.com/?target=https%3A//gist.github.com/markerikson/6056565dd65d1232784bf42b65f8b2ad)

##### **每个 action 都调用 “所有的 reducer” 会不会很慢？**

我们应当清楚的认识到 Redux store 只有一个 reducer 方法。 store 将当前的 state 和分发的 action 传递给这个 reducer 方法，剩下的就让 reducer 去处理。

显然，在单独的方法里处理所有的 action 仅从方法大小及可读性方面考虑，就已经很不利于扩展了，所以将实际工作分割成独立的方法并在顶层的 reducer 中调用就变得很有意义。尤其是目前的建议模式中推荐让单独的子 reducer 只负责更新特定的 state 部分。 combineReducers() 和 Redux 搭配的方案只是许多实现方式中的一种。强烈建议尽可能保持 store 中 state 的扁平化和范式化，至少你可以随心所欲的组织你的 reducer 逻辑。

即使你在不经意间已经维护了许多独立的子 reducer，甚至 state 也是深度嵌套，reducer 的速度也并不构成任何问题。JavaScript 引擎有足够的能力在每秒运行大量的函数调用，而且大部门的子 reducer 只是使用 switch 语句，并且针对大部分 action 返回的都是默认的 state。

如果你仍然关心 reducer 的性能，可以使用类似 [redux-ignore](https://link.zhihu.com/?target=https%3A//github.com/omnidan/redux-ignore) 和 [reduxr-scoped-reducer](https://link.zhihu.com/?target=https%3A//github.com/chrisdavies/reduxr-scoped-reducer) 的工具，确保只有某几个 reducer 响应特定的 action。你还可以使用 [redux-log-slow-reducers](https://link.zhihu.com/?target=https%3A//github.com/michaelcontento/redux-log-slow-reducers) 进行性能测试。

##### **补充资料**

**讨论**

- [#912: Proposal: action filter utility](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/912)
- [#1303: Redux Performance with Large Store and frequent updates](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/1303)
- [Stack Overflow: State in Redux app has the name of the reducer](https://link.zhihu.com/?target=http%3A//stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer/35674297)
- [Stack Overflow: How does Redux deal with deeply nested models？](https://link.zhihu.com/?target=http%3A//stackoverflow.com/questions/34494866/how-does-redux-deals-with-deeply-nested-models/34495397)

##### **在 reducer 中必须对 state 进行深拷贝吗？拷贝 state 不会很慢吗？**

以不可变的方式更新 state 意味着浅拷贝，而非深拷贝。相比于深拷贝，浅拷贝更快，因为只需复制很少的字段和对象，实际的底层实现中也只是移动了若干指针而已。

因此，你需要创建一个副本，并且更新受影响的各个嵌套的对象层级即可。尽管上述动作代价不会很大，但这也是为什么需要维护范式化及扁平化 state 的又一充分理由。

> Redux 常见的误解： 需要深拷贝 state。实际情况是：如果内部的某些数据没有改变，继续保持统一引用即可。

##### **补充资料**

**文档**

- [Recipes: Structuring Reducers - Prerequisite Concepts](https://link.zhihu.com/?target=http%3A//cn.redux.js.org/docs/faq/docs/faq/docs/recipes/reducers/PrerequisiteConcepts.md)
- [Recipes: Structuring Reducers - Immutable Update Patterns](https://link.zhihu.com/?target=http%3A//cn.redux.js.org/docs/faq/docs/recipes/reducers/ImmutableUpdatePatterns.md)

**讨论**

- [#454: Handling big states in reducer](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/454)
- [#758: Why can't state be mutated？](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/758)
- [#994: How to cut the boilerplate when updating nested entities？](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/994)
- [Twitter: common misconception - deep cloning](https://link.zhihu.com/?target=https%3A//twitter.com/dan_abramov/status/688087202312491008)
- [Cloning Objects in JavaScript](https://link.zhihu.com/?target=http%3A//www.zsoltnagy.eu/cloning-objects-in-javascript/)

##### **怎样减少 store 更新事件的数量？**

Redux 在 action 分发成功（例如，action 到达 store 被 reducer 处理）后通知订阅者。在有些情况下，减少订阅者被调用的次数会很有用，特别在当 action 创建函数分发了一系列不同的 action 时。

如果你在使用 React，你可以写在 ReactDOM.unstable_batchedUpdates() 以提高同步分发的性能，但这个 API 是实验性质的，可能会在以后的版本中移除，所以也不要过度依赖它。可以看看一些第三方的实现 [redux-batched-subscribe](https://link.zhihu.com/?target=https%3A//github.com/tappleby/redux-batched-subscribe)（一个高级的 reducer，可以让你单独分发几个 action）、[redux-batched-subscribe](https://link.zhihu.com/?target=https%3A//github.com/tappleby/redux-batched-subscribe)（一个 store 增强器，可以平衡多个分发情况下订阅者的调用次数）和 [redux-batched-actions](https://link.zhihu.com/?target=https%3A//github.com/tshelburne/redux-batched-actions)（一个 store 增强器，可以利用单个订阅提醒的方式分发一系列的 action）。

##### **补充资料**

**讨论**

- [#125: Strategy for avoiding cascading renders](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/125)
- [#542: Idea: batching actions](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/542)
- [#911: Batching actions](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/911)
- [#1813: Use a loop to support dispatching arrays](https://link.zhihu.com/?target=https%3A//github.com/reactjs/redux/issues/1813)
- [React Redux #263: Huge performance issue when dispatching hundreds of actions](https://link.zhihu.com/?target=https%3A//github.com/reactjs/react-redux/issues/263)

**库**

- [Redux Addons Catalog: Store - Change Subscriptions](https://link.zhihu.com/?target=https%3A//github.com/markerikson/redux-ecosystem-links/blob/master/store.md%23store-change-subscriptions)

##### **仅有 “一个 state 树” 会引发内存问题吗？分发多个 action 会占用内存空间吗？**

首先，在原始内存使用方面，Redux 和其它的 JavaScript 库并没有什么不同。唯一的区别就是所有的对象引用都嵌套在同一棵树中，而不是像类似于 Backbone 那样保存在不同的模型实例中。第二，与同样的 Backbone 应用相比，典型的 Redux 应用可能使用 *更少* 的内存，因为 Redux 推荐使用普通的 JavaScript 对象和数组，而不是创建模型和集合实例。最后，Redux 仅维护一棵 state 树。不再被引用的 state 树通常都会被垃圾回收。

Redux 本身不存储 action 的历史。然而，Redux DevTools 会记录这些 action 以便支持重放，而且也仅在开发环境被允许，生产环境则不会使用。

##### **补充资料**

**文档**

- [Docs: Async Actions](https://link.zhihu.com/?target=http%3A//cn.redux.js.org/docs/faq/advanced/AsyncActions.md%5D)

**讨论**

- [Stack Overflow: Is there any way to "commit" the state in Redux to free memory？](https://link.zhihu.com/?target=http%3A//stackoverflow.com/questions/35627553/is-there-any-way-to-commit-the-state-in-redux-to-free-memory/35634004)
- [Reddit: What's the best place to keep initial state？](https://link.zhihu.com/?target=https%3A//www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)

#### mobx和redux、vuex的区别

##### Flux 思想

是的，Flux 不是某一个 JS 库的名称，而是一种架构思想，很多 JS 库则是这种思想的实现，例如 [Alt](https://alt.js.org/)、[Fluxible](https://fluxible.io/) 等，它用于构建客户端 Web 应用，规范数据在 Web 应用中的流动方式。

那么这个和状态管理有什么关系呢？我们知道，React 只是一个视图层的库，并没有对数据层有任何的限制，换言之任何视图组件中都可能存在改变数据层的代码，而过度放权对于数据层的管理是不利的，另外一旦数据层出现问题将会很难追溯，因为不知道变更是从哪些组件发起的。另外，如果数据是由父组件通过 `props` 的方式传给子组件的话，组件之间会产生耦合，违背了模块化的原则。

我们以 AngularJS 应用为例，在 AngularJS 中，`controller` 是一个包含于作用域 `$scope` 的闭包，而这个闭包对应了一个视图模板，`$scope` 中的数据将会被渲染到模板中。但是一个模板可能会对应到多个 `model`（当前 `controller` 的 `$scope`，父级 `$scope`，指令的 `isolated scope` 等），同样，一个 `model` 也可能影响到多个模板的渲染。应用规模一旦变大，数据和视图的关系很容易混乱，由于这个过程中数据和视图会互相影响，思维的负担也会增加。

而 Flux 的思维方式是单向的，将之前放权到各个组件的修改数据层的 `controller` 代码收归一处，统一管理，组件需要修改数据层的话需要去触发特定的预先定义好的 `dispatcher`，然后 `dispatcher` 将 `action` 应用到 `model` 上，实现数据层的修改。然后数据层的修改会应用到视图上，形成一个单向的数据流。打个比方，这就像是图书馆的管理，原来是开放式的，所有人可以随意进出书库借书还书，如果人数不多，这种方式可以减少流程，增加效率，一旦人数变多就势必造成混乱。Flux 就像是给这个图书馆加上了一个管理员，所有借书还书的行为都需要委托管理员去做，管理员会规范对书库的操作行为，也会记录每个人的操作，减少混乱的现象。

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1708/state-4.png)

##### 主要 Flux 实现

Flux 的实现有很多，不同的实现也各有亮点，下面介绍一些比较流行的 Flux 的实现。

###### [Flux](https://github.com/facebook/flux)

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1708/state-5.png)

这应该是 Flux 的一个比较官方”的实现，显得中规中矩，实现了 Flux 架构文档里的基本概念。它的核心是 [`Dispatcher`](https://github.com/facebook/flux/blob/master/src/Dispatcher.js)，通过 `Dispatcher`，用户可以注册需要相应的 `action` 类型，对不同的 `action` 注册对应的回调，以及触发 `action` 并传递 `payload` 数据。

下面是一个简单示例：

```
const dispatcher = new Dispatcher()
const store = {books: []}

dispatcher.register((payload) => {
    if (payload.actionType === 'add-book') {
        store.books.push(payload.newBook)
    }
})
dispatcher.dispatch({
    actionType: 'add-book',
    newBook: {
        name: 'cookbook'
    }
})
```

可以看到，只使用 Flux 提供的 `Dispatcher` 也是可以的，不过推荐使用 Flux 提供的一些基础类来构建 `store`，这些基础类提供了一些方法可供调用，能更好的扩展数据层的功能，具体使用方法可以参考 [Flux 文档](https://facebook.github.io/flux/docs/flux-utils.html)。

###### [Reflux](https://github.com/reflux/refluxjs)

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1708/state-6.png)

Reflux 是在 Flux 的基础上编写的一个 Flux 实现，从形式上看，去掉了显式的 `Dispatcher`，将 `action` 表现为函数的形式，构建一个 `action` 的方式为：

```
const addBook = Reflux.createAction({
    actionName: 'add-book',
    sync: false,
    preEmit: function() {/*...*/},
    // ...
})
addBook({/*...*/})
```

另外，Reflux 相比 Flux 有一些区别，例如：

###### 依赖

首先 Flux 不是一个库，而是一种架构思想，不过要使用 Flux 还是要引入一个 [`Dispatcher`](https://github.com/facebook/flux/blob/master/src/Dispatcher.js)，而 Reflux 则提供了一整套库供你使用，可以方便地通过 `npm` 来安装。

###### 组件监听事件

在组件内监听事件的写法上，Flux 和 Reflux 也有一些区别，在 Flux 中：

```
const _books = {}
const BookStore = assign({}, EventEmitter.prototype, {
    emitChange () {
        this.emit(CHANGE_EVENT)
    },
    addChangeListener (callback) {
        this.on(CHANGE_EVENT, callback)
    },
    removeChangeListener (callback) {
        this.removeListener(CHANGE_EVENT, callback)
    }
})
const Book = React.createClass({
    componentDidMount:function(){
        bookStore.addChangeListener(this.onAddBook)
    }
})
```

而在 Reflux 中，写法有些不同，它通过在组件中引入 `Mixin` 的方式使得在组件中可调用 `listenTo` 这个方法：

```
var BookStore = React.createClass({
    mixins: [Reflux.ListenerMixin],
    componentDidMount: function() {
        this.listenTo(bookStore, this.onAddBook)
    }
})
```

###### Store 和 Action 的写法

在 Flux 中，初始化一个 `Store` 以及编写 `Action` 都是比较麻烦的，这导致了代码量的增加，可维护性也会降低，例如我们仍然要写一个 `Store` 和对应的 `Action`，创建 `Store` 的写法在上面的示例中已经有了，而创建 `Action` 在两者之间区别也很大，首先是 Flux：

```
const fluxActions = {
    addBook: function(book) {
        Dispatcher.handleViewAction({
        actionType: 'ADD_BOOK',
        book
        })
    },
    // more actions
}
```

Reflux 和 Flux 相比就简单很多：

```
const refluxActions = Reflux.createActions([
    'addBook',
    // more actions
])
```

之所以 Reflux 会简单这么多，是因为它可以在 `Store` 中直接注册事件的回调函数，而去掉了 `Dispatcher` 这一中间层，或者说将 `Dispatcher` 的功能整合进了 `Store` 中。

总的来看，Reflux 相当于是 Flux 的改进版，补全了 Flux 在 `Store` 上缺少的功能，并去掉了 `Dispatcher`（实际上并不是去掉，而是和 `Store` 合并），减少了冗余的代码。

##### [Redux](https://github.com/reactjs/redux)

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1708/state-7.png)

Redux 实际上相当于 Reduce + Flux，和 Flux 相同，Redux 也需要你维护一个数据层来表现应用的状态，而不同点在于 Redux 不允许对数据层进行修改，只允许你通过一个 `Action` 对象来描述需要做的变更。在 Redux 中，去掉了 `Dispatcher`，转而使用一个纯函数来代替，这个纯函数接收原 `state tree` 和 `action` 作为参数，并生成一个新的 `state tree` 代替原来的。而这个所谓的纯函数，就是 Redux 中的重要概念 —— `Reducer`。

在函数式编程中，Reduce 操作的意思是通过遍历一个集合中的元素并依次将前一次的运算结果代入下一次运算，并得到最终的产物，在 Redux 中，`reducer` 通过合并计算旧 `state` 和 `action` 并得到一个新 `state` 则反映了这样的过程。

因此，Redux 和 Flux 的第二个区别则是 Redux 不会修改任何一个 `state`，而是用新生成的 `state` 去代替旧的。这实际上是应用了不可变数据（Immutable Data），在 `reducer` 中直接修改原 `state` 是被禁止的，Facebook 的 [Immutable](https://facebook.github.io/immutable-js/) 库可以帮助你使用不可变数据，例如构建一个可以在 Redux 中使用的 `Store`。

下面是一个用 Redux 构建应用的状态管理的示例：

```
const { List } = require('immutable')
const initialState = {
    books: List([])
}
import { createStore } from 'redux'

// action
const addBook = (book) => {
    return {
        type: ADD_BOOK,
        book
    }
}

// reducer
const books = (state = initialState, action) => {
    switch (action.type) {
        case ADD_BOOK:
        return Object.assign({}, state, {
            books: state.books.push(action.book)
        })
    }
    return state
}

// store
const bookStore = createStore(books, initialState)

// dispatching action
store.dispatch(addBook({/* new book */}))
```

Redux 的工作方式遵循了严格的单向数据流原则，从上面的代码示例中可以看出，整个生命周期分为：

- 在 `store` 中调用 `dispatch`，并传入 `action` 对象。`action` 对象是一个描述变化的普通对象，在示例中，它由一个 `creator` 函数生成。
- 接下来，`store` 会调用注册 `store` 时传入的 `reducer` 函数，并将当前的 `state` 和 `action` 作为参数传入，在 `reducer` 中，通过计算得到新的 `state` 并返回。
- `store` 将 `reducer` 生成的新 `state` 树保存下来，然后就可以用新的 `state` 去生成新的视图，这一步可以借助一些库的帮助，例如官方推荐的 React Redux。

如果一个应用规模比较大的话，可能会面临 `reducer` 过大的问题。这时候我们可以对 `reducer` 进行拆分，例如使用 `combineReducers`，将多个 `reducer` 作为参数传入，生成新的 `reducer`。当触发一个 `action` 的时候，新 `reducer` 会触发原有的多个 `reducer`:

```
const book(state = [], action) => {
    // ...
    return newState
}
const author(state = {}, action) => {
    // ...
    return newState
}
const reducer = combineReducers({ book, author })
```

关于 Redux 的更多用法，可以仔细阅读文档，这里就不多介绍了。

React 技术栈中可用的状态管理库还有更多，例如 [Relay](https://facebook.github.io/relay/)，不过它需要配合 [GraphQL](https://graphql.org/learn/)，在没有 GraphQL 的支持下不好引入，这里就不多赘述了（其实是我没有研究过）。

关于 React 中类 Flux 架构的状态管理工具我们就先聊到这里，接下来我们会聊到其他框架技术栈中的状态管理工具，看看它们会有什么特点。

##### [Vuex](https://github.com/vuejs/vuex)

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1708/state-8.png)

我们业务中使用 Vue 的比例是最高的，说到 Vue 中的状态管理就不得不提到 Vuex。Vuex 也是基于 Flux 思想的产品，所以在某种意义上它和 Redux 很像，但又有不同，下面通过 Vuex 和 Redux 的对比来看看 Vuex 有什么区别。

首先，和 Redux 中使用不可变数据来表示 `state` 不同，Vuex 中没有 `reducer` 来生成全新的 `state` 来替换旧的 `state`，Vuex 中的 `state` 是可以被修改的。这么做的原因和 Vue 的运行机制有关系，Vue 基于 ES5 中的 `getter/setter` 来实现视图和数据的双向绑定，因此 Vuex 中 `state` 的变更可以通过 `setter` 通知到视图中对应的指令来实现视图更新。

另外，在 Vuex 中也可以记录每次 `state` 改变的具体内容，`state` 的变更可被记录与追踪。例如 Vue 的[官方调试工具](https://github.com/vuejs/vue-devtools)中就集成了 Vuex 的调试工具，使用起来和 Redux 的调试工具很相似，都可以根据某次变更的 `state` 记录实现视图快照。

上面说到，Vuex 中的 `state` 是可修改的，而修改 `state` 的方式不是通过 `actions`，而是通过 `mutations`。一个 `mutation` 是由一个 `type` 和与其对应的 `handler` 构成的，`type` 是一个字符串类型用以作为 `key` 去识别具体的某个 `mutation`，`handler` 则是对 `state` 实际进行变更的函数。

```
// store
const store = {
    books: []
}

// mutations
const mutations = {
    [ADD_BOOKS](state, book) {
        state.books.push(book)
    }
}
```

那么 `action` 呢？Vuex 中的 `action` 也是 `store` 的组成部分，它可以被看成是连接视图与 `state` 的桥梁，它会被视图调用，并由它来调用 `mutation handler`，向 `mutation` 传入 `payload`。

这时问题来了，Vuex 中为什么要增加 `action` 这一层呢，是多此一举吗？

当然不是，在知乎上有这样一个问题可以当做很好的栗子：[Vue.js中`ajax`请求代码应该写在组件的`methods`中还是Vuex的`actions`中](https://www.zhihu.com/question/57133837)？这个问题的答案并不唯一，但通过这个问题可以很好的说明一个 Vuex 的概念——`mutation` 必须是同步函数，而 `action` 可以包含任意的异步操作。

回到这个问题本身，如果在视图中不进行异步操作（例如调用后端 API）只是触发 `action` 的话，异步操作将会在 `action` 内部执行：

```
const actions = {
    addBook({ commit }) {
        request.get(BOOK_API).then(res => commit(ADD_BOOK, res.body.new_book))
    }
}
```

可以看出，这里的状态变更相当于是 `action` 产生的副作用，`mutation` 的作用是将这些副作用记录下来，这样就形成了一个完整数据流闭环，数据流的顺序如下：

- 在视图中触发 `action`，并根据实际情况传入需要的参数。
- 在 `action` 中触发所需的 `mutation`，在 `mutation` 函数中改变 `state`。
- 通过 `getter/setter` 实现的双向绑定会自动更新对应的视图。

##### [MobX](https://github.com/mobxjs/mobx)

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1708/state-9.png)

MobX 是一个比较新的状态管理库，它的前身是 Mobservable，实际上 MobX 相当于是 Mobservable 的 2.0 版本。它的上升势头很猛，在 React 社区中很受关注，在不久前刚结束的 React Conf 2017 中也有相关的分享（需翻墙）：[Preethi Kasireddy - MobX vs Redux: Comparing the Opposing Paradigms - React Conf 2017](https://youtu.be/76FRrbY18Bs)。

> 如果阅读视频有一定的困难，建议[阅读这篇文章](https://zhuanlan.zhihu.com/p/25989654)。

Mobx 和 Redux 相比，差别就比较大了。如果说 Redux 吸收并发扬了很多函数式编程思想的话，Mobx 则更多体现了面向对象及的特点。MobX 的特点总结起来有以下几点：

- **`Observable`**：它的 `state` 是可被观察的，无论是基本数据类型还是引用数据类型，都可以使用 MobX 的 `(@)observable` 来转变为 `observable value`。
- **`Reactions`**：它包含不同的概念，基于被观察数据的更新导致某个计算值（computed values），或者是发送网络请求以及更新视图等，都属于响应的范畴，这也是响应式编程（Reactive Programming）在 JavaScript 中的一个应用。
- **`Actions`**：它相当于所有响应的源头，例如用户在视图上的操作，或是某个网络请求的响应导致的被观察数据的变更。

和 Redux 对单向数据流的严格规范不同，Mobx 只专注于从 `store` 到 `view` 的过程。在 Redux 中，数据的变更需要监听（可见上文 Redux 示例代码），而 Mobx 的数据依赖是基于运行时的，这点和 Vuex 更为接近。它的 `store` 组织起来大概像这样：

```
class BookStore {
    books = []
    @observable admin = ''
    @computed get availableBooks() {
        return this.books.filter(book => !book.isAvailable);
    }
}
```

和 Vuex 一样，比较直观。

而在修改数据方面，Mobx 的操作成本是最低的，它的 `store` 基于 `class` 实现，因此可以直接进行修改，不需要像 Vuex 一样触发 `mutation` 或是和 Redux 一样调用 `reducer` 并返回新的 `state`，对开发更友好。

那么 Mobx 是怎么将数据和视图关联起来的呢？我们知道，在 React 中，组件是由无状态函数（stateless function）渲染的，我们只要在组件中加入 [mobx-react](https://github.com/mobxjs/mobx-react) 这个包提供的 `(@)observer` 函数（或使用 ES7 `decorator` 语法），就可以在 `store` 被改变时自动 `re-render` 引用了相应数据的 React 组件。

```
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'

@observer
class BookStoreView extends Component {
    render() {
        return (
        <div>
            <ul>
            {this.props.bookStore.books.map(book =>
                <BookView book={book} author={book.author} />
            )}
            </ul>
        </div>
        )
    }
}

const BookView = observer(({book}) =>
    <li>
        <input
        type="checkbox"
        checked={book.isAvailable}
        onClick={() => book.isAvailable = !book.isAvailable}
        />{book.title}
    </li>
)

const store = new BookStore();
ReactDOM.render(<BookStoreView bookStore={store} />, document.getElementById('app'));
```

可以看到，所有操作数据的方式在组件中直接进行。

虽然 Mobx 提供了便捷的代码书写方式，但这样容易造成 `store` 被随意修改，在项目规模比较大的时候，像 Vuex 和 Redux 一样对修改数据的入口进行限制可以提高安全性。在 Mobx 2.2 之后的版本中可以通过 [`useStrict`](https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#usestrict) 限制只能通过 `action` 对数据进行修改。

上文提到，Mobx 只专注于从 `store` 到 `view` 的过程，所以业务逻辑的规划没有一定的标准遵循，社区目前也没有很好的最佳实践，需要开发者们在实际开发中积累经验，规划好代码。

