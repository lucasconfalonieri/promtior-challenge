# Promtior RAG Backend

This backend is a LangChain + LangServe service that exposes a Retrieval-Augmented Generation (RAG) chatbot
to answer questions about Promtior.

## Pipeline

1. **ingest.py**
   - Loads Promtior's public content (website, PDF material, curated facts).
   - Splits content into semantically coherent chunks.
   - Generates embeddings with OpenAI.
   - Builds and persists a FAISS vectorstore into `data/vectorstore/`.

2. **rag_chain.py**
   - Loads the persisted FAISS index.
   - Creates a retriever.
   - Wraps it with a prompt that constrains the model to answer ONLY using retrieved context.
   - Returns a LangChain runnable/chain.

3. **app.py**
   - FastAPI + LangServe.
   - Exposes the RAG chain at `/rag`.

## Environment variables
`.env.example`:
    OPENAI_API_KEY=sk-xxx
    OPENAI_MODEL=gpt-4o-mini
    OPENAI_EMBEDDING_MODEL=text-embedding-3-small


## Run locally
```bash
pip install -r requirements.txt
cp .env.example .env 
python ingest.py 
uvicorn app:app --reload --port 8000
