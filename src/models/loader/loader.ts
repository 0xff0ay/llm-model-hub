/**
 * Model loader module
 */

import { createProvider, ProviderType } from '../../core';

export interface ModelLoadOptions {
  provider: ProviderType;
  model: string;
  apiKey?: string;
}

export class ModelLoader {
  private loadedModels: Map<string, any> = new Map();

  async load(options: ModelLoadOptions): Promise<any> {
    const key = `${options.provider}:${options.model}`;

    if (this.loadedModels.has(key)) {
      return this.loadedModels.get(key);
    }

    const provider = createProvider(options.provider, {
      apiKey: options.apiKey
    });

    this.loadedModels.set(key, provider);
    return provider;
  }

  unload(provider: ProviderType, model: string): boolean {
    const key = `${provider}:${model}`;
    return this.loadedModels.delete(key);
  }

  isLoaded(provider: ProviderType, model: string): boolean {
    const key = `${provider}:${model}`;
    return this.loadedModels.has(key);
  }

  getLoaded(): Array<{ provider: ProviderType; model: string }> {
    return Array.from(this.loadedModels.keys()).map(key => {
      const [provider, model] = key.split(':');
      return { provider: provider as ProviderType, model };
    });
  }

  clear(): void {
    this.loadedModels.clear();
  }
}

export const modelLoader = new ModelLoader();
