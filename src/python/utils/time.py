"""
Python time utilities
"""

from datetime import datetime, timedelta
from typing import Optional


def now() -> datetime:
    """Get current time"""
    return datetime.now()


def now_iso() -> str:
    """Get current time as ISO string"""
    return datetime.now().isoformat()


def parse_iso(iso_string: str) -> datetime:
    """Parse ISO string"""
    return datetime.fromisoformat(iso_string)


def format_date(dt: datetime, format_str: str = "%Y-%m-%d") -> str:
    """Format date"""
    return dt.strftime(format_str)


def add_days(dt: datetime, days: int) -> datetime:
    """Add days to date"""
    return dt + timedelta(days=days)


def time_ago(dt: datetime) -> str:
    """Get time ago string"""
    diff = now() - dt
    if diff.days > 365:
        return f"{diff.days // 365} years ago"
    if diff.days > 30:
        return f"{diff.days // 30} months ago"
    if diff.days > 0:
        return f"{diff.days} days ago"
    if diff.seconds > 3600:
        return f"{diff.seconds // 3600} hours ago"
    if diff.seconds > 60:
        return f"{diff.seconds // 60} minutes ago"
    return "just now"
