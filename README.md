# 🧠 llm-model-hub

> **Unified LLM Management Platform** — Claude Code Style TUI

```
╔═══════════════════════════════════════════════════════════════╗
║                     LLM MODEL HUB v1.0.0                      ║
║          One Interface to Rule All Language Models            ║
╚═══════════════════════════════════════════════════════════════╝
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Multi-Provider** | Unified API for 10+ LLM providers |
| 🖥️ **TUI Interface** | Terminal User Interface (Claude Code style) |
| ⚡ **Hot-Swap** | Switch providers without code changes |
| 🔐 **Secure** | Env-based credential management |
| 📦 **Lightweight** | TypeScript + minimal dependencies |

## �_supported Providers

```
┌─────────────────────────────────────────────────────────────────┐
│  [01] 🤖 OpenAI        │  [06] 🟣 HuggingFace                   │
│  [02] 🦉 Anthropic     │  [07] 🏠 Ollama (Local)               │
│  [03] 🔵 Google Gemini │  [08] 🌫️ Mistral AI                   │
│  [04] 🟢 Azure OpenAI  │  [09] 🌀 Replicate                    │
│  [05] ☁️ AWS Bedrock   │  [10] 📚 Cohere                       │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

```bash
# Clone & Install
git clone https://github.com/0xff0ay/llm-model-hub.git
cd llm-model-hub
npm install

# Run TUI
npm run dev

# Build
npm run build
npm start
```

## ⚙️ Configuration

Create `.env` file:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google
GOOGLE_API_KEY=...

# Azure
AZURE_OPENAI_ENDPOINT=https://...
AZURE_OPENAI_KEY=...

# AWS Bedrock
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# Cohere
COHERE_API_KEY=...

# HuggingFace
HUGGINGFACE_API_KEY=...

# Ollama (Local)
OLLAMA_BASE_URL=http://localhost:11434

# Mistral
MISTRAL_API_KEY=...

# Replicate
REPLICATE_API_KEY=...
```

## 📖 Usage

```typescript
import { createProvider, ProviderType } from 'llm-model-hub';

const llm = createProvider('openai', { model: 'gpt-4' });
const response = await llm.complete('Hello world!');
```

## 🎯 Architecture

```
llm-model-hub/
├── src/
│   ├── core/          # Core interfaces & registry
│   ├── providers/    # Provider implementations
│   │   ├── openai/
│   │   ├── anthropic/
│   │   ├── google/
│   │   ├── azure/
│   │   ├── aws/
│   │   ├── cohere/
│   │   ├── huggingface/
│   │   ├── ollama/
│   │   ├── mistral/
│   │   └── replicate/
│   └── cli/          # TUI interface
├── dist/             # Compiled output
└── package.json
```

## 📊 Stats

```
┌────────────────────────────────────────────────────────────────┐
│  Providers  │     10     │  ⭐ Stars  │    Coming Soon       │
│  CLI Tools  │     5+     │  🍴 Forks  │    Coming Soon       │
│  Language   │   TypeScript  │  License  │       MIT          │
└────────────────────────────────────────────────────────────────┘
```

## 🤝 Contributing

Pull requests welcome! Let's build the ultimate LLM hub together.

## 📝 License

MIT © 2024 LLM-Model Hub Team

---

```
[░▒▓█] System ready. Type 'npm run dev' to launch.
```
