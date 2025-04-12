
### 一、两者介绍

- mixin 和 extends均是用于合并、拓展组件的，两者均通过 mergeOptions 方法实现合并
- extends 用于组件的继承，mixin 用于组件的复用
- extends 优先级高于 mixin
- 定义 mixin

```js
// myMixin.js
export const myMixin = {
  data() {
    return {
      mixinData: '来自mixin的数据'
    }
  },
  created() {
    console.log('mixin的created钩子')
  },
  methods: {
    mixinMethod() {
      console.log('mixin的方法被调用')
    }
  }
}
```
- 使用 mixin，是一个数组，可以接受多个 mixin

```js
import { myMixin } from './myMixin'
export default {
  mixins: [myMixin],
  data() {
    return {}
  }
}
```
- 定义 extends，先整个基础组件，再通过 extends 继承
 ```js
 // BaseComponent.vue
export default {
  data() {
    return {}
  }
}
```
```js
import BaseComponent from './BaseComponent.vue'

export default {
  extends: BaseComponent,
  data() {
    return {}
  }
}
```

### 二、两者的覆盖逻辑

| 覆盖逻辑 | mixin/extends |
| --- | --- |
| data | 只会将自己有的但是组件上没有的内容混合到组件上，重复定义的默认使用组件上的 |
| provide | 同上 |
| inject | 同上 |
| methods | 同上 |
| computed | 同上 |
| 组件、过滤器、指令 | 同上 |
| watch | 合并监听的回调方法，先执行 mixin/extends 里的回调，再执行组件里的 |
| 生命周期钩子 | 同一钩子的回调合并成数组，先执行 mixin/extend 里的，再执行组件里的 |

