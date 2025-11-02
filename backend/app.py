import os
from pathlib import Path
from fastapi import FastAPI
from dotenv import load_dotenv
from langserve import add_routes
from rag_chain import get_rag_chain
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent

def create_app():
    load_dotenv(dotenv_path=BASE_DIR / ".env")

    app = FastAPI(
        title="Promtior Challenge RAG API",
        description="RAG chatbot about Promtior using LangChain + LangServe",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    rag_chain = get_rag_chain()

    add_routes(app, rag_chain, path="/rag")

    return app

app = create_app()

