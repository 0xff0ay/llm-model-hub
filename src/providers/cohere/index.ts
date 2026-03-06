import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class CohereProvider extends BaseProvider {
  public name = 'Cohere';
  public supportedModels = [
    'command-r-plus',
    'command-r',
    'command',
    'command-light',
    'command-nightly',
    'c4ai-aya-expanse-8b',
    'c4ai-aya-expanse-32b'
  ];
  public defaultModel = 'command-r-plus';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'https://api.cohere.ai/v1',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const response = await this.client.post(
        '/generate',
        {
          model: request.model,
          prompt: request.messages.map(m => m.content).join('\n'),
          temperature: request.temperature,
          max_tokens: request.max_tokens,
          top_p: request.top_p,
          stop_sequences: request.stop
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
        id: `cohere-${Date.now()}`,
        object: 'chat.completion',
        created: Date.now(),
        model: request.model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: data.generations[0].text
          },
          finish_reason: data.generations[0].finish_reason
        }],
        usage: {
          prompt_tokens: data.meta?.billed_tokens?.input || 0,
          completion_tokens: data.meta?.billed_tokens?.output || 0,
          total_tokens: (data.meta?.billed_tokens?.input || 0) + (data.meta?.billed_tokens?.output || 0)
        }
      };
    });
  }

  async *chatStream(request: LLMRequest): AsyncGenerator<StreamChunk> {
    const response = await this.client.post(
      '/generate',
      {
        model: request.model,
        prompt: request.messages.map(m => m.content).join('\n'),
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
        try {
          const data = JSON.parse(line);
          if (data.text) {
            yield {
              id: `cohere-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Date.now(),
              model: request.model,
              choices: [{
                index: 0,
                delta: {
                  content: data.text
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
