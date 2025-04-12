
### 一、导航守卫介绍

- 分全局守卫、路由独享守卫、组件内守卫


#### 1.1 全局守卫

- 有三个路由钩子：
  - `beforeEach`：全局前置守卫，进入路由前执行
  - `afterEach`：全局后置守卫，进入路由后执行
  - `beforeResolve`：全局解析守卫，在 beforeRouteEnter 调用之后调用

- 具体使用，比如在 beforeEach 中判断用户是否登录，如果未登录则跳转到登录页面

```js
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})
```

- 又比如页面跳转后，需要滚动到顶部，可以在 afterEach 中实现
```js
router.afterEach((to, from) => {
  window.scrollTo(0, 0)
})
```

#### 1.2 路由独享守卫

- `beforeEnter`：路由独享守卫，进入路由前执行

```js
{        
    path: '/',        
    name: 'login',        
    component: login,        
    beforeEnter: (to, from, next) => {          
        console.log('即将进入登录页面')          
        next()        
    }    
}
```

#### 1.3 组件内守卫

- `beforeRouteEnter`：进入组件前触发，不能获取组件实例，需要在 next 回调中获取

```js
beforeRouteEnter(to, from, next) {      
    next(target => {        
        if (from.path == '/classProcess') {          
            target.isFromProcess = true        
        }      
    })    
}
```

- `beforeRouteUpdate`：当前地址改变并且该组件被复用时触发
- `beforeRouteLeave`：离开组件被调用



### 二、路由钩子在生命周期函数的体现

- 完整的路由导航解析过程
  - 触发进入其他路由。
  - 调用要离开路由的组件守卫beforeRouteLeave
  - 调用全局置守卫∶ beforeEach
  - 在重用的组件里调用 beforeRouteUpdate
  - 调用路由独享守卫 beforeEnter。
  - 解析异步路由组件。
  - 在将要进入的路由组件中调用 beforeRouteEnter
  - 调用全局解析守卫 beforeResolve
  - 导航被确认。
  - 调用全局后置钩子的 afterEach 钩子。
  - 触发DOM更新（mounted）。
  - 执行beforeRouteEnter 守卫中传给 next 的回调函数


