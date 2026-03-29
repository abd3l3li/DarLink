function readErrorBody(res) {
  return res.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  });
}

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

  if (!res.ok) {
    const body = await readErrorBody(res);
    const message = typeof body === "string" && body ? body : body?.message || body?.error;
    throw new Error(message || `Upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.urls || [];
}