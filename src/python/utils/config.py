"""
Python configuration utilities
"""

import os
import json
from typing import Any, Dict, Optional
from pathlib import Path


class Config:
    """Configuration manager"""

    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file or "config.json"
        self.data: Dict[str, Any] = {}

    def load(self) -> Dict[str, Any]:
        """Load configuration"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                self.data = json.load(f)
        return self.data

    def save(self) -> None:
        """Save configuration"""
        Path(self.config_file).parent.mkdir(parents=True, exist_ok=True)
        with open(self.config_file, 'w') as f:
            json.dump(self.data, f, indent=2)

    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value"""
        return self.data.get(key, default)

    def set(self, key: str, value: Any) -> None:
        """Set configuration value"""
        self.data[key] = value

    def get_provider(self, provider: str) -> Dict[str, Any]:
        """Get provider configuration"""
        providers = self.data.get('providers', {})
        return providers.get(provider, {})

    def set_provider(self, provider: str, config: Dict[str, Any]) -> None:
        """Set provider configuration"""
        if 'providers' not in self.data:
            self.data['providers'] = {}
        self.data['providers'][provider] = config
