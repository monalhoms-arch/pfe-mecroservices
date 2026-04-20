import os
import uuid
import urllib.request
from typing import List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from config import settings
from database import get_db, init_db, InvoiceDB
from core_engine import generate_premium_pdf

# Initialize Database
init_db()

app = FastAPI(
    title=settings.APP_TITLE, 
    description="خدمة متطورة لتوليد فواتير الـ PDF بنظام 'خدمتي' مع دعم كامل للغة العربية ورموز QR."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
async def health_check():
    return {"status": "online", "service": "pdf"}

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
    provider_id: int = 1
    customer_name: str
    customer_details: Optional[str] = None
    provider_name: str
    provider_details: Optional[str] = None
    items: List[InvoiceItem]
    currency: str = "DZD"
    notes: Optional[str] = None

@app.post("/api/v1/generate-pdf")
async def create_pdf_invoice(request: Request, payload: InvoiceRequest, db=Depends(get_db)):
    try:
        invoice_id = str(uuid.uuid4())[:8].upper()
        
        # Generate using Core Engine
        file_path, total_price = generate_premium_pdf(
            data=payload,
            invoice_id=invoice_id,
            font_path=FONT_PATH,
            output_dir=INVOICES_DIR
        )
        
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
            "download_url": download_url,
            "total_price": total_price
        }
    except Exception as e:
        if db: db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/files/{invoice_id}", name="download_invoice")
async def download_invoice(invoice_id: str):
    file_path = os.path.join(INVOICES_DIR, f"{invoice_id}.pdf")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Invoice not found")
    return FileResponse(file_path, media_type="application/pdf")

if __name__ == "__main__":
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
