"""
Python validation utilities
"""

from typing import Any, Dict, List, Optional


def validate_required(data: Dict, fields: List[str]) -> List[str]:
    """Validate required fields"""
    errors = []
    for field in fields:
        if field not in data or not data[field]:
            errors.append(f"Missing required field: {field}")
    return errors


def validate_type(value: Any, expected_type: type) -> bool:
    """Validate type"""
    return isinstance(value, expected_type)


def validate_range(value: float, min_val: float, max_val: float) -> bool:
    """Validate range"""
    return min_val <= value <= max_val


def validate_email(email: str) -> bool:
    """Validate email"""
    return "@" in email and "." in email.split("@")[1]


def validate_url(url: str) -> bool:
    """Validate URL"""
    return url.startswith("http://") or url.startswith("https://")
