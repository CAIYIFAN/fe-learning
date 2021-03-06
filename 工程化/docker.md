## Docker

### 什么是Docker

Docker是一个虚拟环境容器，可以将你的可执行文件、配置文件及一切其他你需要的文件一并打包到这个容器中，并发布和应用到任意平台。比如，你在本地用[<u>Python</u>](http://www.elecfans.com/tags/python/)开发了一个网站后台，开发[<u>测试</u>](http://www.hqpcb.com/zhuoluye11/?tid=26&plan=fashaoyou)完成后，就可以将Python3及其依赖包、Flask及其各种插件、Mysql、Nginx等打包到一个容器中，然后部署到任意你想部署到的环境。

如果不好理解，我们再拿集装箱打个比方。

集装箱解决了什么问题呢？在一艘大船上，可以把货物规整的摆放起来。并且各种各样的货物被集装箱标准化了，集装箱和集装箱之间不会互相影响。那么我就不需要专门运送水果的船和专门运送化学品的船了。只要这些货物在集装箱里封装的好好的，那我就可以用一艘大船把他们都运走。

docker也是类似的理念。我们可以在一台机器上跑多个互相毫无关联的docker容器，每一个容器就相当于一个集装箱。

### Docker里的几个基本概念

#### 镜像

镜像可以理解为一堆静态的文件

#### 容器

容器则是镜像run起来之后的一个实例。镜像之于容器就好比面向对象编程里的class之于object。

#### 仓库

镜像需要地方保存，这个地方就是仓库

#### 与传统虚拟化的区别

传统虚拟化是站在硬件物理资源的基础上，虚拟出多个OS，然后在OS的基础上构建相对独立的程序运行环境，而Dokcer则是在OS的基础上进行虚拟，显然Dokcer轻量得多，因此其资源占用、性能消耗相比传统虚拟化都有很大优势。

### 01 什么是虚拟化？

顾名思义，虚拟化技术是将物理资源以某种技术虚拟成资源池的形式，主要有一虚多和多虚一两种形式，比如个人电脑安装Vmware软件，可以在这个软件上安装其他Win系统、MacOS、[<u>Linux</u>](http://www.elecfans.com/tags/linux/)系统等，实现一台电脑/笔记本承载多个系统的优点，目前苹果笔记本用户双系统解决方案也以虚拟机为主，普通Windows用户可能需求量不大，而技术人员基本是必备软件了。

从企业层面来看，多虚一为主要形式，也就是将大量物理服务器集群虚拟化，形成一个资源池，在这个资源上创建各种不同的虚拟机，实现灵活部署。

## 02 什么是Docker

其实docker和虚拟技术很像，但又有一些不同点，一方面是两个技术的层级上，虚拟机一般是底层硬件Hardware支撑，上层是虚拟管理系统Hypervisor层，在上层开启不同的VM业务，如果需要将这些业务进行隔离，需要每个VM启动客户机操作系统，非常消耗资源。

Docker完全不同，底层有硬件和Host OS系统支撑，比如Windows/MacOS/Linux，中间抛去了臃肿的系统，而是以Docker守护进程代替，上层建立不同的容器，不同的应用镜像打包在不同的容器中，他们互相隔离。

## 03 虚拟化与docker的区别

docker设计小巧，部署迁移快速，运行高效，应用之间相互独立，管理人员可以看到所有容器的内容，虚拟化技术比较臃肿，不论什么应用都需要先创建新的系统，并且并非按照应用隔离，而是按照系统隔离，管理员无法看到系统内部信息。

举个例子，Docker就是手机中的各种APP，只需要一个系统就可以[<u>下载</u>](http://www.elecfans.com/soft/special/)自己所需的应用，但是虚拟化技术相当于你的苹果手机安装一个庞大软件，这个软件上安装安卓系统、魅族系统等，每个系统上还要安装各类应用，比较麻烦。

但两者没有绝对的好坏，主要还是看应用场景，根据不同的需求选择不同的解决方案即可。

## 虚拟化分类

**A、分类I：硬件虚拟化 && 软件虚拟化**

硬件虚拟化，物理硬件本身提供虚拟化的支持。例如，CPU能够自身模拟裂变，让程序或者操作系统认为存在多个CPU，进而能够同时运行多个程序或者操作系统，以及VT-X、EPT等。

软件虚拟化，通过软件的方式来实现**虚拟化中关键的指令转换部分**。例如，各种编程语言的虚拟机环境，JVM。

**B、分类II：主机级虚拟化（虚拟整个硬件平台） && 容器级虚拟化**

拿到安装设置好的虚拟机就类似裸物理机一样使用操作系统，可以和宿主机操作系统不同。

主机级TYPE-I：层级关系-宿主机硬件-->Hypervisor虚拟机管理器-->虚拟机操作系统-->虚拟机应用软件；代表-xen，vmware esx/esxi。

主机级TYPE-II：层级关系-宿主机硬件-->宿主机操作系统-->VMManager-->虚拟机操作系统-->虚拟机应用软件；代表-vmware workstation，vbox。

**C、其他分类（分类太多，概念也有重叠，就不一一列举）：**

- 平台虚拟化：在操作系统和硬件平台间搭建虚拟化设施，使得**整个操作系统都运行在虚拟后的环境中**。
- 应用程序虚拟化：在操作系统和应用程序间实现虚拟化，只让**应用程序运行在虚拟化环境中**。
- 内存虚拟化：将不相邻的内存区，甚至硬盘空间虚拟成统一连续的内存地址，即我们常说的**虚拟内存**。
- 桌面虚拟化：让本地桌面程序利用远程计算机资源运行，达到控制远程计算机的目的。
- ....

## 容器技术

容器技术是一种全新意义上的虚拟化技术，按分类或者实现方式分类，属于操作系统虚拟化的范畴，也就是在由操作系统提供虚拟化的支持，**操作系统提供接口，能够让应用程序间可以互不干扰的独立运行，并且能够对其在运行中所使用的资源进行管理**。由于应用程序的运行被隔离在了一个独立的运行环境之中，这个独立的运行环境就像一个容器，包含住应用程序。
