import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class AnthropicProvider extends BaseProvider {
  public name = 'Anthropic';
  public supportedModels = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-2.1',
    'claude-2.0',
    'claude-1'
  ];
  public defaultModel = 'claude-3-5-sonnet-20241022';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'https://api.anthropic.com/v1',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const systemMessage = request.messages.find(m => m.role === 'system');
      const filteredMessages = request.messages.filter(m => m.role !== 'system');

      const response = await this.client.post(
        '/messages',
        {
          model: request.model,
          messages: filteredMessages,
          system: systemMessage?.content,
          temperature: request.temperature,
          max_tokens: request.max_tokens || 1024,
          top_p: request.top_p,
          stop_sequences: request.stop
        },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      return {
        id: data.id,
        object: 'chat.completion',
        created: Date.now(),
        model: data.model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: data.content[0].text
          },
          finish_reason: data.stop_reason
        }],
        usage: {
          prompt_tokens: data.usage.input_tokens,
          completion_tokens: data.usage.output_tokens,
          total_tokens: data.usage.input_tokens + data.usage.output_tokens
        }
      };
    });
  }

  async *chatStream(request: LLMRequest): AsyncGenerator<StreamChunk> {
    const response = await this.client.post(
      '/messages',
      {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.max_tokens || 1024,
        stream: true
      },
      {
        headers: {
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    for await (const chunk of response.data) {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const data = line.replace(/^data: /, '');
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta') {
            yield {
              id: parsed.id,
              object: 'chat.completion.chunk',
              created: Date.now(),
              model: request.model,
              choices: [{
                index: 0,
                delta: {
                  content: parsed.delta.text
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
