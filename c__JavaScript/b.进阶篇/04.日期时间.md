
> js 中日期时间操作是比较复杂的，分不同的时区，不同的日期格式，不同的时间格式等等，也提供了许多的方法进行相互转换
> 这里仅介绍一些常用的方法

### 一、时间格式

- `ISO 8601` 格式：一种国际标准的时间格式

```js
new Date().toISOString() //2025-02-20T09:13:47.897Z
```

- `RFC 2822` 格式：一种互联网标准的时间格式

```js
new Date().toUTCString() //Thu, 20 Feb 2025 09:16:09 GMT
```

- Date 对象默认格式，也称 `toString` 格式

```js
new Date() //Thu Feb 20 2025 17:18:48 GMT+0800 (中国标准时间)
```

- `toLocaleString` ：慎用，不同的语言环境，输出格式不同，默认中文

```js
new Date().toLocaleString() //2025/2/20 17:19:45
```
### 二、Date 对象

```js
new Date();
new Date(value);
new Date(dateString);
new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
```

- 新创建 Date 对象时，需要 new，不带 new 的创建，不会报错，但是生成的是一个字符串，而不是一个日期对象
- 可以接收多种格式的传参
  - 不传参时，返回当前时间
  - 传参时，返回指定时间
  - 传参时，会自动转换为日期对象

```js
new Date("20 Feb 2025");
new Date(1740042263555);
```

### 三、常见的方法

```js
getDate(); // 获取日期
getMonth(); // 获取月份，从 0 开始，比如 0 表示 1 月，11 表示 12 月
getFullYear(); // 获取年份
getHours(); // 获取小时
getMinutes(); // 获取分钟
getSeconds(); // 获取秒
getMilliseconds(); // 获取毫秒
getDay(); // 获取星期几，从 0 开始，比如 0 表示周日，1 表示周一，6 表示周六
getTime(); // 获取时间戳
```

- 获取时间戳的方法除了 `new Date().getTime()` 之外，还有 `Date.now()`，只是第二种方式不需要支持 `< IE8`