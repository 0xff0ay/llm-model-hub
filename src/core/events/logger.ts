/**
 * Event types
 */

export interface Event {
  type: string;
  timestamp: number;
  data: any;
}

export class EventLogger {
  private events: Event[] = [];

  log(type: string, data: any): void {
    this.events.push({
      type,
      timestamp: Date.now(),
      data
    });
  }

  getAll(): Event[] {
    return [...this.events];
  }

  getByType(type: string): Event[] {
    return this.events.filter(e => e.type === type);
  }

  clear(): void {
    this.events = [];
  }
}

export const eventLogger = new EventLogger();
