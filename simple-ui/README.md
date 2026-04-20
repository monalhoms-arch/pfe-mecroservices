# 📱 Simple UI (Service Portals)

This directory contains the practical frontend testing portals for both Customers and Workers of the **"Khidmati"** platform. Instead of a traditional dashboard, this mini-app functions as a direct testing ground/interface for the underlying Python microservices bridging them to practical use cases.

## 📌 Key Features
- **Customer Booking Engine:** A direct interface hitting the `WhatsApp` API endpoints for booking providers and automatically managing localized WhatsApp routing.
- **Worker Management Arsenal:** 
  - Exposes a dedicated pane for workers to interact directly with the `PDF Service` to mint and issue standard invoices.
  - Grants workers power to dispatch immediate direct WhatsApp notifications via the `Evolution API` backend network.
- **GPS Localization Setup:** Bridges browser-geospatial nodes with the `GPS` microservice to construct and attach accurate coordinate links inside dispatch mechanisms.
- **Sleek Aesthetics:** Built with the project's consistent Glassmorphism UI guidelines (RTL supported context).

## 🚀 How to Run
Powered by **Vite**. Runs on **Port 5174** (to avoid collision with the port 5173 used by `api-dashboard`).
```bash
npm install
npm run dev
```

> **Note:** These toolsets work perfectly dynamically, but rely directly on `localhost:8000`, `8001`, and `8002` being active concurrently.
