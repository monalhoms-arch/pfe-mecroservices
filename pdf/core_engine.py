import os
import qrcode
from datetime import datetime
from fpdf import FPDF
from arabic_reshaper import reshape
from bidi.algorithm import get_display

class KhidmatiPDF(FPDF):
    def header(self):
        # Premium Brand Header
        self.set_fill_color(37, 211, 102) # WhatsApp Green
        self.rect(0, 0, 210, 40, "F")
        
        # Logo placeholder text (since we don't have a logo file yet)
        self.set_text_color(255, 255, 255)
        self.set_font("Amiri", "B", 24)
        
        # Reshape Arabic for Header
        title = get_display(reshape("منصة خدمتي - فاتورة إلكترونية"))
        self.set_xy(10, 10)
        self.cell(190, 20, title, align="C")

    def footer(self):
        self.set_y(-25)
        self.set_font("Amiri", "", 10)
        self.set_text_color(150, 150, 150)
        text = get_display(reshape("شكراً لتعاملكم مع منصة خدمتي - جميع الحقوق محفوظة 2026"))
        self.cell(0, 10, text, align="C")

def fix_arabic(text):
    if not text:
        return ""
    return get_display(reshape(text))

def generate_premium_pdf(data, invoice_id, font_path, output_dir):
    pdf = KhidmatiPDF()
    pdf.add_page()
    
    # Load Font
    if os.path.exists(font_path):
        pdf.add_font("Amiri", "", font_path, uni=True)
        pdf.add_font("Amiri", "B", font_path, uni=True) # Using same for bold for now
        f = "Amiri"
    else:
        f = "Helvetica"
    
    pdf.set_font(f, size=12)
    pdf.set_text_color(0, 0, 0)
    
    # Metadata Section
    pdf.set_xy(10, 50)
    pdf.set_font(f, "B", 14)
    pdf.cell(100, 10, f"Invoice: #{invoice_id}")
    pdf.set_font(f, "", 12)
    pdf.cell(90, 10, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}", align="R", ln=True)
    
    pdf.ln(10)
    
    # Customer/Provider Details
    col_width = 95
    pdf.set_fill_color(245, 245, 245)
    pdf.cell(col_width, 10, fix_arabic("تفاصيل الزبون"), fill=True, ln=0, align="R")
    pdf.cell(5, 10, "") # Spacer
    pdf.cell(col_width, 10, fix_arabic("تفاصيل المزود"), fill=True, ln=1, align="R")
    
    pdf.cell(col_width, 8, fix_arabic(data.customer_name), align="R")
    pdf.cell(5, 8, "")
    pdf.cell(col_width, 8, fix_arabic(data.provider_name), align="R", ln=1)
    
    if data.customer_details:
        pdf.cell(col_width, 8, fix_arabic(data.customer_details), align="R")
        pdf.cell(5, 8, "")
        pdf.cell(col_width, 8, fix_arabic(data.provider_details or ""), align="R", ln=1)

    pdf.ln(15)
    
    # Table Header
    pdf.set_fill_color(37, 211, 102)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font(f, "B", 12)
    pdf.cell(100, 10, fix_arabic("الوصف"), fill=True, border=1, align="R")
    pdf.cell(30, 10, fix_arabic("الكمية"), fill=True, border=1, align="C")
    pdf.cell(30, 10, fix_arabic("السعر"), fill=True, border=1, align="C")
    pdf.cell(30, 10, fix_arabic("المجموع"), fill=True, border=1, align="C", ln=True)

    # Table Body
    pdf.set_text_color(0, 0, 0)
    pdf.set_font(f, "", 11)
    grand_total = 0
    for item in data.items:
        total = item.price * item.quantity
        grand_total += total
        pdf.cell(100, 10, fix_arabic(item.description), border=1, align="R")
        pdf.cell(30, 10, str(item.quantity), border=1, align="C")
        pdf.cell(30, 10, f"{item.price:,.0f}", border=1, align="C")
        pdf.cell(30, 10, f"{total:,.0f}", border=1, align="C", ln=True)

    # Total Row
    pdf.set_font(f, "B", 13)
    pdf.set_fill_color(240, 240, 240)
    pdf.cell(160, 12, fix_arabic("الإجمالي النهائي"), border=1, align="R", fill=True)
    pdf.cell(30, 12, f"{grand_total:,.0f} {data.currency}", border=1, align="C", fill=True, ln=True)

    # QR Code Generation
    qr_data = f"Khidmati-Invoice:{invoice_id}|Total:{grand_total}{data.currency}"
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")
    
    qr_path = os.path.join(output_dir, f"qr_{invoice_id}.png")
    qr_img.save(qr_path)
    
    # Place QR Code
    pdf.image(qr_path, x=10, y=pdf.get_y() + 10, w=35)
    
    # Final Output
    file_path = os.path.join(output_dir, f"{invoice_id}.pdf")
    pdf.output(file_path)
    
    # Cleanup QR image temp file
    if os.path.exists(qr_path):
        os.remove(qr_path)
        
    return file_path, grand_total
