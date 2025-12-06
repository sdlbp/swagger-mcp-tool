import { z } from "zod";
import { SwaggerLoader } from "../swagger-loader.js";
import { OpenAPIV3 } from "openapi-types";

export const getSchemaTool = {
  name: "get_schema",
  description: "Get schema definition by reference",
  inputSchema: z.object({
    ref: z.string().describe("Schema reference or name, e.g., #/components/schemas/UserSetupParam or UserSetupParam"),
  }),
  handler: async (args: { ref: string }) => {
    const loader = SwaggerLoader.getInstance();
    await loader.load();
    const schemas = loader.getSchemas();

    let schemaName = args.ref;
    // Strip prefix if present
    if (schemaName.startsWith("#/components/schemas/")) {
      schemaName = schemaName.replace("#/components/schemas/", "");
    }

    const schema = schemas[schemaName];

    if (!schema) {
      return {
        content: [{ type: "text" as const, text: `Schema not found: ${args.ref} (searched for ${schemaName})` }],
        isError: true,
      };
    } 

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(schema, null, 2),
        },
      ],
    };
  },
};

