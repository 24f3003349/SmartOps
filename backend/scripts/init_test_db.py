from sqlmodel import Session, select
from app.core.db import engine, init_db
from app.models.user import User
from app.core.security import get_password_hash

def test_db():
    print("Initializing DB...")
    init_db()
    
    with Session(engine) as session:
        # Check if user exists
        statement = select(User).where(User.email == "admin@smartops.ai")
        user = session.exec(statement).first()
        
        if not user:
            print("Creating admin user...")
            user = User(
                email="admin@smartops.ai",
                hashed_password=get_password_hash("admin"),
                full_name="Admin User",
                is_superuser=True
            )
            session.add(user)
            session.commit()
            print("Admin user created.")
        else:
            print("Admin user already exists.")

if __name__ == "__main__":
    test_db()
