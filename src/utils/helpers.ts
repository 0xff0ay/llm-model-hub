/**
 * Utility functions for LLM-Model Hub
 */

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return tokens.toString();
}

export function formatPrice(cents: number): string {
  if (cents >= 100) return `$${(cents / 100).toFixed(2)}`;
  return `$${(cents / 100).toFixed(4)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  return fn().catch(err => {
    if (retries <= 0) throw err;
    return sleep(delay).then(() => retry(fn, retries - 1, delay * 2));
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function parseModelString(model: string): { provider: string; name: string } {
  const parts = model.split('/');
  if (parts.length > 1) {
    return { provider: parts[0], name: parts[1] };
  }
  return { provider: 'unknown', name: model };
}
