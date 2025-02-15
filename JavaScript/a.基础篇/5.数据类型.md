> JavaScript 规定了七种数据类型：未定义（Undefined）、空（Null）、数字（Number）、字符串（String）、布尔值（Boolean）、符号（Symbol）、任意大整数（BigInt）、对象（Object）

> 其中，只有对象是引用类型，其他都是基本类型。


#### Symbol 类型

- Symbol 是 ES6 中引入的新数据类型，它表示一个唯一的常量，通过 Symbol 函数来创建对应的数据类型，创建时可以添加变量描述，该变量描述在传入时会被强行转换成字符串进行存储

```js
var a = Symbol('1')
var b = Symbol(1)
a.description === b.description // true
var c = Symbol({id: 1})
c.description // [object Object]

var d = Symbol('1')
d == a // false
```

#### BigInt 类型

- BigInt 是一种内置对象，它提供了一种方法来表示大于 253 - 1 的整数，这允许我们安全地对大整数执行数学运算，而不会丢失任何信息。
```js
let max = BigInt(Number.MAX_SAFE_INTEGER);

let max1 = max + 1n
let max2 = max + 2n

max1 === max2   // false

```

```js
let a = 1n
let b = 2n
let c = a + b
c // 3n
```
```js
typeof 1n === 'bigint'; // true 
typeof BigInt('1') === 'bigint'; // true 

10n === 10 // false 
10n == 10  // true 
```