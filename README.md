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

				
# 深入解析CSS

每一个CSS属性都有初始（默认）值。如果将initial值赋给某个属性，那么就会有效地将其重置为默认值，这种操作相当于硬复位了该值。

声明display: initial等价于display: inline。不管应用于哪种类型的元素，它都不会等于display: block。这是因为initial重置为属性的初始值，而不是元素的初始值。inline才是display属性的初始值。

##### 简写属性会默默覆盖其他样式

大多数简写属性可以省略一些值，只指定我们关注的值。但是要知道，这样做仍然会设置省略的值，即它们会被隐式地设置为初始值。这会默默覆盖在其他地方定义的样式。

##### 简写值的顺序

##### 上、右、下、左

指定三个值时，左边和右边都会使用第二个值。指定两个值时，上边和下边会使用第一个值。如果只指定一个值，那么四个方向都会使用这个值。

background-position:25% 75%则先指定水平方向的右/左属性值，然后才是垂直方向的上/下属性值。

box-shadow先指定x值再指定y值



CSS为网页带来了后期绑定（late-binding）的样式：直到内容和样式都完成了，二者才会结合起来。

响应式——在CSS中指的是样式能够根据浏览器窗口的大小有不同的“响应”。这要求有意地考虑任何尺寸的手机、平板设备，或者桌面屏幕。



视口——浏览器窗口里网页可见部分的边框区域。它不包括浏览器的地址栏、工具栏、状态栏。

❑ vh：视口高度的1/100。

❑ vw：视口宽度的1/100。

❑ vmin：视口宽、高中较小的一方的1/100（IE9中叫vm，而不是vmin）。

❑ vmax：视口宽、高中较大的一方的1/100（本书写作时IE和Edge均不支持vmax）



使用无单位的数值时，继承的是声明值，即在每个继承子元素上会重新算它的计算值。这样得到的结果几乎总是我们想要的。我们可以用一个无单位的数值给body设置行高，之后就不用修改了，除非有些地方想要不一样的行高。



### css自定义属性

变量名前面必须有两个连字符（--），用来跟CSS属性区分，剩下的部分可以随意命名。

变量必须在一个声明块内声明。这里使用了：root选择器，因此该变量可以在整个网页使用，稍后会解释这一点。

#### 使用自定义属性

```css
:root {
  --main-font: Helvetica, Arial, sans-serif;
}

p {
  font-family: var(--main-font);
}
```

var()函数接受第二个参数，它指定了备用值。如果第一个参数指定的变量未定义，那么就会使用第二个值。

说明如果var()函数算出来的是一个非法值，对应的属性就会设置为其初始值。比如，如果在padding: var(--brand-color)中的变量算出来是一个颜色，它就是一个非法的内边距值。这种情况下，内边距会设置为0。

css自定义属性，它真正的意义在于，自定义属性的声明能够层叠和继承：可以在多个选择器中定义相同的变量，这个变量在网页的不同地方有不同的值。（可以通过javascript对自定义属性进行更改）

```javascript
var rootElement = document.documentElement;
var styles = getComputedStyle(rootElement);
var mainColor = styles.getPropertyValue('--main-bg');

var rootElement = document.documentElement;
rootElement.style.setProperty('--main-bg', '#cdf');
```



普通文档流——指的是网页元素的默认布局行为。行内元素跟随文字的方向从左到右排列，当到达容器边缘时会换行。块级元素会占据完整的一行，前后都有换行。



用百分比指定高度存在问题。百分比参考的是元素容器块的大小，但是容器的高度通常是由子元素的高度决定的。这样会造成死循环，浏览器处理不了，因此它会忽略这个声明。要想让百分比高度生效，必须给父元素明确定义一个高度。



### 垂直居中

可以用表格元素的border-spacing属性来定义单元格的间距。该属性接受两个长度值：水平间距和垂直间距。（也可以将这两个长度值指定为同一值。）可以给容器加上border-spacing:1.5em 0，但这会产生一个特殊的副作用：这个值也会作用于表格的外边缘。这样两列就无法跟头部左右对齐了。



