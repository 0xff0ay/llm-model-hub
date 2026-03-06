import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class AWSBedrockProvider extends BaseProvider {
  public name = 'AWS Bedrock';
  public supportedModels = [
    'anthropic.claude-3-sonnet-20240229-v1:0',
    'anthropic.claude-3-haiku-20240307-v1:0',
    'anthropic.claude-3-opus-20240229-v1:0',
    'anthropic.claude-v2:1',
    'anthropic.claude-v2',
    'amazon.titan-text-express-v1',
    'amazon.titan-text-lite-v1',
    'meta.llama2-13b-chat-v1',
    'meta.llama2-70b-chat-v1',
    'mistral.mistral-large-2402-v1:0',
    'mistral.mistral-small-2402-v1:0'
  ];
  public defaultModel = 'anthropic.claude-3-sonnet-20240229-v1:0';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'https://bedrock.us-east-1.amazonaws.com',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const modelId = request.model;
      const isClaude = modelId.includes('anthropic');

      let body: any = {};
      if (isClaude) {
        const systemMessage = request.messages.find(m => m.role === 'system');
        const filteredMessages = request.messages.filter(m => m.role !== 'system');

        body = {
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: request.max_tokens || 1024,
          messages: filteredMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        };
        if (systemMessage) body.system = [{ text: systemMessage.content }];
      } else {
        body = {
          inputText: request.messages.map(m => m.content).join('\n'),
          textGenerationConfig: {
            temperature: request.temperature,
            maxTokenCount: request.max_tokens,
            topP: request.top_p
          }
        };
      }

      const response = await this.client.post(
        `/model/${modelId}/invoke`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      const data = JSON.parse(response.data.body);

      return {
        id: `bedrock-${Date.now()}`,
        object: 'chat.completion',
        created: Date.now(),
        model: request.model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: isClaude ? data.content[0].text : data.results[0].outputText
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
    const modelId = request.model;

    const body: any = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: request.max_tokens || 1024,
      messages: request.messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    };

    const response = await this.client.post(
      `/model/${modelId}/invoke-with-response-stream`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        responseType: 'stream'
      }
    );

    for await (const chunk of response.data) {
      const data = JSON.parse(chunk.body.toString());
      if (data.type === 'content_block_delta' && data.delta.type === 'text_delta') {
        yield {
          id: `bedrock-${Date.now()}`,
          object: 'chat.completion.chunk',
          created: Date.now(),
          model: request.model,
          choices: [{
            index: 0,
            delta: {
              content: data.delta.text
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
