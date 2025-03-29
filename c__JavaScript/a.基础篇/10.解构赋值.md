
### 一、解构分类

#### 1.1 对象的解构赋值

```js
let obj =  {x: 1, y: 2, z: 3};

let {x: a, y: b, z: c} = obj; // 完整写法
console.log(a, b, c)

let {x, y, z} = obj;  //简写
console.log(x, y, z)
```

- 简写形式，对象的属性名要与分配的属性名一致
- 也可以传递一个默认值，当要分配的属性不存在时，会使用默认值

```js
let {x, y, z, d = 4} = obj;
console.log(d) // 4
```
- 特殊，如果分配的对象属性为 `undefined`，也会使用默认值

```js
const {x = 2} = {x: undefined};
console.log(x);    // 2
```

#### 1.2 数组的解构赋值

- 使用数组解构时，实际上会使用迭代器将所需要的值与结构源分开
- 还可以将解构赋值与扩展运算符结合使

```js
let message = 'Hello';
let [a, b] = message;
let [x, y, ...z] = message;

console.log(a, b);        // H e
console.log(x, y, z);     // H e ['l', 'l', 'o']
```
- 也可以设置默认值

### 二、嵌套解构

- 可以用于嵌套数组和嵌套对象

```js
const student = {
    name: 'ZhangSan',
    age: 18,
    scores: {
        math: 19,
        english: 85,
        chinese: 100
    }
};

const { name, scores: {math, english, chinese} } = student; 
```
```js
let numbers = [1, [2, 3, 4], 5];
let [a, [b, c, d], e] = numbers;
console.log(a, b, c, d, e); // 1 2 3 4 5
```

### 三、使用技巧

#### 3.1 函数传参解构


#### 3.2 交换变量

```js
let a = 1, b = 2;
[a, b] = [b, a];  
```