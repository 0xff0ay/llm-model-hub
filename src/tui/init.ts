/**
 * TUI initialization
 */

import blessed from 'blessed';

export function createScreen() {
  const screen = blessed.screen({
    smartCSR: true,
    title: 'LLM-Model Hub',
    fullUnicode: true,
    dockBorders: true,
    ignoreDockContrast: true
  });

  return screen;
}

export function createMainBox(parent: any) {
  return blessed.box({
    parent,
    width: '100%',
    height: '100%',
    style: {
      bg: '#1a1b26'
    }
  });
}
