"""
Python number utilities
"""

def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp value between min and max"""
    return max(min_val, min(max_val, value))


def round_(value: float, decimals: int = 0) -> float:
    """Round value"""
    return round(value, decimals)


def percent(value: float, total: float) -> float:
    """Calculate percentage"""
    return (value / total * 100) if total > 0 else 0


def random_int(min_val: int, max_val: int) -> int:
    """Generate random integer"""
    import random
    return random.randint(min_val, max_val)
