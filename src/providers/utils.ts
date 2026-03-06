/**
 * Provider utilities
 */

export function getProviderFromEnv(provider: string): string | undefined {
  const envMap: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_API_KEY',
    azure: 'AZURE_OPENAI_KEY',
    cohere: 'COHERE_API_KEY',
    huggingface: 'HUGGINGFACE_HUB_TOKEN',
    mistral: 'MISTRAL_API_KEY',
    replicate: 'REPLICATE_API_KEY'
  };
  return process.env[envMap[provider]];
}

export function isProviderEnabled(provider: string): boolean {
  return !!getProviderFromEnv(provider);
}
