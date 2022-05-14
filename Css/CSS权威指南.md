## 1.CSS和文档

@import指令、link标签

#### 媒体查询

all：用于所有展示媒体

print：为有视力的用户打印文档时使用，也在预览打印效果时使用。

screen：屏幕媒体



and：连接的两个或多个媒体特性必须同时满足条件

not：对整个查询取反

only：只能用在媒体查询的开头

#### 特性查询

渐进增强样式的完美方式。

```
@support (color:black){
	body {color:black;}
	h1 {color:purple;}
	h2 {color:navy;}
}
```

## 2.选择符

#### 元素

```
quto {color:gray};
```

#### 群组

```
body,table,th,td,h1,h2,h3,h4,p,pre,strong,em,b,i{color:gray}
```

#### 通用选择符

```
*{color:red}
```

#### 类选择符

```
.warning {font-wight:bold;}
.warning.urgent{background:silver;}
```

#### ID选择符

```
*#first-para {font-weight:bold;}
```

#### 类选择符和ID选择符的选择

1.类可以使用多次，而一个ID只能使用一次

2.与类选择符不同，ID选择符不能串在一起使用，因为ID属性的值不能是以空格分隔的列表。

#### 属性选择符

```
h1[class] {color:silver}
```

#### 根据精准的属性值选择

```
planet[moons="1"] {font-weight:bold}
```

#### 根据部分属性值选择

| 形式          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| [foo\|="bar"] | 选择元素有foo属性，且其值以bar和一个引文破折号开头，或者就是bar本身 |
| [foo~="bar"]  | 选择的元素有foo属性，且其值是包含bar这个词的一组词           |
| [foo*="bar"]  | 选择的元素有foo属性，且其值包含子串bar                       |
| [foo^="bar"]  | 选择的元素有foo属性，且其值以bar开头                         |
| [foo$="bar"]  | 选择的元素有foo属性，且其值以bar结尾                         |

#### 根据文档结构选择

##### 后代选择器

```
h1 em {color:gray}
```

##### 选择子元素

```
h1>strong{color:red;}
```

##### 选择紧邻同胞元素

```
h1 + p {margin-top: 0;}
```

##### 选择后续同胞

```
h2 ～ol {font-style: italic;}
```

##### 伪类选择器

```
a:link:hover {color: red;}
```

##### 选择根元素

```
:root {boder:10px dotted gray;}
body {boder:10px solid black;}
```

##### 选择空元素

```
p:empty {display:none}
```

##### 选择唯一子类

```
img:only-child {border: 1px solid black;}

a[href] img:only-child {boder:2px solid black;}

a[href] img:only-of-type {float:right; margin: 20px;}

使用only-of-type可以放心选择段落中的图像，而不必担心段正宗有超链接或其他行内元素。
```

##### 选择第一个和最后一个子代

```
选择第一个子代
p:first-child {font-weight:bold;}
li:first-child {text-transform: uppercase;}

最后一个子代
p:last-child {font-weight:bold;}
li:last-child {text-transform:uppercase;}
```

```
这两个伪类结合在一起的效果相当于：only-child
p:only-child {color: red;}
p:first-child:last-child {background-color: red;}
```

**但是切忌不可使用组合规则**

##### 选择第一个和最后一个某种元素

```
table :first-of-type {border-top: 2px solid gray;}

table :last-of-type {border-top:2px solid gray;}
```

```
这两个伪类结合在一起的效果相当于 :only-of-type
table:only-of-type {color:red;}
table:first-of-type:last-of-type {backgound:red;}
```

##### 选择每第n个子元素

```
p:nth-child(1) {font-weight:bold;}
li:nth-child(1) {text-transform: uppercase;}

:nth-child(2n)   选择的是偶数位的子代
:nth-child(2n+1)或:nth-child(2n-1)    选择的是奇数位的子代
even、odd

:nth-last-child(odd)
:nth-last-child(2n+1)

:nth-of-type()
:nth-last-of-type()
```

##### 动态伪类

| 伪类     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| :link    | 指代用超链接的锚记(即具有href属性)，而且指向尚未访问的地址   |
| :visited | 指代指向已访问地址的超链接，出于安全考虑，能应用到已访问链接上的样式十分有限。 |

##### 用户操作伪类

| 伪类    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| :focus  | 指代当前获得输入焦点的元素，即可以接受键盘输入或以某种方式激活 |
| :hover  | 指代鼠标指针放置其上的元素，例如鼠标指针悬停在超链接上       |
| :active | 指代由用户输入激活的元素，例如用户单击超链接时按下鼠标按键的那段时间 |

##### UI状态伪类

