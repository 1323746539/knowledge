### 谈谈对原型与原型链的理解

---
---

#### 理解

- 在 JavaScript 中是使用一个构造函数来新建一个对象的，每一个构造函数都有 `prototype` 属性，这是属性值是一个对象，称为原型对象，包含了这个构造函数的所有实例可共享的属性和方法。
- 每个对象实例内部都有一个指针，指向构造函数的 `prototype` 属性，ES5 中将这个指针称为对象的原型，指针指向的就是原型对象
- 获取对象的原型有两种方式
  - 规范写法 `Object.getPrototypeOf(obj)`
  - 非规范写法 `obj.__proto__`
- 对象实例的 `constructor` 属性指向构造函数

#### 原型修改、重写

```js
function Person(name) {
    this.name = name
}
// 修改原型对象
Person.prototype.getName = function() {}
var p = new Person('hello')
console.log(p.__proto__ === Person.prototype) // true
console.log(p.__proto__ === p.constructor.prototype) // true
// 重写原型
Person.prototype = {
    getName: function() {}
}
var p = new Person('hello')
console.log(p.__proto__ === Person.prototype)        // true
console.log(p.__proto__ === p.constructor.prototype) // false
```

- 可以看出，修改原型对象并不会改变对象实例的 `constructor` 指向，但是重写会改变，重新指向了 Object

```js
console.log(p.constructor === Object) // true
```

#### 原型链的终点是什么？如何打印出原型链终点？

- 原型链的终点是 `Object.prototype.__proto__`，值是 `null`，所以也可以说原型链的终点是 `null`

#### 如何获得对象非原型链上的属性

- 使用 `obj.hasOwnProperty(key)` 方法
- 使用 `Object.hasOwn(obj, key)` 方法
- 使用 `Object.keys(obj)` 方法