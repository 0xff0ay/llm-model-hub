/**
 * TUI Widgets - Additional UI components
 */

import blessed from 'blessed';

export class ProgressBar {
  private element: blessed.Widgets.ProgressBarElement | null = null;

  render(parent: any, options: any = {}): void {
    this.element = blessed.progressbar({
      style: {
        fg: options.fg || '#7aa2f7',
        bg: options.bg || '#414868'
      },
      fill: options.fill || '=',
      width: options.width || '50%',
      height: 1,
      value: options.value || 0,
      ...options
    });

    parent.append(this.element);
  }

  setValue(value: number): void {
    if (this.element) {
      this.element.setProgress(value);
    }
  }

  destroy(): void {
    if (this.element) {
      this.element.destroy();
    }
  }
}

export class Table {
  private element: blessed.Widgets.TableElement | null = null;

  render(parent: any, options: any = {}): void {
    this.element = blessed.table({
      style: {
        header: {
          fg: options.headerFg || '#7aa2f7',
          bold: true
        },
        cell: {
          fg: options.cellFg || '#c0caf5'
        }
      },
      rows: options.rows || [],
      ...options
    });

    parent.append(this.element);
  }

  setRows(rows: string[][]): void {
    if (this.element) {
      this.element.setData(rows);
    }
  }

  destroy(): void {
    if (this.element) {
      this.element.destroy();
    }
  }
}

export class Modal {
  private element: blessed.Widgets.BoxElement | null = null;

  render(parent: any, options: any = {}): void {
    const width = options.width || '50%';
    const height = options.height || '50%';

    this.element = blessed.box({
      top: 'center',
      left: 'center',
      width,
      height,
      border: {
        type: 'line',
        fg: options.borderFg || '#7aa2f7'
      },
      style: {
        bg: '#1a1b26',
        fg: '#c0caf5'
      },
      label: options.label || ' Modal ',
      ...options
    });

    parent.append(this.element);
  }

  show(): void {
    if (this.element) {
      this.element.show();
    }
  }

  hide(): void {
    if (this.element) {
      this.element.hide();
    }
  }

  destroy(): void {
    if (this.element) {
      this.element.destroy();
    }
  }
}
