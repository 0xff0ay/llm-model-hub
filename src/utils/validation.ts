/**
 * Validation utilities
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateApiKey(key: string): ValidationResult {
  const errors: string[] = [];

  if (!key) {
    errors.push('API key is required');
  } else if (key.length < 10) {
    errors.push('API key seems too short');
  }

  return { valid: errors.length === 0, errors };
}

export function validateModel(model: string): ValidationResult {
  const errors: string[] = [];

  if (!model) {
    errors.push('Model name is required');
  } else if (!/^[a-zA-Z0-9\-._]+$/.test(model)) {
    errors.push('Model name contains invalid characters');
  }

  return { valid: errors.length === 0, errors };
}

export function validateTemperature(temp: number): ValidationResult {
  const errors: string[] = [];

  if (typeof temp !== 'number') {
    errors.push('Temperature must be a number');
  } else if (temp < 0 || temp > 2) {
    errors.push('Temperature must be between 0 and 2');
  }

  return { valid: errors.length === 0, errors };
}

export function validateMaxTokens(tokens: number): ValidationResult {
  const errors: string[] = [];

  if (typeof tokens !== 'number') {
    errors.push('Max tokens must be a number');
  } else if (tokens < 1 || tokens > 100000) {
    errors.push('Max tokens must be between 1 and 100000');
  }

  return { valid: errors.length === 0, errors };
}
