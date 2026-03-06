/**
 * API key manager
 */

export interface APIKeyStore {
  [provider: string]: string;
}

class APIKeyManager {
  private keys: APIKeyStore = {};

  set(provider: string, key: string): void {
    this.keys[provider] = key;
  }

  get(provider: string): string | undefined {
    return this.keys[provider];
  }

  has(provider: string): boolean {
    return provider in this.keys;
  }

  remove(provider: string): boolean {
    if (provider in this.keys) {
      delete this.keys[provider];
      return true;
    }
    return false;
  }

  list(): string[] {
    return Object.keys(this.keys);
  }

  clear(): void {
    this.keys = {};
  }
}

export const apiKeyManager = new APIKeyManager();
