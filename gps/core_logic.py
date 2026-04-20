from geopy.distance import geodesic
from typing import Dict

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance in kilometers between two points.
    """
    return geodesic((lat1, lon1), (lat2, lon2)).kilometers

def get_map_urls(lat: float, lng: float, label: str = "Location") -> Dict[str, str]:
    """
    Generate deep links for various map providers.
    """
    return {
        "google_maps": f"https://www.google.com/maps/search/?api=1&query={lat},{lng}",
        "waze": f"https://waze.com/ul?ll={lat},{lng}&navigate=yes",
        "apple_maps": f"http://maps.apple.com/?q={lat},{lng}",
        "yandex": f"yandexmaps://maps.yandex.ru/?pt={lng},{lat}&z=12&l=map",
        "osm": f"https://www.openstreetmap.org/?mlat={lat}&mlon={lng}#map=15/{lat}/{lng}"
    }

def format_coordinates(lat: float, lng: float) -> str:
    """
    Returns a human-readable coordinate string.
    """
    ns = "N" if lat >= 0 else "S"
    ew = "E" if lng >= 0 else "W"
    return f"{abs(lat):.4f}° {ns}, {abs(lng):.4f}° {ew}"