| 伪类           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| :enabled       | 指代启用用户界面元素，即接受输入的元素                       |
| :disabled      | 指代禁用用户界面元素，即不接受输入的元素                     |
| :checked       | 指代由用户或文档默认选中的单选按钮或复选框                   |
| :indeterminate | 指代既未选中也没有未选中的单选按钮或复选框；这个状态只能由DOM脚本设定，不能由用户设定。 |
| :default       | 指代默认选中的单选按钮、复选框或选项                         |
| :valid         | 指代满足所有数据有效性语义的输入框                           |
| :invalid       | 指代不满足所有数据有效性语义的输入框                         |
| :in-range      | 指代输入的值在最小值和最大值之间的输入框                     |
| :out-of-range  | 指代输入的值小于控件允许的最小值时或者大于控件允许的最大值的输入框 |
| :required      | 指代必须输入值的输入框                                       |
| :optional      | 指代无需一定输入值的输入框                                   |
| :read-write    | 指代可由用户编辑的输入框                                     |
| :read-only     | 指代不能由用户编辑的输入框                                   |

##### :target 伪类

举个例子：倘若有个名为 example.html 的文档中包含一个 id 属性值为 myelement 的元素，那么使用 example.html#myelement 这个 URL 即可直接导航至该元素，该 URL 中的 #myelement 即称为 URL 片段标志符

URL中有个片段标识符，它所指向的文档片段在CSS中被称为目标target。

:target伪类定义的样式在两种情况下不会被应用

1.页面的URL中没有片段标志符

2.页面的URL中有片段标志符，但是文档中哪有与之匹配的元素。

##### :lang伪类

:lang伪类可以根据文本使用的语言来选择元素。

##### 否定伪类

:not()

```
li:not(.moreinfo) {font-size:italic;}
```

##### 伪元素选择器

```
::marker
```

##### 装饰首字母

```
p::first-letter {color:red;}
```

##### 装饰首行

```
p::first-line {
	font-size: 150%;
	color: purple;
}
```

##### 对::first-letter 和::first-line 的限制

```
目前::first-letter 和::first-line伪元素只能应用到块级元素上，例如标题或段落，不能应用到行内元素上，例如超链接。::first-letter 和::first-line 样式中可以使用的CSS属性也有限制。
```

允许伪元素使用的属性

| ::first-letter   | ::first-line     |
| ---------------- | ---------------- |
| 所有字体属性     | 所有字体属性     |
| 所有背景属性     | 所有背景属性     |
| 所有文本装饰属性 | 所有文本装饰属性 |
| 所有行内排版属性 | 所有行内排版属性 |
| 所有行内布局属性 | 所有行内布局属性 |
| 所有边框属性     | 所有边框属性     |
| box-shadow       | 所有行内排版属性 |
| color            | color            |
| opacity          | opacity          |

##### 装饰或创建前置和后置内容元素

```
h2::before {content: "]]"; color: silver;}
h2::after {content: "The End.";}
```

## 3.特指度和层叠

##### **CSS的权重，结合实例具体分析**

!important > 行内样式>ID选择器 > 类选择器/属性/伪类 > 标签 > 通配符 > 继承 > 浏览器默认属性

!important :无穷

Style:1000

id:0100

Class/伪类:0010

标签:0001

通配符：0000

##### 继承

##### 可继承的属性：

可继承的样式： font-size, font-family, color, text-indent;

不可继承的样式：border, padding, margin, width, height ;

## 4.值和单位

##### 关键字

none、normal、inherit、initial、unset

all（全局关键词）

##### em和rem的区别

em相对当前元素的字号计算，而rem相对根元素计算。

##### 视区单位

vw：视窗宽度的百分比（1vw 代表视窗的宽度为 1%）

vh：视窗高度的百分比

vmin：当前 vw 和 vh 中较小的一个值

vmax：当前 vw 和 vh 中较大的一个值

##### 属性值

attr()

```
p::before {content: "[" attr(id) "]";}
```

rgb()、rgba()

```
rgb(255,255,255)
rgb(100%,100%,100%)
rgba(255,255,255,0.5)
rgba(100%,100%,100%,0.5)
```

rgba在rgb的三个通道后面增加了一个alpha值。

##### 颜色关键值

```
transparent
currentColor
```

##### 角度

```
deg 度数
grad 百分比
rad 弧度
turn 圈数
```

##### 自定义值

```
var()
calc()计算值
--gutter 自定义变量
```

## 5.字体

font-family

##### @font-face

@font-face能够让你使用自定义字体。

```
@font-face {
	font-family: "SwitzeraADF";
	src: url("SwitzeraADF-Regular.otf");
}
```

##### 字体描述符

| 描述符                | 默认值     | 说明                                                         |
| --------------------- | ---------- | ------------------------------------------------------------ |
| font-style            | normal     | 区分常规、斜体和倾斜字体                                     |
| font-weight           | normal     | 区分不同的字重（例如加粗）                                   |
| font-stretch          | normal     | 区分不同的字符宽度（例如紧缩和加宽）                         |
| font-variant          | normal     | 区分众多字形变体（例如小号大写字母），在很多方面与CSS中的font-feature-settings很像 |
| font-feature-settings | normal     | 直接访问OpenType的低层特性（例如启用连字）                   |
| unicode-range         | U+0-10FFFF | 定义指定字体中可用的字符范围                                 |

百分数始终根据继承自父元素的字号计算。

CSS中的字号会继承，但是继承的是计算得到的值，而不是百分数本身。

##### 自动调节字号

