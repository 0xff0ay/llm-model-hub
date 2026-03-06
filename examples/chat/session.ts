/**
 * Example: Session management
 */

import { sessionManager } from '../../src/storage/session';

function main() {
  const session = sessionManager.create('openai', 'gpt-4o');
  console.log('Created session:', session.id);

  sessionManager.update(session.id);
  console.log('Updated session');

  const retrieved = sessionManager.get(session.id);
  console.log('Retrieved session:', retrieved?.provider);

  console.log('All sessions:', sessionManager.list().length);
}

main();