vertical-align声明只会影响行内元素或者table-cell元素。对于行内元素，它控制着该元素跟同一行内其他元素之间的对齐关系。比如，可以用它控制一个行内的图片跟相邻的文字对齐。对于显示为table-cell的元素，vertical-align控制了内容在单元格内的对齐。如果你的页面用了CSS表格布局，那么可以用vertical-align来实现垂直居中。



### 负边距

负外边距的具体行为取决于设置在元素的哪边，如图3-15所示。如果设置左边或顶部的负外边距，元素就会相应地向左或向上移动，导致元素与它前面的元素重叠，如果设置右边或者底部的负外边距，并不会移动元素，而是将它后面的元素拉过来。给元素底部加上负外边距并不等同于给它下面的元素顶部加上负外边距。



### 外边距折叠

总之，所有相邻的顶部和底部外边距会折叠到一起。如果在页面中添加一个空的、无样式的div（没有高度、边框和内边距），它自己的顶部和底部外边距就会折叠。说明只有上下外边距会产生折叠，左右外边距不会折叠。



如下方法可以防止外边距折叠。

❑ 对容器使用overfow: auto（或者非visible的值），防止内部元素的外边距跟容器外部的外边距折叠。这种方式副作用最小。

❑ 在两个外边距之间加上边框或者内边距，防止它们折叠。

❑ 如果容器为浮动元素、内联块、绝对定位或固定定位时，外边距不会在它外面折叠。❑ 当使用Flexbox布局时，弹性布局内的元素之间不会发生外边距折叠。网格布局同理。

❑ 当元素显示为table-cell时不具备外边距属性，因此它们不会折叠。此外还有table-row和大部分其他表格显示类型，但不包括table、table-inline、table-caption。



### 猫头鹰选择器

＊ + ＊，它会选中页面上有着相同父级的非第一个子元素。

```css
body ＊ + ＊ {
	margin-top: 1.5em;
}
```



### 浮动

要实现将图片移动到网页一侧，并且让文字围绕图片的效果，浮动仍然是唯一的方法。



一个容器内的浮动元素会扩展到另一个容器，这样两个容器的文字就能围绕浮动元素排列。（因此需要清除浮动）

（1）新增空标签清除浮动

（2）伪元素清除浮动



#### 清除浮动和display:tabale

在清除浮动时使用display: table能够包含外边距，是因为利用了CSS的一些特性。创建一个display: table元素（或者是本例的伪元素），也就在元素内隐式创建了一个表格行和一个单元格。因为外边距无法通过单元格元素折叠（参见第3章），所以也无法通过设置了display: table的伪元素折叠。

看起来似乎使用display: table-cell也能达到相同的效果，但是clear属性只能对块级元素生效。表格是块级元素，但是单元格并不是。因此，clear属性无法跟display:table-cell一起使用。所以要用display: table来清除浮动，同时利用隐式创建单元格来包含外边距。



### BFC

BFC里的内容不会跟外部的元素重叠或者相互影响。

给元素添加以下的任意属性值都会创建BFC。

❑ foat: left或right，不为none即可。

❑ overfow:hidden、auto或scroll，不为visible即可。

❑ display:inline-block、table-cell、table-caption、fex、inline-fex、grid或inline-grid。拥有这些属性的元素称为块级容器（block container）。

❑ position:absolute或position: fixed。

BFC有3个好处：包含浮动元素，防止外边距折叠，防止文档流围绕浮动元素排列。



### FlexBox

flex-basis

flex-basis属性可以设置为任意的width值，包括px、em、百分比。它的初始值是auto，此时浏览器会检查元素是否设置了width属性值。如果有，则使用width的值作为flex-basis的值；如果没有，则用元素内容自身的大小。如果flex-basis的值不是auto, width属性会被忽略。

flex-grow

flex-shrink

在垂直的弹性盒子里，子元素的flex-grow和flex-shrink不会起作用，除非有“外力”强行改变弹性容器的高度。



### Grid

