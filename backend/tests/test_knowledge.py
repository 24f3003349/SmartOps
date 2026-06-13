import os
import pytest
from pathlib import Path

# We'll use the UPLOAD_DIR but clean up any files we create during tests
TEST_FILE_NAME = "test_doc_temp_xyz.txt"

@pytest.fixture(autouse=True)
def cleanup_test_files():
    # Setup
    yield
    # Teardown: Clean up test files if they were uploaded
    from app.api.v1.endpoints.knowledge import UPLOAD_DIR
    test_file = UPLOAD_DIR / TEST_FILE_NAME
    if test_file.exists():
        try:
            os.remove(test_file)
        except Exception:
            pass

def test_upload_invalid_file_type(client):
    # Try uploading a .png file
    files = {"file": ("image.png", b"fake_png_data", "image/png")}
    response = client.post("/api/v1/knowledge/upload", files=files)
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]

def test_upload_valid_file_type_and_list(client):
    from app.api.v1.endpoints.knowledge import UPLOAD_DIR
    
    # 1. Verify file is not in current list
    response = client.get("/api/v1/knowledge/files")
    assert response.status_code == 200
    assert TEST_FILE_NAME not in response.json()["files"]
    
    # 2. Upload file
    file_content = b"This is a company FAQ about support ticket response SLAs."
    files = {"file": (TEST_FILE_NAME, file_content, "text/plain")}
    response = client.post("/api/v1/knowledge/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == TEST_FILE_NAME
    assert data["status"] == "uploaded"
    
    # Verify file physically exists
    uploaded_path = Path(data["path"])
    assert uploaded_path.exists()
    assert uploaded_path.read_text() == "This is a company FAQ about support ticket response SLAs."
    
    # 3. Verify it is listed in the files list endpoint
    response = client.get("/api/v1/knowledge/files")
    assert response.status_code == 200
    assert TEST_FILE_NAME in response.json()["files"]
