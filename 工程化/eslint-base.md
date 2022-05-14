ESLint最初是由Nicholas C. Zakas 于2013年6月创建的开源项目。它的目标是提供一个插件化的javascript代码检测工具。它使用解析器将源代码解析成AST，然后检测AST来判断代码是否符合规则。

### ESLint原理

#### 1. 将代码解析成AST

ESLint使用JavaScript解析器把JS代码解析成AST。

PS：解析器：是将代码解析成AST的工具，ES6、react、vue都开发了对应的解析器所以ESLint能检测它们的，ESLint也是因此一统前端Lint工具的。

#### 2. 深度遍历AST，监听匹配过程。

在拿到AST之后，ESLint会以"从上至下"再"从下至上"的顺序遍历每个选择器两次。

#### 3. 触发监听选择器的`rule`回调

在深度遍历的过程中，生效的每条规则都会对其中的某一个或多个选择器进行监听，每当匹配到选择器，监听该选择器的rule，都会触发对应的回调。

#### 4. 具体的检测规则等细节内容。

### ESLint使用
#### 安装

```
sudo npm install -g eslint
//进入项目
eslint --init
```

#### **配置ESLint：**

配置文件 - 使用下面任一的文件来为全部的目录和它的子目录指定配置信息。

- A、javascript：使用.eslintrc.js文件并导出一个包含配置的对象。
- B、YAML：.eslintrc.yaml或者.eslintrc. 
- C、yml JSON：.eslintrc.json，并且此文件允许使用JS形式的注释
- D、废弃的用法：.eslintrc，此文件可以是JSON或者YAML 
- E、package.json：在package.json文件中创建eslintConfig属性，所有的配置包含在此属性中。

 PS： 这些文件的优先级则是按照以上出现的顺序`（.eslintrc.js > .eslintrc.yaml > .eslintrc.yml > .eslintrc.json > .eslintrc > package.json）`。 

从最高优先级到最低优先级的完整配置层次如下：

 1、内联配置` /*eslint-disable*/ `和 `/*eslint-enable*/ ``/*global*/ /*eslint*/ /*eslint-env*/ `

2、命令行选项： `--global --rule --env -c, --config `

3、项目级配置：` .eslintrc.*`或者将package.json文件放入与linted文件相同的目录中 继续搜索.eslintrc，并package.json在祖先目录中的文件（父具有最高的优先级，然后祖父母等），直至并包括根目录或直到一个配置"root": true中找到。 

在没有从（1）到（3）的任何配置的情况下，回到个人的默认配置~/.eslintrc。

 Ps：文件或文件中的eslintConfig字段的形式package.json，ESLint将自动查找和读取，也可以在命令行上指定配置文件。如果您的主目录中（通常~/）有配置文件，则ESLint 仅在ESLint找不到任何其他配置文件时才使用它。 如果在同一个目录中找到.eslintrc和package.json找到一个文件，.eslintrc将会优先考虑，并且package.json不会使用文件。 

#### Eslint规则：

#### 解析器选项（parserOptions）：

```
"parserOptions": {
		"ecmaVersion": 6, //ES的版本，默认为5
		"sourceType": "module", //指定源代码存在的位置，script | module，默认为script。
		"ecmaFeatures": { //指定要使用其他那些语言对象
		"experimentalObjectRestSpread": true,//启用对对象的扩展
		"jsx": true, //启用jsx语法
		"globalReturn":true, //允许return在全局使用
		"impliedStrict":true //启用严格校验模式
	}
}
```

#### 解析器（parser）

默认情况下ESLint使用Espree解析器，这里我们可以修改它的默认设置。

```
parser": "babel-eslint",
```

#### 环境配置（env）

默认情况下，所有环境变量都为false，且这些环境并不冲突，可以自由选择搭配。 环境定义了预定义的全局变量。可用的环境是：

browser - 浏览器全局变量。

node - Node.js全局变量和Node.js范围。

commonjs - CommonJS全局变量和CommonJS范围（使用Browserify / WebPack的浏览器代码）。

此处环境的参数比较多就不一一列举了

#### 插件（plugins）

```
"plugins": ["standard","promise","react"],
```

#### 全局变量（globals） 

指定全局变量的值为true|false。true表示变量可以被覆盖，false表示不允许被覆盖。

```
"globals": {
  "document": true,
  "navigator": true,
  "window": true,
  "think": true
},
```


#### 共享配置（extends）

该属性可以是

**eslint命令，也可以是继承文件的路径。**

 eslint:all:表示引入当前版本eslint的所有核心规则。 

eslint:recommended:表示引入eslint的核心功能，并且报告一些常见的共同错误。 如果值为绝对或相对路径则相当于导入路径对应的规则配置。

```
"extends": recommended,
```

```
"extends": "./eslint-config-public.js",
```

#### 规则（rules）

**规则的错误等级有三种：**

- "off" 或者 0：关闭规则。
- "warn" 或者 1：打开规则，并且作为一个警告（不影响exit code）。
- "error" 或者 2：打开规则，并且作为一个错误（exit code将会是1）。

#### eslint 检查指令 

-  检查且修复 `eslint * --fix `
-  检查指定文件` eslint app.js --fix `


#### 忽略文件

 在我们的工程目录中新建一个文件，命名为“`.eslintignore`”，Eslint会自动识别这个文件。

#### 扩展规范

 同时，关于Eslint还有些通用规则比如google规范、airbnb规范、standar规范。

 eslint-config-google 为谷歌标准

 eslint-config-airbnb 为Airbnb标准,它依赖eslint, eslint-plugin-import, eslint-plugin-react, and eslint-plugin-jsx-a11y等插件，并且对各个插件的版本有所要求。

 eslint-config-standard 它是一些前端工程师自定的标准。
