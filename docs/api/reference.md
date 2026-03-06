/**
 * Document: API Reference
 */

export const apiReference = `
# API Reference

## Chat

Send a chat message to a model.

\`\`\`typescript
const response = await provider.chat({
  model: 'gpt-4o',
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  max_tokens: 500
});
\`\`\`

## Stream

Stream responses from a model.

\`\`\`typescript
for await (const chunk of provider.chatStream(request)) {
  process.stdout.write(chunk.choices[0].delta.content);
}
\`\`\`

## List Models

Get available models for a provider.

\`\`\`typescript
const models = await provider.listModels();
\`\`\`
`;
