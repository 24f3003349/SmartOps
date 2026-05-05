from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext, load_index_from_storage
from pathlib import Path
import os
from ..core.llm import setup_llm

UPLOAD_DIR = "data/knowledge"
STORAGE_DIR = "storage"

class KnowledgeService:
    def __init__(self):
        self.index = None
        setup_llm() # Ensure LLM is configured

    def ingest_documents(self):
        """Processes all documents in the upload directory and updates the index."""
        print(f"Ingesting documents from {UPLOAD_DIR}...")
        
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)
            
        documents = SimpleDirectoryReader(UPLOAD_DIR).load_data()
        
        if not documents:
            print("No documents found to ingest.")
            return None

        # Create index
        self.index = VectorStoreIndex.from_documents(documents)
        
        # Persist index
        self.index.storage_context.persist(persist_dir=STORAGE_DIR)
        print(f"Ingestion complete. Index persisted to {STORAGE_DIR}.")
        return self.index

    def load_index(self):
        """Loads the index from storage if it exists."""
        if os.path.exists(STORAGE_DIR):
            storage_context = StorageContext.from_defaults(persist_dir=STORAGE_DIR)
            self.index = load_index_from_storage(storage_context)
            return self.index
        return None

knowledge_service = KnowledgeService()
