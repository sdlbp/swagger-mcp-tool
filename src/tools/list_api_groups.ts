import { z } from "zod";
import { SwaggerLoader } from "../swagger-loader.js";
import { OpenAPIV3 } from "openapi-types";

export const listApiGroupsTool = {
  name: "list_api_groups",
  description: "Get all API groups (tags) from the Swagger documentation",
  inputSchema: z.object({}),
  handler: async () => {
    const loader = SwaggerLoader.getInstance();
    await loader.load();
    let tags = loader.getTags();

    // If no top-level tags, aggregate from paths
    if (tags.length === 0) {
      const paths = loader.getPaths();
      const tagSet = new Set<string>();

      for (const pathItem of Object.values(paths)) {
        if (!pathItem) continue;
        const methods = ["get", "post", "put", "delete", "patch", "options", "head", "trace"] as const;
        for (const method of methods) {
          const op = pathItem[method] as OpenAPIV3.OperationObject;
          if (op && op.tags) {
            op.tags.forEach(t => tagSet.add(t));
          }
        }
      }
      
      tags = Array.from(tagSet).map(name => ({ name, description: "Collected from paths" }));
    }
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(tags, null, 2),
        },
      ],
    };
  },
};
