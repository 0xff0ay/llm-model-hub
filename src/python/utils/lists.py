"""
Python list utilities
"""

from typing import Any, List, Callable


def first(items: List) -> Any:
    """Get first item"""
    return items[0] if items else None


def last(items: List) -> Any:
    """Get last item"""
    return items[-1] if items else None


def filter_(items: List, predicate: Callable) -> List:
    """Filter items"""
    return [item for item in items if predicate(item)]


def map_(items: List, transform: Callable) -> List:
    """Map items"""
    return [transform(item) for item in items]


def reduce_(items: List, func: Callable, initial: Any = None) -> Any:
    """Reduce items"""
    if initial is None:
        return items[0] if items else None
    result = initial
    for item in items:
        result = func(result, item)
    return result
