import os
import uuid
import urllib.request
from datetime import datetime
from typing import List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fpdf import FPDF

# Database Integration (MySQL for abc.sql)
from sqlalchemy import create_engine, Column, Integer, String, DECIMAL, TIMESTAMP, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root@127.0.0.1:3306/abc"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
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
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'))

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PDF Generation Service", description="A standalone service for generating generic PDF invoices.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INVOICES_DIR = os.path.join(BASE_DIR, "invoices")
FONTS_DIR = os.path.join(BASE_DIR, "fonts")
FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/amiri/Amiri-Regular.ttf"
FONT_PATH = os.path.join(FONTS_DIR, "Amiri-Regular.ttf")

os.makedirs(INVOICES_DIR, exist_ok=True)
os.makedirs(FONTS_DIR, exist_ok=True)
app.mount("/invoices", StaticFiles(directory=INVOICES_DIR), name="invoices")

# Ensure fonts are loaded
if not os.path.exists(FONT_PATH):
    try:
        urllib.request.urlretrieve(FONT_URL, FONT_PATH)
    except Exception as e:
        print(f"Font download failed: {e}")

# Models
class InvoiceItem(BaseModel):
    description: str
    price: float
    quantity: int = 1

class InvoiceRequest(BaseModel):
    invoice_title: str = "INVOICE"
    provider_id: int = 1 # Added provider_id for database tracking
    customer_name: str
    customer_details: Optional[str] = None
    provider_name: str
    provider_details: Optional[str] = None
    items: List[InvoiceItem]
    currency: str = "DZD"
    notes: Optional[str] = None

def generate_pdf(data: InvoiceRequest, invoice_id: str):
    pdf = FPDF()
    pdf.add_page()
    if os.path.exists(FONT_PATH):
        pdf.add_font("Amiri", "", FONT_PATH, uni=True)
        f = "Amiri"
    else:
        f = "Helvetica"
    pdf.set_font(f, size=20)
    
    # Header
    pdf.set_fill_color(37, 211, 102)
    pdf.rect(0, 0, 210, 35, "F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(10, 10)
    pdf.cell(190, 15, data.invoice_title, align="C")

    # Metadata
    pdf.set_text_color(0, 0, 0)
    pdf.set_xy(10, 45)
    pdf.set_font(f, size=12)
    pdf.cell(190, 10, f"Invoice ID: {invoice_id}", ln=True)
    pdf.cell(190, 10, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}", ln=True)
    
    # Items
    pdf.ln(20)
    pdf.set_fill_color(37, 211, 102)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(100, 10, "Description", fill=True, border=1)
    pdf.cell(30, 10, "Qty", fill=True, border=1, align="C")
    pdf.cell(30, 10, "Price", fill=True, border=1, align="C")
    pdf.cell(30, 10, "Total", fill=True, border=1, align="C", ln=True)

    pdf.set_text_color(0, 0, 0)
    pdf.set_font(f, size=10)
    grand_total = 0
    for item in data.items:
        total = item.price * item.quantity
        grand_total += total
        pdf.cell(100, 10, item.description, border=1)
        pdf.cell(30, 10, str(item.quantity), border=1, align="C")
        pdf.cell(30, 10, f"{item.price:,.0f}", border=1, align="C")
        pdf.cell(30, 10, f"{total:,.0f}", border=1, align="C", ln=True)

    pdf.cell(160, 12, "GRAND TOTAL", border=1, align="R")
    pdf.cell(30, 12, f"{grand_total:,.0f} {data.currency}", border=1, align="C", ln=True)

    file_path = os.path.join(INVOICES_DIR, f"{invoice_id}.pdf")
    pdf.output(file_path)
    return file_path, grand_total

@app.post("/api/v1/generate-pdf")
async def create_pdf_invoice(request: Request, payload: InvoiceRequest):
    db = SessionLocal()
    try:
        invoice_id = str(uuid.uuid4())[:8].upper()
        file_path, total_price = generate_pdf(payload, invoice_id)
        
        # Log to Database
        new_invoice = InvoiceDB(
            invoice_code=invoice_id,
            provider_id=payload.provider_id,
            customer_name=payload.customer_name,
            service_price=total_price,
            pdf_path=file_path
        )
        db.add(new_invoice)
        db.commit()

        download_url = str(request.url_for("download_invoice", invoice_id=invoice_id))
        return {
            "status": "success",
            "invoice_id": invoice_id,
            "download_url": download_url
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/api/v1/files/{invoice_id}", name="download_invoice")
async def download_invoice(invoice_id: str):
    file_path = os.path.join(INVOICES_DIR, f"{invoice_id}.pdf")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Invoice not found")
    return FileResponse(file_path, media_type="application/pdf")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002)
