
- 非懒加载

```js
import List from '@/components/list.vue'
const router = new VueRouter({
  routes: [
    { path: '/list', component: List }
  ]
})
```

- 懒加载 方案一(常用)

```js
const List = () => import('@/components/list.vue')
const router = new VueRouter({
  routes: [
    { path: '/list', component: List }
  ]
})
```

- 懒加载 方案二

```js
const router = new VueRouter({
  routes: [
    { path: '/list', component: resolve => require(['@/components/list'], resolve) }
  ]
})
```

- 懒加载 方案三

  - 使用webpack的require.ensure技术

```js
// r就是resolve
const List = r => require.ensure([], () => r(require('@/components/list')), 'list');
// 路由也是正常的写法  这种是官方推荐的写的 按模块划分懒加载 
const router = new Router({
  routes: [
  {
    path: '/list',
    component: List,
    name: 'list'
  }
 ]
}))
```