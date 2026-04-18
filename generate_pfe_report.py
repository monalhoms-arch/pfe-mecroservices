import os
from fpdf import FPDF
from datetime import datetime

# Setup directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR = os.path.join(BASE_DIR, "fonts")
FONT_PATH = os.path.join(FONTS_DIR, "Amiri-Regular.ttf")
OUTPUT_PATH = os.path.join(BASE_DIR, "PFE_Project_Report.pdf")

class PFEReport(FPDF):
    def header(self):
        # Header background
        self.set_fill_color(37, 211, 102) # WhatsApp Green
        self.rect(0, 0, 210, 40, "F")
        self.set_text_color(255, 255, 255)
        
        if os.path.exists(FONT_PATH):
            self.add_font("Amiri", "", FONT_PATH, uni=True)
            self.set_font("Amiri", size=24)
        else:
            self.set_font("Helvetica", style="B", size=24)
            
        self.set_xy(10, 10)
        self.cell(190, 20, "مشروع منصة خدمتي - تقرير المناقشة النهائي", align="C")
        self.ln(25)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"Page {self.page_no()} | Generated on {datetime.now().strftime('%Y-%m-%d')}", align="C")

def generate_final_pdf():
    pdf = PFEReport()
    pdf.add_page()
    
    if os.path.exists(FONT_PATH):
        f = "Amiri"
    else:
        f = "Arial"
        
    pdf.set_text_color(0, 0, 0)
    
    # Section 1: Intro
    pdf.set_font(f, size=16)
    pdf.cell(190, 10, "1. مقدمة حول المشروع (Introduction)", ln=True)
    pdf.set_font(f, size=12)
    pdf.multi_cell(190, 8, "منصة خدمتي هي نظام متكامل يعتمد على الخدمات المصغرة لتنظيم عمليات تأجير العمال والتواصل الآمن والمؤتمت عبر الواتساب. تم تصميم النظام ليدعم الشفافية، السرعة، والأمن في معالجة البيانات.")
    pdf.ln(5)

    # Section 2: Architecture
    pdf.set_font(f, size=16)
    pdf.cell(190, 10, "2. الهندسة البرمجية (System Architecture)", ln=True)
    pdf.set_font(f, size=12)
    pdf.multi_cell(190, 8, "- Microservices: FastAPI (WhatsApp, PDF, GPS).\n- Database: Centralized MySQL (abc_database).\n- Communication: Evolution API Integration for headless WhatsApp operations.")
    pdf.ln(5)

    # Section 3: Features
    pdf.set_font(f, size=16)
    pdf.cell(190, 10, "3. الميزات التقنية (Key Features)", ln=True)
    pdf.set_font(f, size=12)
    pdf.multi_cell(190, 8, "- Automated Messaging: Instant background notifications for bookings.\n- PDF Generation: Automated invoices with direct WhatsApp link delivery.\n- CRUD Management: Full administrative control over workers and accounts.\n- Security: X-API-KEY Auth for service protection.")
    pdf.ln(5)

    # Section 4: Security
    pdf.set_font(f, size=16)
    pdf.cell(190, 10, "4. الأمان (System Security)", ln=True)
    pdf.set_font(f, size=12)
    pdf.multi_cell(190, 8, "تم تنفيذ طبقة حماية برمجية تمنع الوصول غير المصرح به للميكروسيرفس، مما يضمن أن لوحة التحكم الخاصة بالأدمن هي الوحيدة القادرة على إصدار الأوامر الحساسة.")
    pdf.ln(10)

    # Closing
    pdf.set_fill_color(240, 240, 240)
    pdf.set_font(f, size=14)
    pdf.multi_cell(190, 10, "تم إعداد هذا التقرير دعماً لمناقشة مشروع التخرج برمجياً وبنيوياً.", border=1, align="C", fill=True)

    pdf.output(OUTPUT_PATH)
    print(f"Report generated successfully at: {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_final_pdf()
