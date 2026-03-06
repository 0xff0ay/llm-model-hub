"""
Python file utilities
"""

import os
import json
from typing import Any, Dict, List
from pathlib import Path


def read_json(filepath: str) -> Any:
    """Read JSON file"""
    with open(filepath, 'r') as f:
        return json.load(f)


def write_json(filepath: str, data: Any) -> None:
    """Write JSON file"""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)


def read_lines(filepath: str) -> List[str]:
    """Read file lines"""
    with open(filepath, 'r') as f:
        return [line.strip() for line in f]


def write_lines(filepath: str, lines: List[str]) -> None:
    """Write file lines"""
    Path(filepath).parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w') as f:
        f.write('\n'.join(lines))


def file_exists(filepath: str) -> bool:
    """Check if file exists"""
    return os.path.isfile(filepath)


def dir_exists(dirpath: str) -> bool:
    """Check if directory exists"""
    return os.path.isdir(dirpath)
