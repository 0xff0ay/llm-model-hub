import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class OpenAIProvider extends BaseProvider {
  public name = 'OpenAI';
  public supportedModels = [
    'gpt-4o',
    'gpt-4o-2024-05-13',
    'gpt-4-turbo',
    'gpt-4-turbo-2024-04-09',
    'gpt-4',
    'gpt-4-0613',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-0613',
    'gpt-3.5-turbo-1106',
    'gpt-3.5-turbo-0125'
  ];
  public defaultModel = 'gpt-4o';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'https://api.openai.com/v1',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const response = await this.client.post<LLMResponse>(
        '/chat/completions',
        {
          model: request.model,
          messages: request.messages,
          temperature: request.temperature,
          max_tokens: request.max_tokens,
          top_p: request.top_p,
          frequency_penalty: request.frequency_penalty,
          presence_penalty: request.presence_penalty,
          stop: request.stop
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'OpenAI-Organization': this.config.organization
          }
        }
      );
      return response.data;
    });
  }

  async *chatStream(request: LLMRequest): AsyncGenerator<StreamChunk> {
    const response = await this.client.post(
      '/chat/completions',
      {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.max_tokens,
        stream: true
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        responseType: 'stream'
      }
    );

    for await (const chunk of response.data) {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        const data = line.replace(/^data: /, '');
        if (data === '[DONE]') return;

        try {
          yield JSON.parse(data) as StreamChunk;
        } catch {
          continue;
        }
      }
    }
  }

  async listModels(): Promise<string[]> {
    return this.withRetry(async () => {
      const response = await this.client.get('/models', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });
      return response.data.data.map((m: any) => m.id);
    });
  }
}
