/**
 * HuggingFace types
 */

export interface HuggingFaceConfig {
  apiKey: string;
}

export interface HuggingFaceRequest {
  model: string;
  inputs: string;
  parameters?: {
    temperature?: number;
    max_new_tokens?: number;
    top_p?: number;
  };
}
