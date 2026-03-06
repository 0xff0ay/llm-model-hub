/**
 * Stream utilities
 */

export interface StreamOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (full: string) => void;
  onError?: (error: Error) => void;
}

export class StreamHandler {
  private buffer: string = '';

  constructor(private options: StreamOptions) {}

  handleChunk(chunk: string): void {
    this.buffer += chunk;
    this.options.onChunk?.(chunk);
  }

  complete(): void {
    this.options.onComplete?.(this.buffer);
  }

  error(error: Error): void {
    this.options.onError?.(error);
  }

  getBuffer(): string {
    return this.buffer;
  }

  clear(): void {
    this.buffer = '';
  }
}
