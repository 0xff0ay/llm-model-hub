"""
Python HTTP client
"""

import requests
from typing import Dict, Any, Optional


class HTTPClient:
    """Simple HTTP client"""

    def __init__(self, base_url: str = ""):
        self.base_url = base_url
        self.session = requests.Session()

    def get(self, url: str, params: Optional[Dict] = None) -> Any:
        """GET request"""
        full_url = self.base_url + url
        response = self.session.get(full_url, params=params)
        return response.json()

    def post(self, url: str, data: Optional[Dict] = None) -> Any:
        """POST request"""
        full_url = self.base_url + url
        response = self.session.post(full_url, json=data)
        return response.json()

    def put(self, url: str, data: Optional[Dict] = None) -> Any:
        """PUT request"""
        full_url = self.base_url + url
        response = self.session.put(full_url, json=data)
        return response.json()

    def delete(self, url: str) -> Any:
        """DELETE request"""
        full_url = self.base_url + url
        response = self.session.delete(full_url)
        return response.json()
