import os
import qrcode
import urllib.request
from datetime import datetime
from fpdf import FPDF
from arabic_reshaper import reshape
from bidi.algorithm import get_display

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    if len(hex_color) != 6:
        return 37, 211, 102 # Default WhatsApp green
    try:
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    except ValueError:
        return 37, 211, 102

class KhidmatiPremiumPDF(FPDF):
    def __init__(self, brand_color=(37, 211, 102), logo_path=None):
        super().__init__()
        self.brand_color = brand_color
        self.logo_path = logo_path
        
    def header(self):
        # Top brand stripe
        self.set_fill_color(*self.brand_color)
        self.rect(0, 0, 210, 8, "F")
        
        # Logo or Text
        if self.logo_path and os.path.exists(self.logo_path):
            self.image(self.logo_path, x=10, y=12, w=35)
        else:
            self.set_text_color(*self.brand_color)
            self.set_font("Amiri", "", 24)
            title = get_display(reshape("منصة خدمتي"))
            self.set_xy(10, 15)
            self.cell(40, 15, title, align="L")
            
        # Invoice Header Right Aligned
        self.set_text_color(50, 50, 50)
        self.set_font("Amiri", "", 28)
        invoice_title = get_display(reshape("فاتورة ضريبية"))
        self.set_xy(120, 15)
        self.cell(80, 15, invoice_title, align="R")

    def footer(self):
        self.set_y(-30)
        self.set_draw_color(*self.brand_color)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        
        self.set_y(-25)
        self.set_font("Amiri", "", 10)
        self.set_text_color(120, 120, 120)
        text = get_display(reshape("شكراً لاختياركم خدماتنا. تم إصدار هذه الفاتورة آلياً عبر منصة خدمتي."))
        self.cell(0, 5, text, align="C", ln=True)
        text2 = get_display(reshape("جميع الحقوق محفوظة 2026 ©"))
        self.cell(0, 5, text2, align="C")

def fix_arabic(text):
    if not text:
        return ""
    return get_display(reshape(text))

