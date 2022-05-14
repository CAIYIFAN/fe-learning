## Node

### 一.场景

[Node](https://so.csdn.net/so/search?q=Node&spm=1001.2101.3001.7020)运行在单线程下，但这并不意味着无法利用多核/多机下多进程的优势

事实上，Node最初从设计上就考虑了分布式网络场景：

> Node is a single-threaded, single-process system which enforces shared-nothing design with OS process boundaries. It has rather good libraries for networking. I believe this to be a basis for designing very large distributed programs. The “nodes” need to be organized: given a communication protocol, told how to connect to each other. In the next couple months we are working on libraries for Node that allow these networks.

P.S.关于Node之所以叫Node，见[Why is Node.js named Node.js?](https://stackoverflow.com/questions/5621812/why-is-node-js-named-node-js)

#### 为什么要用node?

总结起来node有以下几个特点:简单强大，轻量可扩展．简单体现在node使用的是javascript,json来进行编码，人人都会；强大体现在非阻塞IO,可以适应分块传输数据，较慢的网络环境，尤其擅长高并发访问；轻量体现在node本身既是代码，又是服务器，前后端使用统一语言;可扩展体现在可以轻松应对多实例，多服务器架构，同时有海量的第三方应用组件．

#### node的构架是什么样子的?

主要分为三层，应用app >> V8及node内置架构 >> 操作系统. V8是node运行的环境，可以理解为node虚拟机．node内置架构又可分为三层: 核心模块(javascript实现) >> c++绑定 >> libuv + CAes + http.

[![img](https://camo.githubusercontent.com/63db0fe13f25ff1cd22250583da4ab26234969407756d750a1268ae0caba2178/687474703a2f2f6a6f616f7073696c76612e6769746875622e696f2f74616c6b732f456e642d746f2d456e642d4a6176615363726970742d776974682d7468652d4d45414e2d537461636b2f696d672f6e6f64656a732d617263682d7070742e706e67)](https://camo.githubusercontent.com/63db0fe13f25ff1cd22250583da4ab26234969407756d750a1268ae0caba2178/687474703a2f2f6a6f616f7073696c76612e6769746875622e696f2f74616c6b732f456e642d746f2d456e642d4a6176615363726970742d776974682d7468652d4d45414e2d537461636b2f696d672f6e6f64656a732d617263682d7070742e706e67)

#### node有哪些核心模块?

EventEmitter, Stream, FS, Net和全局对象

#### node有哪些全局对象?

process, console, Buffer

#### process有哪些常用方法?

process.stdin, process.stdout, process.stderr, process.on, process.env, process.argv, process.arch, process.platform, process.exit

#### console有哪些常用方法?

console.log/console.info, console.error/console.warning, console.time/console.timeEnd, console.trace, console.table

#### node有哪些定时功能?

setTimeout/clearTimeout, setInterval/clearInterval, setImmediate/clearImmediate, process.nextTick

#### node中的事件循环是什么样子的?

总体上执行顺序是：process.nextTick >> setImmidate >> setTimeout/SetInterval 看官网吧： https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

#### node中的Buffer如何应用?

Buffer是用来处理二进制数据的，比如图片，mp3,数据库文件等.Buffer支持各种编码解码，二进制字符串互转．

#### EventEmitter

##### 什么是EventEmitter?

EventEmitter是node中一个实现观察者模式的类，主要功能是监听和发射消息，用于处理多模块交互问题.

##### 如何实现一个EventEmitter?

主要分三步：定义一个子类，调用构造函数，继承EventEmitter

代码演示

```
	var util = require('util');
	var EventEmitter = require('events').EventEmitter;

	function MyEmitter() {
		EventEmitter.call(this);
	} // 构造函数

	util.inherits(MyEmitter, EventEmitter); // 继承

	var em = new MyEmitter();
	em.on('hello', function(data) {
		console.log('收到事件hello的数据:', data);
	}); // 接收事件，并打印到控制台
	em.emit('hello', 'EventEmitter传递消息真方便!');
```

##### EventEmitter有哪些典型应用?

1) 模块间传递消息 
1) 回调函数内外传递消息
1) 处理流数据，因为流是在EventEmitter基础上实现的. 
1) 观察者模式发射触发机制相关应用

##### 怎么捕获EventEmitter的错误事件?

监听error事件即可．如果有多个EventEmitter,也可以用domain来统一处理错误事件.

代码演示

```
	var domain = require('domain');
	var myDomain = domain.create();
	myDomain.on('error', function(err){
		console.log('domain接收到的错误事件:', err);
	}); 
	// 接收事件并打印
	myDomain.run(function(){
		var emitter1 = new MyEmitter();
		emitter1.emit('error', '错误事件来自emitter1');
		emitter2 = new MyEmitter();
		emitter2.emit('error', '错误事件来自emitter2');
	});
```

##### EventEmitter中的newListenser事件有什么用处?

newListener可以用来做事件机制的反射，特殊应用，事件管理等．当任何on事件添加到EventEmitter时，就会触发newListener事件，基于这种模式，我们可以做很多自定义处理.

代码演示

```
var emitter3 = new MyEmitter();
emitter3.on('newListener', function(name, listener) {
	console.log("新事件的名字:", name);
	console.log("新事件的代码:", listener);
	setTimeout(function(){ console.log("我是自定义延时处理机制"); }, 1000);
});
emitter3.on('hello', function(){
	console.log('hello　node');
});
```

#### Stream

##### 什么是Stream?

stream是基于事件EventEmitter的数据管理模式．由各种不同的抽象接口组成，主要包括可写，可读，可读写，可转换等几种类型．

##### Stream有什么好处?

非阻塞式数据处理提升效率，片断处理节省内存，管道处理方便可扩展等.

