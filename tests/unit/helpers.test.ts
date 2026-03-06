/**
 * Unit tests for helpers
 */

import { truncate, formatTokens, formatPrice, generateId } from '../src/utils/helpers';

describe('Helper Utils', () => {
  test('truncate short strings', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  test('truncate long strings', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  test('formatTokens', () => {
    expect(formatTokens(500)).toBe('500');
    expect(formatTokens(1500)).toBe('1.5K');
    expect(formatTokens(1500000)).toBe('1.5M');
  });

  test('formatPrice', () => {
    expect(formatPrice(100)).toBe('$1.00');
    expect(formatPrice(50)).toBe('$0.50');
  });

  test('generateId', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(10);
  });
});