def generate_premium_pdf(data, invoice_id, font_path, output_dir):
    # Process brand color
    brand_color = hex_to_rgb(data.brand_color) if getattr(data, 'brand_color', None) else (37, 211, 102)
    
    # Process Logo
    logo_path = None
    if getattr(data, 'logo_url', None):
        logo_path = os.path.join(output_dir, f"logo_{invoice_id}.png")
        try:
            req = urllib.request.Request(data.logo_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(logo_path, 'wb') as out_file:
                out_file.write(response.read())
        except Exception as e:
            print(f"Failed to download logo: {e}")
            logo_path = None

    pdf = KhidmatiPremiumPDF(brand_color=brand_color, logo_path=logo_path)
    
    # Load Font
    f = "Helvetica"
    if os.path.exists(font_path):
        pdf.add_font("Amiri", "", font_path, uni=True)
        f = "Amiri"
        
    pdf.add_page()
    pdf.set_font(f, size=12)
    
    # Invoice Meta Info (Number, Date)
    pdf.set_xy(10, 45)
    pdf.set_text_color(100, 100, 100)
    pdf.set_font(f, "", 12)
    pdf.cell(100, 8, f"Invoice No: #{invoice_id}")
    pdf.cell(90, 8, f"Date: {datetime.now().strftime('%d %B, %Y')}", align="R", ln=True)
    
    pdf.set_draw_color(220, 220, 220)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)
    
    # Customer and Provider Info
    pdf.set_font(f, "", 14)
    pdf.set_text_color(*brand_color)
    col_width = 95
    pdf.cell(col_width, 8, fix_arabic("موجهة إلى (العميل)"), align="R")
    pdf.cell(5, 8, "")
    pdf.cell(col_width, 8, fix_arabic("صادرة من (المزود)"), align="R", ln=True)
    
    pdf.set_font(f, "", 12)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(col_width, 6, fix_arabic(data.customer_name), align="R")
    pdf.cell(5, 6, "")
    pdf.cell(col_width, 6, fix_arabic(data.provider_name), align="R", ln=True)
    
    if data.customer_details or getattr(data, 'provider_details', None):
        pdf.set_font(f, "", 10)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(col_width, 6, fix_arabic(data.customer_details or ""), align="R")
        pdf.cell(5, 6, "")
        pdf.cell(col_width, 6, fix_arabic(getattr(data, 'provider_details', "") or ""), align="R", ln=True)

    pdf.ln(15)
    
    # Stylish Table Header
    pdf.set_fill_color(*brand_color)
    pdf.set_text_color(255, 255, 255)
    pdf.set_font(f, "", 12)
    pdf.set_draw_color(255, 255, 255) # invisible borders for header
    
    pdf.cell(100, 12, fix_arabic("وصف الخدمة / المنتج"), fill=True, border=1, align="R")
    pdf.cell(30, 12, fix_arabic("الكمية"), fill=True, border=1, align="C")
    pdf.cell(30, 12, fix_arabic("سعر الوحدة"), fill=True, border=1, align="C")
    pdf.cell(30, 12, fix_arabic("المجموع"), fill=True, border=1, align="C", ln=True)

    # Table Body
    pdf.set_text_color(50, 50, 50)
    pdf.set_font(f, "", 11)
    pdf.set_draw_color(230, 230, 230)
    
    grand_total = 0
    fill = False
    for item in data.items:
        total = item.price * item.quantity
        grand_total += total
        if fill:
            pdf.set_fill_color(248, 248, 248)
        
        pdf.cell(100, 12, fix_arabic(item.description), border="B", align="R", fill=fill)
        pdf.cell(30, 12, str(item.quantity), border="B", align="C", fill=fill)
        pdf.cell(30, 12, f"{item.price:,.2f}", border="B", align="C", fill=fill)
        pdf.cell(30, 12, f"{total:,.2f}", border="B", align="C", fill=fill, ln=True)
        fill = not fill

    pdf.ln(5)
    
    # Totals Section
    pdf.set_x(140)
    pdf.set_font(f, "", 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(30, 10, fix_arabic("المجموع الفرعي"), align="R")
    pdf.set_text_color(50, 50, 50)
    pdf.cell(30, 10, f"{grand_total:,.2f}", align="C", ln=True)
    
    pdf.set_x(140)
    pdf.set_font(f, "", 14)
    pdf.set_text_color(255, 255, 255)
    pdf.set_fill_color(*brand_color)
    pdf.cell(30, 12, fix_arabic("الإجمالي النهائي"), fill=True, align="R")
    pdf.set_font("Helvetica", "B", 12) # Use helvetica for bold latin currency
    pdf.cell(30, 12, f"{grand_total:,.2f} {data.currency}", fill=True, align="C", ln=True)

    # QR Code Generation for validation
    qr_data = f"Invoice:{invoice_id}|Total:{grand_total}{data.currency}"
    qr = qrcode.QRCode(version=1, box_size=8, border=2)
    qr.add_data(qr_data)
    qr.make(fit=True)
    # Give QR code the brand color
    qr_img = qr.make_image(fill_color=brand_color, back_color="white")
    
    qr_path = os.path.join(output_dir, f"qr_{invoice_id}.png")
    qr_img.save(qr_path)
    
    # Place QR Code
    pdf.set_y(pdf.get_y() - 10)
    pdf.image(qr_path, x=10, y=pdf.get_y(), w=35)
    
    pdf.set_xy(48, pdf.get_y() + 10)
    pdf.set_font(f, "", 9)
    pdf.set_text_color(150, 150, 150)
    pdf.cell(50, 5, fix_arabic("امسح الرمز للتحقق من الفاتورة"), align="R")
    
    # Output file
    file_path = os.path.join(output_dir, f"{invoice_id}.pdf")
    pdf.output(file_path)
    
    # Cleanup Temp Images
    if os.path.exists(qr_path):
        os.remove(qr_path)
    if logo_path and os.path.exists(logo_path):
        os.remove(logo_path)
        
    return file_path, grand_total

