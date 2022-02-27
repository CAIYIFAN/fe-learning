# fe-learning
# my-problems

记录问题

小数四舍五入至整数


```javascript
function toSmallRounding(nums) {
  return Math.round(nums.toFixed(1))
}
```

倒计时切换至后台后会被暂停的问题：

由于倒计时是基于requestAnimationFrame进行开发的，而在大多数浏览器里，当requestAnimationFrame() 运行在后台标签页或者隐藏的<iframe> 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命，所以会导致该问题。

可以采用监听页面可见性来刷新倒计时解决该问题

```javascript
// 应用demo
// startSimulation 和 pauseSimulation 在其他地方定义
function handleVisibilityChange() {
  if (document.hidden) {
    pauseSimulation();
  } else  {
    startSimulation();
  }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);
```

相关API

[`Document.hidden`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/hidden) 只读

如果页面处于被认为是对用户隐藏状态时返回true，否则返回false。

[`Document.visibilityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/visibilityState) 只读

是一个用来展示文档当前的可见性的[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 。该属性的值为以下值之一：

- `visible` : 页面内容至少是部分可见。 在实际中，这意味着页面是非最小化窗口的前景选项卡。
- `hidden` : 页面内容对用户不可见。 在实际中，这意味着文档可以是一个后台标签，或是最小化窗口的一部分，或是在操作系统锁屏激活的状态下。
- `prerender` : 页面内容正在被预渲染且对用户是不可见的(被document.hidden当做隐藏). 文档可能初始状态为prerender，但绝不会从其它值转为该值。>
- 注释：有的浏览器不支持此功能`unloaded` : 页面正在从内存中卸载。
- 注释：有的浏览器不支持此功能

[`Document.onvisibilitychange`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/onvisibilitychange)

[`EventListener`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventListener) 提供在`visibilitychange (en-US)` 事件被触发时要调用的代码。



1.边界值问题

​	使用text-overflow,如果要使这个属性生效必须使元素有宽度。

```css
*{
	text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
```

2.布局问题

​	absolute、fixed

​	flex

可以考虑少使用div，多使用类似ul、li的元素。

设计的原则是：能够让元素在正常的文档流下布局则不适用absolute，如果必要使用absolute则必须要注意子绝父相的道理。

3.禁止双击放大

```javascript
<meta name="viewport" content="width=device-width,inital-scale=1.0,maximum-scale=1.0,user-scale=0">

window.onload=function() {
  document.addEventListener('touchstart',function (event){
    if(event.touches.length>1){
      event.preventDefault();
    }
  });
  var lastTouchEnd = 0;
  document.addEventListener('touchend',function (event){
    var now = (new Date()).getTime();
    if(now -lastTouchEnd <= 300){
      event.preventDefault();
    }
    lastTouchEnd = now;
  },false);
  document.addEventListener('gesturestart',function (event){
    event.preventDefault();
  });
}
```

4.CSS overscroll-behavior让滚动嵌套时父滚动不触发、scroll-behavior用于滚动平滑、scroll snap用于滚动定位加上文本的滚动边界。

在模板字符串中，空格、缩进、换行都会被保留

  
1.接口返回，统一结构

2.try-catch融入

3.sql本身字段
