# Search Filter API README

This file documents only the stay search/filter behavior for frontend button-based filters.

- Endpoint: `GET /api/stays`
- Base URL (local): `http://localhost:8081`
- Auth: not required

---

## 1) Backend-supported query params (current code)

Recommended (UI filters):

- `location` as string (matches `Stay.city`, case-insensitive)
- `type` as string (matches `Stay.roomType`, case-insensitive; use `Both` to disable)
- `price` as string enum: `0 - 1000 DH` | `1000 - 2000 DH` | `2000+ DH`

Legacy (still supported):

- `city` as string
- `maxPrice` as number

Examples:
- `GET /api/stays?location=Casablanca&type=Private&price=0%20-%201000%20DH`
- `GET /api/stays?location=Rabat&price=2000%2B%20DH`
- `GET /api/stays?city=Casablanca&maxPrice=1000`

> Current backend logic in `StayController#getStays`:
> - If `city` or `maxPrice` is present, it uses the legacy branch (and **ignores** `location/type/price`).
> - Otherwise, it uses the UI filter branch and combines `location/type/price`.

---

## 2) Mapping from frontend button filters

Frontend filters:

```js
const filterOptions = [
  {
    name: "location",
    options: [
      "Casablanca", "Rabat", "Marrakech", "Fes", "Tanger",
      "Agadir", "Oujda", "Kenitra", "Ben Guerir"
    ]
  },
  {
    name: "type",
    options: ["Private Room", "Shared Room", "Both"]
  },
  {
    name: "price",
    options: ["0 - 1000 DH", "1000 - 2000 DH", "2000+ DH"]
  }
];
```

### location -> `city`
Send selected location as `location`.

Example:
- Selected `Rabat` -> `GET /api/stays?location=Rabat`

### price -> `maxPrice`
Send price as the `price` label string (backend parses it into min/max bounds).

- `0 - 1000 DH` -> `GET /api/stays?price=0%20-%201000%20DH`
- `1000 - 2000 DH` -> `GET /api/stays?price=1000%20-%202000%20DH`
- `2000+ DH` -> `GET /api/stays?price=2000%2B%20DH`

### type
Send type as `type` (matches `Stay.roomType`). Use `Both` to disable the filter.

---

## 3) Postman-ready requests

### Get by location (example)
```http
GET http://localhost:8081/api/stays?location=Casablanca
```

### Get by max price (example)
```http
GET http://localhost:8081/api/stays?city=Casablanca&maxPrice=2000
```

### Get all stays (no filters)
```http
GET http://localhost:8081/api/stays
```

---

## 4) Typical response shape

```json
[
  {
    "id": 1,
    "name": "Cozy Room",
    "description": "Near city center",
    "city": "Casablanca",
    "address": "12 Rue Hassan II",
    "pricePerNight": 1500.0,
    "photoUrl": "https://example.com/photo.jpg",
    "hostId": 3,
    "hostUsername": "host_user",
    "createdAt": "2026-03-20T10:00:00"
  }
]
```

---

## 5) Quick frontend integration rules

1. Build query params from selected buttons.
2. Send only supported backend params: `city`, `maxPrice`.
2b. Prefer UI params: `location`, `type`, `price`.
3. Don’t mix legacy (`city/maxPrice`) with UI (`location/type/price`) in the same request.

