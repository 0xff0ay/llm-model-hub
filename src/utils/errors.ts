/**
 * Error handling
 */

export class LLMError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public provider?: string
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

export class APIKeyError extends LLMError {
  constructor(provider: string) {
    super(`API key not configured for ${provider}`, 'API_KEY_MISSING', 401, provider);
    this.name = 'APIKeyError';
  }
}

export class RateLimitError extends LLMError {
  constructor(provider: string, retryAfter?: number) {
    super(`Rate limit exceeded for ${provider}`, 'RATE_LIMIT_EXCEEDED', 429, provider);
    this.name = 'RateLimitError';
  }
}

export class ModelNotFoundError extends LLMError {
  constructor(model: string, provider: string) {
    super(`Model ${model} not found for ${provider}`, 'MODEL_NOT_FOUND', 404, provider);
    this.name = 'ModelNotFoundError';
  }
}

export class ValidationError extends LLMError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export function handleError(error: any): LLMError {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      return new APIKeyError(data.provider || 'unknown');
    } else if (status === 429) {
      return new RateLimitError(data.provider || 'unknown');
    } else if (status === 404) {
      return new ModelNotFoundError(data.model || 'unknown', data.provider || 'unknown');
    }

    return new LLMError(data.error?.message || error.message, 'API_ERROR', status);
  }

  return new LLMError(error.message || 'Unknown error');
}