font-size-adjust属性用于改变字体族之间的高宽比值。

```
font-size-adjust: 取值 <number>|none|auto
```

##### font-style

```
取值 normal（常规）、italic（斜体）、oblique（倾斜体）
```

##### font-stretch

```
取值 normal | ultra-condensed | extra-condensed | condensed |semi-condensed | semi-expanded |expanded | extra-expanded | ultra-expanded
```

##### font-kerning

```
取值 auto|normal|none
```

##### font-variant

```
取值 normal| small-caps
```

##### 字体特性- font-feature-settings

```
取值 normal
calt 根据上下文替换
ccmp 组合字符
clig 根据上下文连字
liga 标准连字
locl 本地化形式
mark 基本定位标记
mkmk 标记定位标记
```

##### 字体合成  font-symthesis

```
取值 none | weight | style
```

### font属性

```
font：<font-style> <font-weight> <font-size> <font-family>
```

## 6.文本属性

##### 缩进和行内对齐

行内、块级

##### 缩进文本     text-indent

该属性把元素的第一行文本缩进指定的长度，缩进的长度可以是负值。

```
取值： <length> | <percentage>
```

##### 文本对齐 text-align

```
取值 start | end | left | right | center | justify | match-parent | start end
```

##### 对齐最后一行 text-align-last

```
取值 auto | start | end | left | right | center | justify
```

### 块级对齐

##### 行的高度  line-height

```
取值 <number> | <length> | <percentage> | <normal>
```

##### 纵向对齐文本   vertical-align

```
取值  baseline | sub | super | top | text-top | middle | bottom | text-bottom | <length> | <percentage>
```

##### 单词间距  word-spacing

```
取值 <length> | normal
```

##### 字符间距 letter-spacing

```
取值 <length> | normal
```

### 文本转换

##### text-transform

```
取值 uppercase | lowercase | capitalize | none
```

### 文本装饰

##### text-decoration

```
取值 none | [underline || overline || line-through || blink]
```

### 文本渲染效果

##### text-rendering

```
取值 auto | optimizeSpeed | optimizeLegibility | geometricPrecision
```

该属性可以用来优化页面渲染速度？

optimizeSpeed  首先考虑绘制速度

optimizeLegibility 首先考虑清晰性的特性

geometricPercision 的作用是为了让用户代理尽量精准地绘制文本，确保无损缩放。

### 文本阴影

##### text-shadow

```
取值 none | <length>
text-shadow: ragb(128, 128, 255) -5px -0.5em;
```

###  处理空白

##### white-space

```
取值 normal | nowrap | pre | pre-wrap | pre-line
```

| 值       | 空白 | 换行符 | 自动换行 |
| -------- | ---- | ------ | -------- |
| pre-line | 折叠 | 保留   | 允许     |
| normal   | 折叠 | 忽略   | 允许     |
| nowrap   | 折叠 | 忽略   | 禁止     |
| pre      | 保留 | 保留   | 禁止     |
| pre-wrap | 保留 | 保留   | 允许     |

#### 设定制表符的宽度

##### tab-size

```
取值 <length> | <integer>
```

### 换行和断字

##### hyphens

```
取值 manual | auto | none
```

##### word-break

```
取值 normal | break-all | keep-all
break-all 软换行可能出现在任何字符之间，即使是一个词的内部
keep-all 禁止在字符之间软换行
```

##### line-break

| 值     | 说明         |
| ------ | ------------ |
| normal | 正常         |
| loose  | 宽松规则换行 |
| auto   | 自动         |
| strict | 严格规则换行 |

### 文本换行

##### overflow-wrap（原word-wrap）

```
取值 normal | break-word
使用break-word可以在单词内部换行。
```

##### **单行文本溢出加 ... 如何实现？**

​    text-overflow: ellipsis;

### 书写模式

##### writing-mode

```
取值 horizontal-tb | vertival-rl | vertical-lr
```

### 改变文本方向

##### text-orientation

```
取值 mixed | upright | sideways
```

#### 声明方向

##### direction

```
取值  ltr | rtl
```

##### unicode-bidi

```
取值 normal | embed | bidi-override
```

## 7.视觉格式基础化

### 调整元素的显示方式

##### display

| 属性             | 值                                                           |
| ---------------- | ------------------------------------------------------------ |
| display-outside  | block、inline、run-in                                        |
| display-inside   | flow、flow-root、table、flex、grid、ruby                     |
| display-listitem | list-item                                                    |
| display-internal | table-row-group、table-header-group、table-footer-group、table-row、table-cell、table-column-group、table-column、table-caption、ruby-base、ruby-text、ruby-base-container、ruby-text-container |
| display-box      | contents、none                                               |
| display-legacy   | inline-block、inline-list-item、inline-table、inline-flex、inline-grid |

##### 块级框

##### box-sizing

```
content-box
padding-box
bordering-box
```

##### 横向格式化属性

margin-left、margin-right、border-left、border-right、width、padding-right、padding-left、

auto

##### 纵向格式化属性

margin-top、margin-bottom、border-top、border-bottom、padding-top、padding-bottom、height

##### 百分数高度

