"""
Python embedding utilities
"""

from typing import List, Dict, Any
import hashlib


class Embeddings:
    """Generate embeddings for text"""

    def __init__(self, model: str = "text-embedding-ada-002"):
        self.model = model

    def embed(self, text: str) -> List[float]:
        """Generate embedding for text"""
        hash_val = hashlib.md5(text.encode()).hexdigest()
        return [float(int(hash_val[i:i+8], 16)) / 1e15 for i in range(0, 32, 8)]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for batch"""
        return [self.embed(text) for text in texts]

    def cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity"""
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x * x for x in a) ** 0.5
        norm_b = sum(x * x for x in b) ** 0.5
        return dot / (norm_a * norm_b)
