# 🛠️ Khidmati Microservices Platform (منصة خدمتي)

Welcome to the **Khidmati** ecosystem. This project is a professional-grade, decoupled microservices architecture designed for a SaaS labor rental management system. It merges a premium React-based dashboard with multiple Python FastAPI services, all powered by a shared MySQL database.

---

## 🏗️ Project Architecture

The system is built on a "Service-Oriented" philosophy, where each core function resides in its own isolated environment:

1.  **[API Dashboard (Frontend)](./api-dashboard)** (Port 5173): A high-end React/Vite interface using **Glassmorphism** aesthetics. It provides a unified view of the marketplace and admin control tools.
2.  **[WhatsApp Service](./whatsapp)** (Port 8000): The central hub for communication. It handles:
    *   **Marketplace logic**: Dynamic worker directory & appointment booking.
    *   **Security**: OTP verification via Evolution API.
    *   **Notifications**: Automated reminders stored in MySQL.
3.  **[PDF Invoice Service](./pdf)** (Port 8002): An automated engine that generates professional PDF documents and **logs financial transactions** directly into the shared database.
4.  **[GPS & Maps Service](./gps)** (Port 8001): A utility for generating map links and tracking mobile coordinates.

---

## 🗄️ Database Integration

Unlike basic prototypes, Khidmati uses a real-time **MySQL** persistence layer:
- **`abc.sql`**: Contains the full schema for `provider`, `appointments`, and `invoices`.
- **Shared Data**: Microservices 8000 and 8002 synchronize data through this database to ensure consistency across the platform.

---

## 🚀 Getting Started

### Prerequisites
*   **MySQL Server**: (e.g., XAMPP or Laragon) with a database named `abc`.
*   **Python 3.10+** & **Node.js**.
*   **Redis**: (Optional, for advanced OTP rate limiting).

### Installation & Setup

#### 1. Database Setup
Import the [abc.sql](./abc.sql) file into your MySQL server to populate the providers and structure.

#### 2. Backend Services
Run each service in a separate terminal:
```bash
# WhatsApp & Marketplace (Port 8000)
cd whatsapp && pip install -r requirements.txt && python main.py

# PDF Engine (Port 8002)
cd pdf && pip install -r requirements.txt && python main.py

# GPS Utility (Port 8001)
cd gps && pip install -r requirements.txt && python main.py
```

#### 3. Frontend Dashboard
```bash
cd api-dashboard
npm install
npm run dev
```

---

## 🎨 Key Features
*   **🌟 Marketplace**: Real-time worker directory fetched from the DB.
*   **📄 PDF Invoicing**: Automatic invoice generation with database archiving.
*   **💬 Dual WhatsApp Redirection**: Simultaneous PDF receipt and provider notification.
*   **📍 Location Tracking**: One-click geolocation sharing for field workers.
*   **💎 Premium UI**: Matte/Glass finish with smooth RTL (Arabic) support.

---

## 📄 Final Notes
This project was developed as a "Gold Master" version for a graduation project (PFE 2026), showcasing the power of Microservices and modern Web technologies.

Created with ❤️ for the Khidmati Platform.
