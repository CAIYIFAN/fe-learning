### 1.node.js安装

注意 Node 的版本必须大于等于 10

##### 1.1 打开NodeJs的官网下载页面：[nodejs.org/en/download…](https://nodejs.org/en/download/)

##### 1.2 直接下载最新版本，根据系统选择

##### 1.3 然后打开终端后 执行命令node -v 查看node版本 出现版本号说明安装成功。

### 2、安装Python2

注意Python的版本必须是2.x系列的，

##### 2.1 Python的官网下载地址为：[www.python.org/downloads/](https://www.python.org/downloads/)

默认安装后，将python2配置到环境变量中。

### 3、安装[Java SE Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

1.下载jdk并安装（注：1.8版本的jdk可行）

2.环境变量设置

```
sudo vim /etc/profile
```

```
JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_77.jdk/Contents/Home/"

CLASS_PATH="$JAVA_HOME/lib"

PATH=".:$PATH:$JAVA_HOME/bin"
```

3.使命令生效

```
source /etc/profile
```

4.检查环境变量

```
echo $JAVA_HOME
```

### 4.切换源

```
# 使用nrm工具切换淘宝源 

npx nrm use taobao 

# 如果之后需要切换回官方源可使用  

npx nrm use npm
```

### 5.安装yarn

[Yarn](http://yarnpkg.com/)是 Facebook 提供的替代 npm 的工具，可以加速 node 模块的下载。

安装完 yarn 之后就可以用 yarn 代替 npm 了，例如用yarn add 库名 代替 npm install 库名

```
$ npm install -g yarn
```

### 6.安装react-native cli

react-native cli 是React Native 的命令行工具

```
$ npm install -g react-native-cli
```

或者

```
$ yarn add -g react-native-cli 
```

### 7.安装Watchman

```
brew install node 

brew install watchman
```

### 8.Android环境搭建

1.下载新版Android studio

2.安装Android sdk

Android Studio 默认会安装最新版本的 Android SDK。目前编译 React Native 应用需要的是`Android 9 (Pie)`版本的 SDK（注意 SDK 版本不等于终端系统版本，RN 目前支持 android4.1 以上设备）。

3.配置Android环境变量

```
vi ~/.bash_profile
```

```
# 如果你不是通过Android Studio安装的sdk，则其路径可能不同，请自行确定清楚。
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```

```
source $HOME/.bash_profile
#使之生效
echo $ANDROID_HOME
#检查
```

4.打开模拟器

### 9.IOS环境搭建

1.下载Xcode

2.React Native 目前需要[Xcode](https://developer.apple.com/xcode/downloads/) 10 或更高版本。你可以通过 App Store 或是到[Apple 开发者官网](https://developer.apple.com/xcode/downloads/)上下载。这一步骤会同时安装 Xcode IDE、Xcode 的命令行工具和 iOS 模拟器。

#### Xcode 的命令行工具

启动 Xcode，并在`Xcode | Preferences | Locations`菜单中检查一下是否装有某个版本的`Command Line Tools`。Xcode 的命令行工具中包含一些必须的工具，比如`git`等。

![Xcode Command Line Tools](https://reactnative.cn/docs/assets/GettingStartedXcodeCommandLineTools.png)

### 10.创建项目

1.创建

```
react-native init AwesomeProject
```

2.运行android项目

```
$ cd AwesomeProject   #先进入项目里
$ react-native run-android #然后运行
```

3.运行ios项目

```
$ cd AwesomeProject   #先进入项目里
$ react-native run-ios #然后运行
```

## 运行react-native官方的demo

1.cd react-native

2.npm install

3.npm start

IOS环境运行

1.需要安装Xcode

2.brew install cocoapods

3.运行cd RNTester; pod install;

4.打开RNTesterPods.xcworkspace，然后build

Android环境运行

1. cd react-native

2. 下载ndk

   http://developer.android.com/tools/sdk/ndk/index.html
    http://www.androiddevtools.cn
    http://tools.android-studio.org
    https://developer.android.google.cn/ndk/downloads/revision_history.html

   （ndk版本要注意适配）

   ndk环境配置

   ```
   vi ~/.bash_profile
   export NDK_HOME=/Users/wayne/Downloads/android-ndk-r10e
   export PATH=$PATH:$NDK_HOME/
   然后使用下列命令使其立即生效（否则重启后才生效）：
   source ~/.bash_profile
   ```

3. ./gradlew :RNTester:android:app:installJscDebug

4. ./scripts/packager.sh

