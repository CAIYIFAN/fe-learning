---
title: html5中新增的属性
date: 2021-02-16 01:03:23
tags: HTML
---

###  H5中的新特性

1.新的语义元素，例如<header>,<footer>,<article>,<section>

2.新的表单控件，比如数字、日期、时间、日历和滑块

3.强大的图像支持（借由<canvas>和<svg>）

4.强大的多媒体支持（借由<video>和<audio>）

5.强大的API，比如用本地存储取代cookie

6.data---自定义属性

7.hidden属性

8.spellcheck语法检查

9.translate可翻译

### H5中新的语义/结构元素

```
<article> 定义文档内的文章
<aside> 定义页面内容之外的内容
<bdi> 定义与其他文本不同的文本方向
<details> 定义用户可查看或隐藏的额外细节
<dialog> 定义对话框或窗口
<figcaption> 定义<figure>元素的标题
<figure> 定义自包含内容，比如图示、图表、照片、代码清单等等。
<footer> 定义文档或节的页脚
<header> 定义文档或节的页眉
<main> 定义文档的主内容
<mark> 定义重要或强调的内容
<menuitem> 定义用户能够从弹出菜单调用的命令/菜单栏项目
<meter> 定义已知范围内的标量测量
<nav> 定义文档内的导航链接
<progress> 定义任务进度
<rp> 定义在不支持ruby注释的浏览器中显示什么
<rt> 定义关于字符的解释/发音
<ruby> 定义ruby注释
<section> 定义文档中的节
<summary> 定义<details>元素的可见标题
<time> 定义日期/时间
<wbr> 定义可能的折行（line-break）
```

### 新的表单元素

```
<datalist> 定义输入控件的预定义选项
<keygen> 定义键对生成器字段（用于表单）
<output> 定义计算结果
```

### HTML5中新增的输入类型

```
1.color
2.date
3.datetime
4.datetime-local
5.email
6.month
7.number
8.range
9.search
10.tel
11.time
12.url
13.week
```

### 输入限制

```
disabled ：规定输入字段应该被禁用
max ： 规定输入字段的最大值
maxlength ： 规定输入字段的最大字符数
min ： 规定输入字段的最小值
pattern ： 规定通过检查输入值的正则表达式
readonly ： 规定输入字段为只读（无法修改）
required ： 规定输入字段是必需的（必需填写）
size ： 规定输入字段的宽度（以字符计）
step ： 规定输入字段的合法数字间隔
value ： 规定输入字段的默认值
```

### HTML5中input新增属性

```
autocomplete ：规定表单或输入字段是否应该自动完成
autofocus ：当页面加载<input>元素时，应该自动获取元素
form : form属性规定<input>元素所属的一个或多个表单
formaction ：规定当提交表单时处理该输入控件的文件的URL，该属性覆盖<form>元素的action属性
formenctype ：规定当把表单数据(form-data)提交至服务器时如何对其进行编码(仅针对 method="post"的表单)，该属性覆盖<form>元素的enctype属性。
formmethod : 定义用以向action URL 发送表单数据（form-data）的HTTP方法。该属性覆盖<form>元素的method属性。
formnovalidate ：如果设置，则规定在提交表单时不对<input>元素进行验证。该属性覆盖<form>元素的novalidate属性。
formtarget：规定的名称或关键词指示提交表单后在何处显示接收到的响应。该属性覆盖<form>元素的target属性。
height 和 width
list ：该属性引用的<datalist>元素中包含了<input>元素的预定义选项。	
min 和 max
multiple：如果设置，则规定允许用户在<input>中输入一个以上的值。（适用于email和file）
pattern(regexp)：正则表达式（适用于text、search、url、tel、email、password）
placeholder ： 规定用以描述输入字段预期值的提示（样本值或有关格式的简短描述）
required
step：规定<input>元素的合法数字间隔。
```

### form中增加的属性

```
autocomplete ：规定表单或输入字段是否应该自动完成
novlidate ：规定在提交表单时不对表单数据进行验证
```

### HTML5 Canvas

