/**
 * Model registry
 */

import { ModelInfo, ModelProvider, ModelType } from '../models/registry/models';

export function getModelById(id: string): ModelInfo | undefined {
  const models = getAllModels();
  return models.find(m => m.id === id);
}

export function getModelsByProvider(provider: ModelProvider): ModelInfo[] {
  const models = getAllModels();
  return models.filter(m => m.provider === provider);
}

export function getAllModels(): ModelInfo[] {
  return [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: ModelProvider.OPENAI,
      type: ModelType.CHAT,
      context_length: 128000,
      max_output_tokens: 16384,
      supports_streaming: true,
      supports_function_calling: true,
      pricing: { input: 5.0, output: 15.0 },
      description: 'Latest GPT-4 model with multimodal capabilities'
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: ModelProvider.OPENAI,
      type: ModelType.CHAT,
      context_length: 128000,
      max_output_tokens: 4096,
      supports_streaming: true,
      supports_function_calling: true,
      pricing: { input: 10.0, output: 30.0 },
      description: 'Fast GPT-4 model'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: ModelProvider.OPENAI,
      type: ModelType.CHAT,
      context_length: 16385,
      max_output_tokens: 4096,
      supports_streaming: true,
      supports_function_calling: true,
      pricing: { input: 0.5, output: 1.5 },
      description: 'Fast and affordable model'
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: ModelProvider.ANTHROPIC,
      type: ModelType.CHAT,
      context_length: 200000,
      max_output_tokens: 8192,
      supports_streaming: true,
      pricing: { input: 3.0, output: 15.0 },
      description: 'Anthropic best model'
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      provider: ModelProvider.GOOGLE,
      type: ModelType.CHAT,
      context_length: 2000000,
      max_output_tokens: 8192,
      supports_streaming: true,
      pricing: { input: 1.25, output: 5.0 },
      description: 'Google multimodal model'
    },
    {
      id: 'mistral-large',
      name: 'Mistral Large',
      provider: ModelProvider.MISTRAL,
      type: ModelType.CHAT,
      context_length: 128000,
      max_output_tokens: 32000,
      supports_streaming: true,
      pricing: { input: 2.0, output: 6.0 },
      description: 'Mistral AI flagship model'
    }
  ];
}