##### 自动调整高度 

```
height: auto
```

### 行内元素

##### 行内格式化

line-height

纵向对齐

```
line-height = font-size
```

改变断行行为

```
box-decoration-break
slice 默认分行
clone 把元素各片段视作单独的框
```

##### 流动显示方式

```
#first {display:flow;} 块级
#second {display: block flow;} 块级
#third {display: inline flow;} 行内
```

##### display属性的新旧值对照

| 旧值             | 新值                  |
| ---------------- | --------------------- |
| block            | block flow            |
| inline           | inline flow           |
| inline-block     | inline-block flow     |
| list-item        | list-item flow        |
| inline-list-item | inline-list-item flow |
| table            | block table           |
| inline-table     | inline table          |
| flex             | block  flex           |
| inline-flex      | inline flex           |
| grid             | block grid            |
| inline-grid      | inline grid           |

### contents显示方式

```
display: contents 
应用至元素上之后，那个元素不在参与页面的格式化。
```

## 8.内边距、边框、轮廓和外边距

width：适用于除行内非置换元素，表格中的行和行组之外的所有元素。

height：适用于适用于除行内非置换元素，表格中的行和行组之外的所有元素。

padding、padding-left、padding-right、padding-bottom、padding-left、padding-top

### 边框

##### border-style

```
取值：none、hidden、solid、dotted、dashed、double、groove、ridge、inset、outset
```

一个边框可以写多个样式

```
p.aside {border-style: solid dashed dotted solid;}
//此方法为简写，可分别为border-top-style、border-right-style、border-bottom-style、border-left-style
```

##### border-width

```
取值：thin、medium、thick、<length>
同理
```

完全不需要边框使用

```
border-width:none
```

##### border-color

```
同理
```

##### border

```
border:<border-width><border-style><border-color>;
```

##### 圆角边框

##### border-radius

```
#example {border-radius: 2em}
同理
```

##### 图像边框

##### border-image-source

适用于：除border-collapse属性的值为collapse的表格内的元素之外的所有元素（只出现在4个角）

##### border-image-slice

适用于：除border-collapse属性的值为collapse的表格内的元素之外的所有元素

该属性在图像上放置4条裁剪线，这4条线围聚得到的部分用作绘制边框的图像。

##### border-image-width

##### 外推边框     border-image-outset

##### border-image-repeat

```
取值： stretch、repeat、round、space
```

##### boder-image

```
border-image:<border-image-source><border-image-slice><border-image-width><border-image-repeat>
```

### 轮廓

##### outline-style

```
取值：auto、none、solid、dotted、dashed、double、groove、ridge、inset、outset
```

##### outline-width

##### outline-color

##### outline

```
outline:<outline-color><outline-style><outline-width>
```

##### 轮廓与边框的区别

1.轮廓对布局完全没有影响，只仅仅是视觉上的效果

2.轮廓在外边距上

### 外边距

margin、margin-top、margin-right、margin-bottom、margin-left

## 9.颜色、背景和渐变

##### 前景色 color

### 背景

##### 背景色 background-color

##### 裁剪背景 background-clip

``` 
取值： border-box | padding-box | content-box | text
```

##### 背景图 background-image

##### 背景定位 background-position

```
取值：left、center、right、top、bottom、
```

##### 改变定位框 backgound-origin

```
取值：border-box、padding-box、content-box
```

##### 背景重复方式 background-repeat

```
取值：repeat-x、repeat-y、【repeat、space、round、no-repeat】
```

##### 背景粘附 background-attachment

```
取值: scroll、fixed、local
```

##### 控制背景图的尺寸   background-size

```
取值: [[<length>|<percentage>|auto]{1,2}| cover | contain ]
```

##### backgound

```
<bg-image>||<position>[/<bg-size>]? || <repeat-style> || <attachment> || <box> || <box> || <background-color>
```

##### 多个背景图

```
section {
	background-image: url(bg01.png), url(bg02.png), url(bg03.png);
  background-position: top right,left center, 50%,100%;
  background-repeat: no-repeat;
}
```

```
section {
	background: url(bg01.png) right top no-repeat,
							url(bg02.png) center left no-repeat,
							url(bg03.png) 50% 100% repeat-x; 
}
```

### 渐变

```
#ex02 {background-image:linear-gradient(90deg,purple,gold);}
```

##### 径向渐变

```
.radial {backgroudn-image: radial-gradient(purple, gold);}
```

### 盒子投影

##### boxshadow

（inset）

```
.box:nth-of-type(2) {box-shadow: 2em 0.5em 0.25em rgba(128,0,0,0.5);}
```

## 10.浮动及其形状

##### float

浮动会导致脱离文档流

```
取值：left、right、none
```

##### 浮动规则

1.浮动元素的左（或右）外边界不能超过容纳快的左（或右）内边界。

2.如果在文档源码中处于前面的元素向左浮动，那后面的浮动元素的左外边界必在前一个元素右外边界的右侧，除非后一个元素的顶边在前一个元素的底边以下。

