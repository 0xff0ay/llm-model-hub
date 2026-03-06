/**
 * TUI input listener
 */

export interface KeyHandler {
  key: string;
  callback: () => void;
}

export class InputListener {
  private handlers: KeyHandler[] = [];

  on(key: string, callback: () => void): void {
    this.handlers.push({ key, callback });
  }

  handle(key: string): void {
    const handler = this.handlers.find(h => h.key === key);
    if (handler) {
      handler.callback();
    }
  }

  remove(key: string): void {
    this.handlers = this.handlers.filter(h => h.key !== key);
  }
}
