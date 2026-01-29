#!/usr/bin/env node
import { createRequire } from "module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { name: string; version: string };
import { listApiGroupsTool } from "./tools/list_api_groups.js";
import { searchApisTool } from "./tools/search_apis.js";
import { getApiDetailTool } from "./tools/get_api_detail.js";
import { getSchemaTool } from "./tools/get_schema.js";
import { typescriptGeneratePrompt } from "./prompts/typescript_generate.js";
import { apiCallGeneratePrompt } from "./prompts/api_call_generate.js";
import { SwaggerLoader } from "./swagger-loader.js";

// Parse command line arguments to get Swagger document URL
const docsUrl = process.argv[2];

// Swagger document URL must be provided
if (!docsUrl) {
  console.error("❌ Error: Swagger document URL must be provided as a command line argument");
  console.error("Usage: swagger-mcp-tool <swagger-docs-url>");
  process.exit(1);
}

// Initialize SwaggerLoader
SwaggerLoader.getInstance();

// 1. Create MCP server
const server = new McpServer(
  {
    name: pkg.name,
    version: pkg.version,
  },
  {
    capabilities: {
      tools: { listChanged: true },
      prompts: { listChanged: true },
    },
  }
);

// 2. Register tools
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

// 3. Register prompts
server.registerPrompt(
  typescriptGeneratePrompt.name,
  {
    title: typescriptGeneratePrompt.title,
    description: typescriptGeneratePrompt.description,
  },
  typescriptGeneratePrompt.handler
);
server.registerPrompt(
  apiCallGeneratePrompt.name,
  {
    title: apiCallGeneratePrompt.title,
    description: apiCallGeneratePrompt.description,
  },
  apiCallGeneratePrompt.handler
);

// Start server
async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  const loader = SwaggerLoader.getInstance();
  // Use stderr for logging to avoid interfering with MCP protocol stdio communication
  console.error("🚀 Swagger MCP Server started!");
  console.error(`📄 Swagger document source: ${loader.getDocsUrl()}`);
  console.error("Available tools:", [listApiGroupsTool.name, searchApisTool.name, getApiDetailTool.name, getSchemaTool.name].join(", "));
  console.error("Available prompts:", [typescriptGeneratePrompt.name, apiCallGeneratePrompt.name].join(", "));
}

startServer().catch(console.error);
