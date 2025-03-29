
### 实现call、apply、bind函数

---
---

#### 实现call函数

- 判断调用的对象是否为函数
- 判断传入的上下文对象是否存在，不存在则设置为 `window`
- 处理传入的参数，截取第一个参数后的所有参数
- 将函数作为上下文对象的一个属性
- 使用上下文对象来调用这个方法，并保存返回结果
- 删除刚才新增的属性
- 返回结果
```js
Function.prototype.myCall = function(context) {
  // 判断调用对象
  if (typeof this !== "function") {
    console.error("type error");
  }
  let args = [...arguments].slice(1)；
  let result = null;
  context = context || window;
  context.fn = this;
  result = context.fn(...args);
  delete context.fn;
  return result;
}
```

#### 实现apply函数

- 与上面的区别就是传入参数的处理不同

```js
Function.prototype.myApply = function(context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  let result = null;
  // 判断 context 是否存在，如果未传入则为 window
  context = context || window;
  // 将函数设为对象的方法
  context.fn = this;
  // 调用方法
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  // 将属性删除
  delete context.fn;
  return result;
};
```

#### 实现bind函数

- 判断调用对象是否为函数
- 保存当前函数的引用，获取其余传入参数值
- 创建一个函数返回
- 使用 `apply` 来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 `this` 给 `apply` 调用，其余情况都传入指定的上下文对象

```js
Function.prototype.myBind = function(context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  const args = [...arguments].slice(1);
  const fn = this;
  return function Fn() {
    return fn.apply(this instanceof Fn ? this : context, args.concat(...arguments));
  }
}
```