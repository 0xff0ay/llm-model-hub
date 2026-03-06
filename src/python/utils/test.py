"""
Python test utilities
"""

import time
from typing import Any, Callable


def timer(func: Callable) -> Callable:
    """Decorator to time function execution"""
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.2f}s")
        return result   
    return wrapper


def assert_eq(actual: Any, expected: Any, msg: str = "") -> None:
    """Assert equal"""
    if actual != expected:
        raise AssertionError(f"{msg} Expected {expected}, got {actual}")


def assert_raises(func: Callable, exception: type = Exception) -> None:
    """Assert raises exception"""
    try:
        func()
        raise AssertionError(f"Expected {exception.__name__} to be raised")
    except exception:
        pass
