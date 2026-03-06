/**
 * Model validation module
 */

export function validateModelName(model: string): boolean {
  return /^[a-zA-Z0-9\-._:/]+$/.test(model);
}

export function normalizeModelName(model: string): string {
  return model.trim().toLowerCase();
}

export function parseModelString(model: string): { provider: string; name: string } {
  if (model.includes('/')) {
    const parts = model.split('/');
    return { provider: parts[0], name: parts.slice(1).join('/') };
  }
  return { provider: 'unknown', name: model };
}
