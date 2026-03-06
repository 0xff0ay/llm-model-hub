/**
 * TUI screen manager
 */

import blessed from 'blessed';

export class ScreenManager {
  private screens: Map<string, blessed.Widgets.Screen> = new Map();
  private current: string = 'main';

  create(name: string, options: any = {}): blessed.Widgets.Screen {
    const screen = blessed.screen({
      smartCSR: true,
      title: options.title || 'LLM-Model Hub',
      ...options
    });
    this.screens.set(name, screen);
    return screen;
  }

  switch(name: string): boolean {
    if (this.screens.has(name)) {
      this.current = name;
      return true;
    }
    return false;
  }

  get(name?: string): blessed.Widgets.Screen | undefined {
    return this.screens.get(name || this.current);
  }

  destroy(name?: string): void {
    if (name) {
      this.screens.get(name)?.destroy();
      this.screens.delete(name);
    } else {
      for (const screen of this.screens.values()) {
        screen.destroy();
      }
      this.screens.clear();
    }
  }
}

export const screenManager = new ScreenManager();