grid-column是grid-column-start和grid-column-end的简写；grid-row是grid-row-start和grid-row-end的简写。中间的斜线只在简写属性里用于区分两个值，斜线前后的空格不作要求。



❑ Flexbox本质上是一维的，而网格是二维的。

❑ Flexbox是以内容为切入点由内向外工作的，而网格是以布局为切入点从外向内工作的。

Flexbox以内容为切入点由内向外工作，而网格以布局为切入点由外向内工作。Flexbox让你在一行或一列中安排一系列元素，但是它们的大小不需要明确指定，每个元素占据的大小根据自身的内容决定。

而在网格中，首先要描述布局，然后将元素放在布局结构中去。虽然每个网格元素的内容都能影响其网格轨道的大小，但是这同时也会影响整个轨道的大小，进而影响这个轨道里的其他网格元素的大小。



自动分行

```
<div class="portfolio">
	<figure class="featured">
	</figure>
	....
</div>


.portfolio {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	grid-auto-rows: 1fr;
	grid-gap: 1em;
	grid-auto-flow: dense;
}

// 将特定图片放大，在水平和垂直方向上各占据两个网格轨道
.portfolio .featured {
	grid-row: span 2;
	grid-column: span 2;
}
```



网格有一个限制是要求用特定的DOM结构，也就是说，所有的网格元素必须是网格容器的直接子节点。因此，不能将深层嵌套的元素在网格上对齐。

可以给网格元素加上display: grid，在外层网格里创建一个内部网格，但是内部网格的元素不一定会跟外层网格的轨道对齐。一个网格里的子元素的大小也不能影响到另一个网格的网格轨道大小。



### object-fit

❑ cover：扩展图片，让它填满盒子（导致图片一部分被裁剪）。

❑ contain：缩放图片，让它完整地填充盒子（导致盒子里出现空白）



### 属性兼容： 特性查询

```
@supports (display: grid) {
}
```

IE不支持@supports规则。它忽略了特性查询里的任何规则，不管是否真的支持该特性。通常情况下这是可以接受的，因为让旧版的浏览器渲染回退布局也是情理之中的事情。

❑ @supports not(<declaration>)——只有当不支持查询声明里的特性时才使用里面的样式规则。

❑ @supports (<declaration>) or (<declaration>)——查询声明里的两个特性只要有一个支持就使用里面的样式规则。

❑ @supports (<declaration>) and (<declaration>)——查询声明里的两个特性都支持才使用里面的样式规则。



### 渲染过程和层叠顺序

浏览器将HTML解析为DOM的同时还创建了另一个树形结构，叫作渲染树（render tree）。它代表了每个元素的视觉样式和位置。同时还决定浏览器绘制元素的顺序。顺序很重要，因为如果元素刚好重叠，后绘制的元素就会出现在先绘制的元素前面。

通常情况下（使用定位之前），元素在HTML里出现的顺序决定了绘制的顺序。

定位元素时，这种行为会改变。浏览器会先绘制所有非定位的元素，然后绘制定位元素。默认情况下，所有的定位元素会出现在非定位元素前面。



### z-index

z-index属性的值可以是任意整数（正负都行）。z表示的是笛卡儿x-y-z坐标系里的深度方向。拥有较高z-index的元素出现在拥有较低z-index的元素前面。拥有负数z-index的元素出现在静态元素后面。

z-index的行为很好理解，但是使用它时要注意两个小陷阱。第一，z-index只在定位元素上生效，不能用它控制静态元素。第二，给一个定位元素加上z-index可以创建层叠上下文。



### 层叠上下文

一个层叠上下文包含一个元素或者由浏览器一起绘制的一组元素。其中一个元素会作为层叠上下文的根，比如给一个定位元素加上z-index的时候，它就变成了一个新的层叠上下文的根。所有后代元素就是这个层叠上下文的一部分。



说明给一个定位元素加上z-index是创建层叠上下文最主要的方式，但还有别的属性也能创建，比如小于1的opacity属性，还有transform、filter属性。由于这些属性主要会影响元素及其子元素渲染的方式，因此一起绘制父子元素。文档根节点（<html>）也会给整个页面创建一个顶级的层叠上下文。



