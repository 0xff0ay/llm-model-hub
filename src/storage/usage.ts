/**
 * Usage tracking
 */

export interface UsageRecord {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timestamp: number;
}

export class UsageTracker {
  private records: UsageRecord[] = [];

  add(record: UsageRecord): void {
    this.records.push(record);
  }

  getByProvider(provider: string): UsageRecord[] {
    return this.records.filter(r => r.provider === provider);
  }

  getByDateRange(start: number, end: number): UsageRecord[] {
    return this.records.filter(r => r.timestamp >= start && r.timestamp <= end);
  }

  getTotalCost(): number {
    return this.records.reduce((sum, r) => sum + r.cost, 0);
  }

  getTotalTokens(): { input: number; output: number } {
    return this.records.reduce(
      (acc, r) => ({
        input: acc.input + r.inputTokens,
        output: acc.output + r.outputTokens
      }),
      { input: 0, output: 0 }
    );
  }

  clear(): void {
    this.records = [];
  }
}

export const usageTracker = new UsageTracker();
