
### 一、核心流程

- 初始化阶段： 将 data 数据转换为响应式对象
- 依赖收集阶段：在 data 数据被访问时，触发 getter 函数，然后收集依赖
- 派发更新阶段：当 data 数据发生变化时，触发 setter 函数，然后派发更新



### 二、详细实现机制

- 响应式数据初始化（Vue2）

```js
// 简化版Observer类
class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep() // 每个Observer实例有一个Dep实例
    if (Array.isArray(value)) {
      // 处理数组
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

// 定义响应式属性
function defineReactive(obj, key, val) {
  const dep = new Dep() // 每个属性有一个Dep实例
  
  // 递归处理嵌套对象
  let childOb = observe(val)
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (Dep.target) { // 当前正在计算的Watcher
        dep.depend() // 收集依赖
        if (childOb) {
          childOb.dep.depend() // 收集子对象的依赖
        }
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return
      val = newVal
      childOb = observe(newVal) // 新值转为响应式
      dep.notify() // 通知依赖更新
    }
  })
}
```
- Dep 类（依赖管理器）

```js
class Dep {
  constructor() {
    this.subs = [] // 存储Watcher实例
  }
  
  addSub(sub) {
    this.subs.push(sub)
  }
  
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this) // 让Watcher记住这个Dep
    }
  }
  
  notify() {
    const subs = this.subs.slice()
    for (let i = 0; i < subs.length; i++) {
      subs[i].update() // 通知所有Watcher更新
    }
  }
}

Dep.target = null // 静态属性，指向当前正在计算的Watcher
```

- Watcher 类（依赖）

```js
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }
  
  get() {
    Dep.target = this // 设置当前Watcher
    let value
    try {
      value = this.getter.call(this.vm, this.vm) // 触发getter
    } finally {
      Dep.target = null // 收集完成后清除
    }
    return value
  }
  
  addDep(dep) {
    if (!this.deps.includes(dep)) {
      this.deps.push(dep)
      dep.addSub(this) // Dep记住这个Watcher
    }
  }
  
  update() {
    this.run()
  }
  
  run() {
    const value = this.get()
    if (value !== this.value) {
      const oldValue = this.value
      this.value = value
      this.cb.call(this.vm, value, oldValue) // 执行回调
    }
  }
}
```

### 三、依赖收集过程示例

```js
new Vue({
  data: { message: 'Hello' },
  template: '<div>{{ message }}</div>'
})
```

- 初始化阶段：
  - 将 message 转换为响应式属性
  - 为 message 创建 Dep 实例
- 首次渲染
  - 创建渲染 Watcher
  - 执行渲染函数时访问 message，触发 getter
  - getter 监测到 Dep.target 存在，将当前 Watcher 加入 message 的 Dep
- 数据变化
  - 修改 message，触发 setter
  - setter 通知 message 的 Dep 触发更新 dep.notify()
  - 渲染 Watcher 收到通知，执行更新操作

> 以上都是 vue2 的核心机制，vue3 中原理相似，但是实现完全不一样