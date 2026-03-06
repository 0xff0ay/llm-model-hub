/**
 * Key bindings for TUI
 */

export interface KeyBinding {
  key: string;
  description: string;
  handler: () => void;
}

export const defaultKeyBindings: KeyBinding[] = [
  { key: 'C-c', description: 'Exit application', handler: () => process.exit(0) },
  { key: 'escape', description: 'Exit application', handler: () => process.exit(0) },
  { key: 'C-r', description: 'Refresh screen', handler: () => {} },
  { key: 'tab', description: 'Next panel', handler: () => {} },
  { key: 'S-tab', description: 'Previous panel', handler: () => {} },
  { key: 'C-k', description: 'Clear current input', handler: () => {} },
  { key: 'C-l', description: 'Clear chat', handler: () => {} },
  { key: 'C-s', description: 'Save conversation', handler: () => {} },
  { key: 'C-n', description: 'New conversation', handler: () => {} },
  { key: 'C-p', description: 'Previous command', handler: () => {} },
  { key: 'up', description: 'Previous item', handler: () => {} },
  { key: 'down', description: 'Next item', handler: () => {} },
];

export class KeyBindingManager {
  private bindings: Map<string, KeyBinding> = new Map();

  constructor() {
    for (const binding of defaultKeyBindings) {
      this.bindings.set(binding.key, binding);
    }
  }

  register(binding: KeyBinding): void {
    this.bindings.set(binding.key, binding);
  }

  unregister(key: string): boolean {
    return this.bindings.delete(key);
  }

  get(key: string): KeyBinding | undefined {
    return this.bindings.get(key);
  }

  getAll(): KeyBinding[] {
    return Array.from(this.bindings.values());
  }

  handle(key: string): boolean {
    const binding = this.bindings.get(key);
    if (binding) {
      binding.handler();
      return true;
    }
    return false;
  }
}

export const keyBindingManager = new KeyBindingManager();
