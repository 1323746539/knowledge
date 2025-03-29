> 通常说的拷贝，即是对对象或数组的拷贝

### 一、浅拷贝实现

- 是指一个新的对象对原始对象的属性值进行精确地拷贝，如果拷贝的是基本数据类型，拷贝的就是基本数据类型的值，如果是引用数据类型，拷贝的就是内存地址
- 即：如果其中一个对象的引用内存地址发生改变，另一个对象也会发生变化

#### 1.1 直接赋值

#### 1.2 Object.assign

- 主要用途是合并对象，只能进行浅拷贝
- `Object.assign(target, ...sources)`  : target 为目标对象，sources 为源对象
- 会将源对象的所有可枚举属性的值复制到目标对象中，返回目标对象
- 如果目标对象和源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性
- 如果该函数只有一个参数，当参数为对象时，直接返回该对象；当参数不是对象时，会先将参数转换为对象，然后返回

```js
let target = {a: 1};
let object2 = {b: 2};
let object3 = {b: 3, c: 4};
Object.assign(target,object2,object3);  
console.log(target);  // {a: 1, b: 3, c: 4}
```

#### 1.3 扩展运算符

- 对象和数组都可以用

```js
let obj1 = {a:1,b:{c:1}}
let obj2 = {...obj1};
obj1.a = 2;
console.log(obj1); //{a:2,b:{c:1}}
console.log(obj2); //{a:1,b:{c:1}}

obj1.b.c = 2;
console.log(obj1); //{a:2,b:{c:2}}
console.log(obj2); //{a:1,b:{c:2}} 浅拷贝与深拷贝区别就在这
```

#### 1.4 数组方法实现数组浅拷贝

- slice : 不写参数，就可以实现一个数组的浅拷贝

```js
let arr = [1,2,3,4];
console.log(arr.slice()); // [1,2,3,4]
console.log(arr.slice() === arr); //false
```
- concat : 类似

```js
let arr = [1,2,3,4];
console.log(arr.concat()); // [1,2,3,4]
```

#### 1.5 手写实现浅拷贝

```js
function shallowCopy(obj) {
  // 只拷贝对象
  if (!obj || typeof obj !== 'object') return;
  let newObj = Array.isArray(obj) ? [] : {};
  for(let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = ong[key];
    }
  }

  return newObj;
}
```

### 二、深拷贝实现

#### 2.1 JSON.parse(JSON.stringify(obj))
- 缺点：
    - 会忽略 undefined
    - 会忽略 symbol
    - 不能序列化函数
    - 不能解决循环引用的对象
    - 不能正确处理 new Date()
    - 不能处理正则
    - 不能处理 NaN、Infinity、-Infinity
    - 不能处理对象的原型链
  
- 简单说就是，只能处理基本对象、数组


#### 2.2 structuredClone

```js
const originalObject = {
  name: "John",
  age: 30,
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "Anystate"
  },
  date: new Date(123),
  
}

const copied = structuredClone(originalObject);
```

- 缺点：
    - 兼容性问题
    - 不能处理函数、方法
    - 不能处理对象的原型链


#### 2.3 手写实现深拷贝

- 这里考虑了 日期对象、正则、 函数、 循环应用

```js
function deepClone(target, map = new WeakMap()) {
  // 如果是基本数据类型或 null，直接返回
  if (target === null || typeof target !== 'object') {
    return target;
  }

  // 如果是日期对象，返回一个新的日期对象
  if (target instanceof Date) {
    return new Date(target);
  }

  // 如果是正则表达式对象，返回一个新的正则表达式对象
  if (target instanceof RegExp) {
    return new RegExp(target);
  }

  // 如果是函数，直接返回（函数通常不需要深拷贝）
  if (typeof target === 'function') {
    return target;
  }

  // 检查是否已经拷贝过该对象，避免循环引用
  if (map.has(target)) {
    return map.get(target);
  }

  // 创建新的对象或数组
  const cloneTarget = Array.isArray(target) ? [] : {};
  map.set(target, cloneTarget); // 将当前对象和拷贝对象存入 WeakMap

  // 递归拷贝所有属性
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      cloneTarget[key] = deepClone(target[key], map);
    }
  }

  return cloneTarget;
}
```

- 用法： `deepClone(obj)`