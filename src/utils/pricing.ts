/**
 * Price calculator
 */

export interface PriceConfig {
  inputPrice: number;
  outputPrice: number;
}

const PRICES: Record<string, PriceConfig> = {
  'gpt-4o': { inputPrice: 5.0, outputPrice: 15.0 },
  'gpt-4-turbo': { inputPrice: 10.0, outputPrice: 30.0 },
  'gpt-3.5-turbo': { inputPrice: 0.5, outputPrice: 1.5 },
  'claude-3-5-sonnet': { inputPrice: 3.0, outputPrice: 15.0 },
  'claude-3-opus': { inputPrice: 15.0, outputPrice: 75.0 },
  'gemini-1.5-pro': { inputPrice: 1.25, outputPrice: 5.0 },
  'gemini-1.5-flash': { inputPrice: 0.075, outputPrice: 0.3 },
};

export function calculatePrice(model: string, inputTokens: number, outputTokens: number): number {
  const price = PRICES[model];
  if (!price) return 0;
  return (inputTokens / 1000000) * price.inputPrice + (outputTokens / 1000000) * price.outputPrice;
}

export function getModelPrice(model: string): PriceConfig | undefined {
  return PRICES[model];
}
