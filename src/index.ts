#!/usr/bin/env bun

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// 简单的工具示例
class SimpleTools {
  // 计算器工具
  static calculate(operation: string, a: number, b: number): number {
    switch (operation) {
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        if (b === 0) throw new Error("除数不能为零");
        return a / b;
      default:
        throw new Error(`不支持的操作: ${operation}`);
    }
  }

  // 文本处理工具
  static processText(text: string, operation: string): string {
    switch (operation) {
      case "uppercase":
        return text.toUpperCase();
      case "lowercase":
        return text.toLowerCase();
      case "reverse":
        return text.split("").reverse().join("");
      case "word_count":
        return text.split(/\s+/).filter(word => word.length > 0).length.toString();
      default:
        throw new Error(`不支持的操作: ${operation}`);
    }
  }

  // 时间工具
  static getTimeInfo(): { current: string; timestamp: number; timezone: string } {
    const now = new Date();
    return {
      current: now.toISOString(),
      timestamp: now.getTime(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  // 随机数生成器
  static generateRandom(min: number, max: number, count: number = 1): number[] {
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      result.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return result;
  }
}

// 创建 MCP 服务器
const server = new Server({
  name: "bun-mcp-server",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

// 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calculator",
        description: "执行基本的数学计算操作",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["add", "subtract", "multiply", "divide"],
              description: "数学操作类型",
            },
            a: {
              type: "number",
              description: "第一个数字",
            },
            b: {
              type: "number",
              description: "第二个数字",
            },
          },
          required: ["operation", "a", "b"],
        },
      },
      {
        name: "text_processor",
        description: "处理文本字符串",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "要处理的文本",
            },
            operation: {
              type: "string",
              enum: ["uppercase", "lowercase", "reverse", "word_count"],
              description: "文本处理操作",
            },
          },
          required: ["text", "operation"],
        },
      },
      {
        name: "time_info",
        description: "获取当前时间信息",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "random_generator",
        description: "生成指定范围内的随机数",
        inputSchema: {
          type: "object",
          properties: {
            min: {
              type: "number",
              description: "最小值",
              default: 0,
            },
            max: {
              type: "number",
              description: "最大值",
              default: 100,
            },
            count: {
              type: "number",
              description: "生成数量",
              default: 1,
            },
          },
          required: ["min", "max"],
        },
      },
      {
        name: "file_operations",
        description: "执行基本的文件操作",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["read", "write", "list", "exists"],
              description: "文件操作类型",
            },
            path: {
              type: "string",
              description: "文件或目录路径",
            },
            content: {
              type: "string",
              description: "要写入的内容（仅用于 write 操作）",
            },
          },
          required: ["operation", "path"],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "calculator": {
        const { operation, a, b } = args as {
          operation: string;
          a: number;
          b: number;
        };
        const result = SimpleTools.calculate(operation, a, b);
        return {
          content: [
            {
              type: "text",
              text: `计算结果: ${a} ${operation} ${b} = ${result}`,
            },
          ],
        };
      }

      case "text_processor": {
        const { text, operation } = args as {
          text: string;
          operation: string;
        };
        const result = SimpleTools.processText(text, operation);
        return {
          content: [
            {
              type: "text",
              text: `文本处理结果 (${operation}): ${result}`,
            },
          ],
        };
      }

      case "time_info": {
        const timeInfo = SimpleTools.getTimeInfo();
        return {
          content: [
            {
              type: "text",
              text: `当前时间信息:\n- ISO 时间: ${timeInfo.current}\n- 时间戳: ${timeInfo.timestamp}\n- 时区: ${timeInfo.timezone}`,
            },
          ],
        };
      }

      case "random_generator": {
        const { min, max, count = 1 } = args as {
          min: number;
          max: number;
          count?: number;
        };
        const numbers = SimpleTools.generateRandom(min, max, count);
        return {
          content: [
            {
              type: "text",
              text: `生成的随机数 (${min}-${max}, 数量: ${count}): ${numbers.join(", ")}`,
            },
          ],
        };
      }

      case "file_operations": {
        const { operation, path, content } = args as {
          operation: string;
          path: string;
          content?: string;
        };

        let result: string;

        switch (operation) {
          case "read": {
            try {
              const file = Bun.file(path);
              if (await file.exists()) {
                result = await file.text();
              } else {
                result = `文件不存在: ${path}`;
              }
            } catch (error) {
              result = `读取文件失败: ${error instanceof Error ? error.message : String(error)}`;
            }
            break;
          }

          case "write": {
            try {
              if (!content) {
                result = "错误: 写入操作需要提供 content 参数";
              } else {
                await Bun.write(path, content);
                result = `成功写入文件: ${path}`;
              }
            } catch (error) {
              result = `写入文件失败: ${error instanceof Error ? error.message : String(error)}`;
            }
            break;
          }

          case "list": {
            try {
              const dir = Bun.file(path);
              if (await dir.exists()) {
                // 这里简化处理，实际应该使用 fs 模块
                result = `目录列表功能需要进一步实现: ${path}`;
              } else {
                result = `目录不存在: ${path}`;
              }
            } catch (error) {
              result = `列出目录失败: ${error instanceof Error ? error.message : String(error)}`;
            }
            break;
          }

          case "exists": {
            try {
              const file = Bun.file(path);
              const exists = await file.exists();
              result = `文件/目录 ${exists ? "存在" : "不存在"}: ${path}`;
            } catch (error) {
              result = `检查文件存在性失败: ${error instanceof Error ? error.message : String(error)}`;
            }
            break;
          }

          default:
            result = `不支持的文件操作: ${operation}`;
        }

        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `错误: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Bun MCP 服务器已启动！");
  console.error("📋 可用工具:");
  console.error("  - calculator: 数学计算");
  console.error("  - text_processor: 文本处理");
  console.error("  - time_info: 时间信息");
  console.error("  - random_generator: 随机数生成");
  console.error("  - file_operations: 文件操作");
}

startServer().catch(console.error);