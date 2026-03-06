/**
 * Events system for LLM-Model Hub
 */

import { EventEmitter } from 'events';

export interface ChatEvent {
  provider: string;
  model: string;
  messages: any[];
  response?: string;
  tokens?: number;
  duration?: number;
  error?: string;
}

export interface ModelEvent {
  model: string;
  provider: string;
  action: 'load' | 'unload' | 'error';
}

export class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emitChatEvent(event: ChatEvent): void {
    this.emit('chat', event);
  }

  emitModelEvent(event: ModelEvent): void {
    this.emit('model', event);
  }

  onChat(callback: (event: ChatEvent) => void): void {
    this.on('chat', callback);
  }

  onModel(callback: (event: ModelEvent) => void): void {
    this.on('model', callback);
  }
}

export const eventBus = EventBus.getInstance();
