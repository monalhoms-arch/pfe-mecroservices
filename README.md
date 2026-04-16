# 🛠️ Khidmati Microservices Platform (منصة خدمتي)

Welcome to the **Khidmati** monorepo. This project is a modern, decoupled microservices architecture designed for a SaaS labor rental management system. It features a stunning React-based dashboard interacting with multiple Python FastAPI services.

---

## 🏗️ Project Architecture

The system is divided into four main components:

1.  **[API Dashboard](./api-dashboard)** (Port 5173): A premium React/Vite frontend using modern aesthetics (Glassmorphism) to manage all services.
2.  **[WhatsApp Service](./whatsapp)** (Port 8000): Handles Security, OTP verification, and asynchronous notifications via Evolution API.
3.  **[GPS & Maps Service](./gps)** (Port 8001): Generates cross-platform map links and provides interactive coordinates formatting.
4.  **[PDF Invoice Service](./pdf)** (Port 8002): Generates professional PDF invoices for clients and providers.

---

## 🚀 Getting Started

### Prerequisites
*   **Python 3.10+** (for backend services)
*   **Node.js & npm** (for the dashboard)
*   **Redis** (required by the WhatsApp service for OTP rate limiting)
*   **Evolution API** (configured instance for real WhatsApp messaging)

### Installation & Execution

#### 1. WhatsApp Service (Security & OTP)
```bash
cd whatsapp
pip install -r requirements.txt
python main.py
```

#### 2. GPS & Maps Service
```bash
cd gps
pip install -r requirements.txt
python main.py
```

#### 3. PDF Invoice Service
```bash
cd pdf
pip install -r requirements.txt
python main.py
```

#### 4. API Dashboard (Frontend)
```bash
cd api-dashboard
npm install
npm run dev
```

---

## 🔐 Configuration
Ensure you have the following environment variables or configuration files set:
*   **WhatsApp Service**: Check `whatsapp/config.py` for Evolution API URLs and keys.
*   **Dashboard**: Defaults connect to `localhost` on ports 8000, 8001, and 8002.

---

## 🎨 Design Philosophy
The platform prioritizes **Visual Excellence**:
*   **Modern UI**: Built with Vanilla CSS for maximum performance and customizability.
*   **Glassmorphism**: Elegant transparent cards and vibrant gradients.
*   **Responsive**: Fully functional on desktop and mobile browsers.

---

## 📄 License
Created for the PFE project. All rights reserved.