##### Stream有哪些典型应用?

文件，网络，数据转换，音频视频等.

##### 怎么捕获Stream的错误事件?

监听error事件，方法同EventEmitter.

##### 有哪些常用Stream,分别什么时候使用?

Readable为可被读流，在作为输入数据源时使用；Writable为可被写流,在作为输出源时使用；Duplex为可读写流,它作为输出源接受被写入，同时又作为输入源被后面的流读出．Transform机制和Duplex一样，都是双向流，区别时Transfrom只需要实现一个函数_transfrom(chunk, encoding, callback);而Duplex需要分别实现_read(size)函数和_write(chunk, encoding, callback)函数.

##### 实现一个Writable Stream?

三步走:

1. 构造函数call Writable 

2)　继承Writable 
3)　实现_write(chunk, encoding, callback)函数

代码演示

```
var Writable = require('stream').Writable;
var util = require('util');

function MyWritable(options) {
	Writable.call(this, options);
} // 构造函数
util.inherits(MyWritable, Writable); // 继承自Writable
MyWritable.prototype._write = function(chunk, encoding, callback) {
	console.log("被写入的数据是:", chunk.toString()); // 此处可对写入的数据进行处理
	callback();
};

process.stdin.pipe(new MyWritable()); // stdin作为输入源，MyWritable作为输出源   
```

#### 文件系统

##### 内置的fs模块架构是什么样子的?

fs模块主要由下面几部分组成: 1) POSIX文件Wrapper,对应于操作系统的原生文件操作 2) 文件流 fs.createReadStream和fs.createWriteStream 3) 同步文件读写,fs.readFileSync和fs.writeFileSync 4) 异步文件读写, fs.readFile和fs.writeFile

##### 读写一个文件有多少种方法?

总体来说有四种: 1) POSIX式低层读写 2) 流式读写 3) 同步文件读写 4) 异步文件读写

##### 怎么读取json配置文件?

主要有两种方式，第一种是利用node内置的require('data.json')机制，直接得到js对象; 第二种是读入文件入内容，然后用JSON.parse(content)转换成js对象．二者的区别是require机制情况下，如果多个模块都加载了同一个json文件，那么其中一个改变了js对象，其它跟着改变，这是由node模块的缓存机制造成的，只有一个js模块对象; 第二种方式则可以随意改变加载后的js变量，而且各模块互不影响，因为他们都是独立的，是多个js对象.

##### fs.watch和fs.watchFile有什么区别，怎么应用?

二者主要用来监听文件变动．fs.watch利用操作系统原生机制来监听，可能不适用网络文件系统; fs.watchFile则是定期检查文件状态变更，适用于网络文件系统，但是相比fs.watch有些慢，因为不是实时机制．

#### 网络

##### node的网络模块架构是什么样子的?

node全面支持各种网络服务器和客户端，包括tcp, http/https, tcp, udp, dns, tls/ssl等.

##### node是怎样支持https,tls的?

主要实现以下几个步骤即可: 1) openssl生成公钥私钥 2) 服务器或客户端使用https替代http 3) 服务器或客户端加载公钥私钥证书

##### 实现一个简单的http服务器?

经典又很没毛意义的一个题目．思路是加载http模块，创建服务器，监听端口.

代码演示

```
	var http = require('http'); // 加载http模块

	http.createServer(function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'}); // 200代表状态成功, 文档类型是给浏览器识别用的
		res.write('<meta charset="UTF-8"> <h1>我是标题啊！</h1> <font color="red">这么原生，初级的服务器，下辈子能用着吗?!</font>'); // 返回给客户端的html数据
		res.end(); // 结束输出流
	}).listen(3000); // 绑定3ooo, 查看效果请访问 http://localhost:3000
```

#### child-process

##### 为什么需要child-process?

node是异步非阻塞的，这对高并发非常有效．可是我们还有其它一些常用需求，比如和操作系统shell命令交互，调用可执行文件，创建子进程进行阻塞式访问或高CPU计算等，child-process就是为满足这些需求而生的．child-process顾名思义，就是把node阻塞的工作交给子进程去做．

##### exec,execFile,spawn和fork都是做什么用的?

exec可以用操作系统原生的方式执行各种命令，如管道 cat ab.txt | grep hello; execFile是执行一个文件; spawn是流式和操作系统进行交互; fork是两个node程序(javascript)之间时行交互.

##### 实现一个简单的命令行交互程序?

那就用spawn吧.

代码演示

```
	var cp = require('child_process');

	var child = cp.spawn('echo', ['你好', "钩子"]); // 执行命令
	child.stdout.pipe(process.stdout); // child.stdout是输入流，process.stdout是输出流
	// 这句的意思是将子进程的输出作为当前程序的输入流，然后重定向到当前程序的标准输出，即控制台
```

##### 两个node程序之间怎样交互?

用fork嘛，上面讲过了．原理是子程序用process.on, process.send，父程序里用child.on,child.send进行交互.
代码演示

```
	1) fork-parent.js
	var cp = require('child_process');
	var child = cp.fork('./fork-child.js');
	child.on('message', function(msg){
		console.log('老爸从儿子接受到数据:', msg);
	});
	child.send('我是你爸爸，送关怀来了!');

	2) fork-child.js
	process.on('message', function(msg){
		console.log("儿子从老爸接收到的数据:", msg);
		process.send("我不要关怀，我要银民币！");
	});
```

##### 怎样让一个js文件变得像linux命令一样可执行?

1) 在myCommand.js文件头部加入 #!/usr/bin/env node 2) chmod命令把js文件改为可执行即可 3) 进入文件目录，命令行输入myComand就是相当于node myComand.js了

