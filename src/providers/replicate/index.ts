import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class ReplicateProvider extends BaseProvider {
  public name = 'Replicate';
  public supportedModels = [
    'meta/llama-3.3-70b-instruct',
    'meta/llama-3.1-405b-instruct',
    'meta/llama-3.1-70b-instruct',
    'meta/llama-3.1-8b-instruct',
    'meta/llama-3-70b-instruct',
    'meta/llama-3-8b-instruct',
    'mistralai/mistral-large',
    'mistralai/mistral-7b-instruct-v0.2',
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-opus',
    'google/gemma-2-27b-it',
    'google/gemma-2-9b-it',
    'meta/codellama-70b-instruct',
    'microsoft/phi-3-mini-128k-instruct'
  ];
  public defaultModel = 'meta/llama-3.1-70b-instruct';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'https://api.replicate.com/v1',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const response = await this.client.post(
        '/deployments/' + request.model.replace('/', '__') + '/completions',
        {
          prompt: request.messages.map(m => m.content).join('\n'),
          temperature: request.temperature,
          max_tokens: request.max_tokens,
          top_p: request.top_p
        },
        {
          headers: {
            'Authorization': `Token ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      return {
        id: data.id || `replicate-${Date.now()}`,
        object: 'chat.completion',
        created: Date.now(),
        model: request.model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: data.completion || data.output || ''
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    });
  }

  async *chatStream(request: LLMRequest): AsyncGenerator<StreamChunk> {
    const response = await this.client.post(
      '/deployments/' + request.model.replace('/', '__') + '/completions',
      {
        prompt: request.messages.map(m => m.content).join('\n'),
        temperature: request.temperature,
        max_tokens: request.max_tokens,
        top_p: request.top_p,
        stream: true
      },
      {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    for await (const chunk of response.data) {
      const text = chunk.toString();
      if (text.startsWith('data: ')) {
        try {
          const data = JSON.parse(text.slice(6));
          if (data.completion || data.output) {
            yield {
              id: data.id || `replicate-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Date.now(),
              model: request.model,
              choices: [{
                index: 0,
                delta: {
                  content: data.completion || data.output
                }
              }]
            };
          }
        } catch {
          continue;
        }
      }
    }
  }

  async listModels(): Promise<string[]> {
    return this.supportedModels;
  }
}
