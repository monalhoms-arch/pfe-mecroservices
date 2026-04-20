import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from config import settings
from core_logic import calculate_distance, get_map_urls, format_coordinates

app = FastAPI(
    title=settings.APP_TITLE, 
    description="النظام الأساسي لتحديد المواقع، حساب المسافات، وتوليد روابط الخرائط لمنصة خدمتي."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
async def health_check():
    return {"status": "online", "service": "gps"}

class Coordinates(BaseModel):
    latitude: float
    longitude: float

class DistanceRequest(BaseModel):
    origin: Coordinates
    destination: Coordinates

@app.get("/api/v1/maps-url")
async def generate_maps_url(lat: float, lng: float, label: Optional[str] = "Location"):
    """
    توليد روابط مخصصة لمختلف تطبيقات الخرائط
    """
    if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
        raise HTTPException(status_code=400, detail="إحداثيات غير صحيحة")

    return {
        "status": "success",
        "human_readable": format_coordinates(lat, lng),
        "urls": get_map_urls(lat, lng, label)
    }

@app.post("/api/v1/distance")
async def get_distance(payload: DistanceRequest):
    """
    حساب المسافة الجوية بين نقطتين بالكيلومترات
    """
    try:
        dist = calculate_distance(
            payload.origin.latitude, payload.origin.longitude,
            payload.destination.latitude, payload.destination.longitude
        )
        return {
            "status": "success",
            "distance_km": round(dist, 2),
            "distance_m": round(dist * 1000, 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
