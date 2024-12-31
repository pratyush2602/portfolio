from fastapi import FastAPI
from .chatbot import router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(router, prefix="/api")
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
@app.get("/")
def read_root():
    with open("frontend\index.html") as f:
        return HTMLResponse(f.read())


import uvicorn

if __name__ == "__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)