# Slot Requests (Bookings) — Expected Endpoints

Slot requests are created when a guest clicks **Request Slot** from `/slot-show/:slotId`.

Backend already supports this resource under `/api/slot-requests/*`.

---

## Create a slot request

### POST `/api/slot-requests` (protected)

**Request**
```json
{
  "stayId": 1,
  "startDate": "2026-04-01",
  "endDate": "2026-04-10"
}
```

**Response `200`**
```json
{
  "id": 10,
  "stayId": 1,
  "stayName": "Cozy Room in Casablanca",
  "guestId": 5,
  "guestUsername": "john_doe",
  "startDate": "2026-04-01",
  "endDate": "2026-04-10",
  "status": "PENDING",
  "createdAt": "2026-03-28T10:00:00Z"
}
```

**Rules (expected)**
- Guest cannot request their own stay
- Dates must be in the future
- `endDate` must be after `startDate`

---

## Guest views their requests

### GET `/api/slot-requests/me` (protected)

**Response `200`**: array of slot request objects

---

## Host views incoming requests

### GET `/api/slot-requests/host` (protected)

**Response `200`**: array of slot request objects

---

## Host updates request status

### PATCH `/api/slot-requests/{id}/status` (protected; host only)

**Request**
```json
{ "status": "ACCEPTED" }
```

Allowed values:
- `PENDING`
- `ACCEPTED`
- `REJECTED`
- `CANCELLED`

**Response `200`**: updated slot request object

---

## Recommended extras (useful for UX)

### PATCH `/api/slot-requests/{id}/cancel` (protected; guest only)

Lets the guest cancel their own request.

**Response `200`**: updated request with `status: "CANCELLED"`

### GET `/api/stays/{id}/availability` (public)

So the listing details can show real availability instead of the mock `avSlots`.

**Response `200`**
```json
{
  "availableSlots": 2,
  "nextAvailableFrom": "2026-05-01"
}
```
