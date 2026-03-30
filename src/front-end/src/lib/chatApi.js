import { getStoredToken, isAuthRejectedStatus, clearStoredAuth } from "./auth";

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

export async function fetchRooms(token) {
  const res = await fetch(buildUrl("/api/rooms"), {
    headers: { ...authHeaders(token) },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to load rooms (${res.status})`);
  }

  return res.json();
}

export async function fetchRoomBetween(user2Id, token) {
  const res = await fetch(buildUrl("/api/rooms/between", { user2Id }), {
    headers: { ...authHeaders(token) },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to load room (${res.status})`);
  }

  return res.json();
}

export async function ensureRoom(user2Id, token) {
  const res = await fetch(buildUrl("/api/rooms", { user2Id }), {
    method: "POST",
    headers: { ...authHeaders(token) },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to ensure room (${res.status})`);
  }

  // Backend returns a string "Chat room created successfully"
  return res.text();
}

export async function fetchMessages(roomId, token) {
  const res = await fetch(buildUrl("/api/rooms/messages", { roomId }), {
    headers: { ...authHeaders(token) },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to load messages (${res.status})`);
  }

  return res.json();
}

export async function fetchStaysByHostId(hostId, token) {
  const res = await fetch(buildUrl(`/api/stays/by-host/${hostId}`), {
    headers: { ...authHeaders(token) },
  });

  if (!res.ok) {
    const body = await readErrorBody(res);
    throw new Error(typeof body === "string" && body ? body : `Failed to load stays (${res.status})`);
  }

  return res.json();
}

export async function fetchMe(token) {
  const res = await fetch(buildUrl("/api/users/me"), {
    headers: { ...authHeaders(token) },
  });

  if (isAuthRejectedStatus(res.status)) {
    clearStoredAuth();
    return null;
  }

  if (!res.ok) return null;
  return res.json();
}