##### child-process和process的stdin,stdout,stderror是一样的吗?

概念都是一样的，输入，输出，错误，都是流．区别是在父程序眼里，子程序的stdout是输入流，stdin是输出流．

#### 异步

##### node中的异步和同步怎么理解

node是单线程的，异步是通过一次次的循环事件队列来实现的．同步则是说阻塞式的IO,这在高并发环境会是一个很大的性能问题，所以同步一般只在基础框架的启动时使用，用来加载配置文件，初始化程序什么的．

##### 有哪些方法可以进行异步流程的控制?

1) 多层嵌套回调 
1) 为每一个回调写单独的函数，函数里边再回调
1) 用第三方框架比方async, q, promise等

#### 部署

##### 怎样绑定node程序到80端口?

多种方式 

1) sudo 
1) apache/nginx代理
1) 用操作系统的firewall iptables进行端口重定向

#### 性能调优

##### 怎样充分利用多个CPU?

一个CPU运行一个node实例

##### 怎样调节node执行单元的内存大小?

用--max-old-space-size 和 --max-new-space-size 来设置 v8 使用内存的上限

#### 异常调试

##### 有哪些方法可以让node程序遇到错误后自动重启?

1) runit 2) forever 3) nohup npm start &

##### 程序总是崩溃，怎样找出问题在哪里?

1) node --prof 查看哪些函数调用次数多 2) memwatch和heapdump获得内存快照进行对比，查找内存溢出

##### 有哪些常用方法可以防止程序崩溃?

1) try-catch-finally 2) EventEmitter/Stream error事件处理 3) domain统一控制 4) jshint静态检查 5) jasmine/mocha进行单元测试

##### 怎样调试node程序?

node --debug app.js 和node-inspector

##### 如何捕获NodeJS中的错误，有几种方法?

1. 监听错误事件req.on('error', function(){}), 适用EventEmitter存在的情况; 
2. Promise.then.catch(error),适用Promise存在的情况 
3. try-catch,适用async-await和js运行时异常，比如undefined object

### 二.创建进程

通信方式与进程产生方式有关，而Node有4种创建进程的方式：`spawn()`，`exec()`，`execFile()`和`fork()`

#### spawn

```perl
const { spawn } = require('child_process');
const child = spawn('pwd');
// 带参数的形式
// const child = spawn('find', ['.', '-type', 'f']);
```

`spawn()`返回`ChildProcess`实例，`ChildProcess`同样基于事件机制（EventEmitter API），提供了一些事件：

- `exit`：子进程退出时触发，可以得知进程退出状态（`code`和`signal`）
- `disconnect`：父进程调用`child.disconnect()`时触发
- `error`：子进程创建失败，或被`kill`时触发
- `close`：子进程的`stdio`流（标准输入输出流）关闭时触发
- `message`：子进程通过`process.send()`发送消息时触发，父子进程之间可以通过这种*内置的消息机制通信*

可以通过`child.stdin`，`child.stdout`和`child.stderr`访问子进程的`stdio`流，这些流被关闭的时，子进程会触发`close`事件

P.S.`close`与`exit`的区别主要体现在多进程共享同一`stdio`流的场景，某个进程退出了并不意味着`stdio`流被关闭了

在子进程中，`stdout/stderr`具有Readable特性，而`stdin`具有Writable特性，*与主进程的情况正好相反*：

