---
title: 在react中如何获取多个Input框中的值
date: 2021-02-16 00:53:49
tags: React
---

假如页面中有很多input需要取值，如果数量少的话，可以一个一个的定义，但是如果数据多的话一个一个的处理，会造成代码冗余，工作量大的问题。

### 方法1

关键点就是我们传递一下name值，然后去setState里动态设置每个input的值，我们可以在render里边console.log(this.state)看一下，我们的每一项的值就是{name1:”abc”,name2:”def”}

```javascript
import React,{ Component } from 'react';
class ReplenishData extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }
    showVal(name,e){
        this.setState({
            [name]:e.target.value
        });
    }
    render(){
        console.log(this.state);
        return(
            <div>
                <input type="text" onChange= {this.showVal.bind(this,"name1")} />
                <input type="text" onChange={this.showVal.bind(this,"name2")} />
                <input type="text" onChange={this.showVal.bind(this,"name3")} />
                <input type="text" onChange={this.showVal.bind(this,"name4")} />
                <input type="text" onChange={this.showVal.bind(this,"name5")} />
                <input type="text" onChange={this.showVal.bind(this,"name6")} />
            </div>
        )
    }
}
```

### 方法2

使用ref去获取dom节点内的值

```javascript
import React,{useRef} from 'react'
export default class form_input extends React.Component{
    constructor(){
        super()
        this.usname = useRef()
        this.age = useRef()
    }
    // 获取input DOM节点
    sbmmt(){
        console.log(this.usname.current.value)
        console.log(this.age.current.value)
    }
    render(){
        return(
            <div>
                <hr/>
                  {/*获取input dom 节点  */}
                  <input type="text" ref={this.usname}></input>
                  <input type="text" ref={this.age}></input>
                  <button onClick={this.sbmmt.bind(this)}>提交信息</button>
            </div>
        
            
        )
    }
}
```

