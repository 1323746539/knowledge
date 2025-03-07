### new 操作符的实现原理

---
---

#### new 操作符的实现原理

- 创建一个空对象
- 将这个空对象的原型指向构造函数的 `prototype`
- 将构造函数的 `this` 绑定到新创建的对象上，并执行构造函数
- 如果构造函数返回一个对象，则返回该对象；否则返回新创建的对象

#### 代码实现

```js
function myNew(constructor, ...args) {
    // 创建一个空对象，并将其原型指向构造函数的 prototype
    const obj = Object.create(constructor.prototype);
    const result = constructor.apply(obj, args);
    return result instanceof Object ? result : obj;
}
// 测试
function Person(name, age) {
    this.name = name;
    this.age = age;
}
const person = myNew(Person, 'Tom', 18);
```