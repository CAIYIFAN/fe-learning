## 1.去除网页超链接的下划线

```
<style>
a {text-docoration:none}
a:hover {color: #3366CC;text-decoration:underline}
</style>
```

## 2.设置浮动背景

```
<style type="text/css">
	body { background-image:url(image/bg.gif); background-attachment:fixed}
</style>
```

## 3.正确对齐文本

```
<style>
	.dq { margin-left: 68px; margin-right: 70px; margin-top:69px; margin-bottom: 71px}
</style>
```

## 4.超链接访问过后放置hover样式出现问题

超链接访问过后防止hover样式出现问题，可以在head中相应的位置输入

```
<style type="text/css">
	a:link {
		color:red
	}
	a:hover {
		color:blue
	}
	a:visited {
		color:green
	}
	a:active{
		color:orange
	}
</style>
```

## 5.解决list-style-image无法准确定位的问题

可以在head中相应的位置输入

```
<style type="text/css">
	li {
		list-style:url ("http://gluu5.163.com//E/11/ 6.gif");
	}
	li a {
		position:relative;
		top:-5px;
		font:12px/25px宋体;
	}
</style>
```

解决的方法一般是用li的背景模拟，这里采用相对定位的方法也能够解决。

## 6.文本垂直居中

```
<style type="text/css">
	Div {
		height:50px;
		line-height:50px;
	}
</style>
```

## 7.border-width

#### 例子 1

```
border-width:thin medium thick 10px;
```

- 上边框是细边框
- 右边框是中等边框
- 下边框是粗边框
- 左边框是 10px 宽的边框

#### 例子 2

```
border-width:thin medium thick;
```

- 上边框是 10px
- 右边框和左边框是中等边框
- 下边框是粗边框

#### 例子 3

```
border-width:thin medium;
```

- 上边框和下边框是细边框
- 右边框和左边框是中等边框

#### 例子 4

```
border-width:thin;
```

- 所有 4 个边框都是细边框

## 8.利用CSS去掉下划线

```
<style>
	a { text-decoration: none}
</style>
```

## 9.设置滚动条颜色

```
<style type="text/css">
	html {
		scrollbar-face-color:#f6f6f6;
		scrollbar-highlight-color:#fff000;
		scrollbar-shadow-color:#ee00ee;
		scrollbar-3dlight-color:#ee222e;
		scrollbar-arrow-color:#ccc000;
		scrollbar-track-color:#ddeecc;
		scrollbar-darkshadow-color:#fffddd;
	}
</style>
```

