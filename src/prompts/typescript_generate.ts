const GUIDE_TEXT = `## Deriving TypeScript Types from OpenAPI/Swagger Schemas

Follow these steps to obtain schema definitions from the current document and map them to TypeScript types:

1. **Resolve the schema reference**
   - When inspecting an operation with \`get_api_detail\`, \`$ref\` values in \`requestBody\`, \`parameters\`, or response schemas point to component schemas (e.g. \`#/components/schemas/UserSetupParam\`).
   - You can also call \`get_schema\` with a known schema name (e.g. \`UserSetupParam\`) to inspect the raw schema.

2. **Fetch the schema**
   - Call \`get_schema\` with \`ref\` set to either the full reference \`#/components/schemas/XXX\` or the schema name \`XXX\`.
   - The tool returns the schema as JSON (including \`properties\`, \`type\`, \`required\`, etc.).

3. **Emit TypeScript types**
   - Use the fetched schema to draft \`interface\` or \`type\` declarations that reflect the schema structure.
   - For \`$ref\`, use the referenced schema name as the type name, or resolve it via \`get_schema\` and inline the definition.

**Note:** If the repository already contains a type definition that matches or closely matches the target schema (same name or equivalent shape), do not generate a duplicate; reuse or reference the existing type instead.

To produce type definitions, first call \`get_schema\` for the target schema, then generate the corresponding TypeScript types based on the schema.`;

export const typescriptGeneratePrompt = {
  name: "typescript_generate",
  title: "Typescript Generate",
  description:
    "Returns a short guide for generating TypeScript type definitions from the current OpenAPI/Swagger document. Use get_schema to fetch a schema, then follow the guide to generate the corresponding types.",
  handler: async () => {
    return {
      messages: [
        {
          role: "assistant" as const,
          content: { type: "text" as const, text: GUIDE_TEXT },
        },
      ],
    };
  },
};
