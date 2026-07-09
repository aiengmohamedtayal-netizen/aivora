import sys
import os
import traceback

sys.path.insert(0, os.path.dirname(__file__))

try:
    from app.main import app
except Exception as e:
    # If app.main fails to import, create a dummy ASGI app that returns the error
    async def app(scope, receive, send):
        assert scope['type'] == 'http'
        error_msg = traceback.format_exc()
        await send({
            'type': 'http.response.start',
            'status': 200,
            'headers': [
                (b'content-type', b'application/json'),
            ]
        })
        await send({
            'type': 'http.response.body',
            'body': f'{{"error": "Python Initialization Error", "traceback": {repr(error_msg)}}}'.encode('utf-8')
        })
