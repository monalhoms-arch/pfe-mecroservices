from sqlalchemy import create_engine, Column, Integer, String, DECIMAL, TIMESTAMP, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class InvoiceDB(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    invoice_code = Column(String(20), unique=True, nullable=False)
    provider_id = Column(Integer, nullable=False)
    customer_name = Column(String(100), nullable=False)
    service_price = Column(DECIMAL(10, 2), nullable=False)
    pdf_path = Column(String(255))
    status = Column(String(20), default="Unpaid") # Paid, Unpaid, Cancelled
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    # Simple migration: Add status column if it doesn't exist
    try:
        with engine.begin() as conn:
            # For Postgres
            if "postgres" in settings.DATABASE_URL:
                conn.execute(text("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Unpaid';"))
            # For SQLite
            elif "sqlite" in settings.DATABASE_URL:
                # SQLite doesn't support IF NOT EXISTS for columns directly in old versions, but we can try-except
                try:
                    conn.execute(text("ALTER TABLE invoices ADD COLUMN status VARCHAR(20) DEFAULT 'Unpaid';"))
                except Exception:
                    pass # Column might already exist
    except Exception as e:
        print(f"Migration error (safe to ignore if column exists): {e}")
