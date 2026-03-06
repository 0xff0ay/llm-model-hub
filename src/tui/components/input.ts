import blessed, { Widgets } from 'blessed';
import { TUIComponent, createBoxStyle } from './base';

export class InputPanel extends TUIComponent {
  private inputBox: blessed.Widgets.TextareaElement | null = null;
  private onSubmitCallback: ((value: string) => void) | null = null;
  private placeholder: string = 'Type your message...';

  constructor(placeholder?: string) {
    super();
    if (placeholder) this.placeholder = placeholder;
  }

  render(parent: Widgets.ParentWidget, options: Partial<Widgets.BoxOptions> = {}): void {
    const style = createBoxStyle(this.theme);

    this.element = blessed.box({
      ...style,
      ...options,
      height: 10,
      bottom: 0,
      border: {
        type: 'line',
        fg: style.border.fg
      }
    } as any);

    this.inputBox = blessed.textarea({
      style: {
        fg: this.theme.text.primary,
        bg: this.theme.bg,
        focus: {
          border: {
            fg: this.theme.selected
          }
        }
      },
      width: '100%',
      height: '100%',
      padding: {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1
      },
      placeholder: this.placeholder,
      inputOnFocus: true,
      value: ''
    } as any);

    this.inputBox.key('enter', () => {
      const value = this.inputBox!.getValue();
      if (value.trim()) {
        this.emit('submit', value);
        this.inputBox!.setValue('');
      }
    });

    this.inputBox.key('C-c', () => {
      process.exit(0);
    });

    this.element.append(this.inputBox);
    parent.append(this.element);
  }

  onSubmit(callback: (value: string) => void): void {
    this.onSubmitCallback = callback;
    this.on('submit', callback);
  }

  getValue(): string {
    return this.inputBox ? this.inputBox.getValue() : '';
  }

  setValue(value: string): void {
    if (this.inputBox) {
      this.inputBox.setValue(value);
    }
  }

  focus(): void {
    if (this.inputBox) {
      (this.inputBox as any).focus();
    }
  }

  clear(): void {
    if (this.inputBox) {
      this.inputBox.setValue('');
    }
  }
}