```
fillStyle:设置图形的填充色
strokeStyle：设置图形轮廓的颜色
globalAlpha全局属性可以设置绘制图形的不透明度（rgba()也可以）
lineWidth：设置线条的粗细，必须取整数，默认为1.0
lineCap：设置线段断点的样式，包含三种样式：butt、round和square，默认值为butt
lineJoin：设置两条线段连接处的样式，包括三种样式：round、bevel、miter，默认值为miter
miterLimit：设置两条线段连接处焦点的的绘制方式
setLineDash()、lineDashOffset属性可以定义虚线样式


创建阴影：
shadowColor：设置阴影颜色
shadowBlur：设置阴影的模糊级别
shadowOffsetX：设置阴影在x轴的偏移距离
shadowOffsetY：设置阴影在y轴的偏移距离

fill()填充规则：
nonzero:非零环绕数规则，为默认值
evenodd:奇偶规则

<canvas id="myCanvas" width="200" height="100"></canvas>


<script type="text/javascript">
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
cxt.fillStyle = "#FF0000";
cxt.fillRect(0,0,150,75);//绘制矩形
</script>


<script type="text/javascript">
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
cxt.moveTo(10,10);
cxt.lineTo(150,50);
cxt.lineTo(10,50);
cxt.stroke();//绘制线条
</script>

<script type="text/javascript">
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
cxt.fillStyle = "#FF0000";
cxt.beginPath();
cxt.arc(70,18,15,0.Math.PI*2,true);
cxt.closePath();
cxt.fill();//绘制圆形
</script>

<script type="text/javascript">
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
var grd = cxt.createLinearGradient(0,0,175,50);
grd.addColorStop(0,"#FF0000");
grd.addColorStop(1,"#00FF00");
cxt.fillStyle = grd;//渐变
cxt.fillRect(0,0,175,50);
</script>

<script type="text/javascript">
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
var img = new Image();
img.src = "flower.png";
cxt.drawImage(img,0,0);//绘制图像
</script>

//可以使用save()方法，将当前的状态推送到栈中保存，使用restore()方法可以将上一个保存的状态就从栈中弹出，恢复上一次所有的设置。

context.clearRect(x,y,width,height);
//该方法可以清除指定区域内的所有图形，显示画布背景。

context.translate(dx,dy);
//移动坐标

context.rotate(angle);
//旋转

context.transform(a,b,c,d,e,f)
//变换图形

图片合成globalCompositeOperation()
source-over(默认值)：A over B
destination-over：B over A
source-atop：只绘制原有内容和新图形与原有内容重叠的部分，且新图形位于原有内容之上。
destination-atop：只绘制新图形和新图新与原有内容重叠的部分，且原有内容位于重叠部分之下。
source-in：新图形只出现在与原有内容重叠的部分，其余区域变为透明
destination-in：原有内容只出现在与新图形重叠的部分，其余区域为透明
source-out：新图形中与原有内容不重叠的部分保留
destination-out：原有内容中与新图形不重叠的部分被保留
lighter：两图形重叠的部分做加色处理
darker：两图形重叠的部分做减色处理
copy：只保留新图形，在Chrome浏览器中无效，Opera 11.5中有效
xor：将重叠部分变为透明

裁剪clip()

绘制文本
fillText():以填充的形式绘制文本
strokeText():轮廓方式绘制文本
font()
textAlign()
textBaseline()

测量宽度
metrics = context.measureText(text);

像素操作
1.创建图像数据
var imgData=context.createImageData(width,height);
var imgData=context.createImageData(imageData);
2.将图像数据从指定ImageData对象写入画布
context.putImageData(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
3.在画布中复制图像数据
var imgData = context.getImageData(x,y,width,height);
4.保存数据
canvas.toDataURL(type, encoderOption);
```

### Canvas 2D API新功能

创建Path2D对象的3种方式

```
new Path2D();   //空的Path对象
new Path2D(path); //复制path对象
new Path2D(d); //通过SVG path字符串创建path对象
```



### Canvas与SVG对比

#### canvas

1.依赖分辨率

2.不支持事件处理器

3.弱的文本渲染能力

4.能够以.png或.jpg格式保存结果图像

5.最适合图像密集型的游戏，其中的许多对象会被频繁重绘

#### SVG

1.不依赖分辨率

2.支持事件处理器

3.最适合带有大型渲染区域的应用程序（比如谷歌地图）

4.复杂度高会减慢渲染速度（任何过度使用DOM的应用都不快）

5.不适合游戏应用



### 音频相关

#### embed

```
<embed height="100" width="100" src="song.mp3"/>
```

#### 问题

1.该标签在HTML4中是无效的，页面无法通过HTML4验证

2.不同的浏览器对音频格式的支持也不同

3.如果浏览器不支持该文件格式，没有插件的话就无法播放该音频

4.如果用户的计算机未安装插件，无法播放音频

5.如果把该文件转换为其他格式，仍然无法在所有浏览器中播放。

#### object

```
<object height="100" width="100" data="song.mp3"></object>
```

#### 问题

1.不同浏览器对音频格式的支持也不同

2.如果浏览器不支持该文件格式，没有插件的话无法立即播放该音频

3.如果用户的计算机未安装插件，无法播放插件

4.如果把该文件转换为其他格式，仍然无法在所有浏览器中播放。

#### HTML5中的audio元素

```
<audio controls="controls">
	<source src="song.mp3" type="audio/mp3">
	<source src="song.ogg" type="audio/ogg">
</audio>
autoplay：音频在就绪后马上播放
controls：用户显示控件，比如播放按钮
loop：当音频结束时重新开始播放
preload：音频在页面加载时进行加载，并预备播放，如果使用autopaly则忽略该属性
src：源
```

#### 问题

1.audio标签在HTML4中是无效的

2.必须把音频文件转换为不同的格式

3.audio元素在老式浏览器中不起作用

#### 关于音频最好的HTML解决方法

```
<audio controls="controls" height = "100" width="100">
	<source src="song.mp3" type="audio/mp3">
	<source src="song.ogg" type="audio/ogg">
<embed height="100" width="100" src="song.mp3" />
</audio>
```

#### 问题

1.必需把音频转换为不同格式

2.audio、embed元素无法通过HTML4和XHTML验证

3.embed元素无法回退来显示错误消息

#### 雅虎媒体播放器

```
<a href="song.mp3">Play Sound</a>
<script type="text/javascript" src="http://mediaplayer.yahoo.com/js">
</script>
```

#### 超链接

```
<a href="song.mp3">Play the sound</a>
```

### HTML播放视频

#### embed

```
<embed src="movie.swf" height="200" width="200"></embed>
```

#### 问题

1.HTML4无法识别embed标签，你的页面无法通过验证

2.如果浏览器不支持Flash，那么视频将无法播放

3.iPad和iPhone不能显示Flash视频

4.如果你将视频转换成其他格式，那么它仍然不能在所有浏览器中播放

#### object

```
<object data="movie.swf" height="200" width="200" />
```

#### 问题

1.如果浏览器不支持Flash，将无法播放视频

2.iPad和iPhone 不能显示Flash视频

3.如果你将视频转换成其他格式，那么它仍然不能在所有浏览器中播放

#### video标签

```
<video width="320" height="240" controls="controls">
	<source src="movie.mp4" type="video/mp4">
	<source src="movie.ogg" type="video/ogg">
	<source src="movie.webm" type="video/webm">
Your browser does not support the video tag.
</video>	
autoplay：视频在就绪后马上播放
controls：用户显示控件，比如播放按钮
loop：当视频结束时重新开始播放
muted:设置视频的音频输出为静音
poster：设置视频下载的时候显示图像，或者在用户单击"播放"按钮前显示图像
preload：视频在页面加载时进行加载，并预备播放，如果使用autopaly则忽略该属性
src：源
```

#### 问题

1.必需把视频转换为很多不同的格式

2.video 元素在老式浏览器中无效

3.video元素无法通过html4和xhtml验证

#### 最好的HTMl解决方案

```
<video width="320" height="240" controls="controls">
	<source src="movie.mp4" type="video/mp4">
	<source src="movie.ogg" type="video/ogg">
	<source src="movie.webm" type="video/webm">
	<object data="movie.mp4" width="320" height="240">
	<embed src="movie.swf" width="320" height="240" />
	</object>
</video>	
```

#### 问题

1.必需把视频转换为很多不同的格式

2.video、embed元素无法通过html4和xhtml验证

#### 优酷解决方案

```
<embed src="http://player.youku.com/player.php/sid/XMzl2NTc4NTMy/v.swf" width="480" height="400"
	type="application/x-shockwave-flash">
</embed>
```

#### 使用超链接

```
<a href="movie.swf">Play a video file</a>
```

### 媒体方法

##### 1.用于返回一个字符串以表示客户端是否能够播放指定的媒体类型

```
var canPlay = media.canPlayType(type)
```

##### 2.pause()

##### 3.play()

### 媒体事件

```
abort
canplay
canplaythrough
durationchange
emptied
ended
error
loadeddata
loadedmetadata
loadstart
pause
play
playing
progress
ratechange
readystatechange
seeked
seeking
stalled
suspend
timeupdate
volumechange
waiting
```

### HTML5地理定位

#### 使用地理定位

```
<scritpt>
var x = document.getElementById("demo");
function getLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
	}else{
		x.innerHTML = "Geolocation is not supported by this browser";
	}
}
function showPosition(position){
	x.innerHTML = "Latitude" + position.coords.latitude + "<br/>Longitude:" + position.coords.longitude;
}
</script>
```

#### 处理错误和拒绝

```
function showError(error){
	switch(error.code){
		case error.PERMISSION_DENIED:
			x.innerHTML = "User denided the request for Geolocation"
			break;
		case error.POSITION_UNAVAILABLE:
			x.innerHTML = "Location information is unavailable"
			break;
		case error.TIMEOUT:
			x.innerHTML = "The request to get user location timed out"
			break;
		case error.UNKNOWN_ERROR:
			x.innerHTML = "An unknown error occurred"
			break;
	}
}
```

#### 在地图上显示结果

```
function showPosition(position){
	var latlon = position.coords.latitude+","position.coords.longitude;
	
	var img_url = ;
	document.getElementById("mapholder").innerHTML="<img src="+img_url+"/>";
}
```

```
coords.latitude 十进制数的纬度
coords.longitude 十进制数的经度
coords.accuracy 位置精度
coords.altitude 海拔，海平面以上以米计算
coords.altitudeAccuracy 位置的海拔精度
coords.heading 方向，从正北开始以度计
coords.speed 速度，以米/每秒计
timestamp 响应的日期/时间
```

### HTML5拖拽

```
<!DOCTYPE HTML>
<html>
	<head>
		<script>
			function allowDrop(ev){
				ev.preventDefault();
			}
			function drag(ev){
				ev.dataTransfer.setData("text",ev.target.id);
			}
			function drop(ev){
				ev.preventDefault();
				var data = ev.dataTransfer.getData("text");
				ev.target.appendChild(document.getElementById(data);
			}
		</script>
	</head>
	<body>
		<div id = "div1" ondrop="drop(event)" ondragover = "allowDrop(event)"> </div>
		<img id = "drag1" src="img_logo.gif" draggable="true" ondragstart = "drag(event)" width="336" height="69">
	</body>
</html>
//dataTransfer.setData()方法设置被拖动数据的数据类型和值。
//ondragover事件规定被拖动的数据能够被放置到何处。默认地，数据/元素无法被放置到其他元素中。为了实现拖放，我们必须阻止元素的这种默认的处理方式。
event.preventDefault()
//当放开被拖数据时，会发生drop事件
```

### HTML本地存储

HTML本地存储提供了两个在客户端存储数据的对象

```
windows.localStorage--存储没有截止日期的数据
windows.sessionStorage--针对一个session来存储数据（当关闭浏览器标签页时数据会丢失）
```

```
localStorage.setItem("lastname","Gates");
document.getElementById("result").innerHTML = localStorage.getItem("lastname");

localStorage.lastname = "Gates";
document.getElementById("result").innerHTML = localStorage.lastname;

localStorage.removeItem("lastname");

clear();
```

### HTML5应用程序缓存

应用程序缓存的优势

1.离线缓存--用户可以在应用离线时使用它们

2.速度--已缓存资源加载的更快

3.减少服务器负载--浏览器只从服务器下载更新过或更改过的资源

```
<!DOCTYPE HTML>
<html manifest="demo.appcache">
<body>
文档内容 ......
</body>

</html>
```

每个指定了 manifest 的页面在用户对其访问时都会被缓存。如果未指定 manifest 属性，则页面不会被缓存（除非在 manifest 文件中直接指定了该页面）。

#### Manifest 文件

manifest 文件是简单的文本文件，它告知浏览器被缓存的内容（以及不缓存的内容）。

manifest 文件有三个部分：

- CACHE MANIFEST - 在此标题下列出的文件将在首次下载后进行缓存
- NETWORK - 在此标题下列出的文件需要与服务器的连接，且不会被缓存
- FALLBACK - 在此标题下列出的文件规定当页面无法访问时的回退页面（比如 404 页面）

**注意：**manifest 文件需要设置正确的 MIME-type，即 "text/cache-manifest"。必须在 web 服务器上进行配置。

```
CACHE MANIFEST
# 2012-02-21 v1.0.0
/theme.css
/logo.gif
/main.js

NETWORK:
login.asp

FALLBACK:
/html/ /offline.html
```

### HTML WebWorker

Web worker 是运行在后台的 JavaScript，独立于其他脚本，不会影响页面的性能。您可以继续做任何愿意做的事情：点击、选取内容等等，而此时 web worker 运行在后台。

```
if (typeof(w) == "undefined") {
    w = new Worker("demo_workers.js");//创建
}
w.onmessage = function(event){
	//处理
}
w.postMessage(message);
w.terminate();//停止使用
```

### WebWorker 的使用场合

1.预先抓取并缓存一些数据以供以后使用

2.代码高亮处理或其他一些页面上的文字格式化处理

3.拼写检查

4.分析视频或音频数据

5.后台I/O处理

6.大数据量分析或计算处理

7.canvas元素中的图像数据的运算及生成处理

8.本地数据库中数据的存取及计算处理

### SharedWorker

通过SharedWorker的使用，多个页面可以共用一个后台线程，后台线程可以作为一个提供后台服务的场所。

```
var worker = new SharedWorker(url, [name]);
```

```
var worker =  new SharedWorker('script1.js');
var port =  worker.port;
port.postMessage(message);

port.onmessage=function(event){
	//	处理收到的消息
}
port.addEventListener('message',function(event){
	// 处理收到的消息
}，false);
port.start();
```

### Web SQL Database

```
openDatabase:使用现有数据库或创建新数据库的方式创建数据库对象
transaction:允许我们根据情况控制事务提交或回滚
executeSql:用于执行真实的SQL查询
```

### History API

在历史记录中后退

```
window.history.back();
```

在历史记录中前进

```
windows.history.forward();
```

移动到指定点

```
window.history.go(-1)       //相当于调用back()
window.history.go(1)        //相当于调用forward()
```

查看历史记录栈中一共有几页

```
var numberOfEntries = window.history.length;
```

添加和修改历史记录条目

```
var stateObj = {foo:"bar"};
history.pushState(stateObj, "page 2", "bar.html");

history.replaceState();
```

### replaceState()和pushState()不同之处

pushState()是在history栈中添加一个新的条目，replaceState()是替换当前的记录值。

### History Api 和 hash的区别

1.history api中新的URL可以是任意的同源URL。相反，使用window.location方法时只有修改hash才能保证停留在相同的document中。

2.history 可以根据个人需要决定是否修改URL。相反，设置window.location=“#foo”,只有在当前hash值不是foo时才创建一条新历史记录。

3.history可以在新的历史记录条目中添加抽象数据。hash只能把相关数据转码成一个很短的字符串。

### 文件操作

```
<input type="file" multiple>
新增的对象：FileList、File
fileList：表示用户选择的文件列表
file：表示File控件内的每一个被选择的文件对象。FileList对象为这些File对象的列表，代表用户选择的所有文件。
```

#### Blob对象

HTML5的Blob对象用于存储二进制数据，还可以设置存储数据的MINE类型，其他HTML5二进制对象即成blob对象

（size、type）

限制文件格式的input框

```
<input type="file" id="file" accept="image/*" />
```

创建Blob

```
var blob = new Blob(blobParts,type)
```

#### FileReader

