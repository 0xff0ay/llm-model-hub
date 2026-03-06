import blessed from 'blessed';
import { Sidebar, ListItem } from './components/sidebar';
import { ChatPanel, Message } from './components/chat';
import { InputPanel } from './components/input';
import { StatusBar, StatusInfo } from './components/statusbar';
import { createProvider, ProviderType, ProviderNames } from '../../core';

export interface TUIConfig {
  defaultProvider?: ProviderType;
  defaultModel?: string;
}

export class TUIApplication { 
  private screen: blessed.Widgets.Screen;
  private sidebar: Sidebar;
  private chatPanel: ChatPanel;
  private inputPanel: InputPanel;
  private statusBar: StatusBar;
  private currentProvider: ProviderType = 'openai';
  private currentModel: string = 'gpt-4o';

  constructor(config: TUIConfig = {}) {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'LLM-Model Hub',
      fullUnicode: true
    });

    this.sidebar = new Sidebar('Providers');
    this.chatPanel = new ChatPanel();
    this.inputPanel = new InputPanel('Type your message (Enter to send, Ctrl+C to quit)...');
    this.statusBar = new StatusBar();

    if (config.defaultProvider) {
      this.currentProvider = config.defaultProvider;
    }
    if (config.defaultModel) {
      this.currentModel = config.defaultModel;
    }
  }

  async initialize(): Promise<void> {
    const providers = this.getProviderItems();
    this.sidebar.setItems(providers);
    this.sidebar.onSelect((item) => {
      this.currentProvider = item.id as ProviderType;
      const provider = createProvider(this.currentProvider, { apiKey: process.env[`${this.currentProvider.toUpperCase()}_API_KEY`] });
      this.currentModel = provider.defaultModel;
      this.statusBar.setStatus({
        provider: ProviderNames[this.currentProvider],
        model: this.currentModel
      });
      this.chatPanel.addMessage({
        role: 'system',
        content: `Switched to ${ProviderNames[this.currentProvider]} (${this.currentModel})`
      });
    });

    this.inputPanel.onSubmit(async (value) => {
      await this.handleMessage(value);
    });

    this.statusBar.setStatus({
      provider: ProviderNames[this.currentProvider],
      model: this.currentModel,
      status: 'ready'
    });

    this.screen.key(['C-c', 'escape'], () => {
      process.exit(0);
    });

    this.render();
  }

  private getProviderItems(): ListItem[] {
    const providers: ProviderType[] = [
      'openai', 'anthropic', 'google', 'azure', 'aws',
      'cohere', 'huggingface', 'ollama', 'mistral', 'replicate'
    ];

    return providers.map(p => ({
      id: p,
      label: ProviderNames[p],
      icon: '●'
    }));
  }

  private async handleMessage(message: string): Promise<void> {
    this.chatPanel.addMessage({
      role: 'user',
      content: message,
      model: this.currentModel
    });

    this.statusBar.setStatus({ status: 'loading' });

    try {
      const provider = createProvider(this.currentProvider, {
        apiKey: process.env[`${this.currentProvider.toUpperCase()}_API_KEY`]
      });

      const response = await provider.chat({
        model: this.currentModel,
        messages: [
          ...this.chatPanel.getMessages().map(m => ({
            role: m.role,
            content: m.content
          })),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2048
      });

      const assistantMessage = response.choices[0].message;
      this.chatPanel.addMessage({
        role: 'assistant',
        content: assistantMessage.content,
        model: response.model,
        tokens: response.usage?.total_tokens
      });

      this.statusBar.setStatus({
        status: 'ready',
        tokens: response.usage?.total_tokens || 0
      });
    } catch (error: any) {
      this.chatPanel.addMessage({
        role: 'system',
        content: `Error: ${error.message || 'Unknown error occurred'}`
      });
      this.statusBar.setStatus({ status: 'error' });
    }

    this.chatPanel.scrollToBottom();
  }

  private render(): void {
    const container = blessed.box({
      width: '100%',
      height: '100%',
      style: {
        bg: '#1a1b26'
      }
    });

    this.screen.append(container);

    this.sidebar.render(container, { width: '20%', height: '90%' });
    this.chatPanel.render(container, { width: '80%', left: '20%', height: '75%' });
    this.inputPanel.render(container, { width: '80%', left: '20%', top: '75%', height: '15%' });
    this.statusBar.render(container, { width: '100%', top: '99%' });

    this.sidebar.focus();
    this.screen.render();
  }

  run(): void {
    this.screen.render();
  }

  destroy(): void {
    this.screen.destroy();
  }
}

export async function startTUI(config?: TUIConfig): Promise<void> {
  const app = new TUIApplication(config);
  await app.initialize();
  app.run();
}
