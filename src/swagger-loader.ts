import swaggerParser from "swagger-parser";
import { OpenAPI, OpenAPIV3 } from "openapi-types";

export class SwaggerLoader {
  private static instance: SwaggerLoader;
  private document: OpenAPI.Document | null = null;
  private docsUrl: string;

  private constructor(docsUrl?: string) {
    if (!docsUrl) {
      throw new Error("❌ Error: Must provide Swagger document URL as a command line argument");
    }
    this.docsUrl = docsUrl;
  }

  public static getInstance(): SwaggerLoader {
    if (!SwaggerLoader.instance) {
      // 单例仅支持从启动参数中初始化
      const docsUrl = process.argv[2];
      if (!docsUrl) {
        throw new Error("❌ Error: Swagger document URL must be provided as a command line argument");
      }
      SwaggerLoader.instance = new SwaggerLoader(docsUrl);
    }
    return SwaggerLoader.instance;
  }

  public setDocsUrl(docsUrl: string): void {
    if (this.docsUrl !== docsUrl) {
      this.docsUrl = docsUrl;
      this.document = null; // Clear cached document
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
