"""
HippocampX Educational Games Backend
Professional, scalable FastAPI server.
"""

from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Import API routers
from api.tic_tac_toe import router as tic_tac_toe_router

# Add future game routers here:
# from api.chess import router as chess_router
# from api.connect_four import router as connect_four_router


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = Field("healthy", description="Service health status")
    version: str = Field("1.0.0", description="API version")
    games: list[str] = Field(..., description="Available games")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    print("🚀 Starting HippocampX Games Backend...")
    yield
    print("🛑 Shutting down HippocampX Games Backend...")


# Initialize FastAPI application
app = FastAPI(
    title="HippocampX Games API",
    description="Educational games backend with AI-powered learning experiences",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://hippocampx.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(tic_tac_toe_router)

# Add future routers here:
# app.include_router(chess_router)
# app.include_router(connect_four_router)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )


@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check and available services."""
    return HealthResponse(games=["tic-tac-toe"])


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )