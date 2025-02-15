
> 数据类型转换只能转换为三种类型：字符串（string）、数字（number）、布尔值（boolean）

### 一、显示类型转换

- 转换为字符串
  - toString()
  - `+` 运算符
  - String()

```js
String([1, 2, 3, [4, [5, {}]]]);  // '1,2,3,4,5,[object Object]'
String([]);                       // ''
String(undefined);    // 'undefined'
String(null);         // 'null'
String(NaN);          // 'NaN'
String(Infinity);     // 'Infinity'
String(-Infinity);    // '-Infinity'
String(true);         // 'true'
String(false);        // 'false'
```

- 转换为数字
  - parseInt()
  - parseFloat()
  - `- * /` 运算符
  - Number()

- 转换为布尔值
  - !!
  - Boolean() : 除了 undefined、null、0、NaN、'' 为 false，其余为 true

```js
Boolean(' ');     // true 
Boolean('');      // false
```

### 二、Symbol 类型转换

- 转换为字符串
  - toString()
  - String()

- 转换为数字
  - 不能使用 Number() 将其转换为数字

- 转换为布尔值
  - Boolean() : 除了 undefined、null、0、NaN、'' 为 false，其余为 true