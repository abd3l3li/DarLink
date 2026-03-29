# Listings (Stays) — Expected Endpoints

This doc describes endpoints needed by these UI pages/components:

- Slots listing page (`/slots`)
- Listing details page (`/slot-show/:slotId`)
- Create listing page (`/create-post`)
- My listings page (`/my-listings`)

---

## Frontend stay shape (mock-driven)

The UI currently renders these fields:

```json
{
  "id": "stay-1",
  "city": "Rabat",
  "type": "Private",
  "avSlots": 2,
  "price": 800,
  "photos": ["https://..."],
  "details": "...",
  "included": ["Wi-Fi included"],
  "expectations": ["Quiet at night"],
  "owner": {
    "id": "owner-1",
    "name": "Mohamed Sonbol",
    "image": "https://..."
  },
  "admin": false
}
```

For a production API, prefer:

- numeric `id`
- `photos` as array of URLs
- `owner` object derived from the authenticated host user

---

## List stays

### GET `/api/stays` (public)

Supports browsing and search filter UI.

**Query params (currently supported by backend)**
- `city` (string)
- `maxPrice` (number)

Examples:
- `GET /api/stays`
- `GET /api/stays?city=Rabat`
- `GET /api/stays?maxPrice=2000`

**Response `200`** (backend current shape)
```json
[
  {
    "id": 1,
    "name": "Cozy Room",
    "description": "Near city center",
    "city": "Casablanca",
    "address": "12 Rue Hassan II",
    "roomType": "Private",
    "pricePerNight": 1500.0,
    "photoUrl": "https://example.com/photo.jpg",
    "photos": ["https://example.com/photo.jpg"],
    "included": ["Wi-Fi"],
    "expectations": ["Quiet at night"],
    "avSlots": 2,
    "hostId": 3,
    "hostUsername": "host_user",
    "hostAvatarUrl": "https://example.com/avatar.jpg",
    "owner": { "id": 3, "name": "host_user", "image": "https://example.com/avatar.jpg" },
    "createdAt": "2026-03-20T10:00:00"
  }
]
```

**Recommended frontend mapping (backend → UI)**

| UI field | Backend field | Notes |
|---|---|---|
| `id` | `id` | number in backend |
| `city` | `city` | |
| `type` | `roomType` | frontend can map `roomType -> type` |
| `avSlots` | `avSlots` | returned as `avSlots` in JSON |
| `price` | `pricePerNight` | |
| `photos[]` | `photos` (fallback `photoUrl`) | |
| `details` | `description` | |
| `owner` | `owner` | includes `id`, `name`, `image` |

Backend already includes the UI fields above; the frontend only needs minor key normalization (`roomType -> type`, `pricePerNight -> price`, `description -> details`).

---

## Pagination

### GET `/api/stays/page?page=0` (public)

Backend currently returns a Spring Page-like payload.

**Response `200`**
```json
{
  "content": ["...stay objects..."],
  "totalPages": 5,
  "totalElements": 43,
  "number": 0,
  "size": 9,
  "first": true,
  "last": false
}
```

---

## Get one stay

### GET `/api/stays/{id}` (public)

**Response `200`**: stay object

**Errors**
- `404` not found

---

## Create stay

### POST `/api/stays/create` (protected)

**Request (backend current shape)**
```json
{
  "name": "Cozy Private Room",
  "description": "Near tram station",
  "city": "Casablanca",
  "address": "12 Rue Hassan II",
  "pricePerNight": 1500,
  "photoUrl": "https://example.com/stay.jpg"
}
```

**Response `200`**: created stay

### Expected request from current CreatePost UI (recommended)

This matches what your frontend form collects in `createPost.jsx`:

```json
{
  "city": "Rabat",
  "roomType": "Private",
  "pricePerNight": 800,
  "availableSlots": 2,
  "photos": ["https://..."],
  "included": ["Wi-Fi included"],
  "expectations": ["Quiet at night"],
  "description": "Room details ..."
}
```

> If you keep the backend as-is for now (single `photoUrl`), the frontend can send `photoUrl = photos[0]`.

---

## Update stay

### PUT `/api/stays/{id}` (protected; host only)

**Request**: same as create.

**Response `200`**: updated stay

**Errors**
- `403` not the host

---

## Delete stay

### DELETE `/api/stays/{id}` (protected; host only)

**Response `204`** no body

---

## My listings

### Expected: GET `/api/stays/mine` (protected)

Returns stays where the logged-in user is the host.

**Response `200`**
```json
[
  {
    "id": 12,
    "city": "Rabat",
    "pricePerNight": 800,
    "hostId": 1
  }
]
```

> Backend currently does not document this endpoint; the UI mock uses `admin: true` to represent “my listing”. This endpoint is recommended for real integration.

---

## Photos (optional but recommended)

If you want to support `photos` upload from the frontend (data URLs / file picker), consider:

### POST `/api/uploads/photos` (protected)

`multipart/form-data` with one or more files.

**Response `200`**
```json
{ "urls": ["https://cdn.../photo1.jpg", "https://cdn.../photo2.jpg"] }
```