3.左浮动元素的右外边界不能在右浮动元素的左外边界的右侧。右浮动元素的左外边界不能在左浮动元素的右外边界的左侧。

4.浮动元素的顶边不能比父元素的内顶边高。如果浮动元素位于两个折叠的外边距之间，在两个元素之间放置它的位置时，将视其有个块级父元素。

5.浮动元素的顶边不能比前方任何一个浮动元素或块级元素的顶边高。

6.浮动元素的顶边不能高于文档源码中出现在浮动元素之前的元素生成的框体所在的行框的顶边。

7.左浮动元素的左边如果还有一个向左浮动的元素，那么它的右外边界不能在容纳快的右侧。（浮动元素不可能超出容纳元素的边界，除非浮动元素太宽，容纳元素放不下）

8.浮动元素必须放置在尽可能高的地方。

9.左浮动元素必须尽量向左移动，右浮动元素必须尽量向右移动。位置越高，向左或向右移动的距离越远。

##### 浮动元素与内容重叠

CSS2.1规定：

1.行内框与浮动元素重叠时，其边框、背景和内容都在浮动元素“之上”渲染

2.块级框与浮动元素重叠时，其边框和背景在浮动元素“背后”渲染，而内容在浮动元素“之上”渲染。

### 清除浮动

##### clear属性

```
取值： left、right、both、none
```

### 浮动形状

##### shape-outside

```
取值：none|[<basic-shape><shape-box>]| <image>
```

图片使用GIF87a和PNG格式

basic-shape

```
inset、circle、ellipse、polygon
```

shape-box

```
margin-box、border-box、padding-box、content-box
```

##### 使用透明图像定义形状

##### shape-image-threshold

```
范围为0-1
```

##### 为形状添加外边距

shape-margin

## 11.定位

### position

##### static

​	正常生成元素框，块级元素生成矩形框，位于文档流中；行内元素生成一个或多个行框，随父元素流动。

##### relative

​	元素框偏移一定的距离。元素的形状与未定位时一样，而且元素所占的空间也与正常情况下相同。

##### absolute

​	元素框完全从文档流中移除，相对容纳块定位。此时，容纳块可能是文档中的另一个元素，也可能是初始容纳块。正常情况下元素在文档流中占据的空间不复存在，好似元素没有出现过一样。不管元素在常规的文档流中生成神恶魔类型的框体，定位后生成的都是块级框。

##### fixed

​	元素框的行为类似于absolute，不过容纳块是视区自身。

##### sticky

​	元素一开始留在常规的文档中，达到出发粘滞条件时，从常规的文档流中移除，不过在常规文档流中占据的空间得以保留。

### 偏移属性

##### top、right、bottom、left

### 宽度和高度

##### width、height、min-width、min-height、max-width、max-height

### 内容溢出和裁剪

##### 溢出  overflow

```
取值 visible、 hidden、 scroll、 auto
```

##### 元素可见性   visibility

```
取值 visible、hidden、collapse
```

### 绝对定位

##### 置换元素的位置和尺寸规则

1.如果把width设置为auto，width的具体值由元素的内在宽度确定。

2.在从左至右书写的语言中，如果left的值是auto，auto将替换为静态位置。在从右至左书写的语言中，right属性的auto值被替换为静态位置。

3.如果left或right的值仍是auto，把margin-left或margin-right的auto值替换为0。

4.如果此时margin-left和margin-right的值为auto，把两者设为相等的值，即让元素居中显示在容纳块中。

### Z轴上的位置

##### z-index

叠放的优先级被称为堆叠次序

z-index的值可以设为任何整数，包括负数。z-index的值为负数时，元素远离读者

##### z-index失效的几种情况

失效的情况:

1、父标签 position属性为relative；

2、问题标签无position属性（不包括static）；

3、问题标签含有浮动(float)属性。

4、问题标签的祖先标签的z-index值比较小

解决方法:

第一种: position:relative改为position:absolute；

第二种:浮动元素添加position属性（如relative，absolute等）；

第三种:去除浮动。

第四种:提高父标签的z-index值

### 固定定位

```
position:fixed
```

### 相对定位

```
position:relative
```

### 粘滞定位

```
position:sticky
```

## 12.弹性盒布局

```
display:flex
display:inline-flex
```

### 弹性容器

##### flex-direction

该属性指定在弹性容器中该如何摆放弹性元素，即定义弹性容器的主轴，弹性容器就沿着这个轴排布。

```
取值： row、row-reverse、column、column-reverse
```

##### 换行    flex-wrap

```
取值：nowrap、wrap、wrap-reverse
```

##### 定义弹性流  flex-flow

该属性用于定义主轴和垂直轴的方向，以及是否允许弹性元素换行。

```
取值 <flex-direction> || <flex-wrap>
```

### 调整内容

##### justify-content

```
取值：flex-start、flex-end、center、space-between、space-around、space-evenly
```

##### align-items

```
取值：flex-start、flex-end、center、baseline、stretch
```

##### align-self

```
取值：auto 、flex-start、flex-end、center、baseline、stretch
```

##### align-content

```
取值：flex-start、flex-end、center、space-between、space-around、space-evenly、strech
```

