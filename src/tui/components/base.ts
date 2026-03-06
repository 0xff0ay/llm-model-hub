import blessed from 'blessed';
import { EventEmitter } from 'events';

export interface ThemeColors {
  bg: string;
  fg: string;
  border: string;
  selected: string;
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
}

export const TokyoNightTheme: ThemeColors = {
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
};

export interface TUIStyle {
  bg: string;
  fg: string;
  border: {
    fg: string;
  };
  focus?: {
    border: {
      fg: string;
    };
  };
  selected: {
    bg: string;
    fg: string;
  };
  scrollbar: {
    bg: string;
    fg: string;
  };
}

export function createBoxStyle(theme: ThemeColors): TUIStyle {
  return {
    bg: theme.bg,
    fg: theme.fg,
    border: {
      fg: theme.border
    },
    focus: {
      border: {
        fg: theme.selected
      }
    },
    selected: {
      bg: theme.selected,
      fg: theme.bg
    },
    scrollbar: {
      bg: theme.border,
      fg: theme.text.muted
    }
  };
}

export class TUIComponent extends EventEmitter {
  protected element: blessed.Widgets.BoxElement | null = null;

  constructor() {
    super();
  }

  getElement(): blessed.Widgets.BoxElement | null {
    return this.element;
  }

  render(): void {
    if (this.element) {
      this.screen?.render();
    }
  }

  destroy(): void {
    if (this.element) {
      this.element.destroy();
    }
  }

  protected screen: blessed.Widgets.Screen | null = null;
  protected theme: ThemeColors = TokyoNightTheme;

  setScreen(screen: blessed.Widgets.Screen): void {
    this.screen = screen;
  }

  setTheme(theme: ThemeColors): void {
    this.theme = theme;
  }
}
