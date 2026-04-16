import os
import uuid
import urllib.request
from datetime import datetime
from typing import List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fpdf import FPDF

app = FastAPI(title="PDF Generation Service", description="A standalone service for generating generic PDF invoices.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("invoices", exist_ok=True)
os.makedirs("fonts", exist_ok=True)
app.mount("/invoices", StaticFiles(directory="invoices"), name="invoices")

FONT_URL = "https://github.com/alif-type/amiri/raw/master/Amiri-Regular.ttf"
FONT_PATH = "fonts/Amiri-Regular.ttf"

# تأكد من تحميل الخط العربي عند التشغيل
if not os.path.exists(FONT_PATH):
    try:
        print("Downloading Amiri Font for Arabic Support...")
        urllib.request.urlretrieve(FONT_URL, FONT_PATH)
        print("Font downloaded successfully.")
    except Exception as e:
        print(f"Failed to download font: {e}")

# ──────── النماذج ────────
class InvoiceItem(BaseModel):
    description: str
    price: float
    quantity: int = 1

class InvoiceRequest(BaseModel):
    invoice_title: str = "INVOICE"
    customer_name: str
    customer_details: Optional[str] = None
    provider_name: str
    provider_details: Optional[str] = None
    items: List[InvoiceItem]
    currency: str = "DZD"
    notes: Optional[str] = None

# ──────── دالة التوليد ────────
def generate_pdf(data: InvoiceRequest, invoice_id: str):
    pdf = FPDF()
    pdf.add_page()
    
    if os.path.exists(FONT_PATH):
        pdf.add_font("Amiri", "", FONT_PATH, uni=True)
        f = "Amiri"
    else:
        f = "Helvetica"
        
    # رأس الفاتورة
    pdf.set_fill_color(37, 211, 102) # اللون الأخضر
    pdf.rect(0, 0, 210, 35, "F")
    pdf.set_font(f, size=20)
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(10, 10)
    pdf.cell(190, 15, data.invoice_title, align="C")

    # بيانات الفاتورة الأساسية
    pdf.set_text_color(0, 0, 0)
    pdf.set_xy(10, 45)
    pdf.set_font(f, size=12)
    pdf.cell(190, 10, f"Invoice ID: {invoice_id}", ln=True)
    pdf.cell(190, 10, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}", ln=True)
    pdf.ln(5)

    pdf.set_draw_color(200, 200, 200)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)

    # بيانات الموفر والزبون
    pdf.set_font(f, size=11)
    pdf.set_fill_color(245, 245, 245)
    start_y = pdf.get_y()
    pdf.rect(10, start_y, 190, 45, "F")
    
    pdf.set_xy(15, start_y + 5)
    pdf.cell(90, 8, f"From: {data.provider_name}")
    pdf.cell(90, 8, f"To: {data.customer_name}", ln=True)
    
    pdf.set_xy(15, pdf.get_y())
    if data.provider_details:
        pdf.cell(90, 8, f"Details: {data.provider_details}")
    else:
        pdf.cell(90, 8, "")
        
    if data.customer_details:
        pdf.cell(90, 8, f"Details: {data.customer_details}", ln=True)
    else:
        pdf.cell(90, 8, "", ln=True)

    pdf.ln(15)

    # جدول المشتريات / الخدمات
    pdf.set_fill_color(37, 211, 102)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(90, 10, "Description", fill=True, border=1)
    pdf.cell(30, 10, "Quantity", fill=True, border=1, align="C")
    pdf.cell(40, 10, "Unit Price", fill=True, border=1, align="C")
    pdf.cell(30, 10, "Total", fill=True, border=1, align="C", ln=True)

    pdf.set_text_color(0, 0, 0)
    grand_total = 0

    for item in data.items:
        total = item.price * item.quantity
        grand_total += total
        pdf.cell(90, 10, item.description, border=1)
        pdf.cell(30, 10, str(item.quantity), border=1, align="C")
        pdf.cell(40, 10, f"{item.price:,.2f}", border=1, align="C")
        pdf.cell(30, 10, f"{total:,.2f}", border=1, align="C", ln=True)

    # المجموع الكلي
    pdf.set_fill_color(230, 255, 230)
    pdf.set_font(f, size=12)
    pdf.cell(160, 12, "GRAND TOTAL", border=1, fill=True, align="R")
    pdf.cell(30,  12, f"{grand_total:,.2f} {data.currency}", border=1, fill=True, align="C", ln=True)

    if data.notes:
        pdf.ln(10)
        pdf.set_font(f, size=10)
        pdf.multi_cell(190, 8, f"Notes: {data.notes}")

    pdf.ln(10)
    pdf.set_font(f, size=9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(190, 8, "Generated Automatically | Thank you for your business", align="C")

    # حفظ الملف
    file_path = f"invoices/{invoice_id}.pdf"
    pdf.output(file_path)
    return file_path

# ──────── الـ API ────────
@app.post("/api/v1/generate-pdf")
async def create_pdf_invoice(request: InvoiceRequest):
    try:
        invoice_id = str(uuid.uuid4())[:8].upper()
        generate_pdf(request, invoice_id)
        
        # الرابط المحلي للوصول إلى الفاتورة
        # يمكن تغييره بناءً على الدومين في الإنتاج
        download_url = f"http://127.0.0.1:8002/invoices/{invoice_id}.pdf"
        
        return {
            "status": "success",
            "invoice_id": invoice_id,
            "download_url": download_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # تشغيل السيرفر على المنفذ 8002
    uvicorn.run(app, host="127.0.0.1", port=8002)
