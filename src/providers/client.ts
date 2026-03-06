/**
 * Provider client factory
 */

import { createProvider, ProviderType } from '../core';

export interface ClientOptions {
  provider: ProviderType;
  apiKey?: string;
  baseUrl?: string;
}

export function createClient(options: ClientOptions) {
  const provider = createProvider(options.provider, {
    apiKey: options.apiKey,
    baseUrl: options.baseUrl
  });

  return {
    chat: (request: any) => provider.chat(request),
    chatStream: (request: any) => provider.chatStream(request),
    listModels: () => provider.listModels()
  };
}
