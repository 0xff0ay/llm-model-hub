"""
Model Registry - Central model management
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from enum import Enum
import json
from pathlib import Path


class ModelProvider(Enum):
    """Model provider types"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    AZURE = "azure"
    AWS = "aws"
    COHERE = "cohere"
    HUGGINGFACE = "huggingface"
    OLLAMA = "ollama"
    MISTRAL = "mistral"
    REPLICATE = "replicate"


class ModelType(Enum):
    """Model type classifications"""
    CHAT = "chat"
    COMPLETION = "completion"
    EMBEDDING = "embedding"
    IMAGE = "image"
    CODE = "code"


@dataclass
class ModelInfo:
    """Model information"""
    id: str
    name: str
    provider: ModelProvider
    type: ModelType
    context_length: int
    max_output_tokens: int
    supports_streaming: bool = True
    supports_function_calling: bool = False
    pricing: Optional[Dict[str, float]] = None
    description: str = ""
    capabilities: List[str] = field(default_factory=list)
    deprecated: bool = False


class ModelRegistry:
    """Central model registry"""

    def __init__(self):
        self.models: Dict[str, ModelInfo] = {}
        self._register_default_models()

    def _register_default_models(self):
        """Register default models"""
        # OpenAI Models
        self.register(ModelInfo(
            id="gpt-4o",
            name="GPT-4o",
            provider=ModelProvider.OPENAI,
            type=ModelType.CHAT,
            context_length=128000,
            max_output_tokens=16384,
            supports_streaming=True,
            supports_function_calling=True,
            pricing={"input": 5.0, "output": 15.0},
            description="Latest GPT-4 model with multimodal capabilities"
        ))

        self.register(ModelInfo(
            id="gpt-4-turbo",
            name="GPT-4 Turbo",
            provider=ModelProvider.OPENAI,
            type=ModelType.CHAT,
            context_length=128000,
            max_output_tokens=4096,
            supports_streaming=True,
            supports_function_calling=True,
            pricing={"input": 10.0, "output": 30.0}
        ))

        self.register(ModelInfo(
            id="gpt-3.5-turbo",
            name="GPT-3.5 Turbo",
            provider=ModelProvider.OPENAI,
            type=ModelType.CHAT,
            context_length=16385,
            max_output_tokens=4096,
            supports_streaming=True,
            supports_function_calling=True,
            pricing={"input": 0.5, "output": 1.5}
        ))

        # Anthropic Models
        self.register(ModelInfo(
            id="claude-3-5-sonnet-20241022",
            name="Claude 3.5 Sonnet",
            provider=ModelProvider.ANTHROPIC,
            type=ModelType.CHAT,
            context_length=200000,
            max_output_tokens=8192,
            supports_streaming=True,
            pricing={"input": 3.0, "output": 15.0}
        ))

        self.register(ModelInfo(
            id="claude-3-opus-20240229",
            name="Claude 3 Opus",
            provider=ModelProvider.ANTHROPIC,
            type=ModelType.CHAT,
            context_length=200000,
            max_output_tokens=4096,
            supports_streaming=True,
            pricing={"input": 15.0, "output": 75.0}
        ))

        # Google Models
        self.register(ModelInfo(
            id="gemini-1.5-pro",
            name="Gemini 1.5 Pro",
            provider=ModelProvider.GOOGLE,
            type=ModelType.CHAT,
            context_length=2000000,
            max_output_tokens=8192,
            supports_streaming=True,
            pricing={"input": 1.25, "output": 5.0}
        ))

        self.register(ModelInfo(
            id="gemini-1.5-flash",
            name="Gemini 1.5 Flash",
            provider=ModelProvider.GOOGLE,
            type=ModelType.CHAT,
            context_length=1000000,
            max_output_tokens=8192,
            supports_streaming=True,
            pricing={"input": 0.075, "output": 0.3}
        ))

        # Mistral Models
        self.register(ModelInfo(
            id="mistral-large-latest",
            name="Mistral Large",
            provider=ModelProvider.MISTRAL,
            type=ModelType.CHAT,
            context_length=128000,
            max_output_tokens=32000,
            supports_streaming=True,
            pricing={"input": 2.0, "output": 6.0}
        ))

        # Meta Llama Models
        self.register(ModelInfo(
            id="meta-llama/Llama-3.1-70B-Instruct",
            name="Llama 3.1 70B",
            provider=ModelProvider.HUGGINGFACE,
            type=ModelType.CHAT,
            context_length=128000,
            max_output_tokens=4096,
            supports_streaming=True,
            pricing={"input": 0.0, "output": 0.0}
        ))

    def register(self, model: ModelInfo):
        """Register a model"""
        self.models[model.id] = model

    def get(self, model_id: str) -> Optional[ModelInfo]:
        """Get model by ID"""
        return self.models.get(model_id)

    def list_by_provider(self, provider: ModelProvider) -> List[ModelInfo]:
        """List models by provider"""
        return [m for m in self.models.values() if m.provider == provider]

    def list_by_type(self, model_type: ModelType) -> List[ModelInfo]:
        """List models by type"""
        return [m for m in self.models.values() if m.type == model_type]

    def search(self, query: str) -> List[ModelInfo]:
        """Search models by name or description"""
        query = query.lower()
        return [
            m for m in self.models.values()
            if query in m.name.lower() or query in m.description.lower()
        ]

    def all(self) -> List[ModelInfo]:
        """Get all models"""
        return list(self.models.values())


# Global registry instance
_registry = ModelRegistry()


def get_registry() -> ModelRegistry:
    """Get the global model registry"""
    return _registry


def register_model(model: ModelInfo):
    """Register a model to global registry"""
    _registry.register(model)


def get_model(model_id: str) -> Optional[ModelInfo]:
    """Get a model from global registry"""
    return _registry.get(model_id)


def list_models(provider: Optional[ModelProvider] = None) -> List[ModelInfo]:
    """List models, optionally filtered by provider"""
    if provider:
        return _registry.list_by_provider(provider)
    return _registry.all()


if __name__ == "__main__":
    registry = get_registry()

    print("All Models:")
    for model in registry.all():
        print(f"  - {model.id} ({model.provider.value})")

    print("\nOpenAI Models:")
    for model in registry.list_by_provider(ModelProvider.OPENAI):
        print(f"  - {model.id}: {model.name}")
