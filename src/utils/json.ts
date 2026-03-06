/**
 * JSON utilities
 */

export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function jsonStringify(obj: any, pretty: boolean = false): string {
  return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
}

export function jsonPath(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}
