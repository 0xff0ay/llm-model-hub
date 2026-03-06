"""
Cache management module
"""

import os
import json
import hashlib
import time
from typing import Any, Optional, Dict
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class CacheEntry:
    """Cache entry"""
    key: str
    value: Any
    created_at: float
    expires_at: Optional[float] = None
    hits: int = 0


class Cache:
    """In-memory cache with persistence"""

    def __init__(self, max_size: int = 1000, ttl: Optional[int] = None):
        self.max_size = max_size
        self.ttl = ttl
        self._cache: Dict[str, CacheEntry] = {}
        self._hits = 0
        self._misses = 0

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set cache entry"""
        if len(self._cache) >= self.max_size:
            self._evict_oldest()

        ttl = ttl or self.ttl
        expires_at = time.time() + ttl if ttl else None

        self._cache[key] = CacheEntry(
            key=key,
            value=value,
            created_at=time.time(),
            expires_at=expires_at
        )

    def get(self, key: str, default: Any = None) -> Any:
        """Get cache entry"""
        entry = self._cache.get(key)

        if entry is None:
            self._misses += 1
            return default

        if entry.expires_at and time.time() > entry.expires_at:
            del self._cache[key]
            self._misses += 1
            return default

        entry.hits += 1
        self._hits += 1
        return entry.value

    def delete(self, key: str) -> bool:
        """Delete cache entry"""
        if key in self._cache:
            del self._cache[key]
            return True
        return False

    def clear(self) -> None:
        """Clear all cache"""
        self._cache.clear()
        self._hits = 0
        self._misses = 0

    def _evict_oldest(self) -> None:
        """Evict oldest entry"""
        if not self._cache:
            return

        oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k].created_at)
        del self._cache[oldest_key]

    def stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total = self._hits + self._misses
        hit_rate = self._hits / total if total > 0 else 0

        return {
            "size": len(self._cache),
            "max_size": self.max_size,
            "hits": self._hits,
            "misses": self._misses,
            "hit_rate": hit_rate
        }


class DiskCache:
    """Disk-based cache"""

    def __init__(self, cache_dir: str = "./data/cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _get_path(self, key: str) -> Path:
        """Get file path for key"""
        key_hash = hashlib.md5(key.encode()).hexdigest()
        return self.cache_dir / f"{key_hash}.json"

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set cache entry to disk"""
        path = self._get_path(key)
        data = {
            "key": key,
            "value": value,
            "created_at": time.time(),
            "expires_at": time.time() + ttl if ttl else None
        }

        with open(path, 'w') as f:
            json.dump(data, f)

    def get(self, key: str, default: Any = None) -> Any:
        """Get cache entry from disk"""
        path = self._get_path(key)

        if not path.exists():
            return default

        try:
            with open(path, 'r') as f:
                data = json.load(f)

            if data.get("expires_at") and time.time() > data["expires_at"]:
                path.unlink()
                return default

            return data.get("value", default)
        except:
            return default

    def delete(self, key: str) -> bool:
        """Delete cache entry"""
        path = self._get_path(key)
        if path.exists():
            path.unlink()
            return True
        return False

    def clear(self) -> None:
        """Clear all cache files"""
        for path in self.cache_dir.glob("*.json"):
            path.unlink()


# Global cache instances
memory_cache = Cache(max_size=1000, ttl=3600)
disk_cache = DiskCache()
