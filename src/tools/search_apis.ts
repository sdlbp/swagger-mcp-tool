import { z } from "zod";
import { SwaggerLoader } from "../swagger-loader.js";
import { OpenAPIV3 } from "openapi-types";

interface ApiSummary {
  path: string;
  method: string;
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
}

export const searchApisTool = {
  name: "search_apis",
  description: "Search for APIs by tag or keyword",
  inputSchema: z.object({
    tag: z.string().optional().describe("Filter APIs by tag (group name)"),
    keyword: z.string().optional().describe("Search keyword in path, summary, or description"),
  }),
  handler: async (args: { tag?: string; keyword?: string }) => {
    const loader = SwaggerLoader.getInstance();
    await loader.load();
    const paths = loader.getPaths();
    const results: ApiSummary[] = [];

    const methods = ["get", "post", "put", "delete", "patch", "options", "head", "trace"] as const;

    for (const [path, pathItem] of Object.entries(paths)) {
      if (!pathItem) continue;

      for (const method of methods) {
        const operation = pathItem[method] as OpenAPIV3.OperationObject;
        if (!operation) continue;

        let matches = true;

        // Filter by tag
        if (args.tag) {
          if (!operation.tags || !operation.tags.includes(args.tag)) {
            matches = false;
          }
        }

        // Filter by keyword
        if (matches && args.keyword) {
          const keyword = args.keyword.toLowerCase();
          const searchText = [
            path,
            operation.summary,
            operation.description,
            operation.operationId,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (!searchText.includes(keyword)) {
            matches = false;
          }
        }

        if (matches) {
          results.push({
            path,
            method,
            summary: operation.summary,
            description: operation.description,
            operationId: operation.operationId,
            tags: operation.tags,
          });
        }
      }
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  },
};

