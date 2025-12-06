# swagger-mcp-tool

基于 Bun 的 Swagger MCP 服务器，用于解析和查询 Swagger/OpenAPI 文档。为 AI 模型提供 Swagger 文档查询工具，辅助生成接口代码。例如：AI 可以查询 Swagger 文档获取接口定义，然后生成对应的 TypeScript 接口代码。

## 功能

提供 Swagger/OpenAPI 文档的查询工具，支持从本地文件或远程 URL 加载文档。AI 可以通过这些工具查询接口定义、Schema 等信息，用于生成 TypeScript 类型定义和 API 调用代码。

## 前置使用条件

### 1. 安装 Bun 运行时

项目依赖 Bun 运行时环境，使用前需要先安装 Bun：

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. 准备 Swagger 文档

确保你有可用的 Swagger/OpenAPI 文档（本地文件路径或远程 URL）

## 使用方式

### 通过 npx 使用（推荐）

```bash
# 使用远程 URL
npx swagger-mcp-tool http://example.com/api/swagger.json

# 使用本地文件路径
npx swagger-mcp-tool ./docs/swagger.json

# 使用默认路径（环境变量 DOCS_URL 或 docs/swagger.json）
npx swagger-mcp-tool
```

### 通过 bunx 使用

```bash
# 使用远程 URL
bunx swagger-mcp-tool http://example.com/api/swagger.json

# 使用本地文件路径
bunx swagger-mcp-tool ./docs/swagger.json
```

### 参数说明

- **第一个参数**：Swagger 文档的 URL 或本地文件路径
  - 支持 HTTP/HTTPS URL（远程文档）
  - 支持本地文件路径（相对路径或绝对路径）
  - 如果不提供参数，将使用环境变量 `DOCS_URL` 或默认路径 `docs/swagger.json`

## MCP 客户端配置

### 在 Cursor 中配置

在 Cursor 的 MCP 配置文件中（通常是 `~/.cursor/mcp.json` 或项目中的 `.cursorrules`），添加以下配置：

#### 使用远程 URL

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

#### 使用本地文件

```json
{
  "mcpServers": {
    "swagger-tools": {
      "command": "npx",
      "args": ["swagger-mcp-tool", "/path/to/your/swagger.json"]
    }
  }
}
```

#### 使用 bunx（如果已安装 Bun）

```json
{
  "mcpServers": {
    "swagger-tools": {
      "command": "bunx",
      "args": ["swagger-mcp-tool", "http://example.com/api/swagger.json"]
    }
  }
}
```

**注意**：

- 使用绝对路径更可靠
- 配置后需要重启 Cursor 才能生效

## 可用工具

### 1. list_api_groups

**功能**：列出所有 API 分组（标签）

**描述**：从 Swagger 文档中获取所有 API 分组信息。如果文档中没有定义顶层标签，会自动从路径中收集所有使用的标签。

**使用场景**：

- 查看 API 文档中有哪些功能模块
- 了解 API 的组织结构

### 2. search_apis

**功能**：搜索 API（支持按标签或关键词）

**描述**：根据标签或关键词搜索匹配的 API。支持在路径、摘要、描述和操作 ID 中进行搜索。

**参数**：

- `tag`（可选）：按标签过滤 API
- `keyword`（可选）：在路径、摘要或描述中搜索关键词

**使用场景**：

- 查找特定功能模块的 API
- 根据关键词快速定位相关接口

### 3. get_api_detail

**功能**：获取 API 详细信息

**描述**：获取指定路径和方法的完整 API 定义，包括请求参数、响应结构、描述等详细信息。会自动合并路径级别的参数。

**参数**：

- `path`：API 路径，如 `/user/v1/account/unbind`
- `method`：HTTP 方法，如 `get`、`post`、`put`、`delete`

**使用场景**：

- 查看特定接口的完整定义
- 生成 API 调用代码
- 了解接口的请求和响应结构

### 4. get_schema

**功能**：获取 Schema 定义

**描述**：通过引用或名称获取数据模型的 Schema 定义。支持完整的 Schema 引用格式（如 `#/components/schemas/UserSetupParam`）或简化的名称格式（如 `UserSetupParam`）。

**参数**：

- `ref`：Schema 引用或名称，如 `#/components/schemas/UserSetupParam` 或 `UserSetupParam`

**使用场景**：

- 查看数据模型的定义
- 生成 TypeScript 类型定义
- 了解请求/响应的数据结构

## 许可证

MIT License
