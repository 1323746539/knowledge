### 一、怎么实现v-model

- v-model 是一个语法糖，如
  
```html
<input v-model="searchText">
```

- 等同于
  
```html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
>
```

### 二、作用在自定义组件上

- 在自定义组件中，v-model 默认会利用名为 value 的 prop 和名为 input 的事件

```js
// 父组件
<aa-input v-model="aa"></aa-input>
// 等价于
<aa-input :value="aa" @input="aa=$event.target.value"></aa-input>
// 子组件：
<input :value="aa" @input="onmessage"></aa-input>
props:{value:aa,}
methods:{
    onmessage(e){
        $emit('input',e.target.value)
    }
}
```

### 三、修饰符

- `.lazy`： 将数据更新的时机从 input 事件改为 change 事件
- `.number`：输入字符串转为有效的数字。
- `.trim`：输入首尾空格过滤。
