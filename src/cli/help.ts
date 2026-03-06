/**
 * CLI help command
 */

export const helpText = `
LLM-Model Hub - Commands

Usage: llm-hub [options]

Options:
  -p, --provider <name>   Set provider (openai, anthropic, etc.)
  -m, --model <name>      Set model name
  --prompt <text>         Send a prompt
  -i, --interactive       Interactive mode
  -l, --list              List providers
  --list-models           List models for provider
  -h, --help             Show help
  -v, --version          Show version

Examples:
  llm-hub --list
  llm-hub -p openai -m gpt-4o --prompt "Hello"
  llm-hub -i
`;
