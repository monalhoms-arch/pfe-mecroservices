# GPS API Service 📍

A lightweight, standalone FastAPI microservice for processing map coordinates to generate dynamic mapping URLs and location formatting. It easily integrates into other platforms.

## Features ✨
- **Multi-Map Support:** Generates URLs for Google Maps, Apple Maps, and OpenStreetMap.
- **Location Formatting:** Takes a simple `latitude` and `longitude` payload to craft a shareable link.
- **Lightweight:** Minimal dependencies relying primarily on FastAPI and Pydantic.

## Installation & Setup 🛠️

1. **Clone the repository:**
   ```bash
   git clone https://github.com/monalhoms-arch/gps-api.git
   cd gps-api
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**
   ```bash
   python main.py
   ```
   *The server will start on `http://127.0.0.1:8001`.*

## Endpoints 🚪

### 1. `GET /api/v1/maps-url`
Retrieves direct URLs for Apple Maps, Google Maps, and Open Street Map.

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude
- `zoom`: (Optional) Default is 15.

**Example Request:**
`GET /api/v1/maps-url?lat=36.7538&lng=3.0588`

### 2. `POST /api/v1/format-location`
Returns a direct Google Maps URL using JSON coordinates.

**Request Body (JSON):**
```json
{
  "latitude": 36.7538,
  "longitude": 3.0588
}
```

**Response:**
```json
{
  "url": "https://maps.google.com/?q=36.7538,3.0588"
}
```

**Note:** You can view the automatic Swagger documentation at `http://127.0.0.1:8001/docs`.