所有层叠上下文内的元素会按照以下顺序，从后到前叠放：

❑ 层叠上下文的根

❑ z-index为负的定位元素（及其子元素）

❑ 非定位元素

❑ z-index为auto的定位元素（及其子元素）

❑ z-index为正的定位元素（及其子元素）



如果发现z-index没有按照预期表现，就在DOM树里往上找到元素的祖先节点，直到发现层叠上下文的根。然后给它设置z-idnex，将整个层叠上下文向前或者向后放。还要注意多个层叠上下文嵌套的情况。



### sticky粘性定位

粘性元素永远不会超出父元素的范围



### 响应式设计

响应式设计的三大原则如下。

(1) 移动优先。这意味着在实现桌面布局之前先构建移动版的布局。

(2) @media规则。使用这个样式规则，可以为不同大小的视口定制样式。用这一语法，通常叫作媒体查询（media queries），写的样式只在特定条件下才会生效。

(3) 流式布局。这种方式允许容器根据视口宽度缩放尺寸。



meta

meta标签的content属性里包含两个选项。首先，它告诉浏览器当解析CSS时将设备的宽度作为假定宽度，而不是一个全屏的桌面浏览器的宽度。其次当页面加载时，它使用initial-scale将缩放比设置为100%。

媒体查询

媒体查询还可以放在<link>标签中。在网页里加入<link rel="stylesheet"media="(min-width: 45em)" href="large-screen.css" />，只有当min-width媒体查询条件满足的时候才会将large-screen.css文件的样式应用到页面。然而不管视口宽度如何，样式表都会被下载。这种方式只是为了更好地组织代码，并不会节省网络流量。



新技术：容器查询



流式布局，有时被称作液体布局（liquid layout），指的是使用的容器随视口宽度而变化。



### CSS模块化

❑ OOCSS——面向对象的CSS，由Nicole Sullivan创建。

❑ SMACSS——可扩展的、模块化CSS架构，由Jonathan Snook创建。

❑ BEM——块（Block）、元素（Element）和修饰符（Modifier），由Yandex公司提出。

❑ ITCSS——倒三角形CSS，由Harry Roberts创建。





❑ 把CSS拆解成可复用的模块。

❑ 不要书写可能影响其他模块或者改变其他模块外观的样式。

❑ 使用变体类，提供同一模块的不同版本。

❑ 把较大的结构拆解成较小的模块，然后把多个模块组合在一起构建页面。

❑ 在样式表中，把所有用于同一个模块的样式放在一起。

❑ 使用一种命名约定，比如双连字符和双下划线，以便一眼就可以看清楚模块的结构。



### 模式库

把模块清单整合成一组文档，在大型项目中已经成为通用做法。这组文档被称为模式库（patternlibrary）或者样式指南（style guide）。

模式库不是网站或者应用程序的一部分，它是单独的一组HTML页面，用来展示每个CSS模块。模式库是你和你的团队在建站的时候使用的一个开发工具。

KSS



这种开发方式有几个好处。

第一，为网站提供一致性更好的界面。模式库鼓励开发者复用已有的样式，而不是重新开发。比如说，不应该为网站上10个不同的页面编写10套不同的列表样式，我们更倾向于复用仅有的几套列表。这种开发方式会强迫你停下来思考，是否需要新的样式，现有的模块是否可以满足需求。

第二，当你按照模式库的方式开发模块的时候，你可以孤立地看待问题。你会从一个特定的Web页面中脱离出来，聚焦在为一个模块写样式这样的单一任务上。不同于解决某个页面上的某个特定问题，思考新模块可能会用在什么地方会比较容易一些。你会创建一个更通用、可复用性更好的方案。

第三，这种开发方式允许团队里一部分成员专注于开发CSS。对CSS不太熟悉的开发者可以把一部分工作移交给经验更丰富的人。擅长CSS的开发者每完成一个模块，就可以向其他人发送一个链接，指向模式库里的模块位置。

