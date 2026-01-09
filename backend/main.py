from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Personal Finance Tracker API",
    description="Backend for the Personal Finance & Credit Card Tracker",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Personal Finance Tracker API"}

from app.routes.user import router as UserRouter
from app.routes.bank import router as BankRouter
from app.routes.card import router as CardRouter

app.include_router(UserRouter, tags=["User"], prefix="/api")
app.include_router(BankRouter, tags=["Banks"], prefix="/api")
app.include_router(CardRouter, tags=["Cards"], prefix="/api")
