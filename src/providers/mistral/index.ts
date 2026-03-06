import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class MistralProvider extends BaseProvider {
  public name = 'Mistral';
  public supportedModels = [
    'mistral-large-latest',
    'mistral-large-2411',
    'mistral-small-latest',
    'mistral-small-2409',
    'mistral-medium-latest',
    'mistral-tiny-latest',
    'codestral-latest',
    'codestral-2405'
  ];
  public defaultModel = 'mistral-large-latest';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'https://api.mistral.ai/v1',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const response = await this.client.post(
        '/chat/completions',
        {
          model: request.model,
          messages: request.messages,
          temperature: request.temperature,
          max_tokens: request.max_tokens,
          top_p: request.top_p,
          safe_prompt: false,
          random_seed: null
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      return {
        id: data.id,
        object: 'chat.completion',
        created: data.created,
        model: data.model,
        choices: data.choices.map((c: any, i: number) => ({
          index: i,
          message: c.message,
          finish_reason: c.finish_reason
        })),
        usage: data.usage
      };
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
        top_p: request.top_p,
        stream: true
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
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
    return this.supportedModels;
  }
}
