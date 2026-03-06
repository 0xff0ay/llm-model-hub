/**
 * Table widget
 */

import blessed from 'blessed';

export interface TableOptions {
  headers: string[];
  rows: string[][];
  width?: string;
  height?: string;
}

export class Table {
  private table: blessed.Widgets.TableElement | null = null;

  create(parent: any, options: TableOptions): void {
    this.table = blessed.table({
      style: {
        header: { fg: '#7aa2f7', bold: true },
        cell: { fg: '#c0caf5' }
      },
      headers: options.headers,
      rows: options.rows,
      width: options.width || '100%',
      height: options.height || '100%'
    });
    parent.append(this.table);
  }

  setRows(rows: string[][]): void {
    this.table?.setData(rows);
  }

  destroy(): void {
    this.table?.destroy();
  }
}
