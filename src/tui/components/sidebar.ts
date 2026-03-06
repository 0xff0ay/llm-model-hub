import blessed, { Widgets } from 'blessed';
import { TUIComponent, createBoxStyle, ThemeColors } from './base';

export interface ListItem {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export class Sidebar extends TUIComponent {
  private items: ListItem[] = [];
  private selectedIndex: number = 0;
  private listBox: blessed.Widgets.ListbarElement | null = null;
  private title: string = 'Providers';

  constructor(title: string = 'Providers') {
    super();
    this.title = title;
  }

  setItems(items: ListItem[]): void {
    this.items = items;
    this.updateList();
  }

  setTitle(title: string): void {
    this.title = title;
    if (this.element) {
      this.element.setContent(`{bold}${title}{/bold}`);
    }
  }

  getSelectedItem(): ListItem | null {
    return this.items[this.selectedIndex] || null;
  }

  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  setSelectedIndex(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.selectedIndex = index;
      this.updateList();
    }
  }

  render(parent: Widgets.ParentWidget, options: Partial<Widgets.BoxOptions> = {}): void {
    const style = createBoxStyle(this.theme);

    this.element = blessed.box({
      ...style,
      ...options,
      width: '20%',
      height: '100%',
      left: 0,
      top: 0,
      padding: {
        left: 1,
        right: 1,
        top: 1,
        bottom: 1
      },
      label: ` {bold}${this.title}{/bold} `,
      border: {
        type: 'bg',
        ch: '│',
        fg: style.border.fg
      }
    } as any);

    this.listBox = blessed.listbar({
      style: {
        selected: style.selected,
        item: {
          fg: this.theme.text.primary
        }
      },
      left: 0,
      top: 0,
      width: '100%',
      height: '100%'
    } as any);

    this.updateList();

    this.element.append(this.listBox);
    parent.append(this.element);
  }

  private updateList(): void {
    if (!this.listBox) return;

    this.listBox.setItems(this.items.map((item, index) => ({
      text: item.label,
      callback: () => {
        this.selectedIndex = index;
        this.emit('select', item, index);
      }
    })));
  }

  onSelect(callback: (item: ListItem, index: number) => void): void {
    this.on('select', callback);
  }

  getItems(): ListItem[] {
    return this.items;
  }

  focus(): void {
    if (this.listBox) {
      (this.listBox as any).focus();
    }
  }
}
