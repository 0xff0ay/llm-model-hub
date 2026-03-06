/**
 * Message utilities
 */

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export function createMessage(role: Message['role'], content: string): Message {
  return { role, content };
}

export function createSystemMessage(content: string): Message {
  return { role: 'system', content };
}

export function createUserMessage(content: string): Message {
  return { role: 'user', content };
}

export function createAssistantMessage(content: string): Message {
  return { role: 'assistant', content };
}

export function formatMessages(messages: Message[]): string {
  return messages.map(m => `[${m.role}]: ${m.content}`).join('\n');
}
