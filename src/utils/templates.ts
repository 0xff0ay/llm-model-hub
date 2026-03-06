/**
 * Prompt template system
 */

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  description?: string;
  category?: string;
}

export const builtInTemplates: PromptTemplate[] = [
  {
    id: 'summarizer',
    name: 'Text Summarizer',
    content: 'Summarize the following text in {{length}} words:\n\n{{text}}',
    variables: ['length', 'text'],
    description: 'Summarize any text',
    category: 'writing'
  },
  {
    id: 'explainer',
    name: 'Concept Explainer',
    content: 'Explain {{concept}} in simple terms, as if teaching a beginner. Include examples.',
    variables: ['concept'],
    description: 'Explain concepts simply',
    category: 'education'
  },
  {
    id: 'coder',
    name: 'Code Generator',
    content: 'Write {{language}} code to {{task}}. Include comments and error handling.',
    variables: ['language', 'task'],
    description: 'Generate code',
    category: 'programming'
  },
  {
    id: 'reviewer',
    name: 'Code Reviewer',
    content: 'Review the following code for bugs, performance issues, and best practices:\n\n```\n{{code}}\n```',
    variables: ['code'],
    description: 'Review code',
    category: 'programming'
  },
  {
    id: 'translator',
    name: 'Language Translator',
    content: 'Translate the following from {{source_lang}} to {{target_lang}}:\n\n{{text}}',
    variables: ['source_lang', 'target_lang', 'text'],
    description: 'Translate text',
    category: 'writing'
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm Ideas',
    content: 'Generate {{count}} creative ideas for {{topic}}. For each idea, provide a brief description.',
    variables: ['count', 'topic'],
    description: 'Brainstorm ideas',
    category: 'creative'
  }
];

export function applyTemplate(template: PromptTemplate, variables: Record<string, string>): string {
  let content = template.content;
  for (const [key, value] of Object.entries(variables)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return content;
}

export function validateVariables(template: PromptTemplate, provided: Record<string, string>): string[] {
  const missing: string[] = [];
  for (const variable of template.variables) {
    if (!(variable in provided)) {
      missing.push(variable);
    }
  }
  return missing;
}
