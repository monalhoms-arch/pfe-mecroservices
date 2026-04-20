# 📍 GPS & Mapping Microservice

This directory contains the geospatial and mapping microservice, providing background calculation power and localization utilities for the worker and customer portals.

## 📌 Key Features
- **Map URL Generation:** Converts raw geographical coordinates (`latitude/longitude`) into direct routing links for universal platforms like `Google Maps`, `Apple Maps`, `Waze`, and `OpenStreetMap`.
- **Geodesic Distance Calculation:** Calculates exact aerial geographic distances based on the Earth's radius using the `geopy` library to assist in worker fare estimation.
- **Dynamic Port Routing:** Exposes standard `/api/v1/health` nodes to interact flawlessly with the central dashboard monitoring systems.

## 🚀 How to Run
Runs on **Port 8001**.
```bash
pip install -r requirements.txt
python main.py
```
> Swagger Interactive Docs: `http://localhost:8001/docs`