第四，这种开发方式可以确保文档是最新的。模式库的页面是你测试CSS修改结果的地方，这意味着这些页面会一直呈现出最新的正确行为。修改CSS的时候，文档恰好就在旁边的注释块里，这样很容易保持文档也是最新的（后面会谈到如何修改现有的模块）。



❑ 使用工具来存档和清点模块，比如KSS。

❑ 使用模式库来记录HTML标记示例、模块变体和模块的JavaScript。

❑ 开发模块时遵循“CSS优先”。

❑ 考虑好CSS定义的API，之后不要轻易修改它。

❑ 使用语义版本为CSS做版本控制。

❑ 不要盲目地添加整个CSS框架到页面上，只取自己需要的那部分。



### 背景、阴影和混合模式

#### 渐变

值0deg代表垂直向上（相当于totop），更大的值会沿着顺时针变化，因此90deg代表向右渐变，180deg代表向下渐变，360deg又会代表向上渐变。

```
linear-gradient(90deg, white, blue);
```

度是最常用的单位，还有一些其他单位可以用来表示角度，如下所示。

❑ rad——弧度（radian）。一个完整的圆是2π，大概是6.2832弧度。

❑ turn——代表环绕圆周的圈数。一圈相当于360度（360deg）。可以使用小数来表示不足一圈，比如0.25turn相当于90deg。

❑ grad——百分度（gradian）。一个完整的圆是400百分度（400grad）,100grad相当于90deg。

```
// 重复渐变函数
repeating-linear-gradient

// 径向渐变
radial-gradient
```

#### 阴影

在拟物化设计追求尽量贴近真实世界的同时，扁平化设计选择接受现代社会已经日益数字化的事实。扁平化设计讲究色彩明快统一、外观简洁明了，这就意味着尽量少使用渐变、阴影和圆角。

扁平化设计并不是说完全不用这些特效，用还是要用的，但要用得巧用得妙。例如，前面使用的渐变是从浅蓝色过渡到中蓝色，我们现在也可以使用两个不同蓝色的渐变，只是渐变幅度几乎察觉不到。或者某个元素有个特别小的阴影，小到几乎没有。

#### 混合模式

❑ 使用某种颜色或者渐变为图片着色；

❑ 为图片添加纹理效果，比如划痕或者老胶片放映时的颗粒感等；

❑ 缓和、加深或者减小图片的对比度，使图片上的文字更具可读性；

❑ 在图片上覆盖了一条文字横幅，但是还想让图片完整显示。

这些混合模式又可以划分为五类：变暗、变亮、对比、复合和比较。



### 字体

text-transform把字母改成大写，调大字符间距



font-display

❑ auto——默认行为（在大多数浏览器中是FOIT）。

❑ swap——显示回退字体，在Web字体准备好之后进行交换（FOUT）。

❑ fallback——介于auto和swap之间。文本会保持较短时间（100ms）的隐藏状态，如果这时候Web字体还没有准备好，就显示回退字体。接下来一旦Web字体加载完成，就会显示Web字体。

❑ optional——类似于fallback，但是允许浏览器基于网速判断是否显示Web字体。这就意味着在较慢的连接条件下Web字体可能不会显示。



### 过渡

元素属性任何时候发生变化都会触发过渡：可以是状态改变的时候，比如：hover；也可以是JavaScript导致变化的时候，比如添加或者移除类影响了元素的样式。

transition

第一个值设置了哪个属性需要过渡，初始值是关键字all，表示所有属性都生效。如果只有某个属性需要过渡，在这里指定属性即可。例如transition-property: color将只应用在元素的颜色上，其他属性会立刻发生变化。也可以设置多个值，比如transition-property:color, font-size。

第二个值是持续时间，是一个用秒（例如0.3s）或者毫秒（300ms）表示的时间值。

第三个值是定时函数，用来控制属性的中间值如何计算，实际上控制的是过渡过程中变化率如何加速或者减速。定时函数可以是一个关键字值，比如linear或者ease-in，也可以是自定义函数。这是过渡中很重要的部分，稍后会详细说明。

