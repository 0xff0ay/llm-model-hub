/**
 * AWS Bedrock types
 */

export interface BedrockConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface BedrockRequest {
  modelId: string;
  content: string;
  temperature?: number;
  maxTokens?: number;
}
