## 1.带背景音乐的网页

```
<embed src="yinyue.mid" width="300" height="200" autostart=true controls="middleconsole">
```

## 2.设置每隔一定的时间自动刷新网页

```
<meta http-equiv="refresh" content="10"; url=http://自己的url">
```

## 3.提高站点在搜索引擎中被搜索到的机会

设置title

## 4.让站点自动跳转到另一页

```
<meta http-equiv="refresh" content="5"; url=http://www.gluu5.com/index.htm">
content中的5为停留的秒数，url为跳转的页面
```

## 5.跳转回页面顶部

```
<a href="#top">返回顶部</a>
```

## 6.让浏览器正确显示Word格式文件

```
<meta http-equiv="content-type" content="application/msword">
```

## 7.利用水平线制作垂直线

```
<hr size="1">
```

水平线

```
<hr size="200" width="1">
```

垂直线

## 8.去除页面四周的空白

在body里面加入代码leftmargin="0" topmargin="0"。为了适应浏览器，最好再加上代码marginheight=“0” marginwidth=“0”。

## 9.去除浏览器的滚动条

```
去除浏览器滚动条<body scroll=no>
去除水平滚动条<body style="overflow-x:hidden">
去除垂直滚动条<body style="overflow-y:hidden">
```