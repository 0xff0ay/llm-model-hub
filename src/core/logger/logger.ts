"""
Logger - Logging utilities
"""

import os
import sys
import logging
from typing import Optional, Any
from datetime import datetime
from enum import Enum


class LogLevel(Enum):
    """Log levels"""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class ColoredFormatter(logging.Formatter):
    """Colored log formatter"""

    COLORS = {
        'DEBUG': '\033[36m',    # Cyan
        'INFO': '\033[32m',     # Green
        'WARNING': '\033[33m',   # Yellow
        'ERROR': '\033[31m',     # Red
        'CRITICAL': '\033[35m',  # Magenta
    }
    RESET = '\033[0m'

    def format(self, record):
        log_color = self.COLORS.get(record.levelname, self.RESET)
        record.levelname = f"{log_color}{record.levelname}{self.RESET}"
        return super().format(record)


class Logger:
    """Logger wrapper"""

    def __init__(self, name: str, level: str = "INFO"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, level.upper()))
        self._setup_handlers()

    def _setup_handlers(self):
        if not self.logger.handlers:
            # Console handler
            console = logging.StreamHandler(sys.stdout)
            console.setLevel(logging.DEBUG)

            formatter = ColoredFormatter(
                '%(asctime)s │ %(levelname)s │ %(name)s │ %(message)s',
                datefmt='%H:%M:%S'
            )
            console.setFormatter(formatter)
            self.logger.addHandler(console)

    def debug(self, msg: str, *args, **kwargs):
        self.logger.debug(msg, *args, **kwargs)

    def info(self, msg: str, *args, **kwargs):
        self.logger.info(msg, *args, **kwargs)

    def warning(self, msg: str, *args, **kwargs):
        self.logger.warning(msg, *args, **kwargs)

    def error(self, msg: str, *args, **kwargs):
        self.logger.error(msg, *args, **kwargs)

    def critical(self, msg: str, *args, **kwargs):
        self.logger.critical(msg, *args, **kwargs)


def get_logger(name: str, level: Optional[str] = None) -> Logger:
    """Get a logger instance"""
    log_level = level or os.getenv("LOG_LEVEL", "INFO")
    return Logger(name, log_level)


# Default logger
default_logger = get_logger("llm-hub")
