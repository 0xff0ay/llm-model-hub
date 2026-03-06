import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class AzureProvider extends BaseProvider {
  public name = 'Azure OpenAI';
  public supportedModels = [
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-35-turbo',
    'gpt-35-turbo-16k'
  ];
  public defaultModel = 'gpt-4o';

  private deploymentName: string;

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: process.env.AZURE_OPENAI_ENDPOINT || 'https://{resource}.openai.azure.com',
      ...config
    });
    this.deploymentName = config.deploymentName || 'gpt-4o';
  }

  setDeploymentName(name: string): void {
    this.deploymentName = name;
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    const baseUrl = this.config.baseUrl!.replace('{resource}', process.env.AZURE_RESOURCE_NAME || 'my-resource');

    return this.withRetry(async () => {
      const response = await this.client.post<LLMResponse>(
        `${baseUrl}/openai/deployments/${this.deploymentName}/chat/completions?api-version=2024-02-15-preview`,
        {
          model: request.model,
          messages: request.messages,
          temperature: request.temperature,
          max_tokens: request.max_tokens,
          top_p: request.top_p
        },
        {
          headers: {
            'api-key': this.config.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    });
  }

  async *chatStream(request: LLMRequest): AsyncGenerator<StreamChunk> {
    const baseUrl = this.config.baseUrl!.replace('{resource}', process.env.AZURE_RESOURCE_NAME || 'my-resource');

    const response = await this.client.post(
      `${baseUrl}/openai/deployments/${this.deploymentName}/chat/completions?api-version=2024-02-15-preview`,
      {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.max_tokens,
        stream: true
      },
      {
        headers: {
          'api-key': this.config.apiKey,
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
