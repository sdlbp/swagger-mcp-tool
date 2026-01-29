# swagger-mcp-tool

[![GitHub](https://img.shields.io/badge/GitHub-sdlbp%2Fswagger--mcp--tool-blue)](https://github.com/sdlbp/swagger-mcp-tool)

## 这是什么项目

这是一个 MCP（Model Context Protocol）服务器，用于加载 Swagger/OpenAPI 文档，并向 AI 助手或 MCP 客户端提供查询工具。

## 功能特性

- 直接通过 Agent 使用 Swagger 文档生成接口相关代码。
- 在 TypeScript 项目中直接生成接口响应与接口定义类型描述。

## 安装说明

### 环境依赖

- Node.js >= 18
- npm 或 npx（用于运行 CLI）
- Bun >= 1.0.0（可选，仅开发/构建用）

### 安装步骤

```bash
npm install -g swagger-mcp-tool
```

## 使用方法

在 MCP 客户端配置中添加一个或多个服务器条目（以 Cursor 为例：`~/.cursor/mcp.json`）。每个 Swagger/OpenAPI 文档使用一个独立的服务器名，便于并行项目分别配置。

```json
{
  "mcpServers": {
    "swagger-petstore": {
      "command": "npx",
      "args": ["-y", "swagger-mcp-tool", "https://example.com/petstore.json"]
    },
    "swagger-orders": {
      "command": "npx",
      "args": ["-y", "swagger-mcp-tool", "./openapi/orders.yaml"]
    }
  }
}
```

### 聊天面板示例

配置完成后，可在聊天面板直接描述想要添加的接口，可以使用查看Swagger文档开头，便于Agent触发本工具，比如：

“查看 Swagger 文档，补全订单业务的退款接口。”

## API 说明

| 名称 | 类型 / 命令 | 说明 | 参数 | 返回值 / 输出 |
|------|-------------|------|------|----------------|
| `list_api_groups` | 工具 | 列出所有 API 分组（tags） | 无 | JSON 标签数组 |
| `search_apis` | 工具 | 按标签或关键词搜索 API | `tag`（可选），`keyword`（可选） | JSON API 摘要数组 |
| `get_api_detail` | 工具 | 获取指定接口的完整定义 | `path`，`method` | JSON 操作对象 |
| `get_schema` | 工具 | 根据 `$ref` 或名称获取 Schema | `ref` | JSON Schema 对象 |
| `schema_to_ts_types` | Prompt | 将 Schema 转为 TypeScript 类型定义 | `schema_ref` | 一段 TypeScript 类型代码 |
| `api_call_example` | Prompt | 根据接口定义生成 API 调用示例（fetch/axios） | `path`，`method`，`style`（可选） | 一段 TypeScript 调用示例代码 |

## 许可证

本项目基于 MIT 协议开源，详情见 [LICENSE](../LICENSE) 文件。
