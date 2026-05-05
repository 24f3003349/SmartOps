from app.services.triage import triage_service
import asyncio

async def test():
    print("Testing Triage...")
    result = triage_service.classify_ticket(
        "Cannot login", 
        "I get an Invalid Credentials error even though my password is correct."
    )
    print(f"Category: {result.category}")
    print(f"Priority: {result.priority}")
    print(f"Confidence: {result.confidence}")
    print(f"Reasoning: {result.reasoning}")

if __name__ == "__main__":
    import asyncio
    # classification is synchronous in the service call but uses LLM
    try:
        from app.core.config import settings
        print(f"Using model: {settings.OLLAMA_MODEL}")
        result = triage_service.classify_ticket(
            "SQL Injection detected in auth logs", 
            "We see repeated attempts to exploit our login endpoint via SQLi patterns. Need security audit."
        )
        print(f"Category: {result.category}")
        print(f"Priority: {result.priority}")
        print(f"Confidence: {result.confidence}")
        print(f"Reasoning: {result.reasoning}")
    except Exception as e:
        print(f"Test failed: {e}")
