# swagger-mcp-tool

[![GitHub](https://img.shields.io/badge/GitHub-sdlbp%2Fswagger--mcp--tool-blue)](https://github.com/sdlbp/swagger-mcp-tool)

基于 Node.js 的 Swagger MCP Server，用于解析和查询 Swagger/OpenAPI 文档。为 AI 模型提供 Swagger 文档查询工具，辅助生成接口代码。例如：AI 可以查询 Swagger 文档获取接口定义，然后生成对应的 TypeScript 接口代码。

## 功能

## 用户使用

### 1. 准备环境

- 仅需 Node.js（建议 18+）

```bash
node -v
```

### 2. 准备 Swagger 文档

准备 Swagger/OpenAPI 文档（本地文件路径或远程 URL）。

### 3. 运行命令

```bash
# 使用远程 URL
npx swagger-mcp-tool http://example.com/api/swagger.json

# 使用本地文件路径
npx swagger-mcp-tool ./docs/swagger.json
```

### 4. 参数说明

- 第一个参数必填：Swagger 文档的 URL 或本地文件路径

### 5. MCP 客户端配置（Cursor 示例）

在 Cursor 的 MCP 配置文件中（通常是 `~/.cursor/mcp.json` 或项目中的 `.cursorrules`），添加：

```json
{
  "mcpServers": {
    "swagger-tools": {
      "command": "npx",
      "args": ["swagger-mcp-tool", "http://example.com/api/swagger.json"]
    }
  }
}
```

## 开发

### 1. 安装 Bun（开发/构建用）

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. 本地开发运行

```bash
bun run dev
```

### 3. 构建产物（单文件 JS）

```bash
bun run build
node dist/index.js http://example.com/api/swagger.json
```

构建后目录结构：

```
dist/
  index.js
```

### 4. 一键发布（npm）

```bash
npm run release
```

## 可用工具（简述）

- `list_api_groups`：列出 API 分组
- `search_apis`：按标签或关键词搜索 API
- `get_api_detail`：获取指定接口的详细定义
- `get_schema`：获取数据模型 Schema 定义

## 许可证

MIT License
