export * from './providers';

import { OpenAIProvider } from '../providers/openai';
import { AnthropicProvider } from '../providers/anthropic';
import { GoogleProvider } from '../providers/google';
import { AzureProvider } from '../providers/azure';
import { AWSBedrockProvider } from '../providers/aws';
import { CohereProvider } from '../providers/cohere';
import { HuggingFaceProvider } from '../providers/huggingface';
import { OllamaProvider } from '../providers/ollama';
import { MistralProvider } from '../providers/mistral';
import { ReplicateProvider } from '../providers/replicate';

export type ProviderType =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'azure'
  | 'aws'
  | 'cohere'
  | 'huggingface'
  | 'ollama'
  | 'mistral'
  | 'replicate';

export interface ProviderRegistry {
  [key: string]: any;
}

export const ProviderMap: ProviderRegistry = {
  openai: OpenAIProvider,
  anthropic: AnthropicProvider,
  google: GoogleProvider,
  azure: AzureProvider,
  aws: AWSBedrockProvider,
  cohere: CohereProvider,
  huggingface: HuggingFaceProvider,
  ollama: OllamaProvider,
  mistral: MistralProvider,
  replicate: ReplicateProvider
};

export function createProvider(type: ProviderType, config: any = {}) {
  const ProviderClass = ProviderMap[type];
  if (!ProviderClass) {
    throw new Error(`Unknown provider type: ${type}`);
  }
  return new ProviderClass(config);
}

export const SupportedProviders: string[] = [
  'openai',
  'anthropic',
  'google',
  'azure',
  'aws',
  'cohere',
  'huggingface',
  'ollama',
  'mistral',
  'replicate'
];

export const ProviderNames: Record<ProviderType, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google Gemini',
  azure: 'Azure OpenAI',
  aws: 'AWS Bedrock',
  cohere: 'Cohere',
  huggingface: 'HuggingFace',
  ollama: 'Ollama (Local)',
  mistral: 'Mistral AI',
  replicate: 'Replicate'
};
