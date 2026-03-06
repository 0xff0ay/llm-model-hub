import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

export interface LLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: LLMMessage;
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason?: string;
  }[];
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  maxRetries?: number;
  timeout?: number;
}

export abstract class BaseProvider {
  protected client: AxiosInstance;
  protected config: ProviderConfig;
  public abstract name: string;
  public abstract supportedModels: string[];
  public abstract defaultModel: string;

  constructor(config: ProviderConfig = {}) {
    this.config = {
      maxRetries: 3,
      timeout: 60000,
      ...config
    };

    this.client = axios.create({
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  abstract chat(request: LLMRequest): Promise<LLMResponse>;
  abstract chatStream(request: LLMRequest): AsyncGenerator<StreamChunk>;
  abstract listModels(): Promise<string[]>;

  protected async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < (this.config.maxRetries || 3); i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        await this.delay(Math.pow(2, i) * 1000);
      }
    }

    throw lastError;
  }

  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  getConfig(): ProviderConfig {
    return { ...this.config };
  }
}
