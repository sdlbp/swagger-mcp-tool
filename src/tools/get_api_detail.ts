import { z } from "zod";
import { SwaggerLoader } from "../swagger-loader.js";
import { OpenAPIV3 } from "openapi-types";

export const getApiDetailTool = {
  name: "get_api_detail",
  description: "Get detailed definition of a specific API",
  inputSchema: z.object({
    path: z.string().describe("API path, e.g., /user/v1/account/unbind"),
    method: z.string().describe("HTTP method, e.g., put, get, post"),
  }),
  handler: async (args: { path: string; method: string }) => {
    const loader = SwaggerLoader.getInstance();
    await loader.load();
    const paths = loader.getPaths();
    
    const pathItem = paths[args.path];
    if (!pathItem) {
      return {
        content: [{ type: "text" as const, text: `Path not found: ${args.path}` }],
        isError: true,
      };
    }

    // OpenAPIV3.PathItemObject 可以在顶层有 parameters，需要合并到 operation 中吗？
    // 通常 operation 里的会覆盖顶层的。为了完整性，应该包含。
    // 但简单起见，先只返回 operation，如果需要 path level parameters 再说。
    // 实际上 path level parameters 很常见。
    
    const method = args.method.toLowerCase() as keyof typeof pathItem;
    const operation = pathItem[method] as OpenAPIV3.OperationObject;

    if (!operation) {
      return {
        content: [{ type: "text" as const, text: `Method ${args.method} not found for path ${args.path}` }],
        isError: true,
      };
    }

    // Merge path-level parameters if they exist
    const finalOperation = { ...operation };
    if (pathItem.parameters) {
      finalOperation.parameters = [
        ...(pathItem.parameters as (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]),
        ...(operation.parameters || []),
      ];
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(finalOperation, null, 2),
        },
      ],
    };
  },
};

