from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from contextlib import asynccontextmanager
from .core.config import settings
from .core.db import init_db
from .core.otel import setup_otel
from .core.llm import setup_llm
from .api.v1.api import api_router

# Initialize OTel & LLM
setup_otel(settings.PROJECT_NAME)
setup_llm()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown (if needed)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to SmartOps AI API"}

app.include_router(api_router, prefix=settings.API_V1_STR)

# Instrument with OpenTelemetry
FastAPIInstrumentor.instrument_app(app)
