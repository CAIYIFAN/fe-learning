## HTML5中常见的API

### 1.页面可见性API-----Page Visibility

该API可以用来检测页面对于用户的可见性，即返回用户当前浏览的页面或标签tab的状态变化。在最小化浏览器、切换tab页面时生效。

#### 属性

document.hidden：表示page是否是可见的,值为boolean值

document.visibilityState：

visibilityState有三个值：
	visible：表示该page是处于最前面的页面并且不是处于一个最小化的窗口
	hidden：表示该page不是处于最前面的页面或者是处于一个最小化的窗口
	prerender：表示该页面内容正在重新渲染并且该页面对于用户是不可见的

isibilitychange Event：监听window visibility 的改变的事件

```
// 设置隐藏属性和可见改变事件的名称，属性需要加浏览器前缀 
// since some browsers only offer vendor-prefixed support var hidden, state, visibilityChange; 
if (typeof document.hidden !== "undefined") { 
	hidden = "hidden"; 
	visibilityChange = "visibilitychange"; 
	state = "visibilityState"; 
} else if (typeof document.mozHidden !== "undefined") { 
	hidden = "mozHidden"; 
	visibilityChange = "mozvisibilitychange"; 
	state = "mozVisibilityState"; 
} else if (typeof document.msHidden !== "undefined") { 
	hidden = "msHidden"; 
	visibilityChange = "msvisibilitychange"; 
	state = "msVisibilityState"; 
} else if (typeof document.webkitHidden !== "undefined") { 
	hidden = "webkitHidden"; 
	visibilityChange = "webkitvisibilitychange"; 
	state = "webkitVisibilityState"; 
} 
// 添加一个标题改变的监听器 
document.addEventListener(visibilityChange, function(e) { 
// 开始或停止状态处理 
}, false); 
```

### 2.API全屏API——Full Screen

**Launching Fullscreen Mode 启动全屏模式**

```
// 找到适合浏览器的全屏方法 
function launchFullScreen(element) { 
	if(element.requestFullScreen) { 
		element.requestFullScreen(); 
	} else if(element.mozRequestFullScreen) { 
		element.mozRequestFullScreen(); 
	} else if(element.webkitRequestFullScreen) { 
		element.webkitRequestFullScreen(); 
	} 
} 
// 启动全屏模式 
launchFullScreen(document.documentElement); // the whole page 
launchFullScreen(document.getElementById("videoElement")); // any individual element 
```

**Exit FullScreen Mode 退出全屏模式**

```
function exitFullscreen() { 
	if(document.exitFullscreen) { 
		document.exitFullscreen(); 
	} else if(document.mozCancelFullScreen) { 
		document.mozCancelFullScreen(); 
	} else if(document.webkitExitFullscreen) { 
		document.webkitExitFullscreen(); 
	} 
} 
// Cancel fullscreen for browsers that support it! 
exitFullscreen(); 
```

#### Full Screen 的相关属性和事件

目前fullscreen 仍存在兼容的问题，许多能使用的浏览器仍需要在其相应的属性和事件加相关的前缀。

document.fullScreenElement：该属性表示启动全屏的元素（如 video这些）
document.fullScreenEnabled：该属性表示当前是否全屏
fullscreenchange 事件：监听全屏状态改变的事件

### 3.访问摄像头和麦克风——getUserMedia API

```
// 设置事件监听器 
window.addEventListener("DOMContentLoaded", function() { 
	// 获取元素 
	var canvas = document.getElementById("canvas"), 
	context = canvas.getContext("2d"), 
	video = document.getElementById("video"), 
	videoObj = { "video": true }, 
	errBack = function(error) { 
		console.log("Video capture error: ", error.code); 
	}; 
	// 设置video监听器 
	if(navigator.getUserMedia) { // Standard 
		navigator.getUserMedia(videoObj, function(stream) { 
		video.src = stream; 
		video.play(); 
		}, errBack); 
	} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed 
		navigator.webkitGetUserMedia(videoObj, function(stream){ 
			video.src = window.webkitURL.createObjectURL(stream); 
			video.play(); 
		}, errBack); 
	} 
}, false); 
```

### 4.电池API——Battery API

```
var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery; 
// 电池属性 
console.warn("Battery charging: ", battery.charging); // 当前电池是否在充电 true 
console.warn("Battery level: ", battery.level); // 0.58 
console.warn("Battery discharging time: ", battery.dischargingTime); 
// 添加事件监听器 
battery.addEventListener("chargingchange", function(e) { 
	console.warn("Battery charge change: ", battery.charging); 
}, false); 
```

charging	是否在充电	可读属性
chargingTime	若在充电，还需充电时间	可读属性
dischargingTime	剩余电量	可读属性
level	剩余电量百分数	可读属性
onchargingchange	监听充电状态的改变	可监听事件
onchargingtimechange	监听充电时间的改变	可监听事件
ondischargingtimechange	监听电池可用时间的改变	可监听事件
onlevelchange	监听剩余电量百分数的改变	可监听事件

### 5.预加载——Link Prefetching

**什么是link预加载**
Link prefetching 是利用浏览器最佳的时间去下载或者预加载一些用户可能将会在不久将来浏览的文档的一种浏览器机制。

```
!-- full page --] 
[link rel="prefetch" href="http://davidwalsh.name/css-enhancements-user-experience" /] 
[!-- just an image --] 
[link rel="prefetch" href="http://davidwalsh.name/wp-content/themes/walshbook3/images/sprite.png" /] 
```

### 6.监听屏幕旋转变化接口: ——orientationchange

```
screenOrientation:function () {
	let self = this;
	let orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
		self.angle = orientation.angle;
	});
}
```

| orientation.angle 值 | 屏幕方向 |
| -------------------- | -------- |
| 0                    | 竖屏     |
| 90                   | 向左横屏 |
| -90/270              | 向右横屏 |
| 180                  | 倒屏     |

```
/* 竖屏 */
@media screen and (orientation: portrait) {
	// some css code
}
/* 横屏 */
@media screen and (orientation: landscape) {
    // some css code
}
```

### 7.手机震动: ——window.navigator.vibrate(200)

```
vibrateFun:function (){
	let self = this;
    if (navigator.vibrate) {
        navigator.vibrate([500, 500, 500, 500, 500 ,500 , 500, 500, 500, 500]);
    } else {
        self.vibrateInfo = "您的设备不支持震动";
    }
    // 清除震动
    navigator.vibrate(0);
    // 持续震动
    setInterval(function () {
        navigator.vibrate(200);
    }, 500);
}
```

### 8.当前语言: ——navigator.language

```
function getThisLang() {
     const langList = ['cn', 'hk', 'tw', 'en', 'fr'];
     const langListLen = langList.length;
     const thisLang = (navigator.language || navigator.browserLanguage).toLowerCase();
     for (let i = 0; i < langListLen; i++) {
         let lang = langList[i];
         if (thisLang.includes(lang)) {
             return lang
         } else {
             return'en'
         }
     }
 }
```

### 9.联网状态: ——navigator.onLine

```
function mounted() {
    let self = this;
    window.addEventListener('online', self.updateOnlineStatus, true);
    window.addEventListener('offline', self.updateOnlineStatus, true);
}
methods: {
    updateOnlineStatus: function() {
        var self = this;
        self.onLineInfo = navigator.onLine ? "online": "offline";
    }
}
```

### 10.页面可编辑: ——contentEditable

这个 API 可以使页面所有元素成为可编辑状态，使浏览器变成你的编辑器。

```
你可以在地址栏输入 data:text/html,<html contenteditable>, 这样浏览器就变成了编辑器。
```

**使用场景：**
需求 —— 页面需要一个文本输入框。

- 该文本输入框默认状态下有默认文本提示信息
- 文本框输入状态下其高度会随文本内容自动撑开

```
<div class = 'haveInput' contentEditable = 'true' placeholder = '请输入'></div>
    // css样式
    .haveInput: before {
        content: attr(placeholder);
        display: block;
        color: #333;
    }
```

### 11.浏览器活跃窗口监听: ——window.onblur & window.onfocus

这两个 api 分别表示窗口失去焦点和窗口处于活跃状态。
浏览其他窗口、浏览器最小化、点击其他程序等， window.onblur 事件就会触发;
回到该窗口， window.onfocus 事件就会触发。
例子（微信网页版的消息提示）：

```
   mounted() {
        let self = this;
        window.addEventListener('blur', self.doFlashTitle, true);
        window.addEventListener('focus', function() {
            clearInterval(self.timer);
            document.title = '微信网页版';
        }, true);
    },
    methods: {
        doFlashTitle: function() {
            var self = this;
            self.timer = setInterval(() = >{
                if (!self.flashFlag) {
                    document.title = "微信网页版";
                } else {
                    document.title = `微信（$ {
                        self.infoNum
                    }）`;
                }
                self.flashFlag = !self.flashFlag
            },500)
        }
    }
```

