/**
 * Unit tests for utils
 */

import { validateApiKey, validateModel, validateTemperature } from '../utils/validation';

describe('Validation Utils', () => {
  test('validateApiKey returns valid for non-empty key', () => {
    const result = validateApiKey('test-key-123');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateApiKey returns invalid for empty key', () => {
    const result = validateApiKey('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('API key is required');
  });

  test('validateModel returns valid for correct format', () => {
    const result = validateModel('gpt-4o');
    expect(result.valid).toBe(true);
  });

  test('validateModel returns invalid for special chars', () => {
    const result = validateModel('gpt@4o!');
    expect(result.valid).toBe(false);
  });

  test('validateTemperature returns valid for 0-2', () => {
    expect(validateTemperature(0.5).valid).toBe(true);
    expect(validateTemperature(1.5).valid).toBe(true);
    expect(validateTemperature(0).valid).toBe(true);
  });

  test('validateTemperature returns invalid for out of range', () => {
    expect(validateTemperature(-0.1).valid).toBe(false);
    expect(validateTemperature(2.1).valid).toBe(false);
  });
});
