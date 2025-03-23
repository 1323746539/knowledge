
### `Object.defineProperty()`

- 是 js 中的一个内置函数，用于定义对象的属性。可直接在一个对象上定义一个新属性，或修改一个对象的现有属性，并返回此对象。
- 语法：`Object.defineProperty(obj, prop, descriptor)`
  - `obj`：要在其上定义属性的对象。
  - `prop`：要定义或修改的属性的名称或 Symbol。
  - `descriptor`：要定义或修改的属性描述符。
- 描述符对象有很多属性，类似 Proxy 中的拦截属性，比如
  - `value`：属性的值
  - `writable`：是否可写
  - `enumerable`：是否可枚举
  - `configurable`：是否可配置
  - `get`：获取属性时调用的函数
  - `set`：设置属性时调用的函数

```js
let obj = {};
Object.defineProperty(obj, 'name', {
    get() {
        return this._name;
    },
    set(value) {
        this._name = value;
    },
    enumerable: true,
    configurable: true
});

obj.name = 'Alice';
console.log(obj.name); // 输出：Alice
```

- vue2 中使用了 Object.defineProperty 来实现数据的响应式