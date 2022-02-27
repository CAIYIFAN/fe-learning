---
title: 移动端适配方案的粗浅整理～
date: 2021-02-15 22:06:26
tags: 自适应
---

初次上手移动端项目，那么逃不掉的一个问题，必然是移动端适配的问题。

### 自适应基本概念

- **px**：像素，是屏幕上显示数据的最基本的点，表示相对大小。不同分辨率下相同长度的px元素也会受物理像素的影响，显示可能会不一样。同时，值得注意的点：在chrome、甚至一些移动设备有最小字号的限制，一般为12px。
- **pt**：是一种固定长度的度量单位，等于1/72英寸（未使用过）。
- **css像素**:在不同屏幕上，css像素呈现的物理尺寸一致，但css像素对应的物理像素具数不同。标准的显示密度下，1个css像素对应一个物理像素，缩放时，1个css像素对应的物理像素会减增。css像素称为设备独立像素(device independent pixels: DIPs)。
- **PPI** (pixel per inch):像素密度，每英寸所拥有的像素数。值越高，屏幕越细腻。
- **DPI**(dot per inch):打印设备每英寸印刷出来的点有多少个，值越高，图片越细腻。
- **DPR** 设备物理像素和设备独立像素比，在js中通过`window.devicePixelRatio`获取，而css中则通过`-webkit-device-pixel-ratio`,`-webkit-min-device-pixel-ratio`,`-webkit-max-device-pixel-ratio`进行媒体查询
- **em** 相对父元素的font-size。
- **rem** 相对长度单位，相对于根元素font-size计算值的倍数。
- **视口**：viewport 属性值提供有关视口初始大小的信息。PC端视口指的是浏览器可视区域，宽度与浏览器窗口保持一致。移动端涉及布局视口（Layout Viewport）、视觉视口（Visual ViewPort）和理想视口（Ideal ViewPort）。
- **vw**(viewport width) 视窗宽度，1vw = 视窗宽度的1%。
- **vh**(viewport height) 视窗高度，1vh = 视窗高度的1%。



在正式进入移动端适配前，遇到body适应屏幕高度的问题

#### 让body适应屏幕高度

在实现这一目标的过程中，主要存在3个情况：

1. 只给div设置高度，页面高度100%无效
2. 只给body设置高度100%仍然无效
3. 同时给html与body设置100% 才有效

​	为了让后面的div中的百分比都生效，因此一开始最好就把html,body{height:100%}写上去。



那么接下去着重介绍移动端适配方案：

#### web移动前端自适应适配布局解决方案

##### 1.设置meta

<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />

其中各属性的介绍如下，

width=device-width 屏幕宽度；

initial-scale=1 原始缩放比例为1，即100%铺满；

minimum-scale=1 最小缩放比例为1；

maximum-scale=1 最大缩放比例为1；

user-scalable=no 禁止页面缩放；

##### 2.使用rem

看到一篇文章同时讲了网易的移动端适配方案和淘宝的移动端适配方案，[地址](https://cloud.tencent.com/developer/article/1407007)。

##### 3.使用百分比加媒体查询

##### 4.使用flexbox解决方案

##### 5.通过打包插件完成px单位的转换（如转换成vw）

这里介绍一个插件：postcss-px-to-viewport，它可以将px转换成vw

首先通过npm或者yarn进行安装

```
npm install postcss-px-to-viewport
```

然后在进行相关参数的配置

```
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3, //指定'px'需要转换为视窗单位值的小数位数
      viewportUnit:"vw", //指定需要转换为的视窗单位
      selectorBlackList: ['.ignore'], //指定不转换为视窗单位的类，可以自定义，也可无限添加
      minPixelValue:1,//小于或等于'1px'不转换为视窗单位
      mediaQuery: false//允许在媒体查询中转换'px'
    }
  }
}
```



除此之外，学习过程中我还发现了图片自适应方面的例子：

我们可以通过img的srcset属性与sizes属性进行不同尺寸图片的分辨率切换，以及相同尺寸的分辨率切换。

也可以通过picture标签实现图片方面的自适应：

```
<picture>
	<source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg">
	<source media="(min-width: 800px)" srcset="elva-800w.jpg">
	<img src="elva-800w.jpg" alt="Chris standing up holding gus daughter Elva">
</picture>
```
