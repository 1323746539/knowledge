
### 一、简单介绍

- 自定义指令允许开发者直接操作 DOM 元素
- 指令生命周期钩子
  - bind：指令第一次绑定到元素时调用（Vue 2）
  - inserted：被绑定元素插入父节点时调用（Vue 2）
  - mounted：绑定元素的父组件及他自己的所有子节点都挂载完成后调用（Vue 3）
  - update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前（Vue 2）
  - componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用（Vue 2）
  - unbind：只调用一次，指令与元素解绑时调用（Vue 2）
  - unmounted：只调用一次，指令所在组件的 VNode 及其子 VNode 全部卸载后调用（Vue 3）


- 钩子函数的参数
  - el：指令绑定的元素
  - binding：一个对象，指令的参数和修饰符
  - ...

- 使用
  - 全局使用： `Vue.directive("focus",{})`
  - 局部使用： `directives:{focus:{}}`

### 二、举个例子

- 自定义图片懒加载指令，支持错误处理和展位图

```js
// 增强版懒加载指令
const lazyDirective = {
  mounted(el, binding) {
    const { src, placeholder, error } = binding.value || {}
    const finalSrc = src || binding.value
    
    // 设置占位图
    if (placeholder) {
      el.src = placeholder
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 创建临时Image对象预加载
          const img = new Image()
          img.src = finalSrc
          
          img.onload = () => {
            el.src = finalSrc
            el.classList.add('loaded')
          }
          
          img.onerror = () => {
            if (error) el.src = error
            console.error(`图片加载失败: ${finalSrc}`)
          }
          
          observer.unobserve(el)
        }
      })
    }, {
      rootMargin: '0px 0px 200px 0px'
    })
    
    observer.observe(el)
    el._lazyObserver = observer
  },
  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
    }
  }
}
```
- 使用
```js
Vue.directive('lazy', lazyDirective)
```
```html
<img 
  v-lazy="{
    src: 'https://example.com/image.jpg',
    placeholder: '/placeholder.jpg',
    error: '/error.jpg'
  }" 
  alt="示例图片"
  class="lazy-image"
>
```