import blessed, { Widgets } from 'blessed';
import { TUIComponent, createBoxStyle } from './base';

export interface StatusInfo {
  provider: string;
  model: string;
  tokens: number;
  maxTokens: number;
  status: 'ready' | 'loading' | 'error' | 'streaming';
}

export class StatusBar extends TUIComponent {
  private statusBox: blessed.Widgets.BoxElement | null = null;
  private status: StatusInfo = {
    provider: 'None',
    model: 'None',
    tokens: 0,
    maxTokens: 4096,
    status: 'ready'
  };

  constructor() {
    super();
  }

  setStatus(status: Partial<StatusInfo>): void {
    this.status = { ...this.status, ...status };
    this.updateDisplay();
  }

  getStatus(): StatusInfo {
    return { ...this.status };
  }

  render(parent: Widgets.ParentWidget, options: Partial<Widgets.BoxOptions> = {}): void {
    const style = createBoxStyle(this.theme);

    this.statusBox = blessed.box({
      ...style,
      ...options,
      height: 1,
      bottom: 0,
      tags: true,
      style: {
        fg: this.theme.text.secondary,
        bg: this.theme.border
      }
    } as any);

    parent.append(this.statusBox);
    this.updateDisplay();
  }

  private updateDisplay(): void {
    if (!this.statusBox) return;

    const statusIcon = this.status.status === 'ready' ? '●' :
      this.status.status === 'loading' ? '○' :
        this.status.status === 'streaming' ? '◐' : '✕';

    const statusColor = this.status.status === 'ready' ? this.theme.success :
      this.status.status === 'loading' ? this.theme.warning :
        this.status.status === 'streaming' ? this.theme.primary : this.theme.error;

    const content = [
      `{${statusColor}-fg}${statusIcon}{/} ${this.status.status.toUpperCase()}`,
      `| {${this.theme.secondary}-fg}Provider:{/} ${this.status.provider}`,
      `| {${this.theme.secondary}-fg}Model:{/} ${this.status.model}`,
      `| {${this.theme.secondary}-fg}Tokens:{/} ${this.status.tokens}/${this.status.maxTokens}`
    ].join('  ');

    this.statusBox.setContent(content);
  }
}
