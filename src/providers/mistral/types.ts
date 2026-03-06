/**
 * Mistral types
 */

export interface MistralConfig {
  apiKey: string;
}

export interface MistralRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
}
