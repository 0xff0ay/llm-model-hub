/**
 * Cache key generator
 */

export function generateCacheKey(...parts: any[]): string {
  return parts.map(p => JSON.stringify(p)).join(':');
}

export function parseCacheKey(key: string): any[] {
  return key.split(':').map(p => JSON.parse(p));
}