最后一个值是延迟时间，允许开发者在属性值改变之后过渡生效之前设置一个等待周期。如果你为按钮的悬停状态设置0.5s的过渡延迟，那么在鼠标指针进入元素0.5s之后才会开始发生变化。



对于鼠标悬停、淡入淡出和轻微缩放特效，应该使用较快的过渡速度。一般要控制在300ms以下，有时候甚至可能要低到100ms。对于那些包含较大移动或者复杂定时函数的过渡，比如弹跳特效（参见第15章），要使用较长的300～500ms的持续时间。



大部分的接受长度值、数值、颜色值或者calc()函数值的属性可以添加动画效果；大部分的使用关键字或者其他非连续性值的属性（比如url()）不可以使用动画。



visibility属性可以从页面上移除某个元素，有点类似于display属性，分别设置visible和hidden即可。但跟display不同的是，visibility可以支持动画。为它设置过渡不会使其逐渐消失，但transition-delay可以生效，而在display属性上是不生效的。



为某个元素设置visibility: hidden可以从可见页面中移除该元素，但不会从文档流中移除它，这就意味着该元素仍然占位。其他元素会继续围绕该元素的位置布局，在页面上保留一个空白区域。在我们的例子中，不会影响到菜单，因为我们同时也设置了绝对定位。



❑ 使用过渡可以使页面中的突变变得平滑。

❑ 使用加速运动可以吸引用户注意力。

❑ 通知用户他们的行为已生效，应该使用减速运动。

❑ 只使用CSS无法满足需求时，可以使用JavaScript更改类配合过渡来实现。



### 变换

❑ 旋转（Rotate）——元素绕着一个轴心转动一定角度。

❑ 平移（Translate）——元素向上、下、左、右各个方向移动（有点类似于相对定位）。

❑ 缩放（Scale）——缩小或放大元素。

❑ 倾斜（Skew）——使元素变形，顶边滑向一个方向，底边滑向相反的方向。



实际上，变换在浏览器中的性能要好得多。如果我们要对元素的定位使用动画（比如为left属性添加过渡效果），可以明显感受到性能很差。对复杂元素使用动画或者在页面内一次性对多个元素使用动画，问题尤其明显。



will-change的属性可以对渲染图层添加控制

这个属性可以提前告知浏览器，元素的特定属性将改变。这通常意味着元素将被提升到自己的绘制图层。例如，设置了will-change: transform就表示我们将要改变元素的transform属性。



### 动画

❑ animation-name（over-and-back）——代表动画名称，就像@keyframes规则定义的那样。

❑ animation-duration（1.5s）——代表动画持续时间，在本例中是1.5s。

❑ animation-timing-function（linear）——代表定时函数，用来描述动画如何加速和/或减速。可以是贝塞尔曲线或者关键字值，就像过渡使用的定时函数一样（ease-in、ease-out，等等）。

❑ animation-iteration-count（3）——代表动画重复的次数。初始值默认是1。



### 组合器

❑ 子组合器（>）——匹配的目标元素是其他元素的直接后代。例如：.parent > .child。

❑ 相邻兄弟组合器（+）——匹配的目标元素紧跟在其他元素后面。例如：p + h2。

❑ 通用兄弟组合器（~）——匹配所有跟随在指定元素之后的兄弟元素。注意，它不会选中目标元素之前的兄弟元素。例如：li.active ~ li。



### 伪类选择器

❑ :first-child——匹配的元素是其父元素的第一个子元素。

❑ :last-child——匹配的元素是其父元素的最后一个子元素。

❑ :only-child——匹配的元素是其父元素的唯一一个子元素（没有兄弟元素）。

❑ :nth-child(an+b)——匹配的元素在兄弟元素中间有特定的位置。

❑ :nth-last-child(an+b)——类似于：nth-child()，但不是从第一个元素往后数，而是从最后一个元素往前数。括号内的公式与：nth-child()里的公式的规则相同。

❑ :first-of-type——类似于：first-child，但不是根据在全部子元素中的位置查找元素，而是根据拥有相同标签名的子元素中的数字顺序查找第一个元素。

❑ :last-of-type——匹配每种类型的最后一个子元素。

