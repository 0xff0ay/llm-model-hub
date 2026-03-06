/**
 * Conversation manager
 */

import { v4 as uuidv4 } from 'uuid';

export interface Conversation {
  id: string;
  provider: string;
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  createdAt: number;
  updatedAt: number;
  title?: string;
  metadata?: Record<string, any>;
}

export class ConversationManager {
  private conversations: Map<string, Conversation> = new Map();

  create(provider: string, model: string): Conversation {
    const conversation: Conversation = {
      id: uuidv4(),
      provider,
      model,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  get(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  addMessage(id: string, role: 'system' | 'user' | 'assistant', content: string): void {
    const conversation = this.conversations.get(id);
    if (conversation) {
      conversation.messages.push({ role, content });
      conversation.updatedAt = Date.now();
    }
  }

  delete(id: string): boolean {
    return this.conversations.delete(id);
  }

  list(): Conversation[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  clear(): void {
    this.conversations.clear();
  }
}

export const conversationManager = new ConversationManager();
