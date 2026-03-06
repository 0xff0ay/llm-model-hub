"""
Storage - Data persistence module
"""

import os
import json
import sqlite3
from typing import Any, Optional, List, Dict
from pathlib import Path
from dataclasses import asdict, dataclass
import hashlib
from datetime import datetime


@dataclass
class Conversation:
    """Conversation record"""
    id: str
    provider: str
    model: str
    messages: List[Dict[str, str]]
    created_at: str
    updated_at: str
    title: Optional[str] = None
    metadata: Optional[Dict] = None


class Storage:
    """SQLite-based storage"""

    def __init__(self, db_path: str = "./data/llm-hub.db"):
        self.db_path = db_path
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self):
        """Initialize database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                provider TEXT NOT NULL,
                model TEXT NOT NULL,
                messages TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                title TEXT,
                metadata TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS prompts (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                category TEXT,
                tags TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usage_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                provider TEXT NOT NULL,
                model TEXT NOT NULL,
                input_tokens INTEGER,
                output_tokens INTEGER,
                cost REAL,
                timestamp TEXT NOT NULL
            )
        """)

        conn.commit()
        conn.close()

    def save_conversation(self, conversation: Conversation) -> None:
        """Save conversation"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT OR REPLACE INTO conversations
            (id, provider, model, messages, created_at, updated_at, title, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            conversation.id,
            conversation.provider,
            conversation.model,
            json.dumps(conversation.messages),
            conversation.created_at,
            conversation.updated_at,
            conversation.title,
            json.dumps(conversation.metadata) if conversation.metadata else None
        ))

        conn.commit()
        conn.close()

    def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """Get conversation by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, provider, model, messages, created_at, updated_at, title, metadata
            FROM conversations WHERE id = ?
        """, (conversation_id,))

        row = cursor.fetchone()
        conn.close()

        if not row:
            return None

        return Conversation(
            id=row[0],
            provider=row[1],
            model=row[2],
            messages=json.loads(row[3]),
            created_at=row[4],
            updated_at=row[5],
            title=row[6],
            metadata=json.loads(row[7]) if row[7] else None
        )

    def list_conversations(self, limit: int = 50) -> List[Conversation]:
        """List conversations"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, provider, model, messages, created_at, updated_at, title, metadata
            FROM conversations ORDER BY updated_at DESC LIMIT ?
        """, (limit,))

        rows = cursor.fetchall()
        conn.close()

        return [
            Conversation(
                id=row[0],
                provider=row[1],
                model=row[2],
                messages=json.loads(row[3]),
                created_at=row[4],
                updated_at=row[5],
                title=row[6],
                metadata=json.loads(row[7]) if row[7] else None
            )
            for row in rows
        ]

    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete conversation"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
        deleted = cursor.rowcount > 0

        conn.commit()
        conn.close()

        return deleted

    def save_prompt(self, id: str, name: str, content: str, category: str = None, tags: List[str] = None) -> None:
        """Save prompt template"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        now = datetime.now().isoformat()

        cursor.execute("""
            INSERT OR REPLACE INTO prompts
            (id, name, content, created_at, updated_at, category, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (id, name, content, now, now, category, json.dumps(tags) if tags else None))

        conn.commit()
        conn.close()

    def get_prompt(self, prompt_id: str) -> Optional[Dict]:
        """Get prompt by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, content, created_at, updated_at, category, tags
            FROM prompts WHERE id = ?
        """, (prompt_id,))

        row = cursor.fetchone()
        conn.close()

        if not row:
            return None

        return {
            "id": row[0],
            "name": row[1],
            "content": row[2],
            "created_at": row[3],
            "updated_at": row[4],
            "category": row[5],
            "tags": json.loads(row[6]) if row[6] else []
        }

    def list_prompts(self) -> List[Dict]:
        """List all prompts"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, content, created_at, updated_at, category, tags
            FROM prompts ORDER BY updated_at DESC
        """)

        rows = cursor.fetchall()
        conn.close()

        return [
            {
                "id": row[0],
                "name": row[1],
                "content": row[2],
                "created_at": row[3],
                "updated_at": row[4],
                "category": row[5],
                "tags": json.loads(row[6]) if row[6] else []
            }
            for row in rows
        ]

    def log_usage(self, provider: str, model: str, input_tokens: int, output_tokens: int, cost: float):
        """Log token usage"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO usage_logs (provider, model, input_tokens, output_tokens, cost, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (provider, model, input_tokens, output_tokens, cost, datetime.now().isoformat()))

        conn.commit()
        conn.close()

    def get_usage_stats(self, provider: Optional[str] = None) -> Dict:
        """Get usage statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        if provider:
            cursor.execute("""
                SELECT provider, model, SUM(input_tokens), SUM(output_tokens), SUM(cost), COUNT(*)
                FROM usage_logs WHERE provider = ?
                GROUP BY provider, model
            """, (provider,))
        else:
            cursor.execute("""
                SELECT provider, model, SUM(input_tokens), SUM(output_tokens), SUM(cost), COUNT(*)
                FROM usage_logs
                GROUP BY provider, model
            """)

        rows = cursor.fetchall()
        conn.close()

        return [
            {
                "provider": row[0],
                "model": row[1],
                "total_input_tokens": row[2],
                "total_output_tokens": row[3],
                "total_cost": row[4],
                "request_count": row[5]
            }
            for row in rows
        ]


# Global storage instance
storage = Storage()
