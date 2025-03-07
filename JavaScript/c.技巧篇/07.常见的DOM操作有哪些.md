### 常见的 DOM 操作有哪些

---
---

#### DOM 节点的获取

- `getElementById()`：根据 ID 获取 DOM 节点。
- `getElementsByTagName()`：根据标签名获取 DOM 节点。
- `getElementsByClassName()`：根据类名获取 DOM 节点。
- `querySelector()`：根据 CSS 选择器获取 DOM 节点。
- `querySelectorAll()`：根据 CSS 选择器获取所有符合条件的 DOM 节点。

#### DOM 节点的创建与删除

- `createElement()`：创建新的 DOM 节点。
- `appendChild()`：将新的 DOM 节点添加到指定的父节点中。
- `removeChild()`：删除指定的子节点。

```js
// 首先获取父节点
var container = document.getElementById('container')
// 创建新节点
var targetSpan = document.createElement('span')
// 设置 span 节点的内容
targetSpan.innerHTML = 'hello world'
// 把新创建的元素塞进父节点里去
container.appendChild(targetSpan)
// 删除
container.removeChild(targetSpan)
```

#### DOM 节点的修改

- `innerHTML`：获取或设置 DOM 节点的 HTML 内容。
- `textContent`：获取或设置 DOM 节点的文本内容。
- `setAttribute()`：设置 DOM 节点的属性值。
- `getAttribute()`：获取 DOM 节点的属性值。
- `style`：获取或设置 DOM 节点的样式。

```js
// 获取元素
var targetSpan = document.getElementById('target')  
// 修改元素的内容
targetSpan.innerHTML = 'hello world'
// 修改元素的属性
targetSpan.setAttribute('class', 'new-class')
// 修改元素的样式
targetSpan.style.color = 'red'
```