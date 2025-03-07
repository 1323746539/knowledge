### ajax、axios、fetch的区别

---
---

#### ajax 是一种技术，它的实现方式可以有 `XMLHttpRequest`，`fetch`，`axios`，`jQuery` 等。所以问区别时，一般是问 `XMLHttpRequest`，`fetch`，`axios` 的区别。

#### axios

- Axios 是一个基于 promise 的 HTTP 客户端库，封装了底层的 `XMLHttpRequest` 对象
- 与 `XMLHttpRequest` 区别是
  - 支持 Promise 语法
  - 支持浏览器端和 Node.js 端
  - 支持请求和响应拦截器
  - 支持请求取消
  - 支持请求超时

#### fetch

- ES6 中出现的，基于 promise 设计的
- 不是 ajax 的进一步封装，而是原声的 js，没有使用 `XMLHttpRequest` 对象
- 但实际业务开发中用的比较少，还是用 axios 比较多，原因是
  - 浏览器兼容性问题
  - 不支持请求取消
  - 不支持请求超时
  - 不支持请求和响应拦截器