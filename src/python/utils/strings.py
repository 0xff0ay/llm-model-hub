"""
Python string utilities
"""

from typing import List


def trim(text: str) -> str:
    """Trim whitespace"""
    return text.strip()


def split_lines(text: str) -> List[str]:
    """Split into lines"""
    return text.split("\n")


def join_lines(lines: List[str]) -> str:
    """Join lines"""
    return "\n".join(lines)


def truncate(text: str, length: int, suffix: str = "...") -> str:
    """Truncate text"""
    if len(text) <= length:
        return text
    return text[:length - len(suffix)] + suffix


def slugify(text: str) -> str:
    """Create slug"""
    return text.lower().replace(" ", "-").replace("_", "-")
