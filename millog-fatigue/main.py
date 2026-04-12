"""
Millog Fatigue Calculator API — FastAPI 앱 진입점.

실행 방법:
    uvicorn main:app --reload --port 8000

API 문서:
    http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(
    title="Millog Fatigue Calculator API",
    version="1.0.0",
    description="군 장병의 근무 피로도를 계산하고 자기개발 가용시간을 추천하는 API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root() -> dict:
    """헬스체크 엔드포인트."""
    return {"status": "ok", "service": "Millog Fatigue Calculator API v1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
