在PC项目开发中，一般会使用Chrome的开发者工具进行调试，亦或是其他浏览器的开发工具进行调试。

在平常开发中，我一般会使用Chrome或者是Safari进行调试。

Chrome的功能非常强大，它的工具栏主要分为Elements、Console、Sources、NetWork、Performance、Memory、Application、Lighthouse、Security九大块功能。

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b6d658310bf488f8ecb8e1f260050bb~tplv-k3u1fbpfcp-watermark.image)

本文仅稍微列举Chrome部分功能：

1.查阅增改 DOM 和格式、CSS样式

2.测试页面性能和 SEO

3.通过NetWork请求接受的资源

4.Application 查看利用信息

5.Rendering 实时检测网页变化

前文提到Chrome的功能非常强大，掘金小册中有一本关于Chrome的调试技巧的，5星好评呀！感兴趣的小伙伴可以去找一下。

为了方便移动端调试，在移动端H5项目中往往使用Vconsole以及Charles(MAC系统)进行抓包。

Vconsole: A lightweight, extendable front-end developer tool for mobile web page.

简单讲Vconsole是专门针对移动端调试的轻量调试工具。

主要功能为：

1.log可以查看console.log的打印信息 

2.network可以查看实时请求的接口 

3.Element可以查看html页面节点 

4.Storage可以查看本地storage存储的数据

5.Clear清除

6.Hide隐藏

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44bcf8bd685544aabead4a6d29a601da~tplv-k3u1fbpfcp-watermark.image)

[Charles](https://baike.baidu.com/item/Charles/7841179?fr=aladdin)是一个HTTP代理服务器、HTTP监视器、反转代理服务器，当程序连接Charles的代理访问互联网时，Charles可以监控这个程序发送和接收的所有数据。它允许一个开发者查看所有连接互联网的HTTP通信，这些包括request。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2997e018c8154658a3fcc5d29e4fc017~tplv-k3u1fbpfcp-watermark.image)

Charles主要功能：

1.支持SSL代理，可以截取分析SSL的请求

2.支持流量控制，可以模拟慢速网络以及等待时间较长的请求

3.支持AJAX调试，可以自动将json或xml数据格式化，方便查看

4.支持AMF调试，可以将Flash Remoting 或 Flex Remoting信息格式化，方便查看

5.支持重发网络请求，方便后端调试

6.支持修改网络请求参数

7.支持网络请求的截获并动态修改

8.检查HTML，CSS和RSS内容是否符合W3C标准



在开发过程中，我更喜欢使用Charles配合真机进行调试。虽然Vconsole也可以查看请求相关的信息。但是在这方面貌似Charles来的更强大，一般在项目中的请求往往是HTTPS。

HTTPS用非对称算法随机加密出一个对称密钥，然后双方用对称密钥进行通信，以保证通信的安全性。具体来说，就是客户端生成一个随机密钥，用服务器的公钥对这个密钥进行非对称加密，服务器用私钥进行解密，然后双方就用这个对称密钥来进行数据加密了。

接下去阐述下https抓包的原理

### Charles中的https抓包原理

首先，客户端向服务器发起HTTPS请求，而Charles拦截客户端的请求，伪装成客户端向服务器进行请求。

接着，服务器向“客户端”（实际上是Charles）返回服务器的CA证书，Charles拦截服务器的响应，获取服务器证书公钥，然后自己制作一张证书，将服务器证书替换后发送给客户端。

然后，客户端接收到“服务器”（实际上是Charles）的证书后，生成一个对称密钥，用Charles的公钥加密，发送给“服务器”（Charles）。

再然后，Charles拦截客户端的响应，用自己的私钥解密对称密钥，然后用服务器证书公钥加密，发送给服务器。

最后，服务器用自己的私钥解密对称密钥，向“客户端”（Charles）发送响应，Charles拦截服务器的响应，替换成自己的证书后发送给客户端。

至此，连接建立，Charles拿到了 服务器证书的公钥和客户端与服务器协商的对称密钥，之后就可以解密或者修改加密的报文了。

总结下，在这个过程中Charles实际上充当一个中间代理人的角色，客户端拿到的https资源实际上都是Charles发送给客户端的。

### 使用Charles进行HTTPS抓包

1.安装根证书，然后在证书详情页，将所有设置为始终信任。

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0290abf97db94430ab8966aa3cb1a697~tplv-k3u1fbpfcp-watermark.image)

2.接着，在移动端配置证书（ 前提：保证手机端和电脑端在同一局域网，并设置好代理，ip为电脑端ip，端口为对应端口）

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbbcbdb5c5744710acad5dfbb69cc7f2~tplv-k3u1fbpfcp-watermark.image)

3.然后，在Charles上设置SSL代理

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8b3ad3af5814d0d8c8637bb4ec1346c~tplv-k3u1fbpfcp-watermark.image)

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe41370f023f4541ae8f535b1d7d2714~tplv-k3u1fbpfcp-watermark.image)

至此，本文结束~

