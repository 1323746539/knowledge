
- Vue 的模板编译是将 template 模板字符串转换为可执行的 render 函数的过程，这是 Vue 实现响应式渲染的核心机制之一

### 一、完整编译流程

#### 1.1 解析阶段 Parse

- 将模板字符串转换为 AST（抽象语法树）
- 过程：
  - 使用正则表达式和状态机分析模板字符串
  - 识别模板中的标签、属性、指令、文本等内容
  - 生成树形结构的 AST 节点

- 示例：

```html
<div id="app">{{ message }}</div>
```
- 转换为 AST 节点：
```javascript
{
  type: 1, // 元素节点
  tag: 'div',
  attrsList: [{ name: 'id', value: 'app' }],
  attrsMap: { id: 'app' },
  children: [{
    type: 2, // 文本节点
    expression: '_s(message)',
    text: '{{ message }}'
  }]
}
```

#### 1.2 优化阶段 Optimize

- 对 AST 进行静态节点标记和树的优化
- 过程：
  - 标记静态节点
    - 遍历 AST，标记静态节点
    - 标记静态根节点（子节点全是静态的节点）
  - 优化树结构：移除无用的节点、合并相邻的文本节点等

- 优化作用：
  - 跳过静态节点 diff 过程
  - 提升重新渲染的性能


#### 1.3 代码生成阶段 Generate

- 将 AST 转换为 render 函数字符串
- 转换规则：
  - 元素节点 → _c(tag, data, children)
  - 文本节点 → _v(text)
  - 指令节点 → _d(directive)
  - 插值表达式 → _s(value)

```js
with(this) {
  return _c('div', { attrs: { "id": "app" } }, [_v(_s(message))])
}
```

### 二、核心编译函数

- `compileToFunctions()`

```js
function compileToFunctions(template, options) {
  // 1. 解析
  const ast = parse(template.trim(), options)
  
  // 2. 优化
  optimize(ast, options)
  
  // 3. 生成
  const code = generate(ast, options)
  
  // 4. 创建渲染函数
  return {
    render: new Function(`with(this){return ${code}}`),
    staticRenderFns: []
  }
}
```

- 运行时帮助方法
  - `_c()`：createElement (创建 VNode)
  - `_v()`：createTextVNode (创建文本 VNode)
  - `_s()`：toString (值转换为字符串)
  - `_m()`：renderStatic (渲染静态内容)


### 三、扩展：Template 到 Render 的转换与虚拟 DOM 的关系

- 先说整体流程：

```js
Template → 编译 → Render 函数 → 执行 → 虚拟 DOM → Diff → 真实 DOM
```

- 还是上面例子，转换为 render 函数为

```js
// 这里是 vue3 写法，知道意思就行，vue2 也差不多的
function render() {
  return h('div', { id: 'app' }, this.message)
}
```

- 这里的 h 函数是 Vue 提供的 createElement 方法，用于创建 VNode
- 生成的 VNode 就是一个 js 对象，包含标签、属性、子节点等信息

```js
{
  tag: 'div',
  data: { attrs: { id: 'app' } },
  children: [ this.message ],
  text: undefined
}
```
