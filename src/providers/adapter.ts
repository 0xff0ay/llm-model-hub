/**
 * Provider adapter factory
 */

import { BaseProvider } from '../core/providers';

export interface ProviderAdapter {
  name: string;
  provider: BaseProvider;
}

export function createAdapter(type: string, config: any): ProviderAdapter {
  const { createProvider } = require('../core');
  const provider = createProvider(type, config);
  return { name: type, provider };
}
