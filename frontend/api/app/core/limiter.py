"""
C-04: Centralized slowapi rate limiter singleton.

Import this `limiter` instance in both main.py (to register the state)
and in any endpoint that needs rate limiting.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

# Single limiter instance used across the entire application.
# Uses client IP address as the key function.
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
