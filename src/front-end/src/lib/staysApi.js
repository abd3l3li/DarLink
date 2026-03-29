import { normalizeStay, normalizeStays } from "./stays";

async function readErrorBody(res) {
  const text = await res.text().catch(() => "");
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildUrl(path, query) {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const url = new URL(`${base}${path}`, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) return;
      if (typeof value === "string" && value.trim() === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString().replace(window.location.origin, "");
}

function authHeaders(token) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function fetchStays(filters) {
  const url = buildUrl("/api/stays", filters);
  const res = await fetch(url);
  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(
      typeof body === "string" && body ? body : `Failed to load stays (${res.status})`,
    );
  }
  const data = await res.json();
  return normalizeStays(data);
}

export async function fetchStayById(id) {
  const res = await fetch(buildUrl(`/api/stays/${id}`));
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(
      typeof body === "string" && body ? body : `Failed to load stay (${res.status})`,
    );
  }
  const data = await res.json();
  return normalizeStay(data);
}

export async function fetchMyStays(token) {
  const res = await fetch(buildUrl("/api/stays/mine"), {
    headers: {
      ...authHeaders(token),
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("You must be logged in to view your listings.");
  }

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(
      typeof body === "string" && body ? body : `Failed to load your listings (${res.status})`,
    );
  }

  const data = await res.json();
  return normalizeStays(data);
}

// export async function createStay(payload, token) {
//   const res = await fetch(buildUrl("/api/stays/create"), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeaders(token),
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const body = await readErrorBody(res);
//     throw new Error(
//       typeof body === "string" && body ? body : `Failed to create stay (${res.status})`,
//     );
//   }

//   const data = await res.json();
//   return normalizeStay(data);
// }

// export async function updateStay(id, payload, token) {
//   const res = await fetch(buildUrl(`/api/stays/${id}`), {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeaders(token),
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const body = await readErrorBody(res);
//     throw new Error(
//       typeof body === "string" && body ? body : `Failed to update stay (${res.status})`,
//     );
//   }

//   const data = await res.json();
//   return normalizeStay(data);
// }

export async function deleteStay(id, token) {
  const res = await fetch(buildUrl(`/api/stays/${id}`), {
    method: "DELETE",
    headers: {
      ...authHeaders(token),
    },
  });

  if (res.status === 204) return;

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(
      typeof body === "string" && body ? body : `Failed to delete stay (${res.status})`,
    );
  }
}

export async function fetchMe(token) {
  const res = await fetch(buildUrl("/api/users/me"), {
    headers: {
      ...authHeaders(token),
    },
  });

  if (!res.ok) return null;
  return res.json();
}
