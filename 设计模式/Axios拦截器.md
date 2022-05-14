

## Axios拦截器

### 什么是拦截器

拦截器顾名思义就是对请求的拦截，Axios的拦截器有两种，`请求拦截器`和`响应拦截器`，只要为axios实例添加拦截器每个api请求都会执行拦截器。执行顺序: `请求拦截器 -> api请求 -> 响应拦截器`。 使用方式如下

```javascript
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
```

拦截器还可以取消， Axios拦截器提供了eject方法取消拦截函数（eject需要传入`id`做为参数，id是个use函数的返回值）

```javascript
const interceptorId = axios.interceptors.request.use(function () {/*...*/}); 
axios.interceptors.request.eject(interceptorId);
```

### axios拦截器的用途

#### 统计请求耗时

有时候我们需要统计api从发起请求到返回数据需要的时间，这种比较集中的逻辑就适合用拦截器来做了，统一处理如果以后要改也非常容易哈。

```javascript
axios.interceptors.request.use((config) => {
  // api请求开始的时间
  config.metadata = { startTime: new Date() }
  return config;
});
axios.interceptors.response.use((res) => {
  // api请求结束的时间
  res.config.metadata.endTime = new Date()
  const { startTime, endTime } = res.config.metadata
  // 计算请求耗时的时间
  console.log(endTime - startTime)
  return res
});
```

#### 响应拦截器对后端状态码拦截

对响应状态码做拦截，比入后端返回404状态码， 跳转到404页面， 也可以做其他状态码的判断(这里就不列举了)

```javascript
axios.interceptors.response.use((res) => {
  return res
}, err => {
  if (err.response.status === 404) {
    router.replace({
      path: '/404.html'
    })
  }
})
```

### 拦截器的思想

一开始很多小伙伴(我自己🐶)会被拦截器这个高大上的名词虎住，以为高大上的名词背后的原理高深莫测的。其实不是的，理解拦截器的思想只需要知道简单的数组操作就好了。 现在我们重新理一下, 请求拦截器发生在api请求之前， 响应拦截器发生在api请求之后，仔细思考🤔一下，其实它们`本质上只是一个执行顺序的关系`。 这其实就是一个数组chain能实现的，把请求拦截器的函数推到数组前面， api请求放在中间， 响应拦截器放在数组后面，遍历执行数组chain就实现了拦截器的执行顺序关系，是不是很简单😄。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b3d8f5e7b1a401ca55534f3bf0edd4b~tplv-k3u1fbpfcp-watermark.awebp?)

### 拦截器源码

InterceptorManager构造函数有handlers数组，保存所有的拦截函数， 并且在它的原型上添加三个方法， `use用于添加拦截函数`， 返回一个id， `eject用于取消拦截器`， forEach遍历所有拦截器。

```javascript
// 拦截器构造函数
function InterceptorManager() {
  // 保存拦截器的数组，axios.interceptors.use的拦截函数会被push到handlers，可以添加多个拦截器
  this.handlers = [];
}

// 向拦截器原型上挂载 use方法, 向handler数组中push一个对象, 返回一个id
// 这样就可以通过eject(id) 取消拦截函数了。
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

// 移除拦截器
InterceptorManager.prototype.eject = function eject(id) {
   // 通过id可以查找对应的拦截器，进行移除
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

// 遍历执行所有拦截器
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
```

请求拦截器和响应拦截器都是使用new InterceptorManager实现

```javascript
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  // 请求拦截器和响应拦截器使用的都是 InterceptorManager构造函数
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
```

`任务编排`, 重点来了(`敲黑板`), 通过 把requestInterceptorChain放在 chain数组的前面，responseInterceptorChain放在chain的后面，然后遍历执行chain（chain数组里的数据是成对出现的，一个是拦截器成功和拦截失败的函数，[dispatchRequest, undefined]中的undefined只起一个`占位`的作用 ）。 达到 请求拦截器 -> api请求 -> 响应拦截器 执行顺序的目的。

```javascript
...
// dispatchRequest是api请求
var chain = [dispatchRequest, undefined];
// 把请求拦截器数组requestInterceptorChain 放在 chain 数组的前面
Array.prototype.unshift.apply(chain, requestInterceptorChain);

// 把响应拦截器responseInterceptorChain 放在chain数组的后面
chain = chain.concat(responseInterceptorChain);

promise = Promise.resolve(config);
// 遍历执行chain函数
while (chain.length) {
  promise = promise.then(chain.shift(), chain.shift());
}
...
```

