import sys
import os
import traceback

sys.path.insert(0, os.path.dirname(__file__))

async def app(scope, receive, send):
    try:
        # Import the actual FastAPI app
        from app.main import app as fastapi_app
        
        # Call the FastAPI app
        await fastapi_app(scope, receive, send)
    except Exception as e:
        # Catch any import or initialization errors
        error_msg = traceback.format_exc()
        if scope['type'] == 'http':
            await send({
                'type': 'http.response.start',
                'status': 200,
                'headers': [
                    (b'content-type', b'application/json'),
                ]
            })
            await send({
                'type': 'http.response.body',
                'body': f'{{"error": "Python Runtime Error", "traceback": {repr(error_msg)}}}'.encode('utf-8')
            })
