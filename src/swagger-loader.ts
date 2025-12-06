import swaggerParser from "swagger-parser";
import { OpenAPI, OpenAPIV3 } from "openapi-types";

export class SwaggerLoader {
  private static instance: SwaggerLoader;
  private document: OpenAPI.Document | null = null;
  private docsUrl: string;

  private constructor(docsUrl?: string) {
    this.docsUrl = docsUrl || process.env.DOCS_URL || "docs/swagger.json";
  }

  public static getInstance(docsUrl?: string): SwaggerLoader {
    if (!SwaggerLoader.instance) {
      SwaggerLoader.instance = new SwaggerLoader(docsUrl);
    } else if (docsUrl && SwaggerLoader.instance.docsUrl !== docsUrl) {
      // 如果提供了新的 URL 且与当前不同，重置实例
      SwaggerLoader.instance.docsUrl = docsUrl;
      SwaggerLoader.instance.document = null; // 清除缓存的文档
    }
    return SwaggerLoader.instance;
  }

  public setDocsUrl(docsUrl: string): void {
    if (this.docsUrl !== docsUrl) {
      this.docsUrl = docsUrl;
      this.document = null; // 清除缓存的文档
    }
  }

  public async load(): Promise<OpenAPI.Document> {
    if (this.document) {
      return this.document;
    }
    try {
      // Preserve $ref for schema lookup
      this.document = await swaggerParser.parse(this.docsUrl);
      return this.document;
    } catch (error) {
      console.error("Failed to load swagger document:", error);
      throw error;
    }
  }

  public getDocument(): OpenAPI.Document | null {
    return this.document;
  }

  public getTags(): OpenAPIV3.TagObject[] {
    if (!this.document) return [];
    return (this.document as OpenAPIV3.Document).tags || [];
  }

  public getPaths(): OpenAPIV3.PathsObject {
    if (!this.document) return {};
    return (this.document as OpenAPIV3.Document).paths || {};
  }

  public getSchemas(): { [key: string]: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject } {
    if (!this.document) return {};
    const doc = this.document as OpenAPIV3.Document;
    return doc.components?.schemas || {};
  }

  public getDocsUrl(): string {
    return this.docsUrl;
  }
}