##### flex

```
取值： [<flex-grow><flex-shrink>? || <flex-basis>] | none
初始值： 0 1 auto
```

flex-grow的值决定弹性增长因子，决定分配弹性容器的可用空间时相对其他同辈弹性元素能增大多少。

flex-shrink指定弹性缩减因子。

### 响应式弹性布局

##### flex-basis属性

```
取值：content | [<length> | <percentage>]
```

##### flex简写属性

常见的弹性值

```
flex:initial
flex:auto
flex:none
flex:<number>
```

##### order属性

默认情况下，弹性元素的显示和排布顺序与在源码中的顺序一致。弹性元素和弹性元素行的顺序可以使用flex-direction属性反转，但是有时你可能需要更细致的重排方式。order属性用于修改单个弹性元素的显示顺序。

order属性修改的是视觉顺序，而不是Tab键的索引顺序。

## 13.栅格布局

#### 1.创建栅格

```
display:grid   常规栅格
display:inline-grid 行内栅格
```

##### 栅格容器不是块级容器

1.浮动的元素不会打乱栅格容器。

2.栅格容器的外边距不与其后代的外边距折叠。

3.有些CSS属性和功能不能用在栅格容器和栅格元素上

​	栅格容器上的所有column属性都被忽略。
​	栅格容器没有::first-line 和;;first-letter伪元素，如果使用则被忽略。

​	栅格元素上的float和clear属性将被忽略。float属性对栅格容器中子元素的display属性的计算值是有影响的，因为栅格元素的display的值在变成栅格元素之前计算。

​	vertical-align属性对栅格元素不起作用，不过可能会影响栅格元素中的内容。

#### 2.放置栅格线

```
grid-template-rows，grid-template-columns
取值 none | <track-list> | <auto-track-list>
```

#### 3.重复栅格线

```
#grid {display:grid;
	grid-template-columns: repeat(3,2em,1fr,1fr)} 
	//重复三次

	grid-template-rows: repeat(auto-fill, [top] sem [bottom])
	//自动填充轨道
```

#### 栅格区域

##### grid-template-areas

```
#grid {display:grid;
	grid-template-areas:
		"h h h h"
		"l c c r"
		"l f f f";}
```

与grid-area搭配使用

##### 使用列线和行线

```
.grid { display:grid;width: 50em;
	grid-template-rows: repeat(5,5em);
	grid-template-colums: repeat(10, 5em);
}
.one {
	grid-row-start:2; grid-row-end: 4;
	grid-column-start:2; grid-row-end:4;
}
.two {
	grid-row-start:1; grid-row-end: 3;
	grid-column-start:5; grid-row-end:10;
}
```

简写：grid-row、grid-column

栅格元素是完全有可能重叠的

##### 栅格流 grid-auto-flow

```
取值： row列优先、column行优先
```

#### 自动增加栅格线

grid-auto-rows、grid-auto-columns、

#### grid简写属性

```
取值：none | subgrid | [<grid-template-rows>/<grid-template-columns>] | [<line-names> ? <string> <track-list>? | <grid-auot-flow>[<grid-auto-rows>[/<grid-auto-columns>]?]?]]
```

#### 释放栅格空间

##### 栏距

grid-row-gap、grid-colunm-gap、grid-gap

#### 栅格的对齐方式

| 属性            | 对齐目标                         | 适用于   |
| --------------- | -------------------------------- | -------- |
| justify-self    | 行内方向（横向）上的一个栅格元素 | 栅格元素 |
| justify-item    | 行内方向（横向）上的全部栅格元素 | 栅格容器 |
| justify-content | 行内方向（横向）上的整个栅格     | 栅格容器 |
| align-self      | 块级方向（纵向）上的一个栅格元素 | 栅格元素 |
| align-item      | 块级方向（纵向）上的全部栅格元素 | 栅格容器 |
| align-content   | 块级方向（纵向）上的整个栅格     | 栅格容器 |

## 14.CSS中的表格布局

display：table、inline-table、table-row、table-row-group、table-header-group、table-footer-group、table-column、table-column-group、table-cell、table-caption

##### 表格中的层

单元格-行-行组-列-列组-表格

##### 表题 caption-side

```
取值：top、bottom
```

##### 单元格的边框  border-collapse

```
取值 collapse、separate、inherit
```

##### 边框间距 border-spacing

##### 处理空单元格 empty-cells

```
取值 show、hide
```

##### 表格的尺寸 table-layout

```
取值 auto | fixed
```

## 15.列表和生成的内容

##### list-style-type

##### list-style-image

##### 列表记号的位置 list-style-position

```
取值 inside 、 outside、 inherit
```

##### 列表样式简写  list-style

```
[<list-style-type> || <list-style-image> || <list-style-position>]
```

##### 生成内容 content

```
打印文档时在每个超链接前面加上文本"(link)"
a[href]::before {content: "(link)";}
```

##### content

```
取值： normal | [<string>|<uri>|<counter>|<attr(identifier>)| open-quote | close-quote | no-open-quote | no-close-quoto]
```

##### 引号 quotes

