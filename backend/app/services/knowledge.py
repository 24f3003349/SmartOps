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

    def get_query_engine(self):
        """Returns a query engine for the current index."""
        if not self.index:
            self.load_index()
        
        if not self.index:
            # If still no index, try ingesting if directory exists
            if os.path.exists(UPLOAD_DIR):
                self.ingest_documents()
        
        if not self.index:
            raise Exception("No knowledge index found or created. Please upload documents first.")
            
        return self.index.as_query_engine()

knowledge_service = KnowledgeService()
