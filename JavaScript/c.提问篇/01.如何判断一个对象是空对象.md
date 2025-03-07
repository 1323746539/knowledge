### 如何判断一个对象是空对象

---
---

#### 方法一

- 使用 JSON.stringify() 方法将对象转换为 JSON 字符串，然后判断字符串是否为 "{}"

```js
function isEmptyObject(obj) {
  return JSON.stringify(obj) === '{}';
}
```

#### 方法二

- 使用 `Object.keys()` `Object.values()` `Object.entries()` 方法获取对象的所有属性名，然后判断属性名数组的长度是否为 0

```js
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
```