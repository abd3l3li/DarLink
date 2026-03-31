# Image Upload API Guide (Frontend)

This guide explains exactly how frontend should upload listing images with the backend endpoint that is already implemented.

## Endpoint Contract

- Method: `POST`
- URL: `/api/uploads/images`
- Auth: required (`Authorization: Bearer <jwt>`)
- Request type: `multipart/form-data`
- File field name: `files` (repeat for multiple files)
- Max files per request: `5`
- Max size per file: `5MB`
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

Backend references:

- `src/back-end/src/main/java/com/DarLink/DarLink/Controller/UploadController.java`
- `src/back-end/src/main/java/com/DarLink/DarLink/service/FileStorageService.java`
- `src/back-end/src/main/java/com/DarLink/DarLink/config/SecurityConfig.java`

## Response

Successful upload returns relative URLs:

```json
{
  "urls": ["/uploads/uuid-1.png", "/uploads/uuid-2.jpg"]
}
```

To render in frontend, prepend your app origin:

- Example: `https://localhost:1337/uploads/uuid-1.png`

## Important: Base64 vs Multipart

`/api/uploads/images` accepts multipart files, not raw base64 JSON.

- Works: append `File` objects to `FormData` under `files`
- Does not work: sending `{ "image": "data:image/png;base64,..." }` directly to this endpoint

If UI uses base64 preview, keep original `File` objects for upload.

## Frontend Implementation Pattern

### 1) Store selected files

```js
const [selectedFiles, setSelectedFiles] = useState([]);

function onFileChange(e) {
  const files = Array.from(e.target.files || []);
  setSelectedFiles(files);
}
```

### 2) Upload helper

```js
export async function uploadImages(files, token) {
  if (!files?.length) return [];

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch("/api/uploads/images", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Upload failed (${res.status})`);
  }

  return data.urls || [];
}
```

### 3) Create listing payload

Upload first, then send returned URLs in `photos` to `/api/stays/create`.

```js
const uploadedUrls = await uploadImages(selectedFiles, token);

const payload = {
  city,
  roomType,
  pricePerNight,
  availableSlots,
  included,
  expectations,
  description,
  photos: uploadedUrls,
};
```

## Where to wire in current code

- `src/front-end/src/components/stays/upload.jsx`
  - currently uses `FileReader.readAsDataURL(...)` for preview
  - update this flow to also keep `File` objects in state
- `src/front-end/src/pages/createPost.jsx`
  - call upload helper before create request
  - send returned URLs as `photos`

## Quick Verification

```bash
curl -k -X POST "https://localhost:1337/api/uploads/images" \
  -H "Authorization: Bearer <jwt_token>" \
  -F "files=@/absolute/path/image.png;type=image/png"
```

Then test a returned URL:

```bash
curl -k -I "https://localhost:1337/uploads/<generated-file>.png"
```

## Common Errors

- `401 Unauthorized`: token missing/expired/invalid
- `400 No files provided`: wrong field key or empty selection
- `400 Max 5 files allowed`: upload at most 5 in one request
- `400 Unsupported image type`: use jpeg/png/webp only
- `400 Image too large (max 5MB)`: resize/compress before upload

