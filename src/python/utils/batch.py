"""
Python batch processor
"""

import asyncio
from typing import List, Callable, Any
from concurrent.futures import ThreadPoolExecutor


class BatchProcessor:
    """Process items in batches"""

    def __init__(self, batch_size: int = 10, workers: int = 5):
        self.batch_size = batch_size
        self.workers = workers

    def process(self, items: List[Any], processor: Callable) -> List[Any]:
        """Process items in batches"""
        results = []
        for i in range(0, len(items), self.batch_size):
            batch = items[i:i + self.batch_size]
            results.extend([processor(item) for item in batch])
        return results

    async def process_async(self, items: List[Any], processor: Callable) -> List[Any]:
        """Process items in batches asynchronously"""
        results = []
        for i in range(0, len(items), self.batch_size):
            batch = items[i:i + self.batch_size]
            tasks = [processor(item) for item in batch]
            results.extend(await asyncio.gather(*tasks))
        return results
