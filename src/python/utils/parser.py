"""
Python response parser
"""

import json
from typing import Any, Dict, List, Optional


class ResponseParser:
    """Parse LLM responses"""

    @staticmethod
    def extract_text(response: Dict) -> str:
        """Extract text from response"""
        if "choices" in response:
            return response["choices"][0].get("message", {}).get("content", "")
        if "content" in response:
            return response["content"]
        return ""

    @staticmethod
    def extract_json(response: str) -> Optional[Dict]:
        """Extract JSON from response"""
        try:
            return json.loads(response)
        except:
            start = response.find('{')
            end = response.rfind('}') + 1
            if start >= 0 and end > start:
                try:
                    return json.loads(response[start:end])
                except:
                    pass
        return None

    @staticmethod
    def extract_code(response: str, language: str = "") -> str:
        """Extract code block from response"""
        if "```" in response:
            lines = response.split("```")
            for block in lines[1:]:
                if language in block or not language:
                    code = block.split("\n", 1)[1] if "\n" in block else block
                    return code.rstrip("`")
        return response
