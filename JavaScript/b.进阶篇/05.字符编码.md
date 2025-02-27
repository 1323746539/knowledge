### 一、ASCII 码

- 使用二进制来表示字符
- 一个字节（8位）表示一个字符
- ASCII 至今为止共定义了 128 个字符

### 二、Unicode 码

- 另一种字符编码，与 ASCII 唯一区别是编码的位数
- ASCII 是 Unicode 编码方案的一个子集，本质上，ASCII 格式的文件可以被视为 UTF-8 格式的文件

```js
const s1 = '\u00E9' //é length 长度是1
const s2 = '\u0065\u0301' //é length 长度是2
console.log(s1 === s2) //false
```

- 使用四种编码格式，即 UTF-7、UTF-8、UTF-16、UTF-32，分别使用 7、8、16、32 位来表示一个字符

### 三、Base 64 编码

- 一种将二进制数据转换为 ASCII 字符的方法

### 四、Javascript 编码解码

#### 4.1 UTF-8

- 应用场景，比如 URL 只能包含标准的 ASCII 字符，对于其他字符需要进行编码
- 编码： `encodeURI、encodeURIComponent`，两者有区别，前者接收完整 URL 做参数，后者接收 URL 中的一部分

```js
encodeURI('https://domain.com/path to a document.pdf');
// 结果：'https://domain.com/path%20to%20a%20document.pdf'
`http://domain.com/?search=${encodeURIComponent('name=zhang san&age=19')}`;
// 结果：'http://domain.com/?search=name%3Dzhang%20san%26age%3D19'
```

- 解码：`decodeURI、decodeURIComponent`

```js
decodeURI('https://domain.com/path%20to%20a%20document.pdf');
`http://domain.com/?search=${decodeURIComponent('name%3Dzhang%20san%26age%3D19')}`;
```

- 需要注意，`encodeURIComponent` 编码的字符中，有些字符是不能直接用于 URL 的，比如 `:`、`/`、`?`、`#`、`[`、`]`、`@`、`!`、`$`、`&`、`'`、`(`、`)`、`*`、`+`、`,`、`;`、`=`

#### 4.2 Base64

- 编码： `btoa` (binary to ascii)
- 解码： `atob` (ascii to binary)
