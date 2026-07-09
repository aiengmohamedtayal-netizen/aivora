from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/v1/health")
def health():
    return JSONResponse(content={"status": "minimal_healthy"})

@app.api_route("/{path_name:path}", methods=["GET", "POST"])
def catch_all(path_name: str):
    return JSONResponse(content={"status": "minimal_catch_all", "path": path_name})
