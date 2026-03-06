"""
Python retry utilities
"""

import time
import functools
from typing import Callable, Any, Optional


def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """Retry decorator"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            attempts = 0
            current_delay = delay
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts >= max_attempts:
                        raise
                    time.sleep(current_delay)
                    current_delay *= backoff
        return wrapper
    return decorator


def retry_with_timeout(timeout: float = 30.0):
    """Retry with timeout"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            start = time.time()
            while time.time() - start < timeout:
                try:
                    return func(*args, **kwargs)
                except Exception:
                    if time.time() - start >= timeout:
                        raise
                    time.sleep(0.5)
        return wrapper
    return decorator
