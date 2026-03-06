import blessed, { Widgets } from 'blessed';
import { TUIComponent, createBoxStyle } from './base';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  tokens?: number;
}

export class ChatPanel extends TUIComponent {
  private messages: Message[] = [];
  private logBox: blessed.Widgets.Log | null = null;

  constructor() {
    super();
  }

  addMessage(message: Omit<Message, 'id' | 'timestamp'>): void {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    this.messages.push(newMessage);
    this.renderMessages();
    this.emit('message', newMessage);
  }

  clearMessages(): void {
    this.messages = [];
    this.renderMessages();
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  render(parent: Widgets.ParentWidget, options: Partial<Widgets.BoxOptions> = {}): void {
    const style = createBoxStyle(this.theme);

    this.element = blessed.box({
      ...style,
      ...options,
      label: ' {bold}Chat Output{/bold} ',
      border: {
        type: 'bg',
        ch: '─',
        fg: style.border.fg
      },
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        style: {
          bg: style.scrollbar.bg,
          fg: style.scrollbar.fg
        }
      }
    } as any);

    this.logBox = blessed.log({
      style: {
        fg: this.theme.text.primary,
        bg: this.theme.bg
      },
      width: '100%',
      height: '100%',
      scrollable: true
    } as any);

    this.element.append(this.logBox);
    parent.append(this.element);
    this.renderMessages();
  }

  private renderMessages(): void {
    if (!this.logBox) return;

    this.logBox.setContent('');

    for (const msg of this.messages) {
      const roleColor = msg.role === 'user' ? this.theme.primary :
        msg.role === 'assistant' ? this.theme.accent :
          this.theme.secondary;

      const header = `{${roleColor}-fg}{bold}[${msg.role.toUpperCase()}]${/bold}{/}${roleColor}-fg}`;
      const modelInfo = msg.model ? ` {${this.theme.text.muted}-fg}(${msg.model}){/}` : '';

      this.logBox.pushLine(`${header}${modelInfo}`);
      this.logBox.pushLine(msg.content);
      this.logBox.pushLine('');
    }
  }

  scrollToBottom(): void {
    if (this.logBox) {
      this.logBox.setScrollPerc(100);
    }
  }
}
