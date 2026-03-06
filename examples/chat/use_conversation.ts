/**
 * Example: Conversation manager
 */

import { conversationManager } from '../../src/storage/conversation';

function main() {
  const conv = conversationManager.create('openai', 'gpt-4o');
  console.log('Created conversation:', conv.id);

  conversationManager.addMessage(conv.id, 'user', 'Hello!');
  conversationManager.addMessage(conv.id, 'assistant', 'Hi there!');

  console.log('Conversation messages:', conv.messages.length);
  console.log('All conversations:', conversationManager.list().length);
}

main();
