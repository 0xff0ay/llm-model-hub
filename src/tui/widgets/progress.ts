/**
 * Progress display
 */

import blessed from 'blessed';

export class Progress {
  private bar: blessed.Widgets.ProgressBarElement | null = null;

  create(parent: any, options: any = {}): void {
    this.bar = blessed.progressbar({
      style: {
        fg: options.fg || '#7aa2f7',
        bg: options.bg || '#414868'
      },
      fill: options.fill || '=',
      width: options.width || '50%',
      height: 1,
      value: 0,
      ...options
    });
    parent.append(this.bar);
  }

  update(value: number): void {
    if (this.bar) {
      this.bar.setProgress(value * 100);
    }
  }

  destroy(): void {
    this.bar?.destroy();
  }
}
