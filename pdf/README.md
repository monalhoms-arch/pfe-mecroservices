# 📄 PDF Engine Microservice

This directory contains the dynamic PDF generation microservice. It is responsible for transforming raw appointment/service data into highly professional, printable, and digital invoice documents.

## 📌 Key Features
- **Arabic Language (RTL) Support:** Perfectly reshapes and aligns Arabic characters using `arabic-reshaper` and `python-bidi` for flawless text rendering.
- **QR Code Cryptography:** Injects dynamic and scannable QR codes onto the invoices for instant physical-to-digital validation tracking.
- **Financial Archiving:** Securely connects to the centralized PostgreSQL node to log financial transactions concurrently.
- **Instant Digital Delivery:** Exposes an endpoint to auto-download constructed PDF files instantly.

## 🚀 How to Run
Runs on **Port 8002**.
```bash
pip install -r requirements.txt
python main.py
```
> Generated invoices are cached and stored inside the auto-created `invoices/` directory.
> Swagger Interactive Docs: `http://localhost:8002/docs`
