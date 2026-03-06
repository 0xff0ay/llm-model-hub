/**
 * Model metrics
 */

export interface ModelMetrics {
  totalRequests: number;
  totalTokens: number;
  avgResponseTime: number;
  successRate: number;
}

export class ModelMetricsCollector {
  private metrics: Map<string, ModelMetrics> = new Map();

  record(provider: string, model: string, tokens: number, responseTime: number, success: boolean): void {
    const key = `${provider}/${model}`;
    let metrics = this.metrics.get(key);

    if (!metrics) {
      metrics = {
        totalRequests: 0,
        totalTokens: 0,
        avgResponseTime: 0,
        successRate: 0
      };
      this.metrics.set(key, metrics);
    }

    metrics.totalRequests++;
    metrics.totalTokens += tokens;
    metrics.avgResponseTime = (metrics.avgResponseTime * (metrics.totalRequests - 1) + responseTime) / metrics.totalRequests;
    metrics.successRate = success ? (metrics.successRate * (metrics.totalRequests - 1) + 1) / metrics.totalRequests : (metrics.successRate * (metrics.totalRequests - 1)) / metrics.totalRequests;
  }

  get(provider: string, model: string): ModelMetrics | undefined {
    return this.metrics.get(`${provider}/${model}`);
  }

  getAll(): Map<string, ModelMetrics> {
    return new Map(this.metrics);
  }
}

export const metricsCollector = new ModelMetricsCollector();
