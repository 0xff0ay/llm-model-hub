/**
 * Cohere types
 */

export interface CohereConfig {
  apiKey: string;
}

export interface CohereRequest {
  model: string;
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}
