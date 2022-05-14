## 前端性能优化

### 网络相关

1、尽量减少 HTTP 请求个数——须权衡

2、使用 **CDN**（内容分发网络）

3、为文件头指定 Expires 或 Cache-Control ，使内容具有缓存性

4、使用 gzip 压缩内容

5、减少 DNS 查找次数

6、配置 ETags

7、减少 Cookie 的大小

8、使用无 cookie 的域

9、避免 404

10、DNS预解析

### css相关

1、避免使用 CSS 表达式

2、用 <link> 代替 @import

3、避免使用滤镜

4、雪碧图

### js相关

1、精简 CSS 和 JS

2、剔除重复的 JS 和 CSS

3、开发智能事件处理程序

### html相关

1、避免空的 src 和 href

2、把 CSS 放到顶部

3、把 JS 放到底部

4、将 CSS 和 JS 放到外部文件中

5、避免跳转

6、使 AJAX 可缓存

7、尽早刷新输出缓冲

8、使用 GET 来完成 AJAX 请求

9、减少 DOM 元素个数

10、根据域名划分页面内容

11、尽量减少 iframe 的个数

12、减少 DOM 访问

13、预渲染

### 图像、文件相关

1、延迟加载

2、预加载

3、优化图像

4、优化 CSS Spirite

5、不要在 HTML 中缩放图像——须权衡

6、保持单个内容小于25K

7、favicon.ico要小而且可缓存

8、打包组件成复合文本

### Webpack相关

1、对于 Webpack4，打包项目使用 production 模式，这样会自动开启代码压缩

2、使用 ES6 模块来开启 tree shaking，这个技术可以移除没有使用的代码

3、优化图片，对于小图可以使用 base64 的方式写入文件中

4、按照路由拆分代码，实现按需加载

5、给打包出来的文件名添加哈希，实现浏览器缓存文件

#### 首屏加载优化

1. 在使用ui库时,尽量使用按需加载方式

2. 异步加载,官方文档很详尽

3. 合理规划三方库的引用

4. 善用webpack-bundle-analyzer优化项目依赖

5. 服务端开启 gzip压缩



cdn

index.html为协商缓存

css、js为强缓存；

因为生成的html为hash引用，只需要改变index.html就够了



```xml
 <link rel="dns-prefetch" href="https://lf-cdn-tos.bytescm.com/">
```