from llama_index.llms.ollama import Ollama
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings
from .config import settings

def setup_llm():
    if settings.LLM_PROVIDER == "ollama":
        llm = Ollama(
            model=settings.OLLAMA_MODEL,
            base_url=settings.OLLAMA_BASE_URL,
            request_timeout=60.0
        )
    else:
        llm = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            api_base=settings.OPENAI_API_BASE,
            model="gpt-4-turbo" # Or from settings
        )
    
    Settings.llm = llm
    return llm