##### 计数器 counter-reset 重置

```
取值 [<identifier><integer>?]+ | none | inherit

h1 {counter-reset: Chapter 4 section -1 subsec figure 1;}
/* 'subsec'重置为0 */
```

##### counter-increment

```
ol {counter-reset:ordered;} /*默认为0*/
ol li {counter-increment: ordered;} /*默认为1*/
```

##### @counter-style的描述符

| 描述符           | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| system           | 定义要使用的计数器模式系统，可以用的值有fixed、cyclic、alphabetic、numeric、symbolic、additive和extends |
| symbols          | 定义要在计算器模式中使用的符号。除additive和extends记号系统之外，其他系统都需要这个描述符 |
| additive-symbols | 定义在additive计数器模式中使用的符号                         |
| prefix           | 定义放在模式中各计数器之前的字符串或符号                     |
| suffix           | 定义放在模式中各计数器之后的字符串或符号                     |
| negative         | 定义放在计数器中负值两侧的字符串或符号                       |
| range            | 定义应用计数器模式的范围值。在指定范围之外的计数器使用后备计数器格式 |
| fallback         | 定义无法使用主计数器模式表示或者值在range定义的范围之外时使用的计数器模式 |
| pad              | 定义模式中所有计数器至少有几个字符，缺少的位使用指定的一个或一系列符号填充 |
| speak-as         | 定义计数器在文字转语音系统中的发音策略                       |

fixed 固定计数模式，计数器记号数量有限，用完后不重复。

cyclic 循环计数模式

symbolic 符号计数模式

alpahbetic 字母计数模式

numeric  数字计数模式

```
@counter-style hexadecimal {
	system:numeric;
	symbols: '0' '1' '2' '3' '4' '5' '6';
}
```

additive 累加计数模式

extends  扩展计数模式

speak-as发音计数模式

## 16.变形

#### transform属性

### 变形函数

| 函数        | 说明           |
| ----------- | -------------- |
| translate   | 2d平移         |
| translate3d | 3d平移         |
| translateX  | 沿着X轴平移    |
| translateY  | 沿着Y轴平移    |
| translateZ  | 沿着X轴平移    |
| scale       | 2d缩放         |
| scale3d     | 3d缩放         |
| scaleX      | 沿着X轴缩放    |
| scaleY      | 沿着Y轴缩放    |
| scaleZ      | 沿着Z轴缩放    |
| rotate      | 2d旋转         |
| rotate3d    | 3d旋转         |
| rotateX     | 绕着X轴旋转    |
| rotateY     | 绕着Y轴旋转    |
| rotateZ     | 绕着Z轴旋转    |
| skew        | 倾斜           |
| skewX       | 绕着X轴倾斜    |
| skewY       | 绕着Y轴倾斜    |
| matrix      | 矩阵函数变形   |
| matrix3d    | 3d矩阵函数变形 |
| perspective | 视域函数       |

##### transform-origin属性

移动原点

##### 选择3D变形方式  transform-style

```
取值： flat | preserve-3d
```

##### 移动视域的原点 perspective-origin

```
取值 left、center、right、top、bottom
```

##### 处理背面 backface-visibility

```
取值 visible、hidden
```

## 17.过渡

#### css过渡（transition简写）

```
button {
	color: meagenta;
	transition: color 200ms ease-in 50ms;
}
button:hover {
	color: rebeccapurple;
	transition:color 200ms ease-out 50ms;
}
```

#### 定义过渡的属性

##### transition-property

属性名、none、all

##### 过渡事件

tansitionend

##### 设置过渡持续时间 transition-duration

##### 调整过渡的内部时序 transition-timing-function

| 时序函数     | 说明                                       | 三次方贝塞尔值                |
| ------------ | ------------------------------------------ | ----------------------------- |
| cubic-bezier | 指定一个三次方贝塞尔曲线                   | cubic-bezier(x1,y1,x2,y2)     |
| ease         | 慢速开始，然后加速，再慢下来，结束时特别慢 | cubic-bezier(0.25,0.1,0.25,1) |
| linear       | 整个过渡过程保持相同的速度                 | cubic-bezier(0,0,1,1)         |
| ease-in      | 慢速开始，然后加速                         | cubic-bezier(0.42,0,1,1)      |
| ease-out     | 快速开始，然后减速                         | cubic-bezier(0,0,0.58,1)      |
| ease-in-out  | 与ease类似；中间较快，两端很慢，但不同     | cubic-bezier(0.42,0,0.58,1)   |

##### 步进时序

| 时序函数        | 定义                                                   |
| --------------- | ------------------------------------------------------ |
| step-start      | 整个过渡都处在最终关键帧上。等同于steps(1, start)      |
| step-end        | 整个过渡都处在初始关键帧上，等同于steps(1, end)        |
| steps(n, start) | 显示n个固定镜头，其中第一个固定镜头占整个过渡的百分之n |
| steps(n, end)   | 显示n个固定镜头，前百分之n的事件处于初始值状态         |

##### 延迟过渡 transition-delay

## 18.动画

### 定义关键帧

```
@keyframes fadeout {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
}
```

