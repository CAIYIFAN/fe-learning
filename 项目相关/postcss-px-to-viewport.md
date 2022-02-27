---
title: 移动端适配方案之postcss-px-to-viewport
date: 2021-02-15 23:34:39
tags: 自适应
---

## 移动端适配方案之postcss-px-to-viewport

安装

```
npm install postcss-px-to-viewport
```

引入

```javascript
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3, //指定'px'需要转换为视窗单位值的小数位数
      viewportUnit:"vw", //指定需要转换为的视窗单位
      selectorBlackList: ['.ignore'], //指定不转换为视窗单位的类，可以自定义，也可无限添加
      minPixelValue:1,//小于或等于'1px'不转换为视窗单位
      mediaQuery: false//允许在媒体查询中转换'px'
    }
  }
}
```

