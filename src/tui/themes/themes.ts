/**
 * TUI Theme definitions
 */

import { ThemeColors } from '../components/base';

export const themes: Record<string, ThemeColors> = {
  'tokyo-night': {
    bg: '#1a1b26',
    fg: '#c0caf5',
    border: '#414868',
    selected: '#7aa2f7',
    primary: '#7aa2f7',
    secondary: '#bb9af7',
    accent: '#9ece6a',
    error: '#f7768e',
    warning: '#e0af68',
    success: '#9ece6a',
    text: {
      primary: '#c0caf5',
      secondary: '#a9b1d6',
      muted: '#565f89'
    }
  },
  'dracula': {
    bg: '#282a36',
    fg: '#f8f8f2',
    border: '#44475a',
    selected: '#bd93f9',
    primary: '#bd93f9',
    secondary: '#ff79c6',
    accent: '#50fa7b',
    error: '#ff5555',
    warning: '#f1fa8c',
    success: '#50fa7b',
    text: {
      primary: '#f8f8f2',
      secondary: '#bfc7d5',
      muted: '#6272a4'
    }
  },
  'nord': {
    bg: '#2e3440',
    fg: '#eceff4',
    border: '#4c566a',
    selected: '#88c0d0',
    primary: '#88c0d0',
    secondary: '#b48ead',
    accent: '#a3be8c',
    error: '#bf616a',
    warning: '#ebcb8b',
    success: '#a3be8c',
    text: {
      primary: '#eceff4',
      secondary: '#d8dee9',
      muted: '#4c566a'
    }
  },
  'monokai': {
    bg: '#272822',
    fg: '#f8f8f2',
    border: '#49483e',
    selected: '#ae81ff',
    primary: '#ae81ff',
    secondary: '#f92672',
    accent: '#a6e22e',
    error: '#f92672',
    warning: '#f4bf75',
    success: '#a6e22e',
    text: {
      primary: '#f8f8f2',
      secondary: '#cfcfc2',
      muted: '#49483e'
    }
  }
};

export function getTheme(name: string): ThemeColors {
  return themes[name] || themes['tokyo-night'];
}
