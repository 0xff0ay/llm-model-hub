/**
 * TUI Screen - Main screen management
 */

import blessed from 'blessed';
import { TokyoNightTheme, ThemeColors } from '../components/base';
import { Sidebar } from '../components/sidebar';
import { ChatPanel } from '../components/chat';
import { InputPanel } from '../components/input';
import { StatusBar } from '../components/statusbar';

export class TUIScreen {
  private screen: blessed.Widgets.Screen;
  private theme: ThemeColors;
  private sidebar: Sidebar;
  private chatPanel: ChatPanel;
  private inputPanel: InputPanel;
  private statusBar: StatusBar;

  constructor() {
    this.theme = TokyoNightTheme;
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'LLM-Model Hub',
      fullUnicode: true
    });

    this.sidebar = new Sidebar('Providers');
    this.chatPanel = new ChatPanel();
    this.inputPanel = new InputPanel();
    this.statusBar = new StatusBar();

    this.setupKeyBindings();
  }

  private setupKeyBindings(): void {
    this.screen.key(['C-c', 'escape'], () => {
      process.exit(0);
    });

    this.screen.key(['C-r'], () => {
      this.screen.render();
    });
  }

  getScreen(): blessed.Widgets.Screen {
    return this.screen;
  }

  getTheme(): ThemeColors {
    return this.theme;
  }

  setTheme(theme: ThemeColors): void {
    this.theme = theme;
  }

  getSidebar(): Sidebar {
    return this.sidebar;
  }

  getChatPanel(): ChatPanel {
    return this.chatPanel;
  }

  getInputPanel(): InputPanel {
    return this.inputPanel;
  }

  getStatusBar(): StatusBar {
    return this.statusBar;
  }

  render(): void {
    this.screen.render();
  }

  destroy(): void {
    this.screen.destroy();
  }
}
