/**
 * Environment utilities
 */

export function getEnv(key: string, default?: string): string | undefined {
  return process.env[key] || default;
}

export function setEnv(key: string, value: string): void {
  process.env[key] = value;
}

export function hasEnv(key: string): boolean {
  return key in process.env;
}

export function getAllEnv(): Record<string, string> {
  return { ...process.env };
}
