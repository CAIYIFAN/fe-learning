## 解决方案

这里有两个方案，使用rgba()间接的设定opacity的值，这个属性不会向下继承，或者既然opacity会被子级元素继承，那就把opacity属性放到同级元素实现，下面通过示例具体说说这两种方式：

### 1.使用rgba()间接的设定opacity

rgba()有四个参数，最后一个参数就是opacity的值，和opacity单独设定效果一样，但是这个是有background属性来控制的，background不会向下继承，所以就解决这个问题啦，示例如下：

```
<!DOCTYPE html>
<html>
<head>
 <meta charset="utf-8">
 <title>opacity</title>
</head>
<style type="text/css">
 .opacity{
  position: relative;
  width: 400px;
  height: 300px;
  color: black;
  background: rgba(255,0,0,0.5);
 }
 .opacity-child{
 }
 .normal{
  width: 400px;
  height: 300px;
  background: red;
  color: black;
 }
 </style>
<body>
 <div class="opacity">
  <div class="opacity-child">子元素会继承父级元素的opacity属性</div>
 </div>
 <div class="normal">子元素会继承父级元素的opacity属性</div>
</body>
</html>
```

### 2.把opacity属性放到同级元素实现

```
<!DOCTYPE html>
<html>
<head>
 <meta charset="utf-8">
 <title>opacity</title>
</head>
<style type="text/css">
 .opacity{
  position: relative;
  width: 400px;
  height: 300px;
  color: black;
  }
  .opacity-child{
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
 }
  .opacity-child-background{
  position: absolute;
  top : 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: red;
  opacity: 0.5;
  z-index: 0;
 }
  .normal{
  width: 400px;
  height: 300px;
  background: red;
  color: black;
 }
 </style>
<body>
 <div class="opacity">
  <div class="opacity-child">子元素会继承父级元素的opacity属性</div>
  <div class="opacity-child-background"></div>
 </div>
 <div class="normal">子元素会继承父级元素的opacity属性</div>
</body>
</html>
```

### 3.透明实现的另一个技巧

```
filter:alpha(Opacity=0);
```

