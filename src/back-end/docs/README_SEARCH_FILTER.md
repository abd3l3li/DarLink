# Search Filter API README

This file documents only the stay search/filter behavior for frontend button-based filters.

- Endpoint: `GET /api/stays`
- Base URL (local): `http://localhost:8081`
- Auth: not required

---

## 1) Backend-supported query params (current code)

- `city` as string
- `maxPrice` as number

Examples:
- `GET /api/stays?city=Casablanca`
- `GET /api/stays?maxPrice=1000`

> Current backend logic in `StayController#getStays`:
> - If `city` exists, returns city results.
> - Else if `maxPrice` exists, returns max-price results.
> - Else returns all stays.
>
> So if both are sent, `city` takes priority and `maxPrice` is ignored.

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
Send selected location as `city` directly.

Example:
- Selected `Rabat` -> `GET /api/stays?city=Rabat`

### price -> `maxPrice`
Convert price label to numeric `maxPrice`:

- `0 - 1000 DH` -> `maxPrice=1000`
- `1000 - 2000 DH` -> `maxPrice=2000`
- `2000+ DH` -> no strict backend support for min-only filter in current API

Recommended current behavior for `2000+ DH`:
- Option A: do not send price filter and show all stays.
- Option B: extend backend to support `minPrice` (recommended for production).

### type
Current `Stay` model has no `type` field, so backend cannot filter by room type yet.

Recommended current behavior:
- Ignore `type` when calling API, or handle type in frontend only if you have local metadata.

Recommended production behavior:
- Add `roomType` column in `Stay` + filter param (`type`), then query by it in DB.

---

## 3) Postman-ready requests

### Get by location (example)
```http
GET http://localhost:8081/api/stays?city=Casablanca
```

### Get by max price (example)
```http
GET http://localhost:8081/api/stays?maxPrice=2000
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
3. Do not send `type` until backend supports it.
4. For `2000+ DH`, either skip price filter or add backend `minPrice` support.

