Vite组成：

1.No-Bundle开发服务器

源文件无需打包，直接以原生ES modules的形式加载

2.生产构建

基于Rollup预先配置好的，针对生产环境高度优化的打包命令。



Vite的设计基于两个新趋势

1.现代JavaScript支持广泛铺开

2.新一代的用原生编译语言写的JS编译器（基于Go的esbuild）



原生ESM开发服务器的优势

1.不需要打包源码

2.自然按需处理

3.可直接利用浏览器缓存

4.可以实现更简单高效的热更新（HMR）



原生ESM服务器的技术挑战

HTTP请求开销

加载大量的小模块=大量的并发HTTP请=慢



如何减少HTTP请求开销？

1.用esbuild进行依赖预打包

保证一个依赖对应最多一个HTTP请求

同时处理CommonJs转ESM的兼容

2.利用HTTP header缓存依赖

对预打包过后的一阿里的请求会带有`？v=xxxxxxx`指纹

直接上强缓存`Cache-Control: max-age=31536000,immutable`

除非依赖版本变化，否则不会再产生HTTP请求

3.优化源文件请求

源文件返回的header中带有etag

服务器会保存每个文件的更新状态，没有改动的文件直接返回`304 Not Modified`



为什么生产还是要打包？

简单说：不打包的部署模式会导致大量的级联HTTP请求，对缓存策略也有复杂的要求，目前来说依然不如打包的的部署策略。



Web Worker

图表并行渲染

OffscreenCanvas

WorkerPool（线程池调度）



WebGL



WebAssembly

wasm带来的性能提升相当可观

wasm更适合复杂的计算逻辑

打包后的体积略大



跨端技术

1.多技术栈兼容

2.单页编译

3.同步的多端调试



跨端语法

1.内置环境变量

2.条件变异

3.多端文件后缀





移动端性能优化

虚拟列表 ---- 结构改造、卡片高度计算、白屏优化

低端机降级 ---- 划分标准、优化内容（轮播图改单图、动图改静图、大图改小图、去除跨模块关联、去除实践关联）

体验评分（首屏dom数、图片大小、setData调用频率、内容大小）



代码体积优化

1.代码分包

2.依赖分析：移除未使用内容

3.避免使用本地资源（图片）

4.所有类型都进行压缩和注释清理

5.继承属性

6.样式补全

7.样式命名优化

8.移除map文件



VR加载消耗时--优化策略

组件、模块化：加载优先策略->懒加载

时机控制：VR全景就绪再渲染

网络缓存：浏览器、Node端等请求、计算

网络优化

限制HTTP请求数，避免密集网络请求消耗

增加HTTP2协议支持、静态资源动态域名请求

Basic Universal压缩：不依赖jpg/png格式



贝壳前端中台---整体架构

规范统一：UI规范、数据规范、交互规范、组件规范

客户端：文档服务、示例服务、Mock服务、换肤、依赖分析、Init、Start、Build、Debug、Deploy、

服务层：权限、物料库、Combo、站点代理、物料存储

应用层：配置解析、依赖加载、render、数据埋点、物料文档、社区运营、数据大盘、FAQ、场景组件、贡献激励



MBC业务标准化容器在美团的实践

1.标准化

数据标准化

埋点标准化

交互标准化

设计语言标准化

2.动态化

动态孵化页面

客户端容器动态化

服务端容器动态化

3.配置化

页面配置化

模版配置化

埋点配置化

4.智能化

千人千面



MBC协议层：数据标准化、埋点标准化、架构标准化、设计语言标准化、测试标准化、交互标准化、

自动化测试

配置化平台：页面搭建、模版库、组件库、埋点配置、事件配置、逻辑配置、业务信息配置、数据绑定

服务端容器：API管理、数据源管理、业务模块管理、网关路由、服务编排、DSL引擎、限流、熔断、降级、弹性伸缩

客户端容器：页面路由、网络请求、框架渲染、动态布局引擎、消息机制、事件总线、统一埋点



动态化----客户端页面容器

基础层：事件总线、日志管理、线程池、埋点上报、生命周期、

数据层：数据解析、网络请求、路由、缓存策略、

交互层：事件感知、事件分发、js bridge、js引擎

渲染层：类型映射、数据绑定、布局算法、渲染引擎、线性布局、网格布局、瀑布流布局、吸顶布局、分Tab布局、流式布局

扩展层：异常监控、统一埋点、业务兜底、注册管理