```javascript
child.stdout.on('data', (data) => {
  console.log(`child stdout:\n${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`child stderr:\n${data}`);
});
```

利用进程`stdio`流的管道特性，就可以完成更复杂的事情，例如：

```javascript
const { spawn } = require('child_process');
const find = spawn('find', ['.', '-type', 'f']);
const wc = spawn('wc', ['-l']);
find.stdout.pipe(wc.stdin);
wc.stdout.on('data', (data) => {
  console.log(`Number of files ${data}`);
});
```

作用等价于`find . -type f | wc -l`，递归统计当前目录文件数量

IPC选项

另外，通过`spawn()`方法的`stdio`选项可以建立IPC机制：

```javascript
const { spawn } = require('child_process');
const child = spawn('node', ['./ipc-child.js'], { stdio: [null, null, null, 'ipc'] });
child.on('message', (m) => {
  console.log(m);
});
child.send('Here Here');
// ./ipc-child.js
process.on('message', (m) => {
  process.send(`< ${m}`);
  process.send('> 不要回答x3');
});
```

关于`spawn()`的IPC选项的详细信息，请查看[options.stdio](https://nodejs.org/dist/latest-v8.x/docs/api/child_process.html#child_process_options_stdio)

#### exec

`spawn()`方法默认不会创建shell去执行传入的命令（所以*性能上稍微好一点*），而`exec()`方法会创建一个shell。另外，`exec()`不是基于stream的，而是把传入命令的执行结果暂存到buffer中，再整个传递给回调函数

`exec()`方法的特点是*完全支持shell语法*，可以直接传入任意shell脚本，例如：

```javascript
const { exec } = require('child_process');
exec('find . -type f | wc -l', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`Number of files ${stdout}`);
});
```

但`exec()`方法也因此存在[命令注入](https://blog.liftsecurity.io/2014/08/19/Avoid-Command-Injection-Node.js/)的安全风险，在含有用户输入等动态内容的场景要特别注意。所以，`exec()`方法的适用场景是：希望直接使用shell语法，并且预期输出数据量不大（不存在内存压力）

那么，有没有既支持shell语法，还具有stream IO优势的方式？

有。*两全其美的方式*如下：

```javascript
const { spawn } = require('child_process');
const child = spawn('find . -type f | wc -l', {
  shell: true
});
child.stdout.pipe(process.stdout);
```

开启`spawn()`的`shell`选项，并通过`pipe()`方法把子进程的标准输出简单地接到当前进程的标准输入上，以便看到命令执行结果。实际上还有更容易的方式：

```javascript
const { spawn } = require('child_process');
process.stdout.on('data', (data) => {
  console.log(data);
});
const child = spawn('find . -type f | wc -l', {
  shell: true,
  stdio: 'inherit'
});
```

`stdio: 'inherit'`允许子进程继承当前进程的标准输入输出（共享`stdin`，`stdout`和`stderr`），所以上例能够通过监听当前进程`process.stdout`的`data`事件拿到子进程的输出结果

另外，除了`stdio`和`shell`选项，`spawn()`还支持一些其它选项，如：

```javascript
const child = spawn('find . -type f | wc -l', {
  stdio: 'inherit',
  shell: true,
  // 修改环境变量，默认process.env
  env: { HOME: '/tmp/xxx' },
  // 改变当前工作目录
  cwd: '/tmp',
  // 作为独立进程存在
  detached: true
});
```

*注意*，`env`选项除了以环境变量形式向子进程传递数据外，还可以用来实现沙箱式的环境变量隔离，默认把`process.env`作为子进程的环境变量集，子进程与当前进程一样能够访问所有环境变量，如果像上例中指定自定义对象作为子进程的环境变量集，子进程就无法访问其它环境变量

所以，想要增/删环境变量的话，需要这样做：

```javascript
var spawn_env = JSON.parse(JSON.stringify(process.env));
// remove those env vars
delete spawn_env.ATOM_SHELL_INTERNAL_RUN_AS_NODE;
delete spawn_env.ELECTRON_RUN_AS_NODE;
var sp = spawn(command, ['.'], {cwd: cwd, env: spawn_env});
```

`detached`选项更有意思：

```javascript
const { spawn } = require('child_process');
const child = spawn('node', ['stuff.js'], {
  detached: true,
  stdio: 'ignore'
});
child.unref();
```

以这种方式创建的独立进程行为取决于操作系统，Windows上detached子进程将拥有自己的console窗口，而Linux上该进程会*创建新的process group*（这个特性可以用来管理子进程族，实现类似于[tree-kill](http://www.ayqy.net/blog/nodejs进程间通信/npmjs.com/package/tree-kill)的特性）

`unref()`方法用来断绝关系，这样“父”进程可以独立退出（不会导致子进程跟着退出），但要注意这时子进程的`stdio`也应该独立于“父”进程，否则“父”进程退出后子进程仍会受到影响

#### execFile

```lua
const { execFile } = require('child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

与`exec()`方法类似，但不通过shell来执行（所以性能稍好一点），所以要求传入*可执行文件*。Windows下某些文件无法直接执行，比如`.bat`和`.cmd`，这些文件就不能用`execFile()`来执行，只能借助`exec()`或开启了`shell`选项的`spawn()`

P.S.与`exec()`一样也*不是基于stream的*，同样存在输出数据量风险

xxxSync

`spawn`，`exec`和`execFile`都有对应的同步阻塞版本，一直等到子进程退出

```javascript
const { 
  spawnSync, 
  execSync, 
  execFileSync,
} = require('child_process');
```

同步方法用来简化脚本任务，比如启动流程，其它时候应该避免使用这些方法

#### fork

`fork()`是`spawn()`的变体，用来创建Node进程，最大的特点是父子进程自带通信机制（IPC管道）：

> The child_process.fork() method is a special case of child_process.spawn() used specifically to spawn new Node.js processes. Like child_process.spawn(), a ChildProcess object is returned. The returned ChildProcess will have an additional communication channel built-in that allows messages to be passed back and forth between the parent and child. See subprocess.send() for details.

例如：

```javascript
var n = child_process.fork('./child.js');
n.on('message', function(m) {
  console.log('PARENT got message:', m);
});
n.send({ hello: 'world' });
// ./child.js
process.on('message', function(m) {
  console.log('CHILD got message:', m);
});
process.send({ foo: 'bar' });
```

因为`fork()`自带通信机制的优势，尤其适合用来拆分耗时逻辑，例如：

```javascript
const http = require('http');
const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  };
  return sum;
};
const server = http.createServer();
server.on('request', (req, res) => {
  if (req.url === '/compute') {
    const sum = longComputation();
    return res.end(`Sum is ${sum}`);
  } else {
    res.end('Ok')
  }
});
server.listen(3000);
```

这样做的致命问题是一旦有人访问`/compute`，后续请求都无法及时处理，因为事件循环还被`longComputation`阻塞着，直到耗时计算结束才能恢复服务能力

为了避免耗时操作阻塞主进程的事件循环，可以把`longComputation()`拆分到子进程中：

```javascript
// compute.js
const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  };
  return sum;
};
// 开关，收到消息才开始做
process.on('message', (msg) => {
  const sum = longComputation();
  process.send(sum);
});
```

主进程开启子进程执行`longComputation`：

```javascript
const http = require('http');
const { fork } = require('child_process');
const server = http.createServer();
server.on('request', (req, res) => {
  if (req.url === '/compute') {
    const compute = fork('compute.js');
    compute.send('start');
    compute.on('message', sum => {
      res.end(`Sum is ${sum}`);
    });
  } else {
    res.end('Ok')
  }
});
server.listen(3000);
```

主进程的事件循环不会再被耗时计算阻塞，但进程数量还需要进一步限制，否则资源被进程消耗殆尽时服务能力仍会受到影响

P.S.实际上，`cluster`模块就是对多进程服务能力的封装，*思路与这个简单示例类似*

### 三.通信方式

#### 1.通过stdin/stdout传递json

> stdin/stdout and a JSON payload

最直接的通信方式，拿到子进程的handle后，可以访问其`stdio`流，然后约定一种`message`格式开始愉快地通信：

```javascript
const { spawn } = require('child_process');
child = spawn('node', ['./stdio-child.js']);
child.stdout.setEncoding('utf8');
// 父进程-发
child.stdin.write(JSON.stringify({
  type: 'handshake',
  payload: '你好吖'
}));
// 父进程-收
child.stdout.on('data', function (chunk) {
  let data = chunk.toString();
  let message = JSON.parse(data);
  console.log(`${message.type} ${message.payload}`);
});
```

子进程与之类似：

```javascript
// ./stdio-child.js
// 子进程-收
process.stdin.on('data', (chunk) => {
  let data = chunk.toString();
  let message = JSON.parse(data);
  switch (message.type) {
    case 'handshake':
      // 子进程-发
      process.stdout.write(JSON.stringify({
        type: 'message',
        payload: message.payload + ' : hoho'
      }));
      break;
    default:
      break;
  }
});
```

P.S.VS Code进程间通信就采用了这种方式，具体见[access electron API from vscode extension](https://github.com/Microsoft/vscode/issues/3011#issuecomment-196305696)

明显的*限制*是需要拿到“子”进程的handle，两个完全独立的进程之间无法通过这种方式来通信（比如跨应用，甚至跨机器的场景）

P.S.关于stream及pipe的详细信息，请查看[Node中的流](http://www.ayqy.net/blog/node-stream/)

#### 2.原生IPC支持

如`spawn()`及`fork()`的例子，进程之间可以借助内置的IPC机制通信

父进程：

- `process.on('message')`收
- `child.send()`发

子进程：

- `process.on('message')`收
- `process.send()`发

限制同上，同样要有一方能够拿到另一方的handle才行

#### 3.sockets

借助网络来完成进程间通信，*不仅能跨进程，还能跨机器*

[node-ipc](https://www.npmjs.com/package/node-ipc)就采用这种方案，例如：

```lua
// server
const ipc=require('../../../node-ipc');
ipc.config.id = 'world';
ipc.config.retry= 1500;
ipc.config.maxConnections=1;
ipc.serveNet(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
                ipc.log('got a message : ', data);
                ipc.server.emit(
                    socket,
                    'message',
                    data+' world!'
                );
            }
        );
        ipc.server.on(
            'socket.disconnected',
            function(data,socket){
                console.log('DISCONNECTED\n\n',arguments);
            }
        );
    }
);
ipc.server.on(
    'error',
    function(err){
        ipc.log('Got an ERROR!',err);
    }
);
ipc.server.start();
// client
const ipc=require('node-ipc');
ipc.config.id = 'hello';
ipc.config.retry= 1500;
ipc.connectToNet(
    'world',
    function(){
        ipc.of.world.on(
            'connect',
            function(){
                ipc.log('## connected to world ##', ipc.config.delay);
                ipc.of.world.emit(
                    'message',
                    'hello'
                );
            }
        );
        ipc.of.world.on(
            'disconnect',
            function(){
                ipc.log('disconnected from world');
            }
        );
        ipc.of.world.on(
            'message',
            function(data){
                ipc.log('got a message from world : ', data);
            }
        );
    }
);
```

P.S.更多示例见[RIAEvangelist/node-ipc](https://github.com/RIAEvangelist/node-ipc/tree/master/example)

当然，单机场景下通过网络来完成进程间通信有些浪费性能，但网络通信的*优势*在于跨环境的兼容性与更进一步的RPC场景

#### 4.message queue

父子进程都通过外部消息机制来通信，跨进程的能力取决于MQ支持

即进程间不直接通信，而是通过中间层（MQ），*加一个控制层*就能获得更多灵活性和优势：

- 稳定性：消息机制提供了强大的稳定性保证，比如确认送达（消息回执ACK），失败重发/防止多发等等
- 优先级控制：允许调整消息响应次序
- 离线能力：消息可以被缓存
- 事务性消息处理：把关联消息组合成事务，保证其送达顺序及完整性

P.S.不好实现？包一层能解决吗，不行就包两层……

比较受欢迎的有[smrchy/rsmq](https://github.com/smrchy/rsmq)，例如：

```javascript
// init
RedisSMQ = require("rsmq");
rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );
// create queue
rsmq.createQueue({qname:"myqueue"}, function (err, resp) {
    if (resp===1) {
      console.log("queue created")
    }
});
// send message
rsmq.sendMessage({qname:"myqueue", message:"Hello World"}, function (err, resp) {
  if (resp) {
    console.log("Message sent. ID:", resp);
  }
});
// receive message
rsmq.receiveMessage({qname:"myqueue"}, function (err, resp) {
  if (resp.id) {
    console.log("Message received.", resp)  
  }
  else {
    console.log("No messages for me...")
  }
});
```

会起一个Redis server，基本原理如下：

> Using a shared Redis server multiple Node.js processes can send / receive messages.

消息的收/发/缓存/持久化依靠Redis提供的能力，在此基础上实现完整的队列机制

#### 5.Redis

基本思路与message queue类似：

> Use Redis as a message bus/broker.

Redis自带[Pub/Sub机制](https://redis.io/topics/pubsub)（即发布-订阅模式），适用于简单的通信场景，比如一对一或一对多并且*不关注消息可靠性*的场景

另外，Redis有list结构，可以用作消息队列，以此提高消息可靠性。一般做法是生产者[LPUSH](https://redis.io/commands/lpush)消息，消费者[BRPOP](https://redis.io/commands/brpop)消息。适用于要求消息可靠性的简单通信场景，但缺点是消息不具状态，且没有ACK机制，无法满足复杂的通信需求

P.S.Redis的Pub/Sub示例见[What’s the most efficient node.js inter-process communication library/method?](https://stackoverflow.com/questions/6463945/whats-the-most-efficient-node-js-inter-process-communication-library-method)

### 四.总结

Node进程间通信有4种方式：

- 通过stdin/stdout传递json：最直接的方式，适用于能够拿到“子”进程handle的场景，适用于关联进程之间通信，无法跨机器
- Node原生IPC支持：最native（地道？）的方式，比上一种“正规”一些，具有同样的局限性
- 通过sockets：最通用的方式，有良好的跨环境能力，但存在网络的性能损耗
- 借助message queue：最强大的方式，既然要通信，场景还复杂，不妨扩展出一层消息中间件，漂亮地解决各种通信问题

## node事件循环和浏览器事件循环的区别？

### 浏览器中的 Event Loop

#### 1.Micro-Task 与 Macro-Task

浏览器端事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。**宏任务队列可以有多个，微任务队列只有一个**。

- 常见的 macro-task 比如：setTimeout、setInterval、script（整体代码）、 I/O 操作、UI 渲染等。
- 常见的 micro-task 比如: new Promise().then(回调)、MutationObserver(html5新特性) 等。

#### 2.Event Loop 过程解析

一个完整的 Event Loop 过程，可以概括为以下阶段：



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/10/1683863633586974~tplv-t2oaga2asx-watermark.awebp)



- 一开始执行栈空,我们可以把**执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则**。micro 队列空，macro 队列里有且只有一个 script 脚本（整体代码）。
- 全局上下文（script 标签）被推入执行栈，同步代码执行。在执行的过程中，会判断是同步任务还是异步任务，通过对一些接口的调用，可以产生新的 macro-task 与 micro-task，它们会分别被推入各自的任务队列里。同步代码执行完了，script 脚本会被移出 macro 队列，这个过程本质上是队列的 macro-task 的执行和出队的过程。
- 上一步我们出队的是一个 macro-task，这一步我们处理的是 micro-task。但需要注意的是：当 macro-task 出队时，任务是**一个一个**执行的；而 micro-task 出队时，任务是**一队一队**执行的。因此，我们处理 micro 队列这一步，会逐个执行队列中的任务并把它出队，直到队列被清空。
- **执行渲染操作，更新界面**
- 检查是否存在 Web worker 任务，如果有，则对其进行处理
- 上述过程循环往复，直到两个队列都清空

我们总结一下，每一次循环都是一个这样的过程：



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/10/1683877ba9aab056~tplv-t2oaga2asx-watermark.awebp)



**当某个宏任务执行完后,会查看是否有微任务队列。如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务，执行宏任务的过程中，遇到微任务，依次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推。**

接下来我们看道例子来介绍上面流程：

```
Promise.resolve().then(()=>{
  console.log('Promise1')  
  setTimeout(()=>{
    console.log('setTimeout2')
  },0)
})
setTimeout(()=>{
  console.log('setTimeout1')
  Promise.resolve().then(()=>{
    console.log('Promise2')    
  })
},0)
```

最后输出结果是Promise1，setTimeout1，Promise2，setTimeout2

- 一开始执行栈的同步任务（这属于宏任务）执行完毕，会去查看是否有微任务队列，上题中存在(有且只有一个)，然后执行微任务队列中的所有任务输出Promise1，同时会生成一个宏任务 setTimeout2
- 然后去查看宏任务队列，宏任务 setTimeout1 在 setTimeout2 之前，先执行宏任务 setTimeout1，输出 setTimeout1
- 在执行宏任务setTimeout1时会生成微任务Promise2 ，放入微任务队列中，接着先去清空微任务队列中的所有任务，输出 Promise2
- 清空完微任务队列中的所有任务后，就又会去宏任务队列取一个，这回执行的是 setTimeout2

### Node 中的 Event Loop

#### 1.Node简介

Node 中的 Event Loop 和浏览器中的是完全不相同的东西。Node.js采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现（下文会详细介绍）。



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/11/1683d81674f076eb~tplv-t2oaga2asx-watermark.awebp)

Node.js的运行机制如下:



- V8引擎解析JavaScript脚本。
- 解析后的代码，调用Node API。
- libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。
- V8引擎再将结果返回给用户。

#### 2.六个阶段

其中libuv引擎中的事件循环分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841bd9860c1ee9~tplv-t2oaga2asx-watermark.awebp)



从上图中，大致看出node中的事件循环的顺序：

外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段（按照该顺序反复运行）...

- timers 阶段：这个阶段执行timer（setTimeout、setInterval）的回调
- I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
- idle, prepare 阶段：仅node内部使用
- poll 阶段：获取新的I/O事件, 适当的条件下node将阻塞在这里
- check 阶段：执行 setImmediate() 的回调
- close callbacks 阶段：执行 socket 的 close 事件回调

注意：**上面六个阶段都不包括 process.nextTick()**(下文会介绍)

接下去我们详细介绍`timers`、`poll`、`check`这3个阶段，因为日常开发中的绝大部分异步任务都是在这3个阶段处理的。

##### (1) timer

timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。 同样，**在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行**。

##### (2) poll

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

1.回到 timer 阶段执行回调

2.执行 I/O 回调

并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生
  - 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
  - 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去

当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

##### (3) check阶段

setImmediate()的回调会被加入check队列中，从event loop的阶段图可以知道，check阶段的执行顺序在poll阶段之后。 我们先来看个例子:

```
console.log('start')
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)
Promise.resolve().then(function() {
  console.log('promise3')
})
console.log('end')
//start=>end=>promise3=>timer1=>timer2=>promise1=>promise2

```

- 一开始执行栈的同步任务（这属于宏任务）执行完毕后（依次打印出start end，并将2个timer依次放入timer队列）,会先去执行微任务（**这点跟浏览器端的一样**），所以打印出promise3
- 然后进入timers阶段，执行timer1的回调函数，打印timer1，并将promise.then回调放入microtask队列，同样的步骤执行timer2，打印timer2；这点跟浏览器端相差比较大，**timers阶段有几个setTimeout/setInterval都会依次执行**，并不像浏览器端，每执行一个宏任务后就去执行一个微任务（关于Node与浏览器的 Event Loop 差异，下文还会详细介绍）。

#### 3.Micro-Task 与 Macro-Task

Node端事件循环中的异步队列也是这两种：macro（宏任务）队列和 micro（微任务）队列。

- 常见的 macro-task 比如：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作等。
- 常见的 micro-task 比如: process.nextTick、new Promise().then(回调)等。

#### 4.注意点

##### (1) setTimeout 和 setImmediate

二者非常相似，区别主要在于调用时机不同。

- setImmediate 设计在poll阶段完成时执行，即check阶段；
- setTimeout 设计在poll阶段为空闲时，且设定时间到达后执行，但它在timer阶段执行

```
setTimeout(function timeout () {
  console.log('timeout');
},0);
setImmediate(function immediate () {
  console.log('immediate');
});
```

- 对于以上代码来说，setTimeout 可能执行在前，也可能执行在后。
- 首先 setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的 进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
- 如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了

但当二者在异步i/o callback内部调用时，总是先执行setImmediate，再执行setTimeout

```
const fs = require('fs')
fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0)
    setImmediate(() => {
        console.log('immediate')
    })
})
// immediate
// timeout
复制代码
```

在上述代码中，setImmediate 永远先执行。因为两个代码写在 IO 回调中，IO 回调是在 poll 阶段执行，当回调执行完毕后队列为空，发现存在 setImmediate 回调，所以就直接跳转到 check 阶段去执行回调了。

#### (2) process.nextTick

这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行。

```
setTimeout(() => {
 console.log('timer1')
 Promise.resolve().then(function() {
   console.log('promise1')
 })
}, 0)
process.nextTick(() => {
 console.log('nextTick')
 process.nextTick(() => {
   console.log('nextTick')
   process.nextTick(() => {
     console.log('nextTick')
     process.nextTick(() => {
       console.log('nextTick')
     })
   })
 })
})
// nextTick=>nextTick=>nextTick=>nextTick=>timer1=>promise1
复制代码
```

### Node与浏览器的 Event Loop 差异

**浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。而在Node.js中，microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务**。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841bad1cda741f~tplv-t2oaga2asx-watermark.awebp)



接下我们通过一个例子来说明两者区别：

```
setTimeout(()=>{
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)
setTimeout(()=>{
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
```

浏览器端运行结果：`timer1=>promise1=>timer2=>promise2`

浏览器端的处理过程如下：



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841d6392e8f537~tplv-t2oaga2asx-watermark.awebp)



Node端运行结果分两种情况：

- 如果是node11版本一旦执行一个阶段里的一个宏任务(setTimeout,setInterval和setImmediate)就立刻执行微任务队列，这就跟浏览器端运行一致，最后的结果为`timer1=>promise1=>timer2=>promise2`
- 如果是node10及其之前版本：要看第一个定时器执行完，第二个定时器是否在完成队列中。
  - 如果是第二个定时器还未在完成队列中，最后的结果为`timer1=>promise1=>timer2=>promise2`
  - 如果是第二个定时器已经在完成队列中，则最后的结果为`timer1=>timer2=>promise1=>promise2`(下文过程解释基于这种情况下)

1.全局脚本（main()）执行，将2个timer依次放入timer队列，main()执行完毕，调用栈空闲，任务队列开始执行；

2.首先进入timers阶段，执行timer1的回调函数，打印timer1，并将promise1.then回调放入microtask队列，同样的步骤执行timer2，打印timer2；

3.至此，timer阶段执行结束，event loop进入下一个阶段之前，执行microtask队列的所有任务，依次打印promise1、promise2

Node端的处理过程如下：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841d5f85468047~tplv-t2oaga2asx-watermark.awebp)



### 总结

浏览器和Node 环境下，microtask 任务队列的执行时机不同

- Node端，microtask 在事件循环的各个阶段之间执行
- 浏览器端，microtask 在事件循环的 macrotask 执行完之后执行

## Node.js为什么要异步I/O

### 用户体验

早期浏览器中Javascript是单线程执行，并且与UI渲染共用一个线程，这意味着Javascript执行时，UI渲染和响应都处于停滞状态。

在B/S模型中，网络限速也会给网页的实时体验造成很大麻烦。如果网页需要获取一个网络资源，通过同步的方式获取，那么Javascript就需要等待资源从服务器端获取后才能继续执行，这期间UI将停顿，不响应交互行为。如果采用异步请求，那么在下载资源的同时，Javascript和UI的执行都不会处于等待状态，可以继续响应用户交互行为。

### 资源分配

从资源分配的层面来进一步分析异步I/O的必要性。我们知道计算机发展过程中将组建进行了抽象，分为I/O设备和计算机设备。

现有业务的任务执行顺序主要有两种：
1.单线程串行依次执行。
2.多线程并行完成 。

如果创建多线程的开销小于并行执行，那么多线程的方式是首选。多线程的代价在于创建线程和执行线程上下文切换的开销比较大。另外在多线程编程中面临锁，状态同步等问题，这是多线程诟病的主要原因。

在计算机资源中，通常I/O与CPU计算机之间是可以并行进行的。但同步的编程模型导致的问题是，I/O的进行会让后续任务等待，这造成资源不被更好地利用。

操作系统会将CPU时间片分配给其余进程，以公平而有效地利用资源，基于这一点，有的服务器为了提升响应能力，会通过启动多个工作进程来为更多的用户服务。

异步I/O可以算作Node的特色，因为它是首个大规模将异步I/O应用在应用层上的平台，它力求在单线程上将资源分配得更高效。

## node如何充分利用CPU

### cluster模块实现多进程nodejs应用

```
const express = require("express")
const cluster = require("cluster")
const fs = require("fs")
const os = require("os")

if (cluster.isMaster) {
    console.log("master" + process.pid + "正在运行")
    const cpus = os.cpus().length
    for (let i = 0; i < cpus; i++) {
        cluster.fork()
    }
    cluster.on("exit", (worker, code, signal) => {
        console.log("工作进程" + worker.process.pid + "已退出")
    })
} else {
    const app = express()
    const pid = process.pid
    app.listen(3000, () => {
        console.log(`工作进程${cluster.worker.process.pid} is runing`)
    })

    app.get("/test", function (req, res, next) {
        console.log(`${cluster.worker.process.pid}`)
        fs.readFile('./package-lock.json', (err, data) => {
            res.send(data)
        })
    })
}
```

运行程序并且记录到server.log可以看到

```css
node with-cluster.js > server.log
```

```dart
> fork@1.0.0 start /Users/xxxxx/node-fork
> node with-cluster

master23470正在运行
工作进程23472 is runing
工作进程23473 is runing
工作进程23476 is runing
工作进程23471 is runing
工作进程23474 is runing
工作进程23475 is runing
工作进程23478 is runing
工作进程23477 is runing
```

## pm2

PM2是node进程管理工具，可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单。

## node中的require是怎么实现的？包括模块的寻找和缓存？

### node模块分类

node模块有下面几种:

  1.系统模块(核心模块):由nodejs自带提供,可以是用js或者C++编写的,已经经过编译的模块.
  2.文件模块(用户模块):由用户编写的.

  核心模块在源代码中已经编译了,以二进制文件存在,模块引入时可以直接加到内存,文件定位和编译都省略掉,并在路径分析中优先,所以速度是最快的.

  文件莫模块运行的时候动态加载,需要经过*路径分析和文件定位*,编译,速度一般比核心模块慢.

### require 方法:

#### 1.require作用:

  require方法是nodejs提供的用于引用模块的方法.例如我们需要引入文件模块,则使用下面代码

> varmod = require('module_name')

  此句执行后，Node内部会载入内置模块或通过NPM安装的模块。require函数会返回一个对象，该对象公开的API可能是函数，对象，或者属性如函数，数组，甚至任意类型的JS对象。

#### 2.后缀:

require 默认接受以下后缀:

1 .js 文件 node会通过fs模块同步方式读取文件内容,在文件头尾加入内容,以实现作用域隔离和module.exports,编译并且执行. 其他非node,json,js后缀的统一也当作.js处理.
2.json 文件 node会通过fs模块同步方式读取文件内容,并调用JSON.parse 返回执行JSON.parse后的json对象.
3.node 文件 这是C++编写文件 node会调用dlopen()方法加载编译后生出来的文件.

当文件不带后缀,node会依照 目录 .js .json .node 的顺序进行查找.如果所有模块路径都找不到该文件,则抛出异常.

#### 3. 模块路径(路径分析):

require方法接受下面的引用方式
1.require("模块名"),或者 require('目录/模块名') 不以./开头的相对路径
 如果模块名不是路径，也不是内置模块，Node将试图去当前目录的node_modules文件夹里搜索。如果当前目录的node_modules里没有找到，Node会从父目录的node_modules里搜索，这样递归下去*直到根目录*。如果找不到文件,则会抛出异常

2.require("./模块名")或者 require('./目录/模块名') , 以 ./开头的相对路径
node会直接加载以node运行的工作目录为基准的该模块.如果模块不存在则抛出异常

3 require("/目录/模块名") 或者 require('F:/目录/模块名') 绝对路径
nodej会直接加载该模块.如果模块不存在则抛出异常.

*在这里值得注意的是,如果是想加载当前目录的模块 必须使用:require("./模块名"),使用require("模块名")是不行的

### 模块缓存

对于已加载的模块Node会缓存下来(核心模块会放在NativeModele._cache上,文件模块放在Module._cache上)，而不必每次都重新搜索和编译执行。多次require的同个模块只会被执行一次,下面是一个示例

//modA.js

> console.log('模块modA开始加载...')
>
> exports =function() {
>
> console.log('Hi')
>
> }
>
> console.log('模块modA加载完毕')

//init.js

> varmod1 = require('./modA')
>
> varmod2 = require('./modA')
>
> console.log(mod1 === mod2)

命令行执行：

> node init.js
>
> 输出如下
>
> $node init.js           
> 模块modA开始加载...     
> 模块modA加载完毕      
> true                    

可以看到虽然require了两次，但modA.js仍然只执行了一次。mod1和mod2是相同的，即两个引用都指向了同一个模块对象。

模块的缓存是基于文件的*绝对**路径相关*为key的数组,这样保证了模块缓存的唯一性,不会因为require中不同的写法导致重复载入.

例如:

> //文件:demon/init.js
> varmod1 = require('../demon/modA') ;
> varmod2 = require('./modA')
> console.log(mod1 === mod2)

我们依旧可以得到相同的结果.

## 开发机上多个版本 node共存怎么实现

[1] 安装指定的 nodejs 版本：nvm install 8.12.0

[2] 查看已经安装的 nodejs 列表：nvm ls

[3] 指定当前使用的 nodejs 版本：nvm use 8.12.0

[4] 查看当前使用的 nodejs 版本：node -v
