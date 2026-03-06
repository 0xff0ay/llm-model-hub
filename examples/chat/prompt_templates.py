"""
Example: Prompt templates
"""

from src.python.tokenizer.tokenizer import PromptTemplate


def main():
    templates = PromptTemplate.list_templates()
    print("Available templates:", templates)

    formatted = PromptTemplate.format("alpaca",
        instruction="Explain quantum computing",
        input="",
        output=""
    )
    print(f"\nFormatted: {formatted}")


if __name__":
    main()
__ == "__main