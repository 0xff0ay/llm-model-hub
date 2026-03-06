/**
 * Provider API endpoint
 */

import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    providers: [
      { id: 'openai', name: 'OpenAI', status: 'active' },
      { id: 'anthropic', name: 'Anthropic', status: 'active' },
      { id: 'google', name: 'Google', status: 'active' },
      { id: 'azure', name: 'Azure OpenAI', status: 'inactive' },
      { id: 'aws', name: 'AWS Bedrock', status: 'inactive' },
      { id: 'cohere', name: 'Cohere', status: 'active' },
      { id: 'huggingface', name: 'HuggingFace', status: 'active' },
      { id: 'ollama', name: 'Ollama', status: 'active' },
      { id: 'mistral', name: 'Mistral', status: 'active' },
      { id: 'replicate', name: 'Replicate', status: 'active' },
    ]
  });
});

export default router;
