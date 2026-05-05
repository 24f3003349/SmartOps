from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
from pathlib import Path
from ....services.knowledge import knowledge_service

router = APIRouter()

UPLOAD_DIR = Path("data/knowledge")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith((".pdf", ".txt", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, TXT, and DOCX are allowed.")
    
    file_path = UPLOAD_DIR / file.filename
    
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Trigger ingestion
    try:
        knowledge_service.ingest_documents()
    except Exception as e:
        print(f"Warning: Ingestion failed: {str(e)}")
        # We don't fail the upload if ingestion fails, but we log it
    
    return {"filename": file.filename, "status": "uploaded", "path": str(file_path)}

@router.get("/files")
def list_files():
    files = [f.name for f in UPLOAD_DIR.iterdir() if f.is_file()]
    return {"files": files}
