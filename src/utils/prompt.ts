/**
 * Prompt utilities
 */

export interface PromptHistory {
  id: string;
  prompt: string;
  response: string;
  provider: string;
  model: string;
  timestamp: number;
  tokens: number;
}

export class PromptHistory {
  private history: PromptHistory[] = [];
  private maxSize: number = 1000;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  add(entry: Omit<PromptHistory, 'id' | 'timestamp'>): void {
    const newEntry: PromptHistory = {
      ...entry,
      id: `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    this.history.push(newEntry);

    if (this.history.length > this.maxSize) {
      this.history.shift();
    }
  }

  getAll(): PromptHistory[] {
    return [...this.history].reverse();
  }

  getByProvider(provider: string): PromptHistory[] {
    return this.history.filter(e => e.provider === provider);
  }

  getByModel(model: string): PromptHistory[] {
    return this.history.filter(e => e.model === model);
  }

  search(query: string): PromptHistory[] {
    const q = query.toLowerCase();
    return this.history.filter(e =>
      e.prompt.toLowerCase().includes(q) ||
      e.response.toLowerCase().includes(q)
    );
  }

  clear(): void {
    this.history = [];
  }

  getStats(): { total: number; byProvider: Record<string, number> } {
    const byProvider: Record<string, number> = {};
    for (const entry of this.history) {
      byProvider[entry.provider] = (byProvider[entry.provider] || 0) + 1;
    }
    return { total: this.history.length, byProvider };
  }
}

export const promptHistory = new PromptHistory();
