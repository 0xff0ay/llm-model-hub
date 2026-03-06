/**
 * Provider test utilities
 */

export function createMockProvider(name: string) {
  return {
    name,
    chat: async () => ({ choices: [{ message: { content: 'Mock response' } }] }),
    chatStream: async function*() { yield { choices: [{ delta: { content: 'Mock' } }] }; },
    listModels: async () => ['mock-model-1', 'mock-model-2']
  };
}
