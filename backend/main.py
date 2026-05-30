from backend.database import Base, engine
from backend.models import User

Base.metadata.create_all(bind=engine)

from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import User

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

    # ★ ここが重要：ユーザー数を確認
    user_count = db.query(User).count()

    # ★ 最初のユーザーだけ role="admin"
    role = "admin" if user_count == 0 else "user"

    # 新規ユーザー作成（★ role をセットする）
    new_user = User(
        name=user.name,
        password=user.password,
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "status": "ok",
        "id": new_user.id,
        "role": new_user.role
    }

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    # ユーザー検索
    db_user = db.query(User).filter(User.name == user.name).first()

    if not db_user:
        return {"status": "error", "message": "ユーザーが存在しません"}

    if db_user.password != user.password:
        return {"status": "error", "message": "パスワードが違います"}

    # 成功
    return {
        "status": "ok",
        "id": db_user.id,
        "role": db_user.role
    }
@app.get("/user_info/{user_id}")
def get_user_info(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"status": "error", "message": "ユーザーが存在しません"}

    return {
        "status": "ok",
        "id": user.id,
        "name": user.name,
        "battle_ticket": user.battle_ticket,
        "coin": user.coin
    }

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)