from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.orm import sessionmaker
from .config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

def init_db():
    from ..models.user import User
    from ..models.ticket import Ticket
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
