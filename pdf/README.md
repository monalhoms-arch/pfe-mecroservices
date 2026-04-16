# PDF API Service 📄

A standalone FastAPI microservice for dynamically generating beautiful, professional PDF invoices and documents. It supports custom styling, automatic font loading (including Arabic "Amiri" font), and provides an easy-to-use HTTP API.

## Features ✨
- **Flexible JSON Payload:** Generate PDFs using any provider and customer data.
- **Arabic Language Support:** Automatically downloads and applies the `Amiri-Regular` font to correctly render Arabic script without issues.
- **RESTful API:** Clean `POST` endpoint to upload the invoice request and instantly receive a download link.

## Installation & Setup 🛠️

1. **Clone the repository:**
   ```bash
   git clone https://github.com/monalhoms-arch/pdf-api.git
   cd pdf-api
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   python main.py
   ```
   *The server will start on `http://127.0.0.1:8002`.*

## Endpoints 🚪

### `POST /api/v1/generate-pdf`

**Request Body (JSON):**
```json
{
  "invoice_title": "Tax Invoice / فاتورة ضريبية",
  "customer_name": "Tech Corp",
  "customer_details": "123 Main St.",
  "provider_name": "Service LLC",
  "provider_details": "Phone: +123456789",
  "currency": "USD",
  "items": [
    {
      "description": "Server Maintenance",
      "price": 250,
      "quantity": 1
    }
  ],
  "notes": "Thank you for your business!"
}
```

**Response:**
```json
{
  "status": "success",
  "invoice_id": "A1B2C3D4",
  "download_url": "http://127.0.0.1:8002/invoices/A1B2C3D4.pdf"
}
```

**Note:** You can view the automatic Swagger documentation at `http://127.0.0.1:8002/docs`.
