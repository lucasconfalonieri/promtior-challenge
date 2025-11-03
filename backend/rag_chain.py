import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough


BASE_DIR = Path(__file__).resolve().parent
VECTORSTORE_DIR = BASE_DIR / "data" / "vectorstore"

def get_rag_chain():
    load_dotenv(dotenv_path=BASE_DIR / ".env")

    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise RuntimeError("OPENAI_API_KEY missing")

    embedding_model = os.getenv(
        "OPENAI_EMBEDDING_MODEL",
        "text-embedding-3-small"
    )

    chat_model_name = os.getenv(
        "OPENAI_MODEL",
        "gpt-4o-mini"
    )

    embeddings = OpenAIEmbeddings(
        model=embedding_model,
        api_key=openai_api_key,
    )

    vectorstore = FAISS.load_local(
        str(VECTORSTORE_DIR),
        embeddings,
        allow_dangerous_deserialization=True,
    )

    retriever = vectorstore.as_retriever(
        search_type="similarity",    
        search_kwargs={"k": 4},      
    )

    template = """
                You are an AI assistant that answers questions using the provided context.
                If the answer is not in the context, say:
                "I don't have that information based on Promtior's available data."
                Rules:
                - Do not hallucinate.
                - Answer in the language asked.
                - Be concise and factual.
                - If you're asked something generic like 'what is AI', tie it back to how Promtior positions itself (if and only if the context supports it).
                Be concise and factual. 

                Context:
                {context}

                Question:
                {question}

                Answer:
                """

    prompt = ChatPromptTemplate.from_template(template)

    llm = ChatOpenAI(
        model=chat_model_name,
        openai_api_key=openai_api_key,
        temperature=0,
    )

    def format_docs(docs):
        return "\n\n".join(
            f"[source: {d.metadata.get('source', 'unknown')}]\n{d.page_content}"
            for d in docs
        )
    rag_chain = (
        {
            "question": RunnablePassthrough(),
            "context": retriever | format_docs,
        }
        | prompt
        | llm         
        | StrOutputParser()
    )
    return rag_chain
