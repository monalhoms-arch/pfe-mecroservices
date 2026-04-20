# 🛠️ Khidmati Platform Version 1.0 (Gold Master)

Welcome to the **Khidmati Ecosystem**. This project represents a professional-level, decoupled Microservices architecture tailored for a SaaS Labor management platform. It combines high-end React frontends with powerful Python FastAPI backend utilities, unified by a persistent **PostgreSQL** data layer.

---

## 🏛️ System Architecture

The heart of the project lives in its independent but interconnected services:

### 1. 🟢 WhatsApp Core Service (Port `8000`)
Located in `./whatsapp/`. This is the central hub connecting all nodes.
- **Role**: Manages providers and handles all system notifications.
- **Marketplace API**: Controls the `provider` and `appointments` tables.
- **Messaging**: Connected to the Evolution API to send real-time alerts.
- **Security**: Handles the OTP lifecycle for user logins.

### 2. 📍 GPS Locomotion Service (Port `8001`)
Located in `./gps/`.
- **Role**: Geodesic calculator and mapping engine.
- Calculates precise aerial distances between service points using `geopy`.
- Generates universal provider mapping links (Google Maps, Waze, Apple, OSM).

### 3. 📄 Premium PDF Engine (Port `8002`)
Located in `./pdf/`.
- **Role**: Financial and documentation hub (`invoices` table).
- Automatically formats and generates premium invoices leveraging **RTL Arabic Reshaping**.
- Injects dynamic QR codes for instant physical-to-digital invoice validation.

---

## 💻 Frontend Applications

### 1. 🎛️ API Dashboard (Admin Space)
Located in `./api-dashboard/` (Port `5173`).
- A highly polished React interface allowing platform administrators to monitor real-time system health, view OTP statuses, observe backend data pulses, and manage worker queues.
- Designed with premium **Glassmorphism** styling.

### 2. 📱 Simple UI (End-User App)
Located in `./simple-ui/` (Port usually `5174` or `5173` depending on spin-up).
- **Customer Portal**: Direct marketplace booking interacting with the WhatsApp service for automated provider dispatch, natively supporting the GPS plugin for location sharing.
- **Worker Portal**: The "Toolbelt" for providers. Allows field workers to instantly generate PDF invoices (via Port 8002) and send customized direct WhatsApp alerts (via Port 8000).

---

## 🗄️ Database
All microservices connect to a single unified **PostgreSQL** database ensuring no data fragmentation.
- The initialization file `database_init.sql` serves as the blueprint for the `accounts`, `provider`, `appointments`, and `invoices` architecture.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL Server Instance (Database: `whatsapp_data`)
- Redis (For OTP caching)

### Running the Backends
Open 3 separate terminal tabs and launch each independent service:
```bash
# 1. WhatsApp Service
cd whatsapp
pip install -r requirements.txt
python main.py

# 2. GPS Service
cd gps
pip install -r requirements.txt
python main.py

# 3. PDF Service
cd pdf
pip install -r requirements.txt
python main.py
```

### Running the Frontends
```bash
# Admin Dashboard
cd api-dashboard
npm install
npm run dev

# Customer/Worker App
cd simple-ui
npm install
npm run dev
```

---
*Developed as a Gold Master version for a Graduation Project (PFE 2026).*
