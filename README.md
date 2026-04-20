# 🛠️ Khidmati Microservices Platform (منصة خدمتي)

Welcome to the **Khidmati** ecosystem. This project is a professional-grade, decoupled microservices architecture designed for a SaaS labor rental management system. It merges a premium React-based dashboard with multiple Python FastAPI services, all powered by a high-performance **PostgreSQL** database.

---

## 🏗️ Project Architecture

The system is built on a "Service-Oriented" philosophy, where each core function resides in its own isolated environment:

1.  **[API Dashboard (Frontend)](./api-dashboard)** (Port 5173): A high-end React/Vite interface using **Glassmorphism** aesthetics. It provides a unified view of the marketplace and admin control tools.
2.  **[WhatsApp Service](./whatsapp)** (Port 8000): The central hub for communication. It handles:
    *   **Marketplace logic**: Dynamic worker directory & appointment booking.
    *   **Security**: OTP verification via Evolution API.
    *   **Notifications**: Automated reminders stored in PostgreSQL.
3.  **[PDF Invoice Service](./pdf)** (Port 8002): An automated engine that generates professional PDF documents and **logs financial transactions** directly into the shared database.
4.  **[GPS & Maps Service](./gps)** (Port 8001): A utility for generating map links and tracking mobile coordinates.

---

## 🗄️ Database Integration

Khidmati uses a robust **PostgreSQL** persistence layer for real-time data handling:
- **Automatic Migration**: Microservices are configured to automatically create the necessary schema on startup.
- **Shared Data**: Microservices 8000 and 8002 synchronize data through a shared PostgreSQL instance to ensure consistency across the platform.
- **Environment Driven**: All database credentials are managed via secure `.env` files.

---

## 🚀 Getting Started

### Prerequisites
*   **PostgreSQL 15+**: Ensure you have a running instance and a database named `whatsapp_data`.
*   **Python 3.10+** & **Node.js**.
*   **Redis**: Used for high-performance OTP management and rate limiting.

### Installation & Setup

#### 1. Configuration
Copy the `.env.example` files to `.env` in each service directory and update your credentials:
- `whatsapp/.env`
- `pdf/.env`

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
