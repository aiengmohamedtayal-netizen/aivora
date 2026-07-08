import sys
import os

# Add the api directory to the Python path so 'app.main' can be resolved
# when Vercel executes this from the project root.
sys.path.insert(0, os.path.dirname(__file__))

from app.main import app

# Vercel's Python runtime requires the ASGI/WSGI app to be exported, typically named `app`.
# The app object from app.main is already imported and exposed here.
