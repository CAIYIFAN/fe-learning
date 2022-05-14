---
title: 初探React-Hook
date: 2021-02-16 01:32:31
tags: React
---

### useState

```
import React, { useState } from 'react';

function App() {
    const [ state, setState ] = useState(0);
    return (
        <span>{state}</span>
    )
}
```

### useEffect

​		函数组件的每次运行都相当于 class component 中的一次 render，每轮都会保留它的闭包，所以，我们的 useEffect 实际保留了它运行轮次的 state 和 props 状态（如果依赖不更新，那么状态不更新），这也就是 useEffect 和 componentDidMount 生命周期的关系。

```
import React, { useEffect } from 'react';
function App() {
    useEffect(() => {
        console.log('I am mount');
        return () => {
            console.log('before next run, I am cleaned');
        }
    }, []);
```

### useLayoutEffect

​		useLayoutEffect 与 useEffect 的不同在于，useLayoutEffect 会在 DOM 渲染之前执行，而 useEffect 会在 DOM 渲染之后执行，所以我们可以利用这个特性，避免一些由于 DOM 渲染之后进行操作导致的白屏问题。

### useCallback

```
import React, { useCallback } from 'react';
function App() {
    const cb = useCallback(() => { console.log('callback') }, []);
    return (
        <button onClick={cb}></button>
    )
}
```

### useMemo

useMemo 可以为我们的 function component 提供缓存的能力，在一些重计算的场景下，可以减少重复计算的次数，起到明显的性能提升。 当然，useMemo同样可以用来缓存组件，起到类似与 class component 中 shouldComponentUpdate 的作用。

### useRef

​		因为 immutable 的 state 并不适合我们存储一些不参与 UI 显示的变量。hooks 为我们提供了 useRef 去存储 mutable 的不参与 UI 显示的变量，并且可以在每一轮 render 中共享。

​		useRef 不仅可以用来存储对 Dom 元素的引用（它的本意），更可以用来存储我们需要在每轮 render 中共享的 mutable 的变量（可能非常常用）。

```
import React, { useRef } from 'react';
function App() {
  const td = useRef(1);
  console.log(td.current); // 1
  ...
```

### useReducer

```
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

### useContext

```
// 假定我们已经有 Context
function Child(props) {
    const { value } = useContext(Context);
    return (
      <div>
        {value}
      </div>
    )
}
```

### 利用 setState 的回调处理获取 state 的问题

```
const [state, setState] = useState(0);

// 利用 setState 的回调拿到最新的 state，返回原值，可以不触发 rerender（极端情况下可以用于性能优化）
const update = useCallback(() => {
    setState(state => {
        // 做你想做的任何事情
        return state;
    })
}, []);
```

#### 把 useReducer 的 reducer 放在 function component 函数体内，利用 dispatch 最终触发的是最新的闭包中的 reducer 来确保我们可以拿到处于最新状态的 props

```
function App({ a, b, c }) {
    const reducer = (state, action) => {
        switch(action.type) {
            case 'init':
                // 这里永远可以拿到最新的 a
                return Object.assign(state, { a: a });
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(reducer, {});
    return (
        <div>{ state.a }</div>
    )
}
```

### 减少Render

#### 直接使用 React.memo

```
const Child = function({ a, b, c }) {
    return <div>{a}{b}{c}</div>
} 
export default React.memo(Child);
```

#### 使用 useMemo 进行细粒度的控制

```
function App({ a, b, c }) {
    const RenderComponent = useMemo(() => {
        return <div>{c}</div>
    }, [c]);
    return (
        <RenderComponent />
    )
}
```

#### 使用 useCallback 包裹函数，使函数变化减少

```
const useTrigger = () => {
    const [state, setState] = useState(false);
    const trigger = useCallback(() => {
        setState(ste => !ste);
    }, []);
    return { state, trigger };
}

// vs

const useTrigger = () => {
    const [state, setState] = useState(false);
    const trigger = useCallback(() => {
        setState(ste => !ste);
    }, [state]);
    return { state, trigger };
}
```

### Hook实践

## Hook实践

#### 双向数据绑定

```
const useInput = () => {
  const [value, setValue] = useState('');
  const onChange = val => {
    setValue(val.target.value);
  };
  return {
    value,
    onChange
  };
};
```

### 表单提交

```
export const useSubmit = submitFunction => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);

  const trigger = useCallback(() => {
    try {
      if (_.isFunction(submitFunction)) {
        (async () => {
          let res = await submitFunction();
          if (res) {
            setRes(res);
          }
        })();
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(true);
    }
  }, [submitFunction]);

  return [loading, res, error];
};
```

### 利用 useMemo 操作 props 数据

```
import React, { useMemo } from 'react';

function App({ data }) {
    // 只有 data 更新时重新计算
    const info = useMemo(() => {
        // 对 data 进行一系列的计算操作
        return newData;
    }, [data]);
}
```

### 利用 hooks 返回组件

```
import React, { useState, useCallback } from 'react';
import { Modal } from 'antd';

export default function useModal() {
  const [show, setShow] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setShow(true);
  }, []);

  const closeModal = useCallback(() => {
    setShow(false);
  }, []);

  const CusModal: React.SFC = ({ children, ...props }) => {
    return (
      <Modal
        visible={show}
        {...props}>
        {children}
      </Modal>
    )
  }

  return {
    show,
    setShow,
    openModal,
    closeModal,
    CusModal
  }
}
```

### 利用 ref 记录停留时间(无侵入埋点)

```
export const useHoverTime = eventName => {
  const EV = `${ eventName}`;
  const ref = useRef(null);

  useEffect(() => {
    localStorage.setItem(EV, 0);
    return () => {
      const time = localStorage.getItem(EV);
      // do something 
      localStorage.setItem(EV, null);
    };
  }, []);

  useEffect(() => {
    let startTime = null;
    let endTime = null;
    const overHandler = () => {
      startTime = new Date();
    };
    const outHandler = () => {
      endTime = new Date();
      localStorage.setItem(
        EV,
        parseInt(localStorage.getItem(EV)) +
        parseInt(endTime - startTime)
      );
      startTime = 0;
      endTime = 0;
    };
    if (ref.current) {
      ref.current.addEventListener('mouseover', overHandler);
      ref.current.addEventListener('mouseout', outHandler);
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mouseover', overHandler);
        ref.current.removeEventListener('mouseout', outHandler);
      }
    };
  }, [ref]);
  return ref;
};
```

### combindReducer

```
const combineReducers = (reducers) => {
    const keys = Object.keys(reducers);
    const initObj = {};
    keys.forEach(key => {
        let draftState = reducers[key](undefined, { type: '' });
        if (!draftState) {
            draftState = {};
            console.warn(
                `[Error]: 在combineReducers 中 Reducer 需要初始化!`
            );
        }
        initObj[key] = draftState;
    })
    return (state, action) => {
        keys.forEach(key => {
            const prevState = initObj[key];
            initObj[key] = reducers[key](prevState, action);
        });
        return { ...initObj };
    }
}
```