❑ :only-of-type——该选择器匹配的元素是满足该类型的唯一一个子元素。

❑ :nth-of-type(an+b)——根据目标元素在特定类型下的数字顺序以及特定公式选择元素，类似于：nth-child。

❑ nth-last-of-type(an+b)——根据元素类型以及特定公式选择元素，从其中最后一个元素往前算，类似于：nth-last-child。

❑ :not(<selector>)——匹配的元素不匹配括号内的选择器。括号内的选择器必须是基础选择器，它只能指定元素本身，无法用于排除祖先元素，同时不允许包含另一个排除选择器。

❑ :empty——匹配的元素必须没有子元素
❑ :focus——匹配通过鼠标点击、触摸屏幕或者按Tab键导航而获得焦点的元素。

❑ :hover——匹配鼠标指针正悬停在其上方的元素。

❑ :root——匹配文档根元素。对HTML来说，这是<html>元素，但是CSS还可以应用到XML或者类似于XML的文档上，比如SVG。在这些情况下，该选择器的选择范围更广。还有一些表单域相关的伪类选择器。其中一些是在选择器Level4版本的规范中提出或者修订的，因此在IE10以及其他一些浏览器中不受支持。请在Can I Use网站上查看兼容情况。

❑ :disabled——匹配已禁用的元素，包括input、select以及button元素。

❑ :enabled——匹配已启用的元素，即那些能够被激活或者接受焦点的元素。

❑ :checked——匹配已经针对选定的复选框、单选按钮或选择框选项。

❑ :invalid——根据输入类型中的定义，匹配有非法输入值的元素。例如，当<input type="email">的值不是一个合法的邮箱地址时，该元素会被匹配（Level4）。

❑ :valid——匹配有合法值的元素（Level4）。

❑ :required——匹配设置了required属性的元素（Level4）。

❑ :optional——匹配没有设置required属性的元素（Level4）。以上并未列出全部伪类选择器。请参阅MDN文档Pseudo-classes，查看MDN上的完整清单。

### 伪元素选择器

❑ ::before——创建一个伪元素，使其成为匹配元素的第一个子元素。该元素默认是行内元素，可用于插入文字、图片或其他形状。必须指定content属性才能让元素出现，例如：.menu::before。

❑ ::after——创建一个伪元素，使其成为匹配元素的最后一个子元素。该元素默认是行内元素，可用于插入文字、图片或其他形状。必须指定content属性才能让元素出现，例如：.menu::after。

❑ ::first-letter——用于指定匹配元素的第一个文本字符的样式，例如：h2::first-letter。

❑ ::first-line——用于指定匹配元素的第一行文本的样式。

❑ ::selection——用于指定用户使用鼠标高亮选择的任意文本的样式。通常用于改变选中文本的background-color。只有少数属性可以使用，包括color、background-color、cursor、text-decoration。

### 属性选择器

属性选择器用于根据HTML属性匹配元素。其优先级与一个类选择器（0,1,0）相等。

❑ [attr]——匹配的元素拥有指定属性attr，无论属性值是什么，例如：input[disabled]。

❑ [attr="value"]——匹配的元素拥有指定属性attr，且属性值等于指定的字符串值，例如：input[type="radio"]。

❑ [attr^="value"]——“开头”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值的开头是指定的字符串值，例如：a[href^="https"]。

❑ [attr$="value"]——“结尾”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值的结尾是指定的字符串值，例如：a[href$= ".pdf"]。

❑ [attr＊="value"]——“包含”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值包含指定的字符串值，例如：[class＊="sprite-"]。

❑ [attr~="value"]——“空格分隔的列表”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值是一个空格分隔的值列表，列表中的某个值等于指定的字符串值，例如：a[rel="author"]。

❑ [attr|="value"]——匹配的元素拥有指定属性attr，且属性值要么等于指定的字符串值，要么以该字符串开头且紧跟着一个连字符（-）。适用于语言属性，因为该属性有时候会指定一种语言的子集（比如墨西哥西班牙语，es-MX，或者普通的西班牙语，es），例如：[lang|="es"]。
