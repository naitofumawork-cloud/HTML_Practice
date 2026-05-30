# models.py
from sqlalchemy import Column, Integer, String
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String,unique=True)
    password = Column(String)
    role=Column(String,default="user")
    
    battle_ticket = Column(Integer, default=10)  # スタミナ
    coin = Column(Integer, default=10)            # ガチャ用コイン
    
#管理者アカウント付与
#PS C:\Fuma\html\first_practice> sqlite3 users.db
# SQLite version 3.50.4 2025-07-30 19:33:53
# Enter ".help" for usage hints.
# sqlite> SELECT id, name, role FROM users;
# 1|fuma|user
# sqlite> UPDATE users SET role = 'admin' WHERE id = 1;
# sqlite> SELECT id, name, role FROM users;            
# 1|fuma|admin
# sqlite> Program interrupted.