# 🛠️ API Dashboard

This directory contains the Administrative Dashboard Space. It is a dedicated web application for system administrators designed to monitor data flows, system health, and infrastructure capabilities.

## 📌 Key Features
- **Centralized System Health Monitoring:** Actively pings and tracks the real-time node health of the ecosystem's servers (`WhatsApp: 8000`, `GPS: 8001`, `PDF: 8002`).
- **Activity & Workflow Tracking:** Provides a live data stream of dispatched WhatsApp OTPs, created invoices, and ecosystem logs.
- **Ultra-Modern UI:** Built fully on React.js using premium **Glassmorphism** aesthetic patterns designed to emulate high-end SaaS applications.

## 🚀 How to Run
Powered by the ultra-fast **Vite** bundler. Runs default on **Port 5173**.
```bash
npm install
npm run dev
```
> *Note: For the dashboard to display green metrics, ensure the corresponding Python microservices (whatsapp, pdf, gps) are running in parallel on your local environment.*
