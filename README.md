# swagger-mcp-tool

[![GitHub](https://img.shields.io/badge/GitHub-sdlbp%2Fswagger--mcp--tool-blue)](https://github.com/sdlbp/swagger-mcp-tool)

<!-- translate:off -->
<!-- LANGUAGE SWITCHER -->
[Chinese (Simplified Han script)](./docs/README-zh.md) 
<!-- translate:on -->

## What is swagger-mcp-tool

An MCP (Model Context Protocol) server that loads Swagger/OpenAPI documents and exposes query tools for AI assistants and MCP clients.

## Features

- Generate API-related code directly through an agent using Swagger docs.
- Generate response types and interface definitions for TypeScript projects.

## Installation

### Prerequisites

- Node.js >= 18
- npm or npx (for running the CLI)
- Bun >= 1.0.0 (optional, for development/build)

### Install

```bash
npm install -g swagger-mcp-tool
```

## Usage

Add one or more server entries to your MCP client config (example for Cursor: `~/.cursor/mcp.json`). Use a separate server name per Swagger/OpenAPI document to support multiple projects in parallel.

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

### Chat panel examples

After the server is configured, describe what you want to add in the chat panel. Start with "View the Swagger doc" to help the agent trigger this tool, for example:

"View the Swagger doc and complete the refund API for the order domain."

## API

| Tool | Description | Parameters | Output |
|------|-------------|------------|--------|
| `list_api_groups` | List all API groups (tags) | None | JSON array of tag objects |
| `search_apis` | Search APIs by tag or keyword | `tag` (optional), `keyword` (optional) | JSON array of API summaries |
| `get_api_detail` | Get full operation detail | `path`, `method` | JSON operation object |
| `get_schema` | Get schema by `$ref` or name | `ref` | JSON schema object |

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
