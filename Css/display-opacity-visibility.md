---
title: display，opacity，visibility三者之间的区别
date: 2021-02-16 00:50:07
tags: CSS
---

这三个方法可以使使指定元素在视野里无法可见。

```
display: none;
opacity: 0;
visibility: hidden;
```

### display: none; 该方法会改变页面布局。

1.元素彻底消失，脱离文档流。

2.子元素跟随父元素被隐藏，并且无法单独显示。

3.绑定的时间也无法触发。

4.无论如何，DOM节点还是存在的，仍旧可以用js操作。

### opacity: 0;该方法不会改变页面布局。

1.是指上是元素的透明度为0。

2.子元素opacity: 1 是无效的，元素依旧无法显示。

3.绑定的的时间仍然可以触发。

### visibility:hidden；该方法不会改变页面的布局

1.使元素不可见

2.子元素设置visibility: visible; 后，子元素会显示，但是父元素不会显示。

3.绑定的事件不可触发。