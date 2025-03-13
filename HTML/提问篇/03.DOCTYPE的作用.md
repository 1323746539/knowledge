### DOCTYPE 的作用

---
---

- DOCTYPE（文档类型声明），一般声明在 HTML 文档的第一行，目的是告诉浏览器（解析器）应该以什么样的文档类型定义来解析文档
- 在 HTML 文档中，`DOCTYPE` 的存在与否以及其格式是否正确，会影响浏览器的渲染模式
  - 标准模式：当声明正确时，浏览器会按照 W3C 标准规范解析和渲染页面
  - 怪异模式：当声明不正确时，浏览器会按照自己的方式（旧的、非标准的规则）解析和渲染页面
- 两种模式，会导致页面的渲染结果不同

```js
<!DOCTYPE html>
<html>
<head>
    <title>示例</title>
</head>
<body>
    <div style="width: 50%; margin: auto;">内容</div>
</body>
</html>
```

- 标准模式下， div 会正确居中显示，但是怪异模式下，可能无法正确居中
- 常见的 DOCTYPE 声明
  - HTML5：`<!DOCTYPE html>`
  - HTML4.01：`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "URL_ADDRESS    - HTML4.01：`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`
    - XHTML 1.0：`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">`