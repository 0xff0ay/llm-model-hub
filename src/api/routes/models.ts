/**
 * Model API endpoint
 */

import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
      { id: 'mistral-large', name: 'Mistral Large', provider: 'mistral' },
      { id: 'mistral-small', name: 'Mistral Small', provider: 'mistral' },
    ]
  });
});

export default router;
