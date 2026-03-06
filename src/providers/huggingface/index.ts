import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class HuggingFaceProvider extends BaseProvider {
  public name = 'HuggingFace';
  public supportedModels = [
    'meta-llama/Llama-3.3-70B-Instruct',
    'meta-llama/Llama-3.1-405B-Instruct',
    'meta-llama/Llama-3.1-70B-Instruct',
    'meta-llama/Llama-3.1-8B-Instruct',
    'meta-llama/Meta-Llama-3-70B-Instruct',
    'meta-llama/Meta-Llama-3-8B-Instruct',
    'mistralai/Mistral-Large-Instruct-2411',
    'mistralai/Mistral-Small-Instruct-2409',
    'Qwen/Qwen2.5-72B-Instruct',
    'Qwen/Qwen2.5-32B-Instruct',
    'Qwen/Qwen2.5-14B-Instruct',
    'google/gemma-2-27b-it',
    'google/gemma-2-9b-it',
    'bigcode/starcoder2-15b',
    'microsoft/Phi-3-mini-128k-instruct'
  ];
  public defaultModel = 'meta-llama/Llama-3.1-70B-Instruct';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'https://api-inference.huggingface.co',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const prompt = request.messages.map(m => {
        if (m.role === 'system') return `System: ${m.content}\n`;
        if (m.role === 'user') return `User: ${m.content}\n`;
        return `Assistant: ${m.content}\n`;
      }).join('');

      const response = await this.client.post(
        `/models/${request.model}`,
        {
          inputs: prompt,
          parameters: {
            temperature: request.temperature,
            max_new_tokens: request.max_tokens,
            top_p: request.top_p,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = Array.isArray(response.data)
        ? response.data[0].generated_text
        : response.data.generated_text;

      return {
        id: `hf-${Date.now()}`,
        object: 'chat.completion',
        created: Date.now(),
        model: request.model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: text
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
    const prompt = request.messages.map(m => m.content).join('\n');

    const response = await this.client.post(
      `/models/${request.model}`,
      {
        inputs: prompt,
        parameters: {
          temperature: request.temperature,
          max_new_tokens: request.max_tokens,
          top_p: request.top_p,
          return_full_text: false
        }
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
      const text = chunk.toString();
      if (text) {
        yield {
          id: `hf-${Date.now()}`,
          object: 'chat.completion.chunk',
          created: Date.now(),
          model: request.model,
          choices: [{
            index: 0,
            delta: {
              content: text
            }
          }]
        };
      }
    }
  }

  async listModels(): Promise<string[]> {
    return this.supportedModels;
  }
}
