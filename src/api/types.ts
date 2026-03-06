/**
 * API types for LLM-Model Hub
 */

export interface ChatRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage?: Usage;
}

export interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: StreamChoice[];
}

export interface StreamChoice {
  index: number;
  delta: Partial<Message>;
  finish_reason?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  max_output_tokens: number;
}

export interface ProviderInfo {
  id: string;
  name: string;
  models: string[];
  status: 'active' | 'inactive' | 'error';
}
