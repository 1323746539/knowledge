
### 一、生命周期函数

- Vue2: 
  - 初始化阶段：beforeCreate、created、beforeMount、mounted
  - 更新阶段：beforeUpdate、updated
  - 销毁阶段：beforeDestroy、destroyed
  - keep-alive钩子：activated、deactivated
- Vue3:
  - 初始化阶段：setup()、onBeforeMount、onMounted
  - 更新阶段：onBeforeUpdate、onUpdated
  - 销毁阶段：onBeforeUnmount、onUnmounted
  - keep-alive钩子：onActivated、onDeactivated

### 二、props、data 访问时机

- 在 vue2 中，`beforeCreate` 阶段，data 和 props 还未初始化，不能访问，仅初始化了事件（`$emit/$on`）和生命周期钩子
- 在 `created` 阶段，data 和 props 已经初始化，可以访问
- 在 vue3 中，`setup` 阶段，data 和 props 已经初始化，可以访问

### 三、父组件和子组件的执行顺序

- 加载渲染过程：父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted
- 子组件更新过程：父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated
- 销毁过程：父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

### 四、一般在哪个生命周期中发起异步请求

- 一般在 `created` 生命周期中发起异步请求，因为 `created` 阶段，data 和 props 已经初始化，可以访问
- vue3 在 `setup` 阶段，data 和 props 已经初始化，可以访问