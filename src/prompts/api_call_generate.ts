const GUIDE_TEXT = `## Generating API Call Examples from OpenAPI/Swagger

Follow these steps to produce TypeScript API call examples (e.g. \`fetch\` or \`axios\`) for endpoints in the current document:

1. **Find the API that matches the user’s description**
   - **Prefer the chat context:** If the conversation already provides a \`path\` and \`method\` (e.g. from a previous \`search_apis\` or \`get_api_detail\` result, or from the user’s message), use those and skip loading the full list.
   - **If the context does not identify the API:** Prefer calling \`search_apis\` with a keyword or path fragment from the user's description to narrow results. Only call \`search_apis\` **without parameters** if you still cannot find a match, then identify the one that matches what the user described (by path, method, summary, or tags).
   - **If no API matches** (from context or from the full list), **stop and do not generate an example.** Tell the user that the described API was not found.
   - Once you have a matching \`path\` and \`method\`, call \`get_api_detail\` with them to get the full operation (parameters, requestBody, responses).

2. **Handle TypeScript definitions when needed**
   - If the project uses TypeScript, generate the necessary type definitions for the API call example.
   - If the user already has type definitions, **prefer using the user-defined types**.
   - If the user-defined types seem incorrect or inconsistent, **ask a follow-up question** to clarify before generating or using types.

3. **Emit the example**
   - Use the operation returned by \`get_api_detail\` as the reference. Prefer the project’s existing API call style when present; otherwise use a reasonable, idiomatic style (e.g. fetch or axios).`;

export const apiCallGeneratePrompt = {
  name: "api_call_generate",
  title: "API Call Generate",
  description:
    "Returns a short guide for generating TypeScript API call (fetch or axios) from the current OpenAPI/Swagger document. Use get_api_detail to inspect an operation, then follow the guide to build the example.",
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
