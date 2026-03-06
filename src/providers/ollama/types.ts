/**
 * Ollama types
 */

export interface OllamaConfig {
  baseUrl: string;
}

export interface OllamaRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  options?: {
    num_predict?: number;
    top_p?: number;
  };
}
