"""
Python dictionary utilities
"""

from typing import Any, Dict, List


def get(d: Dict, key: str, default: Any = None) -> Any:
    """Get value from dict"""
    return d.get(key, default)


def set_(d: Dict, key: str, value: Any) -> None:
    """Set value in dict"""
    d[key] = value


def has(d: Dict, key: str) -> bool:
    """Check if key exists"""
    return key in d


def delete(d: Dict, key: str) -> bool:
    """Delete key from dict"""
    if key in d:
        del d[key]
        return True
    return False


def keys(d: Dict) -> List:
    """Get keys"""
    return list(d.keys())


def values(d: Dict) -> List:
    """Get values"""
    return list(d.values())
