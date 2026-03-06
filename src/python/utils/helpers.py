"""
Python utilities for LLM-Model Hub
"""

import os
import json
import hashlib
from typing import Any, Dict, List, Optional
from pathlib import Path


def load_json_file(filepath: str) -> Dict:
    """Load JSON file"""
    with open(filepath, 'r') as f:
        return json.load(f)


def save_json_file(filepath: str, data: Any) -> None:
    """Save JSON file"""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)


def calculate_hash(data: str) -> str:
    """Calculate SHA256 hash"""
    return hashlib.sha256(data.encode()).hexdigest()


def get_env(key: str, default: Optional[str] = None) -> Optional[str]:
    """Get environment variable"""
    return os.getenv(key, default)


def ensure_dir(path: str) -> Path:
    """Ensure directory exists"""
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    return p


def read_file(path: str) -> str:
    """Read file contents"""
    with open(path, 'r') as f:
        return f.read()


def write_file(path: str, content: str) -> None:
    """Write file contents"""
    ensure_dir(Path(path).parent)
    with open(path, 'w') as f:
        f.write(content)
