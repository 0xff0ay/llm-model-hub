/**
 * Test mock data
 */

export const mockProviders = [
  { id: 'openai', name: 'OpenAI', enabled: true },
  { id: 'anthropic', name: 'Anthropic', enabled: true },
  { id: 'google', name: 'Google', enabled: false },
  { id: 'azure', name: 'Azure', enabled: false }
];

export const mockModels = [
  { id: 'gpt-4o', provider: 'openai', contextLength: 128000 },
  { id: 'gpt-3.5-turbo', provider: 'openai', contextLength: 16385 },
  { id: 'claude-3-5-sonnet', provider: 'anthropic', contextLength: 200000 }
];
