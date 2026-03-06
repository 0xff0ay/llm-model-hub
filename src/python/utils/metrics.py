"""
Python metrics tracking
"""

from typing import Dict, List
from datetime import datetime
from collections import defaultdict


class Metrics:
    """Track metrics"""

    def __init__(self):
        self.metrics: Dict[str, List[float]] = defaultdict(list)

    def record(self, name: str, value: float) -> None:
        """Record a metric"""
        self.metrics[name].append(value)

    def get(self, name: str) -> List[float]:
        """Get metric values"""
        return self.metrics.get(name, [])

    def avg(self, name: str) -> float:
        """Get average"""
        values = self.get(name)
        return sum(values) / len(values) if values else 0

    def sum(self, name: str) -> float:
        """Get sum"""
        return sum(self.get(name))

    def count(self, name: str) -> int:
        """Get count"""
        return len(self.get(name))

    def clear(self) -> None:
        """Clear all metrics"""
        self.metrics.clear()
