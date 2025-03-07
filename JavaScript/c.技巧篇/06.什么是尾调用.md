### 什么是尾调用，尾调用的好处是什么

---
---

#### 概念

- 尾调用（Tail Call）是函数式编程的一个重要概念，指某个函数的最后一步是调用另一个函数，并使用 `return` 返回这个函数调用
- 尾调用不一定出现在函数尾部，只要是最后一步操作即可
- 代码执行是基于执行栈的，一般当一个函数里调用另一个函数时，会保留当前的函数执行上下文，在创建一个新的函数执行上下文入栈，但是使用尾调用的话，会直接复用当前的函数执行上下文，这样就可以避免创建新的函数执行上下文，从而提高性能

#### 好处

- 优化性能，节省内存空间
- 递归调用可避免栈溢出

#### 例子

```js
// 普通递归
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1); // 调用结果出现了进一步处理，所以不是尾调用
}
// 尾递归
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}
```
- 其他例子
```js
function f() {
  if (condition) {
    return b(); // ✅ 分支中的尾调用
  }
  return c(); // ✅ 另一分支的尾调用
}
function d() {
  return b() + 1; // ❌ 非尾调用：调用后需要执行加法
}
function e() {
  return b() || c(); // ❌ 非尾调用：调用后需要执行逻辑判断
}
```