```
	if(typeof FileReader == "undefined"){
		alert("当前浏览器不支持FileReader对象")
	} else {
		var reader = new FileReader();
	}
	//提供的方法
	readAsText(Blob,type): 将Blob对象或文件中的数据读取为文本数据。第二个参数为文本的编码方式
	readAsBinaryString(Blob):将Blob对象或文件中的数据读取为二进制字符串，通常调用该方法将文件提交到服务端，服务端可以通过字段字符串存储文件。
	readAsDataURL(Blob):将Blob对象或文件中的数据读取为DataURL字符串，该方法就是将数据以一种特殊格式的URL地址形式直接读入页面。
	readAsArrayBuffer(Blob):将Blob对象或文件中的数据读取为一个ArrayBuffer对象
	abort():中断读取操作。
```

##### FileReader事件

```
onabort:数据读取中断时触发
onprogress:数据读取中触发
onerror:数据读取出错时触发
onload:数据读取完成时触发
onloadstart:数据读取时触发
onloadend:数据读取完成时触发，无论成功或失败
```

### ArrayBuffer 和 ArrayBufferView

ArrayBuffer对象表示一个固定长度的缓存区，用来存储文件或网络大数据；ArrayBufferView对象表示将缓存区中的数据转换为各种类型的数值数组。

```
var buffer = new ArrayBuffer(32);
//参数为一个无符号长整型的整数，用于设置缓存区的长度，单位为byte。ArrayBuffer缓存区创建成功之后，该缓存区内容存储数据初始化为0；
```

HTML5使用ArrayBufferView对象以一种标准格式来表示ArrayBuffer缓存区中的数据，HTML5不允许直接使用ArrayBufferView对象，而是使用ArrayBuffer的子类实例来存取ArrayBuffer缓存区中的数据。

### FileSystem API //文件操作

1.支持跨域通信，但是每个域的文件系统智能被该域专用，不能被其他域访问。

2.存储数据是永久的，不能被浏览器随意删除，但是存储在临时文件系统中的数据可以被浏览器自行删除。

3.当Web应用连续发出多次对文件系统的操作请求时，每个请求都将得到响应，同时第一个请求中所保存的数据可以被之后的请求立即得到。

### HTML5通信

```
otherWindow.postmessage(message,origin);

otherWindow:表示发送消息的目标窗口对象
```

### WebRTC基础

```
MediaStream：能够通过设备的摄像头和麦克风获得视频、音频的同步流。
RTCPeerConnection：用于构建点对点之间的稳定、高效的流传输的组件
RTCDataChannel：在浏览器间（点对点）建立一个高吞吐量、低延时的信道，用于传输任意数据。
```

### HTML通知API（Notification API）

```
1.判断浏览器是否支持这个API
2.获取权限
window.Notification.requestPermission();
3.创建消息通知
var notification = new Notification(title,options)
4.监测和管理通知
包含有4个事件类型，show，close，click，error
```

### 指针锁定API

### Mutation Observer

这是一个变动观察器，是监听DOM变动的接口。当DOM对象树发生任何变动时，Mutation Observer会得到通知。

#### fetch事件

​	event.request.url

​	event.request.method

​	event.request.headers

​	event.request.body

### ServiceWorker

1.它是一个被注册在指定源和路径下的事件驱动Worker

2.它可拦截并修正地址导航及资源请求

3.Service Worker 不允许访问DOM，Service Worker是运行在独立于当前Js主线程的线程中，所以不会造成阻塞。

4.运行于HTTPS中



## 通信相关的API

### XMLHttpRequest

### Fetch API

### MessageChannel对象与MessagePort对象

```
var mc = new MessageChannel();
```

```
MessagePort对象
	.postMessage  用于向通道发送消息
	.start
	.close 
```

### HTML Server-Sent 事件

Server-Sent 事件指的是网页自动从服务器获得更新。

```
var source = new EventSource("demo_sse.php");
source.onmessage = function(event) {
    document.getElementById("result").innerHTML += event.data + "<br>";
};
```

| 事件      | 描述                     |
| :-------- | :----------------------- |
| onopen    | 当通往服务器的连接被打开 |
| onmessage | 当接收到消息             |
| onerror   | 当发生错误               |

### BroadcastChannel API

```
const channel = new BroadcastChannel('my_bus');
//连接my_bus通道
channel.postMessage('This is a test message.');

channel.postMessage(new Blob(['foo', 'bar'], {type: 'plain/text'}));
```

