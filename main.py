from database import Base, engine
from models import User

Base.metadata.create_all(bind=engine)

from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # 名前の重複チェック
    existing = db.query(User).filter(User.name == user.name).first()
    if existing:
        return {
            "status": "error",
            "message": "その名前は既に使われています"
        }

    # 新規ユーザー作成
    new_user = User(name=user.name, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "status": "ok",
        "id": new_user.id
    }

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)