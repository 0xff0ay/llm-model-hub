"""
Dataset loader for fine-tuning
"""

import json
from typing import List, Dict, Any, Iterator
from pathlib import Path


class DatasetLoader:
    """Load and process datasets for fine-tuning"""

    def __init__(self, filepath: str):
        self.filepath = Path(filepath)

    def load_jsonl(self) -> List[Dict[str, Any]]:
        """Load JSONL file"""
        data = []
        with open(self.filepath, 'r') as f:
            for line in f:
                if line.strip():
                    data.append(json.loads(line))
        return data

    def load_json(self) -> List[Dict[str, Any]]:
        """Load JSON file"""
        with open(self.filepath, 'r') as f:
            data = json.load(f)
        if isinstance(data, list):
            return data
        return [data]

    def iterate_jsonl(self) -> Iterator[Dict[str, Any]]:
        """Iterate over JSONL file"""
        with open(self.filepath, 'r') as f:
            for line in f:
                if line.strip():
                    yield json.loads(line)

    def format_for_training(
        self,
        prompt_field: str = "prompt",
        response_field: str = "response"
    ) -> List[Dict[str, str]]:
        """Format dataset for training"""
        if self.filepath.suffix == '.jsonl':
            data = self.load_jsonl()
        else:
            data = self.load_json()

        formatted = []
        for item in data:
            formatted.append({
                "prompt": item.get(prompt_field, ""),
                "response": item.get(response_field, "")
            })

        return formatted
