"""
Plugin system for LLM-Model Hub
"""

from typing import Dict, Any, Callable, List
from dataclasses import dataclass
import importlib.util
from pathlib import Path


@dataclass
class PluginInfo:
    """Plugin information"""
    name: str
    version: str
    description: str
    author: str
    hooks: List[str]


class Plugin:
    """Base plugin class"""

    name: str = "base"
    version: str = "1.0.0"
    description: str = ""
    author: str = ""
    hooks: List[str] = []

    def __init__(self):
        self.enabled = True

    def on_load(self):
        """Called when plugin is loaded"""
        pass

    def on_unload(self):
        """Called when plugin is unloaded"""
        pass

    def on_chat(self, messages: List[Dict], context: Dict) -> List[Dict]:
        """Called on chat messages"""
        return messages

    def on_response(self, response: str, context: Dict) -> str:
        """Called on response"""
        return response


class PluginManager:
    """Plugin manager"""

    def __init__(self):
        self.plugins: Dict[str, Plugin] = {}
        self.hooks: Dict[str, List[Callable]] = {}

    def register(self, plugin: Plugin):
        """Register a plugin"""
        self.plugins[plugin.name] = plugin
        plugin.on_load()

    def unregister(self, name: str):
        """Unregister a plugin"""
        if name in self.plugins:
            self.plugins[name].on_unload()
            del self.plugins[name]

    def get(self, name: str) -> Plugin:
        """Get a plugin"""
        return self.plugins.get(name)

    def list_all(self) -> List[PluginInfo]:
        """List all plugins"""
        return [
            PluginInfo(
                name=p.name,
                version=p.version,
                description=p.description,
                author=p.author,
                hooks=p.hooks
            )
            for p in self.plugins.values()
        ]

    def add_hook(self, hook_name: str, callback: Callable):
        """Add a hook callback"""
        if hook_name not in self.hooks:
            self.hooks[hook_name] = []
        self.hooks[hook_name].append(callback)

    def execute_hook(self, hook_name: str, *args, **kwargs):
        """Execute all hooks for an event"""
        if hook_name in self.hooks:
            for callback in self.hooks[hook_name]:
                callback(*args, **kwargs)

    def load_from_directory(self, directory: str):
        """Load plugins from directory"""
        path = Path(directory)
        if not path.exists():
            return

        for file in path.glob("*.py"):
            if file.name.startswith("_"):
                continue

            spec = importlib.util.spec_from_file_location(file.stem, file)
            if spec and spec.loader:
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)

                for name in dir(module):
                    obj = getattr(module, name)
                    if isinstance(obj, type) and issubclass(obj, Plugin) and obj != Plugin:
                        self.register(obj())


# Global plugin manager
plugin_manager = PluginManager()
