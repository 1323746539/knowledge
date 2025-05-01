# Markdown 文档查看器 - 前端

这是一个基于Vue 3和Vite构建的Markdown文档查看器，可以浏览和展示本地Markdown文件。

## 功能

- 浏览所有可用的文档目录
- 目录之间快速导航
- 渲染Markdown文档为HTML
- 响应式设计，支持各种设备

## 安装

```bash
# 安装依赖
npm install
```

## 构建和运行

```bash
# 构建项目
npm run build

# 预览
npm run preview
```

## 开发

```bash
# 启动开发服务器
npm run dev
```

## 注意

此项目需要配合md-viewer-server后端服务一起使用，请确保md-viewer-server已启动并运行在http://localhost:3000。

## 项目结构

- `src/` - Vue源代码
  - `views/` - 页面组件
  - `components/` - 可复用组件
