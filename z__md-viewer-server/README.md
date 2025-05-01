# Markdown 文档查看器 - 服务端

这是Markdown文档查看器的后端服务，提供API接口读取本地Markdown文件。

## 功能

- 扫描目录结构，识别包含Markdown文件的文件夹
- 提供REST API接口读取文件内容
- 支持CORS，方便前端调用

## 安装

```bash
# 安装依赖
npm install
```

## 运行

```bash
# 启动服务器
npm start
```

服务器将在 http://localhost:3000 上运行。

## API接口

- `GET /api/folders` - 获取所有文件夹
- `GET /api/files/:folder` - 获取指定文件夹中的所有.md文件
- `GET /api/content/:folder/:file` - 获取指定文件的内容

## 注意事项

此服务需要与md-viewer前端项目一起使用。请确保它运行在3000端口，以便前端能够正确访问。 