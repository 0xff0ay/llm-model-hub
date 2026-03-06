/**
 * Provider configuration utilities
 */

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  maxRetries?: number;
  timeout?: number;
  deploymentName?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export function validateProviderConfig(config: ProviderConfig, provider: string): boolean {
  if (!config.apiKey && provider !== 'ollama') {
    console.warn(`Warning: No API key configured for ${provider}`);
    return false;
  }
  return true;
}

export function getApiKeyFromEnv(provider: string): string | undefined {
  const envVars: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_API_KEY',
    azure: 'AZURE_OPENAI_KEY',
    aws: 'AWS_ACCESS_KEY_ID',
    cohere: 'COHERE_API_KEY',
    huggingface: 'HUGGINGFACE_HUB_TOKEN',
    mistral: 'MISTRAL_API_KEY',
    replicate: 'REPLICATE_API_KEY'
  };

  return process.env[envVars[provider]];
}
