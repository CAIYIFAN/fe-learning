## 编码规则

建议代码开头位置显式定义 `@charset "encoding-name";` ，让SASS能够按照给定的字符集编译输出。

## 变量

```scss
$font-stack:    Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

```css
body {
  font: 100% Helvetica, sans-serif;
  color: #333; }
```

## 嵌套

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none; }
nav li {
  display: inline-block; }
nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none; }
```

## 引入

```scss
// _reset.scss
html, body, ul, ol {
  margin:  0;
  padding: 0;
}

// base.scss
@import 'reset';
body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

```css
html, body, ul, ol {
  margin: 0;
  padding: 0; }

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef; }
```

## 混合

```scss
@mixin border-radius($radius) {
          border-radius: $radius;
      -ms-border-radius: $radius;
     -moz-border-radius: $radius;
  -webkit-border-radius: $radius;
}

.box {
  @include border-radius(10px);
}
```

```css
.box {
  border-radius: 10px;
  -ms-border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px; }
```

## 继承

```scss
// 这段代码不会被输出到最终生成的CSS文件，因为它没有被任何代码所继承。
%other-styles {
  display: flex;
  flex-wrap: wrap;
}

// 下面代码会正常输出到生成的CSS文件，因为它被其接下来的代码所继承。
%message-common {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.message {
  @extend %message-common;
}

.success {
  @extend %message-common;
  border-color: green;
}

.error {
  @extend %message-common;
  border-color: red;
}

.warning {
  @extend %message-common;
  border-color: yellow;
}
```

```css
.message, .success, .error, .warning {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333; }

.success {
  border-color: green; }

.error {
  border-color: red; }

.warning {
  border-color: yellow; }
```

## 引用父级选择器&

```scss
/*===== SCSS =====*/
a {
  font-weight: bold;
  text-decoration: none;
  &:hover { text-decoration: underline; }
  body.firefox & { font-weight: normal; }
}

/*===== CSS =====*/
a {
  font-weight: bold;
  text-decoration: none; }
  a:hover {
    text-decoration: underline; }
  body.firefox a {
    font-weight: normal; }
```

## 数据类型

```
1.数值number ： 1.2 , 13 , 10px
2.颜色color ： blue 、 #04a3f9 、 rgba(255, 0, 0, 0.5)
3.布尔值bollean ： true 、 false
4.空值null ： null
5.字符串string ：有或没有引号， "menu" 、 'sidebar' 、 navbar
6.数组list ：由空格或逗号分隔， 1.5em 1em 0 2em, Helvetica, Arial, sans-serif
7.对象map ： (key1: value1、key2: value2)
8.函数function 。
```

## 插值 `#{}`

```scss
/*===== SCSS =====*/
$name: uinika;
$attr: border;
p.#{$name} {
  #{$attr}-color: blue;
}

/*===== CSS =====*/
p.uinika {
  border-color: blue; }
```

#### 变量默认值 `!default`

```scss
/*===== SCSS =====*/
$content: "First content";
$content: "Second content?" !default;
$new_content: "First time reference" !default;
#main {
  content: $content;
  new-content: $new_content;
}

/*===== CSS =====*/
#main {
  content: "First content";
  new-content: "First time reference"; }
```

```scss
/*===== SCSS =====*/
$content: null;
$content: "Non-null content" !default;
#main {
  content: $content;
}

/*===== CSS =====*/
#main {
  content: "Non-null content"; }
```

## 嵌套的@import

```scss
/*===== SCSS =====*/
// 文件demo.scss包含如下代码
.demo {
  color: red;
}

#app {
  @import "demo"; // 在文件app.scss中引入demo.scss
}

/*===== CSS =====*/
#app .demo {
  color: red;
}
```

## @media

```scss
/*===== SCSS =====*/
.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}

/*===== CSS =====*/
.sidebar {
  width: 300px;
}

@media screen and (orientation: landscape) {
  .sidebar {
    width: 500px;
  }
}
```

## @extend

```scss
/*===== SCSS =====*/
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}

/*===== CSS =====*/
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  border-width: 3px;
}
```

## 多重继承

```scss
/*===== SCSS =====*/
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.attention {
  font-size: 3em;
  background-color: #ff0;
}
.seriousError {
  @extend .error;
  @extend .attention;
  border-width: 3px;
}

/*===== CSS =====*/
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd;
}

.attention, .seriousError {
  font-size: 3em;
  background-color: #ff0;
}

.seriousError {
  border-width: 3px;
}
```

## !optional

如果希望 `@extend` 不生成任何选择器，可以在选择器后面添加 `!optional` 标志

```scss
a.important {
  @extend .notice !optional;
}
```

## @debug

`@debug` 指令打印SassScript表达式的值到标准错误输出流，可以用来调试具有复杂SassScript的SASS文件，例如：

```scss
/*===== SCSS =====*/
@debug 10em + 12em;

/*===== CSS =====*/
Line 1 DEBUG: 22em
```

## @warn

`@warn` 指令打印SassScript表达式的值到标准错误输出流，在警告用户弃用库或者修复 `mixin` 轻微错误的场景比较有用， `@warn` 和 `@debug` 存在2个主要区别：

可以使用 `--quiet` 命令行选项或SASS的 `:quiet` 选项来关闭 `@warn` 警告。

样式表trace将与消息一起被打印，开发人员可以方便的看到 `@warn` 警告发生在样式表的哪里个位置。

```scss
/*===== SCSS =====*/
@mixin adjust-location($x, $y) {
  @if unitless($x) {
    @warn "Assuming #{$x} to be in pixels";
    $x: 1px * $x;
  }
  @if unitless($y) {
    @warn "Assuming #{$y} to be in pixels";
    $y: 1px * $y;
  }
  position: relative;
  left: $x;
  top: $y;
}
```

## @error

`@error` 指令抛出一个SassScript表达式的值作为致命错误，其中包含了友好的堆栈trace，可以用来验证 `mixin` 和 `function` 的参数，例如：

```scss
@mixin adjust-location($x, $y) {
  @if unitless($x) {
    @error "$x may not be unitless, was #{$x}.";
  }
  @if unitless($y) {
    @error "$y may not be unitless, was #{$y}.";
  }
  position: relative;
  left: $x;
  top: $y;
}
```

SASS当前还没有提供捕获 `@error` 的方式。

## @if

`@if` 指令接收一个SassScript表达式，当表达式返回 `false` 或者 `null` 之外的数据时，会选择使用接下来的嵌套语句，

```scss
/*===== SCSS =====*/
p {
  @if 1+1==2 {
    border: 1px solid;
  }
  @if 5 < 3 {
    border: 2px dotted;
  }
  @if null {
    border: 3px double;
  }
}

/*===== CSS =====*/
p {
  border: 1px solid; }
```

`@if` 语句后面可以跟随多个 `@else if` 语句和一个 `@else` 语句，如果 `@if` 语句失败，SASS将逐个尝试 `@else if` 语句，直至其中一个成功；如果全部失败，则会执行 `@else` 语句。例如：

```scss
/*===== SCSS =====*/
$type: monster;
p {
  @if $type==ocean {
    color: blue;
  }
  @else if $type==matador {
    color: red;
  }
  @else if $type==monster {
    color: green;
  }
  @else {
    color: black;
  }
}

/*===== CSS =====*/
p {
  color: green; }
```

## @for

`@for` 指令用于重复输出一组样式，每次重复时都会存在一个计数器变量用于调整输出结果。该指令拥有 `@for $var from  through ` 和 `@for $var from  to ` 两种形式。

`$var` 可以是任意变量名（例如 `$i` ）， `` 和 `` 是返回整数的SassScript表达式，如果 `` 大于 `` ，那么计数器将会进行递减而非递增。

`@for` 指令会设置 `$var` 为指定范围内的连续数值，对于 `from...through` 数值范围包括 `` 和 `` 的值，对于 `from...to` 会从 `` 开始运行，但不会包括 `` 的值。

```
/*===== SCSS =====*/
@for $i from 1 through 3 {
  .item-#{$i} {
    width: 2em * $i;
  }
}

/*===== CSS =====*/
.item-1 {
  width: 2em; }

.item-2 {
  width: 4em; }

.item-3 {
  width: 6em; }
```

## @each

`@each` 指令的使用格式为 `@each $var in ` ，其中 `$var` 可以是任意变量名称（ *例如 `$length` 或 `$name`* ），而 `` 是一个返回 `list` 或者 `map` 的SassScript表达式。

`@each` 规则设置 `$var` 为 `list` 或 `map` 当中的每一项，输出样式中将会使用 `$var` 的实际值。

```scss
/*===== SCSS =====*/
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}

/*===== CSS =====*/
.puma-icon {
  background-image: url("/images/puma.png"); }

.sea-slug-icon {
  background-image: url("/images/sea-slug.png"); }

.egret-icon {
  background-image: url("/images/egret.png"); }

.salamander-icon {
  background-image: url("/images/salamander.png"); }
```

## 多重赋值

`@each` 指令能够以 `@each $var1, $var2, ... in ` 的格式使用多个变量，如果 `` 是一个列表中的列表元素，那么子列表中的每个元素将会被分配至各自的变量，例如：

```scss
/*===== SCSS =====*/
@each $animal, $color, $cursor in (puma, black, default), (sea-slug, blue, pointer), (egret, white, move) {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
    border: 2px solid $color;
    cursor: $cursor;
  }
}

/*===== CSS =====*/
.puma-icon {
  background-image: url("/images/puma.png");
  border: 2px solid black;
  cursor: default; }

.sea-slug-icon {
  background-image: url("/images/sea-slug.png");
  border: 2px solid blue;
  cursor: pointer; }

.egret-icon {
  background-image: url("/images/egret.png");
  border: 2px solid white;
  cursor: move; }
```

## @while

`@while` 指令可以用来重复输出嵌套的样式，直至SassScript表达式返回结果为 `false` ，可以用于实现比 `@for` 语句更复杂的循环，但日常开发较少使用。

```scss
/*===== SCSS =====*/
$i: 6;
@while $i>0 {
  .item-#{$i} {
    width: 2em * $i;
  }
  $i: $i - 2;
}

/*===== CSS =====*/
.item-6 {
  width: 12em; }

.item-4 {
  width: 8em; }

.item-2 {
  width: 4em; }
```

## 输出类型

虽然SASS默认输出的CSS格式是良好的，但是可以根据开发人员的个人习惯，使用SASS提供的其它4种输出格式。即可以通过 `:style` 选项进行设定，也可以在命令行中直接使用 `--style` 标志。

### `:nested`

嵌套nested是SASS默认的输出格式，每个属性都会占据一行，但缩进不是固定的，每个规则都基于其嵌套深度进行缩进。例如：

```scss
#main {
  color: #fff;
  background-color: #000; }
  #main p {
    width: 10em; }

.huge {
  font-size: 10em;
  font-weight: bold;
  text-decoration: underline; }
```

### `:expanded`

扩展expanded格式类似于人工手写的CSS样式，每个属性和规则都独占用一行。规则当中的CSS属性会进行缩进，但规则本身并不会进行任何特殊的缩进，例如：

```scss
#main {
  color: #fff;
  background-color: #000;
}
#main p {
  width: 10em;
}

.huge {
  font-size: 10em;
  font-weight: bold;
  text-decoration: underline;
}
```

### `:compact`

紧凑compact格式比起上述两种格式占据的空间更小，这种格式将重点聚焦在选择器而非CSS属性上。每个CSS规则独自占据一行，该行还包括全部的CSS属性。 *每个嵌套的规则都会另起新行，不嵌套的选择器会输出空白行作为分隔* ，例如：

```scss
#main { color: #fff; background-color: #000; }
#main p { width: 10em; }

.huge { font-size: 10em; font-weight: bold; text-decoration: underline; }
```

### `:compressed`

压缩compressed格式会尽可能减小所生成文件的体积，并在该文件末尾产生一个换行。除了必要的选择器分隔之外，几乎没有多余的空格。这种格式会让颜色等CSS属性值以最简短的方式来进行表示，由于代码可读性极差，因此主要用于生产环境。

```scss
#main{color:#fff;background-color:#000}#main p{width:10em}.huge{font-size:10em;font-weight:bold;text-decoration:underline}
```

### Sass函数

转载至:https://www.jianshu.com/p/7f879ce0cbb9

#### 1. 字符串函数

- unquote（$string）：删除字符串中的引号；
- quote（$string）：给字符串添加引号；
- To-upper-case（$string）：将字符串小写字母转换为大写字母
- To-lower-case（$string）：将字符串大写字母转换为小写字母

#### 2. 数字函数

- percentage($value)：将不带单位的数转换成百分比值；
- round($value)：将数值四舍五入，转换成一个最接近的整数；
- ceil($value)：向上取整；
- floor($value)：向下取整；
- abs($value)：取数的绝对值；
- min($numbers…)：找出几个数值之间的最小值；
- max($numbers…)：找出几个数值之间的最大值；
- random(): 获取随机数

#### 3. 列表函数

- length($list)：返回一个列表的长度值;
- nth($list, $n)：返回一个列表中指定的某个标签值;
- join($list1, $list2, [$separator])：将两个列给连接在一起，变成一个列表；
- append($list1, $val, [$separator])：将某个值放在列表的最后；
- zip($lists…)：将几个列表结合成一个多维的列表；
- index($list, $value)：返回一个值在列表中的位置值。

```
//SCSS
.demo1 {
  width : length(10px);   //返回列表清单中有多少个值，空格隔开，不能使用逗号。
  height:  length(border 1px solid)  //同一个列表里,可以是不同类型、不同单位的值
}
.demo2 {
  width: nth((Helvetica,Arial,sans-serif),2);   //指定列表中某个位置的值，1是指列表中的第一个标签值,以此类推。
  height: nth((1px solid red) border-top green,1);
}
.demo3 {
  margin: join((10px 20px),(30px 40px));  //将两个列表连接合并成一个列表,不同列表之间用逗号隔开。
  padding: append((10px,20px,20px),30px);  //将某个值插入到列表中，并且处于最末位
  border: zip(1px 2px 3px,solid dashed dotted) ;  //多个列表值转成一个多维的列表,每个单一的列表个数值必须是相同
}
.demo4 {
  width: index(1px solid red, 1px);   //返回对应的值在列表中所处的位置,第一个值就是1,以此类推。
  height:  index(1px solid red, yellow)  //如果指定的值不在列表中，那么返回的值将是false著作权归作者所有。
}
//CSS
.demo1 {
  width: 1;
  height: 3;
}
.demo2 {
  width: Arial;
  height: 1px solid red;
}
.demo3 {
  margin: 10px 20px 30px 40px;
  padding: 10px, 20px, 20px, 30px;
  border: 1px solid, 2px dashed, 3px dotted;
}
.demo4 {
  width: 1;
}
```

#### 4. Introspection函数

- type-of($value)：返回一个值的类型;
- unit($number)：返回一个值的单位;
- unitless($number)：判断一个值是否带有单位;
- comparable($number-1, $number-2)：判断两个值是否可以做加、* 减和合并.

#### 5. 三元条件函数

```
if($condition,$if-true,$if-false);
```

```
//SCSS
.demo1{width:if(true,8em,20em)}
.demo2{height:if(false,8em,20em)}
//CSS
.demo1 { width: 8em;}
.demo2 {height: 20em;}
```

#### 6.Maps的函数

- map-get($map,$key)：根据给定的 key 值，返回 map 中相关的值；
- map-has-key($map,$key)：根据给定的 key 值判断 map 是否有对应的 value 值，如果有返回 true，否则返回 false。
- map-keys($map)：返回 map 中所有的 key。
- map-values($map)：返回 map 中所有的 value。
- map-merge($map1,$map2)：将两个 map 合并成一个新的 map。
- map-remove($map,$key)：从 map 中删除一个 key，返回一个新 map。
- keywords($args)：返回一个函数的参数，这个参数可以动态的设置 key 和 value。

#### 7.颜色函数

- rgb($red,$green,$blue)：根据**红**、**绿**、**蓝**三个值创建一个颜色；
- rgba($red,$green,$blue,$alpha)：根据**红**、**绿**、**蓝**和**透明度**值创建一个颜色；
- red($color)：从一个颜色中获取其中**红色**值；
- green($color)：从一个颜色中获取其中**绿色**值；
- blue($color)：从一个颜色中获取其中**蓝色**值；
- mix($color-1,$color-2,[$weight])：把两种颜色混合在一起。

#### 8.自定义函数

```
//SCSS
@function column-width($col, $total) {
  @return percentage($col/$total);
}
.col-3 {
  width: column-width($col:3, $total:8);
}
.col-5 {
  width: column-width($total:5,$col:8);
}
```

```
//CSS
.col-3 {  width: 37.5%; }
.col-5 {  width: 160%; }
```
