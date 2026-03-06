import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class OllamaProvider extends BaseProvider {
  public name = 'Ollama';
  public supportedModels = [
    'llama3.3',
    'llama3.2',
    'llama3.1',
    'llama3',
    'mistral',
    'mixtral',
    'phi4',
    'qwen2.5',
    'gemma2',
    'command-r',
    'llava',
    'codellama'
  ];
  public defaultModel = 'llama3.1';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'http://localhost:11434',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const response = await this.client.post(
        '/api/chat',
        {
          model: request.model,
          messages: request.messages,
          temperature: request.temperature,
          options: {
            num_predict: request.max_tokens,
            top_p: request.top_p
          },
          stream: false
        }
      );

      const data = response.data;
      return {
        id: data.message.id || `ollama-${Date.now()}`,
        object: 'chat.completion',
        created: Date.now(),
        model: data.model,
        choices: [{
          index: 0,
          message: {
            role: data.message.role,
            content: data.message.content
          },
          finish_reason: data.done ? 'stop' : 'length'
        }],
        usage: {
          prompt_tokens: data.prompt_eval_count || 0,
          completion_tokens: data.eval_count || 0,
          total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
        }
      };
    });
  }

  async *chatStream(request: LLMRequest): AsyncGenerator<StreamChunk> {
    const response = await this.client.post(
      '/api/chat',
      {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        options: {
          num_predict: request.max_tokens,
          top_p: request.top_p
        },
        stream: true
      },
      {
        responseType: 'stream'
      }
    );

    for await (const chunk of response.data) {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            yield {
              id: data.message.id || `ollama-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Date.now(),
              model: data.model,
              choices: [{
                index: 0,
                delta: {
                  content: data.message.content
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
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models.map((m: any) => m.name);
    } catch {
      return this.supportedModels;
    }
  }
}
