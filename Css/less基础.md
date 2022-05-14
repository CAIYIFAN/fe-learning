## Less

### 变量

```less
@pre-blue :  #5B83AD;
@after-blue :@nice-blue + #111；
#header{ color: @after-blue; }

#header { color :#6c94be }
```

```less
@fnord:'I am Kim'
@var: 'fnord';
content:@@var

content:'I am Kim';
```

### 混合

```less
.temp{
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
#header a{
  color : #111;
  .temp;
}
#nav a{
  color : black;
  .temp;
}

#header a{
  color : #111;
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
#nav a{
  color : black;
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

```less
.border-radius (@radius) {
        border-radius: @radius;
   -moz-border-radius: @radius;
-webkit-border-radius: @radius;
}

#header {
  .border-radius(4px);
}

.button {
  .border-radius(6px);  
}

.border-radius (@radius : 5px) {
        border-radius: @radius;
   -moz-border-radius: @radius;
-webkit-border-radius: @radius;
}

#header {
  .border-radius(4px);
}
```

```less
.box-shadow (@x: 0, @y: 0, @blur: 1px, @color: #000) {
  box-shadow: @arguments;
  -moz-box-shadow: @arguments;
  -webkit-box-shadow: @arguments;
}
.box-shadow(2px, 5px);

.box-shadow{
          box-shadow: 2px 5px 1px #000;
     -moz-box-shadow: 2px 5px 1px #000;
  -webkit-box-shadow: 2px 5px 1px #000;
}
```

### 模式匹配

```less
//让.mixin根据不同的@switch值而表现各异
.mixin (dark, @color) {
  color: darken(@color, 10%);
}
.mixin (light, @color) {
  color: lighten(@color, 10%);
}
.mixin (@_, @color) {
  display: block;
}

//运行
@switch: light;

.class {
  .mixin(@switch, #888);
}

.class {
  color: #a2a2a2;
  display: block;
}
/*mixin就会得到传入颜色的浅色。如果@switch设为dark，就会得到深色。

具体实现如下：
第一个混合定义并未被匹配，因为它只接受dark做为首参
第二个混合定义被成功匹配，因为它只接受light
第三个混合定义被成功匹配，因为它接受任意值

只有被匹配的混合才会被使用。变量可以匹配任意的传入值，而变量以外的固定值就仅仅匹配与其相等的*/
```

### 导引表达式

```less
//when关键字用以定义一个导引序列(此例只有一个导引)
.mixin (@a) when (lightness(@a) >= 50%) {
  background-color: black;
}
.mixin (@a) when (lightness(@a) < 50%) {
  background-color: white;
}
.mixin (@a) {
  color: @a;
}

//运行
.class1 { .mixin(#ddd) }
.class2 { .mixin(#555) }

.class1 {
  background-color: black;
  color: #ddd;
}
.class2 {
  background-color: white;
  color: #555;
}
```

### 嵌套规则

```less
#header {
  color: black;

  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
    &:hover { text-decoration: none }
  }
}

#header { color: black; }
#header .navigation {
  font-size: 12px;
}
#header .logo { 
  width: 300px; 
}
#header .logo:hover {
  text-decoration: none;
}
```

### 运算

```less
@base : 10%;
@filter : @base * 2;
@other : @base + @filter;

color : #888 / 4;
background-color : @base=color + #111;
height : 100% / 2 + filterl;

@var  : 1px + 5; //6px
width  : (@var + 5 ) *2; //被允许使用括号
border: (@width * 2) solid black;  // 可以在符合属性中进行使用
```

### 函数

```less
lighten(@color, 10%);     // 返回一个比@color低10％更轻的颜色
darken(@color, 10%);      // 返回一个比@color高10％较暗的颜色
saturate(@color, 10%);    // 返回比@color多饱和度10％的颜色
desaturate(@color, 10%);  // 返回一个比@color少饱和度10％的颜色
fadein(@color, 10%);      // 返回一个比@color少10％透明度的颜色
fadeout(@color, 10%);     // 返回一个比@color多10％透明度的颜色
fade(@color, 50%);        // 返回一个颜色透明度为50％的颜色
spin(@color, 10);         // 返回色调比@color大10度的颜色
spin(@color, -10);        // 返回一个比@color小10度色调的颜色
mix(@color1, @color2);    // 返回一个混合@ color1和@ color2的颜色

@base: #f04615;
.class {
  color: saturate(@base, 5%);
  background-color: lighten(spin(@base, 8), 25%);
}

hue(@color)                     //获取色相
saturation(@color)             //获取饱和度
lightness(@color)              //获取明度

@new: hsl(hue(@old), 45%, 90%);
round(1.67); // returns `2`
ceil(2.4);   // returns `3`
floor(2.6);  // returns `2`
percentage(0.5); // returns `50%`
```

### importing(导入)

```less
@import "lib.less";
@import "lib";
```

### 字符串插值

```less
@base-url: "http://assets.fnord.com";
background-image: url("@{base-url}/images/bg.png");
```

### 避免编译

```less
.class {
  filter: ~"ms:alwaysHasItsOwnSyntax.For.Stuff()";
}

.class {
  filter: ms:alwaysHasItsOwnSyntax.For.Stuff();
}
```

