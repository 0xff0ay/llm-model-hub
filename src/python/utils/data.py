"""
Python data processing utilities
"""

from typing import List, Dict, Any, Optional
import json


class DataProcessor:
    """Process and transform data"""

    @staticmethod
    def filter_by_field(data: List[Dict], field: str, value: Any) -> List[Dict]:
        """Filter data by field value"""
        return [item for item in data if item.get(field) == value]

    @staticmethod
    def group_by_field(data: List[Dict], field: str) -> Dict[Any, List[Dict]]:
        """Group data by field"""
        groups = {}
        for item in data:
            key = item.get(field)
            if key not in groups:
                groups[key] = []
            groups[key].append(item)
        return groups

    @staticmethod
    def map_fields(data: List[Dict], mapping: Dict[str, str]) -> List[Dict]:
        """Map field names"""
        result = []
        for item in data:
            new_item = {}
            for old_field, new_field in mapping.items():
                if old_field in item:
                    new_item[new_field] = item[old_field]
            result.append(new_item)
        return result

    @staticmethod
    def deduplicate(data: List[Dict], key: str) -> List[Dict]:
        """Remove duplicates by key"""
        seen = set()
        result = []
        for item in data:
            val = item.get(key)
            if val not in seen:
                seen.add(val)
                result.append(item)
        return result
