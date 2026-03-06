/**
 * Message queue for async operations
 */

export interface QueueItem {
  id: string;
  data: any;
  priority: number;
  timestamp: number;
}

export class MessageQueue {
  private queue: QueueItem[] = [];

  enqueue(id: string, data: any, priority: number = 0): void {
    this.queue.push({ id, data, priority, timestamp: Date.now() });
    this.queue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
  }

  dequeue(): QueueItem | undefined {
    return this.queue.shift();
  }

  peek(): QueueItem | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }

  remove(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index >= 0) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const messageQueue = new MessageQueue();
