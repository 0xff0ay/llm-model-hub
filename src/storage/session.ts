/**
 * Session manager
 */

import { v4 as uuidv4 } from 'uuid';

export interface Session {
  id: string;
  provider: string;
  model: string;
  createdAt: number;
  lastActivity: number;
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();

  create(provider: string, model: string): Session {
    const session: Session = {
      id: uuidv4(),
      provider,
      model,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };
    this.sessions.set(session.id, session);
    return session;
  }

  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  update(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.lastActivity = Date.now();
    }
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  list(): Session[] {
    return Array.from(this.sessions.values());
  }

  clear(): void {
    this.sessions.clear();
  }
}

export const sessionManager = new SessionManager();
