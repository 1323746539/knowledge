
### 一、keep-alive 的使用

- `keep-alive` 是Vue内置的一个抽象组件，用于保留组件状态或避免重新渲染。它不会出现在DOM中
- 有三个属性：
  - include：字符串或正则表达式，只有名称匹配的组件会被缓存
  - exclude：字符串或正则表达式，任何名称匹配的组件都不会被缓存
  - max：数字，最多可以缓存多少组件实例
- 注意：
  - 被 keep-alive 包裹的组件，会多出两个生命周期钩子函数：activated 和 deactivated
- 和 keep-alive 搭配使用的一般有：动态组件和路由组件

```html
<keep-alive>
  <component :is="currentView"></component>
</keep-alive>
```
```html
<keep-alive include="a,b" max="10">
  <router-view></router-view>
</keep-alive>
```

### 二、内部实现原理

#### 2.1 缓存机制

- keep-alive 内部维护了一个 `cache对象`和 `keys数组`
- cache 用于存储缓存的VNode实例
- keys 数组存储缓存组件的key，用于实现LRU(最近最少使用)算法


#### 2.2 渲染机制

- 当组件被 keep-alive 包裹时，会调用 keep-alive 的 render 函数，而不是组件本身的 render 函数
- 判断组件 name ，不在 include 或者在 exclude 中，直接返回 vnode，说明该组件不被缓存
- 获取组件的 key 值（如果没有重新生成），判断是否命中缓存，如果命中则直接返回缓存的VNode实例，否则调用组件的 render 函数生成VNode实例，并将其缓存起来

#### 2.3 LRU 算法

- 当缓存数量超过max时，会移除最久未使用的组件
- 每次访问缓存组件时，会将其key从当前位置删除，然后移动到 keys 数组的末尾

#### 2.4 关键源码

```js
// 核心render函数
render () {
  const slot = this.$slots.default
  const vnode = getFirstComponentChild(slot)
  const componentOptions = vnode && vnode.componentOptions
  
  if (componentOptions) {
    // 检查include/exclude
    const name = getComponentName(componentOptions)
    if (
      (include && (!name || !matches(include, name))) ||
      (exclude && name && matches(exclude, name))
    ) {
      return vnode
    }
    
    const { cache, keys } = this
    const key = vnode.key == null
      ? componentOptions.Ctor.cid + ... 
      : vnode.key
    
    if (cache[key]) {
      // 命中缓存
      vnode.componentInstance = cache[key].componentInstance
      // 调整key位置
      remove(keys, key)
      keys.push(key)
    } else {
      // 缓存组件
      cache[key] = vnode
      keys.push(key)
      // 如果超过max，删除最久未使用的
      if (this.max && keys.length > parseInt(this.max)) {
        pruneCacheEntry(cache, keys[0], keys, this._vnode)
      }
    }
    
    vnode.data.keepAlive = true
  }
  return vnode || (slot && slot[0])
}
```

### 三、应用场景

- 表单内容缓存：用户在表单中填写大量数据时，切换路由后返回可以保留填写内容

- 列表状态保持：保持列表的滚动位置和筛选状态

- 动态组件切换：多个组件频繁切换时避免重复渲染

- 性能优化：对复杂组件进行缓存，减少渲染开销

