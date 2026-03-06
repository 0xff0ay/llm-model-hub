"""
Python async utilities
"""

import asyncio
from typing import Callable, Any, List, TypeVar


T = TypeVar('T')


async def run_async(func: Callable, *args, **kwargs) -> Any:
    """Run function in async context"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, lambda: func(*args, **kwargs))


async def gather_with_limit(tasks: List, limit: int = 5) -> List:
    """Run tasks with concurrency limit"""
    semaphore = asyncio.Semaphore(limit)

    async def run_task(task):
        async with semaphore:
            return await task

    return await asyncio.gather(*[run_task(task) for task in tasks])


async def retry_async(func: Callable, retries: int = 3, delay: float = 1.0) -> Any:
    """Retry async function"""
    for i in range(retries):
        try:
            return await func()
        except Exception as e:
            if i == retries - 1:
                raise
            await asyncio.sleep(delay * (i + 1))
