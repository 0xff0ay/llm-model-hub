/**
 * Color utilities for TUI
 */

export function hexToAnsi(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 16 + Math.round(r / 51) * 36 + Math.round(g / 51) * 6 + Math.round(b / 51);
}

export function rgbToAnsi(r: number, g: number, b: number): number {
  return 16 + Math.round(r / 51) * 36 + Math.round(g / 51) * 6 + Math.round(b / 51);
}

export function ansi256ToRgb(n: number): [number, number, number] {
  if (n < 16) return [(n & 1) * 255, (n & 2) * 127, (n & 4) * 127];
  n -= 16;
  return [
    Math.min(255, Math.round((n / 35) * 255)),
    Math.min(255, Math.round(((n % 35) / 5) * 255)),
    Math.min(255, Math.round((n % 5) * 255))
  ];
}

export const Colors = {
  red: '#f7768e',
  green: '#9ece6a',
  yellow: '#e0af68',
  blue: '#7aa2f7',
  magenta: '#bb9af7',
  cyan: '#7dcfff',
  white: '#c0caf5',
  gray: '#565f89'
};
