"""
Python cache implementation
"""

import time
from typing import Any, Optional, Callable
import hashlib
import json


class SimpleCache:
    """Simple in-memory cache"""

    def __init__(self, ttl: int = 3600):
        self.ttl = ttl
        self.cache = {}

    def get(self, key: str) -> Optional[Any]:
        """Get value"""
        if key in self.cache:
            value, expiry = self.cache[key]
            if time.time() < expiry:
                return value
            del self.cache[key]
        return None

    def set(self, key: str, value: Any) -> None:
        """Set value"""
        self.cache[key] = (value, time.time() + self.ttl)

    def delete(self, key: str) -> bool:
        """Delete key"""
        if key in self.cache:
            del self.cache[key]
            return True
        return False

    def clear(self) -> None:
        """Clear cache"""
        self.cache.clear()

    def make_key(*args, **kwargs) -> str:
        """Make cache key"""
        key_data = json.dumps({"args": args, "kwargs": kwargs}, sort_keys=True)
        return hashlib.md5(key_data.encode()).hexdigest()
