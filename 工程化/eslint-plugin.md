## ESLint插件开发

```
# 安装模块
npm install -g yo generator-eslint

# 创建目录
mkdir eslint-plugin-demo
cd eslint-plugin-demo

# 创建模板
yo eslint:plugin
```

打开 `lib/rules/disable-console.js` ，可以看到默认的模板代码如下：

```
module.exports = {
  meta: {
    docs: {
      description: "disable console",
      category: "Fill me in",
      recommended: false
    },
    schema: []
  },
  create: function (context) {
    // variables should be defined here
    return {
      // give me methods
    };
  }
};
```

简单的介绍下其中的参数（更详细的介绍可以查看[官方文档](https://cn.eslint.org/docs/developer-guide/working-with-rules#rule-basics)）：

- meta：规则的一些描述信息 
  - docs：规则的描述对象 
    - descrition(string)：规则的简短描述
    - category(string)： 规则的类别（具体类别可以查看[官网](https://cn.eslint.org/docs/rules/)）
    - recommended(boolean)：是否加入 `eslint:recommended`
  - schema(array)：规则所接受的配置项
- create：返回一个对象，该对象包含 ESLint 在遍历 JavaScript 代码 AST 时，所触发的一系列事件勾子。

可以看到 `console.log()` 属于 `ExpressionStatement(表达式语句)` 中的 `CallExpression(调用语句)`。

```
{
  "type": "ExpressionStatement",
  "expression": {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "console"
      },
      "property": {
        "type": "Identifier",
        "name": "log"
      },
      "computed": false
    }
  }
}
```

所以，我们要判断代码中是否调用了 `console`，可以在 create 方法返回的对象中，写一个 CallExpression 方法，在 ESLint 遍历 AST 的过程中，对调用语句进行监听，然后检查该调用语句是否为 `console` 调用。

```
module.exports = {
  create: function(context) {
    return {
      CallExpression(node) {
        // 获取调用语句的调用对象
        const callObj = node.callee.object
        if (!callObj) {
          return
        }
        if (callObj.name === 'console') {
          // 如果调用对象为 console，通知 ESLint
          context.report({
            node,
            message: 'error: should remove console'
          })
        }
      },
    }
  }
}
```

可以看到我们最后通过 `context.report` 方法，告诉 ESLint 这是一段有问题的代码，具体要怎么处理，就要看 ESLint 配置中，该条规则是 `[off, warn, error]` 中的哪一个了。

之前介绍规则的时候，有讲到规则是可以接受配置的，下面看看我们自己制定规则的时候，要如何接受配置项。其实很简单，只需要在 mate 对象的 schema 中定义好参数的类型，然后在 create 方法中，通过 `context.options` 获取即可。下面对 `disable-console` 进行修改，毕竟禁止所有的 console 太过严格，我们可以添加一个参数，该参数是一个数组，表示允许调用的 console 方法。

```
module.exports = {
  meta: {
    docs: {
      description: "disable console", // 规则描述
      category: "Possible Errors",    // 规则类别
      recommended: false
    },
    schema: [ // 接受一个参数
      {
        type: 'array', // 接受参数类型为数组
        items: {
          type: 'string' // 数组的每一项为一个字符串
        }
      }
    ]
  },

  create: function(context) {
    const logs = [ // console 的所以方法
        "debug", "error", "info", "log", "warn", 
        "dir", "dirxml", "table", "trace", 
        "group", "groupCollapsed", "groupEnd", 
        "clear", "count", "countReset", "assert", 
        "profile", "profileEnd", 
        "time", "timeLog", "timeEnd", "timeStamp", 
        "context", "memory"
    ]
    return {
      CallExpression(node) {
         // 接受的参数
        const allowLogs = context.options[0]
        const disableLogs = Array.isArray(allowLogs)
          // 过滤掉允许调用的方法
          ? logs.filter(log => !allowLogs.includes(log))
          : logs
        const callObj = node.callee.object
        const callProp = node.callee.property
        if (!callObj || !callProp) {
          return
        }
        if (callObj.name !== 'console') {
          return
        }
        // 检测掉不允许调用的 console 方法
        if (disableLogs.includes(callProp.name)) {
          context.report({
            node,
            message: 'error: should remove console'
          })
        }
      },
    }
  }
}
```

规则写完之后，打开 `tests/rules/disable-console.js` ，编写测试用例。

```
var rule = require("../../../lib/rules/disable-console")
var RuleTester = require("eslint").RuleTester

var ruleTester = new RuleTester()
ruleTester.run("disable-console", rule, {
  valid: [{
    code: "console.info(test)",
    options: [['info']]
  }],
  invalid: [{
    code: "console.log(test)",
    errors: [{ message: "error: should remove console" }]
  }]
});
```

引入插件，然后开启规则即可。

```
// eslintrc.js
module.exports = {
  plugins: [ 'demo' ],
  rules: {
    'demo/disable-console': [
      'error', [ 'info' ]
    ],
  }
}
```

