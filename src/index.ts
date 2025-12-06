#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listApiGroupsTool } from "./tools/list_api_groups.js";
import { searchApisTool } from "./tools/search_apis.js";
import { getApiDetailTool } from "./tools/get_api_detail.js";
import { getSchemaTool } from "./tools/get_schema.js";
import { SwaggerLoader } from "./swagger-loader.js";

// 解析命令行参数获取 Swagger 文档 URL
const docsUrl = process.argv[2] || process.env.DOCS_URL;

// 初始化 SwaggerLoader，如果提供了 URL 则使用它
if (docsUrl) {
  SwaggerLoader.getInstance(docsUrl);
}

// 1、创建MCP服务器
const server = new McpServer(
  {
    name: "swagger-tools",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        listChanged: true,
      },
    },
  }
);

// 2、注册工具
server.registerTool(
  listApiGroupsTool.name,
  {
    description: listApiGroupsTool.description,
    inputSchema: listApiGroupsTool.inputSchema.shape,
  },
  listApiGroupsTool.handler
);

server.registerTool(
  searchApisTool.name,
  {
    description: searchApisTool.description,
    inputSchema: searchApisTool.inputSchema.shape,
  },
  searchApisTool.handler
);

server.registerTool(
  getApiDetailTool.name,
  {
    description: getApiDetailTool.description,
    inputSchema: getApiDetailTool.inputSchema.shape,
  },
  getApiDetailTool.handler
);

server.registerTool(
  getSchemaTool.name,
  {
    description: getSchemaTool.description,
    inputSchema: getSchemaTool.inputSchema.shape,
  },
  getSchemaTool.handler
);

// 启动服务器
async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  const loader = SwaggerLoader.getInstance();
  // 使用 stderr 输出日志，避免干扰 MCP 协议的 stdio 通信
  console.error("🚀 Swagger MCP Server 服务器已启动！");
  console.error(`📄 Swagger 文档源: ${loader.getDocsUrl()}`);
  console.error("Available tools:", [listApiGroupsTool.name, searchApisTool.name, getApiDetailTool.name, getSchemaTool.name].join(", "));
}

startServer().catch(console.error);
