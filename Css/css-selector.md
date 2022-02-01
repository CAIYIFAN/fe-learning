---
title: 子代选择器与后代选择器的区别
date: 2021-02-16 01:16:48
tags: CSS
---

##### 使用后代选择器

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>后代与子代选择器的区别</title>
    <!--<link rel="stylesheet" type="text/css" href="*.css"/>-->
    <script language="javascript" type="text/javascript"></script>
    <style>
        .zero li
        {
            border:1px solid red;
        }
    </style>
</head>
<body>
    <ul class="zero" >
        <li>我是祖先</li>
       <ul>zero
           <li>我是第二代</li>
                <ul>
                    <li>
                    我是第三代
                    </li>
                </ul>
      </ul>
    </ul>
</body>
</html>
```

##### 使用子代选择器

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>后代与子代选择器的区别</title>
    <!--<link rel="stylesheet" type="text/css" href="*.css"/>-->
    <script language="javascript" type="text/javascript"></script>
    <style>
        .zero>li
        {
            border:1px solid red;
        }
    </style>
</head>
<body>
    <ul class="zero" >
        <li>我是祖先</li>
       <ul>zero
           <li>我是第二代</li>
                <ul>
                    <li>
                    我是第三代
                    </li>
                </ul>
      </ul>
    </ul>
</body>
</html>
```

子代选择器与后代选择器的区别是：

后代包含子代，但是后代不全是子代。

##### 验证中会遇到的问题

当使用的css属性是可继承的会导致，使用子代选择器、后代选择器展示的效果是一样的。

##### 可继承的属性：

可继承的样式： font-size, font-family, color, text-indent;

不可继承的样式：border, padding, margin, width, height ;

**同理**，可以使用子代选择器和后代选择器去验证属性是否可继承。