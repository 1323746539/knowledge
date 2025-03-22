
### 对BFC的理解，如何创建BFC

---
---

- `BEC`（Block Formatting Context，块级格式化上下文）
- 是一个独立的渲染区域，其中的元素布局与外部元素互不影响

- 创建BFC的方式：
  - 根元素：body 默认是一个BFC
  - `float` 的值不为 `none`
  - `position` 的值为 `absolute` 或 `fixed`
  - `display` 的值为  `inline-block、table、flex、grid`
  - `overflow` 的值不为 visible，为 `hidden、auto、scroll`

- BFC 的作用：
  - 解决上下元素 margin 重叠问题
  - 解决浮动元素高度塌陷问题
  - 处理溢出，就是常见的设置 `overflow: hidden`