```
@keyframes fadeout {
	0% {
		opacity: 1;
	}
	33.3% {
		opacity: 0;
	}
	100% {
		opacity: 0;
	}
}
```

##### 通过脚本编辑@keyframes动画

```
//获取指定关键帧的选择符和内容
var aRule = myAnimation.findRule('25%', '75%').cssText;

//删除50%关键帧
myAnimation.deleteRule('50%');

//在动画末尾添加53%关键帧
myAnimation.appendRule('53% {top: 50%;}');
```

### 把动画应用到元素上

##### animation-name

```
div {
 	animation-name:change_bgcolor;
}
```

##### animation-duration

```
div {
	animation-name:change_bgcolor,round,W;
	animation-duration:200ms, 100ms, 0.5s;
}
```

##### 声明动画迭代次数  animation-iteration-count

默认情况下动画播放1次

##### 设置动画的播放方向 animation-direction

```
取值： normal、reverse、alternate（2次）、alternate-reverse
```

##### animation-delay

#### 动画事件

animationstart、animationiteration、animationend

属性：animationName、elapsedTime、pseudoElement

##### 改变动画的内部时序   animation-timing-function

##### 设置动画的播放状态 animation-play-state

```
取值： running、paused
```

##### 动画的填充模式 animation-fill-mode

```
取值： none、forwards、backwards、both
```

##### animation

```
#animated {
	animation: 200ms ease-in 50ms 1 normal running forwards slidedown
}
#animated {
	animation-name : slidedown;
	animation-duration : 200ms;
	animation-timing-function : ease-in;
	animation-delay : 50ms;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
	animation-direction:normal;
	animation-play-state: running;
}
```

## 19.滤镜、混合、裁剪、遮罩

### 滤镜 filter

blur()

​	使用高斯模糊对元素的内容做模糊处理，标准偏差由length值定义，设置为0时不对元素做模糊处理。标准偏差值不能设为负值。

opacity()

​	把透明度滤镜应用到元素上，0表示完全透明，1或100%则不对元素做任何处理，不允许使用负值。

drop-shadow()

​	创建与元素的alpha通道形状一致的投影，带模糊效果，而且可以指定颜色。

grayscale()

​	把元素的颜色变成指定的灰阶，值为0时，元素没有任何变化；值为1或100%时，元素完全变成灰度。

sepia()

​	把元素的原色变成指定的墨色调，值为0时，元素没有任何变化；值为1或100%时，元素完全变成褐色。

invert()

​	把元素的所有颜色做相反处理。

hue-rotate()

​	在色轮上旋转色相。

brightness()

​	调整元素上颜色的亮度。

contrast()

​	调整元素上颜色的对比度

saturate()

​	调整元素上颜色的饱和度。

### 合成和混合

##### mix-blend-mode属性

```
取值： normal、multiply、screen、overlay、darken、lighten、color-dodge、color-burn、hard-light、soft-light、difference、exculsion、hue、saturation、color、luminosity
```

##### 背景混合 backgound-blend-mode属性

```
取值： normal、multiply、screen、overlay、darken、lighten、color-dodge、color-burn、hard-light、soft-light、difference、exculsion、hue、saturation、color、luminosity
```

##### 独立混合 isolation

```
取值 auto、isolate
```

### 裁剪和遮罩

#### 裁剪

##### clip-path

```
取值：none | <url> | [[inset() | circle() | ellipse() | polygon()] || [border-box | padding-box | content-box | margin-box | fill-box | stroke-box |view-box]]
```

##### 裁剪填充规则 clip-rule

```
取值： nonzero | evenodd
```

### 蒙版

##### mask-image

```
取值： none、image、mask-source
```

##### 改变蒙版的模式 mask-mode

```
取值：alpha、luminance、match-source
```

#### 调整蒙版的尺寸和重复方式 

##### mask-size

```
取值：[[<length>|<percentage>|auto]{1,2} | cover | contain]
```

##### mask-repeat

```
取值：[repeat-x |repeat-y| [repeat|space|round|no-repeat]{1,2}]
```

##### mask-position

##### mask-origin

```
取值:content-box、padding-box、border-box、margin-box、fill-box、stroke-box、view-box
```

##### 裁剪和合成蒙层

##### mask-clip

```
取值:content-box、padding-box、border-box、margin-box、fill-box、stroke-box、view-box、noclip
```

##### mask-composite

```
取值：add、subtract、intersect、exclude
```

##### mask

```
取值：[<mask-image> || <mask-position> [/<mask-size>]？ || <mask-repeat> || <mask-clip> ||<mask-origin> || <mask-composite> || <mask-mode>]
```

##### 蒙版类型 mask-type

```
取值： luminance、alpha
```

##### 遮罩边框图像 

mask-border-source、mask-border-slice、mask-border-width、mask-border-outset、mask-border-repeat、mask-border-mode、mask-border

##### 对象填充和定位 object-fit

```
取值 fill、contain、cover、scale-down、none
```

##### object-position

## 20.针对特定媒体的样式

@import  @media

#### 媒体类型

all、print、screen、speech