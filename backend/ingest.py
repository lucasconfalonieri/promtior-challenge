import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import TextLoader
from langchain_core.documents import Document

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter,
)
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
PDF_DIR = DATA_DIR / "pdf"
VECTORSTORE_DIR = DATA_DIR / "vectorstore"
FACTS_FILE = DATA_DIR / "promtior_facts.md"

PROMTIOR_URLS = [
    "https://www.promtior.ai/",
    "https://www.promtior.ai/service",
    "https://www.promtior.ai/use-cases",
]

def load_sources():
    docs: list[Document] = []

    if PROMTIOR_URLS:
        web_loader = WebBaseLoader(PROMTIOR_URLS)
        web_docs = web_loader.load()
        for d in web_docs:
            d.metadata["source_type"] = "website"
            d.metadata["source"] = d.metadata.get("source", "promtior_site")
        docs.extend(web_docs)

    presentation_pdf_path = PDF_DIR / "presentation.pdf"
    if presentation_pdf_path.exists():
        pdf_loader = PyPDFLoader(str(presentation_pdf_path))
        pdf_docs = pdf_loader.load()
        for d in pdf_docs:
            d.metadata["source_type"] = "pdf"
            d.metadata["source"] = "promtior_presentation"
        docs.extend(pdf_docs)

    if FACTS_FILE.exists():
        facts_loader = TextLoader(str(FACTS_FILE), encoding="utf-8")
        facts_docs = facts_loader.load()
        for d in facts_docs:
            d.metadata["source_type"] = "curated_facts"
            d.metadata["source"] = "promtior_facts_md"
        docs.extend(facts_docs)

    if not docs:
        print("No documents were uploaded. Check URLs / PDF / facts.md")
    else:
        print(f"Documents uploaded: {len(docs)}")

    return docs


def split_documents(docs: list[Document]):
    final_chunks: list[Document] = []

    curated_docs = [d for d in docs if d.metadata.get("source_type") == "curated_facts"]
    other_docs = [d for d in docs if d.metadata.get("source_type") != "curated_facts"]

    if curated_docs:
        md_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=[
                ("#", "section_h1"),
                ("##", "section_h2"),
                ("###", "section_h3"),
            ]
        )
        for d in curated_docs:
            md_sections = md_splitter.split_text(d.page_content)
            for sec in md_sections:
                sec.metadata.update(d.metadata)
                final_chunks.append(sec)

    if other_docs:
        char_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,    
            chunk_overlap=150, 
            separators=["\n\n", "\n", " ", ""],
        )
        other_chunks = char_splitter.split_documents(other_docs)
        final_chunks.extend(other_chunks)

    print(f"Generated chunks: {len(final_chunks)}")
    return final_chunks


def build_vectorstore(chunks: list[Document]):
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is missing (.env)")

    embedding_model = os.getenv(
        "OPENAI_EMBEDDING_MODEL",
        "text-embedding-3-small"
    )

    embeddings = OpenAIEmbeddings(
        model=embedding_model,
        api_key=openai_api_key,
    )
    vectorstore = FAISS.from_documents(chunks, embedding=embeddings)
    VECTORSTORE_DIR.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(VECTORSTORE_DIR))
    print(f"Vectorstore saved in {VECTORSTORE_DIR}")

def main():
    load_dotenv(dotenv_path=BASE_DIR / ".env")
    os.environ.setdefault(
    "USER_AGENT",
    os.getenv("USER_AGENT", "PromtiorChallengeBot")
    )
    docs = load_sources()
    chunks = split_documents(docs)

    build_vectorstore(chunks)

    print("Vectorstore ready")


if __name__ == "__main__":
    main()
