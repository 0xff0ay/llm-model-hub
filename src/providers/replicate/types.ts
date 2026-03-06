/**
 * Replicate types
 */

export interface ReplicateConfig {
  apiKey: string;
}

export interface ReplicateRequest {
  model: string;
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}
