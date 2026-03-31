# Search & Filters — Expected Endpoints

This doc is focused on the search bar used on `/slots`.

The UI filter options live in `src/components/stays/searchBar.jsx`:

- `location` (city)
- `type` (room type)
- `price` (range)

---

## GET `/api/stays` (public)

### Supported query params (current backend)

- `city` (string)
- `maxPrice` (number)

Examples:

- `GET /api/stays?city=Casablanca`
- `GET /api/stays?maxPrice=2000`

> Current backend behavior applies only one filter at a time (city first, then maxPrice).

---

## Mapping UI options → API query params

### `location` → `city`

- `Rabat` → `GET /api/stays?city=Rabat`

### `price` → `maxPrice`

- `0 - 1000 DH` → `maxPrice=1000`
- `1000 - 2000 DH` → `maxPrice=2000`
- `2000+ DH` → not supported as “min only” currently

Recommended behavior for `2000+ DH` today:
- either don’t send a price filter
- or extend backend to support `minPrice`

### `type`

The UI offers room type filtering, but the backend currently does not expose it in the stay response and cannot filter by it.

Recommended future endpoint contract:

- Add `roomType` to stay data
- Support `type` query param

Example:

- `GET /api/stays?city=Rabat&type=Private&maxPrice=2000`

---

## Recommended production-ready search endpoint

If you want multiple filters at once without ambiguity, consider keeping `GET /api/stays` but implement all params together:

- `city` (string)
- `type` (enum: `Private`, `Shared`, `Both`)
- `minPrice` (number)
- `maxPrice` (number)
- `hasAvailableSlots=true`
- pagination: `page`, `size`

Example:

- `GET /api/stays?city=Rabat&type=Private&minPrice=1000&maxPrice=2000&hasAvailableSlots=true&page=0&size=6`
