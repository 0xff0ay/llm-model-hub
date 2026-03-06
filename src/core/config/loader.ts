/**
 * Configuration loader
 */

import * as fs from 'fs';
import * as path from 'path';

export interface AppConfig {
  'llm-hub': {
    version: string;
    defaultProvider: string;
    defaultModel: string;
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  providers: Record<string, any>;
  ui: {
    theme: string;
    fontSize: number;
    fontFamily: string;
  };
  storage: {
    historyPath: string;
    cachePath: string;
    promptsPath: string;
  };
}

let config: AppConfig | null = null;

export function loadConfig(configPath?: string): AppConfig {
  if (config) return config;

  const defaultPath = path.join(process.cwd(), 'config', 'default.json');
  const filePath = configPath || defaultPath;

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    config = JSON.parse(content);
    return config!;
  }

  throw new Error(`Config file not found: ${filePath}`);
}

export function getConfig(): AppConfig {
  if (!config) {
    return loadConfig();
  }
  return config;
}

export function setConfig(newConfig: AppConfig): void {
  config = newConfig;
}

export function saveConfig(configPath?: string): void {
  const defaultPath = path.join(process.cwd(), 'config', 'default.json');
  const filePath = configPath || defaultPath;

  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}
