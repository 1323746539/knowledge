
- 性能优化：更快的渲染、更小的打包体积（Tree-shaking 支持）。

- Composition API：更灵活的逻辑复用（替代 Options API）。

- 响应式系统升级：使用 Proxy 替代 Object.defineProperty，支持更多数据类型的响应式。

- 多根节点组件：支持 Fragments（模板不再强制单根节点）。

- Teleport 组件：方便将组件渲染到 DOM 的其他位置。

- Suspense 组件：更好地处理异步组件加载状态。

- TypeScript 支持：代码完全用 TypeScript 重写，提供更好的类型推断。

- 自定义渲染器 API：允许自定义渲染逻辑（如 WebGL、Canvas）。

- 全局 API 调整：createApp 代替 new Vue()，更模块化的 API 设计。

- v-model 改进：支持多个 v-model 绑定，自定义修饰符。