import { BaseProvider, LLMRequest, LLMResponse, StreamChunk, ProviderConfig } from './providers';

export class GoogleProvider extends BaseProvider {
  public name = 'Google';
  public supportedModels = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-1.5-pro-002',
    'gemini-1.5-flash',
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-8b',
    'gemini-1.0-pro',
    'gemini-pro-vision'
  ];
  public defaultModel = 'gemini-1.5-pro';

  constructor(config: ProviderConfig = {}) {
    super({
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      ...config
    });
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const contents = request.messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await this.client.post(
        `/models/${request.model}:generateContent`,
        {
          contents,
          generationConfig: {
            temperature: request.temperature,
            maxOutputTokens: request.max_tokens,
            topP: request.top_p,
            stopSequences: request.stop
          }
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
        id: `gemini-${Date.now()}`,
        object: 'chat.completion',
        created: Date.now(),
        model: request.model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: data.candidates[0].content.parts[0].text
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
          completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: (data.usageMetadata?.promptTokenCount || 0) + (data.usageMetadata?.candidatesTokenCount || 0)
        }
      };
    });
  }

  async *chatStream(request: LLMRequest): AsyncGenerator<StreamChunk> {
    const response = await this.client.post(
      `/models/${request.model}:streamGenerateContent`,
      {
        contents: request.messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: request.temperature,
          maxOutputTokens: request.max_tokens,
          topP: request.top_p
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
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            yield {
              id: `gemini-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Date.now(),
              model: request.model,
              choices: [{
                index: 0,
                delta: {
                  content: data.candidates[0].content.parts[0].text
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
