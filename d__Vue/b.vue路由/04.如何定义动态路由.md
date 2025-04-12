
- 目前有两种方式定义动态路由

### 一、params 方式

- 配置路由的方式： `/router/:id`，例如 `/router/123`
- 获取参数的方式： `this.$route.params.id`
- 路由的定义：
```js
{
    path: '/router/:id',
    name: 'router',
    component: Router
}
```
- 使用：

```js
// 方法1：
<router-link :to="{ name: 'users', params: { uname: wade }}">按钮</router-link

// 方法2：
this.$router.push({name:'users',params:{uname:wade}})

// 方法3：
this.$router.push('/user/' + wade)
```

- 注意：在对象的方式中，`name` 是必须的



### 二、query 方式

- 配置路由的方式： `/router?id=123`
- 获取参数的方式： `this.$route.query.id`
- 路由的定义与上面基本一致

```js
{
    path: '/router',
    name: 'router',
    component: Router
}
```

- 使用：

```js
//方式1：直接在router-link 标签上以对象的形式
<router-link :to="{path:'/profile',query:{name:'why',age:28,height:188}}">档案</router-link>

// 方式2：写成按钮以点击事件形式
// 方法1：
<router-link :to="{ name: 'users', query: { uname: james }}">按钮</router-link>

// 方法2：
this.$router.push({ name: 'users', query:{ uname:james }})

// 方法3：
<router-link :to="{ path: '/user', query: { uname:james }}">按钮</router-link>

// 方法4：
this.$router.push({ path: '/user', query:{ uname:james }})

// 方法5：
this.$router.push('/user?uname=' + jsmes)
```
- 在对象的方式中，指定 `name` 或者 `path` 是可选的


### 三、两者的区别

- 获取值的方式不一样
- `query` 方式在 url 中会显示参数，`params` 方式不会显示参数
- 刷新页面时，`query` 方式不会丢失参数，`params` 方式会丢失参数

