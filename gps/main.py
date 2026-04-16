import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="GPS Generation Service", description="A standalone service for location links and tools.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Coordinates(BaseModel):
    latitude: float
    longitude: float

@app.get("/api/v1/maps-url")
async def generate_maps_url(lat: float, lng: float, zoom: Optional[int] = 15):
    """
    توليد روابط الخرائط لمنصات مختلفة بناءً على الإحداثيات
    """
    if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
        raise HTTPException(status_code=400, detail="إحداثيات غير صحيحة")

    return {
        "status": "success",
        "coordinates": {"latitude": lat, "longitude": lng},
        "urls": {
            "google_maps": f"https://maps.google.com/?q={lat},{lng}&z={zoom}",
            "apple_maps": f"https://maps.apple.com/?q={lat},{lng}&z={zoom}",
            "open_street_map": f"https://www.openstreetmap.org/?mlat={lat}&mlon={lng}#map={zoom}/{lat}/{lng}"
        }
    }

@app.post("/api/v1/format-location")
async def format_location(coords: Coordinates):
    """
    تنسيق الإحداثيات للحصول على رابط جوجل ماب كاستجابة مباشرة
    """
    return {
        "url": f"https://maps.google.com/?q={coords.latitude},{coords.longitude}"
    }

if __name__ == "__main__":
    # تشغيل السيرفر على المنفذ 8001
    uvicorn.run(app, host="127.0.0.1", port=8001)
