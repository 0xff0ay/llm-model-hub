/**
 * Type definitions
 */

export interface Provider {
  name: string;
  id: string;
  models: string[];
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  maxTokens: number;
}

export interface ChatOptions {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
}
