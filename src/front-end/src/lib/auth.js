export function getStoredToken() {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
}

export function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("pendingEmail");
  sessionStorage.removeItem("tempToken");

  // same-tab listeners won't receive the `storage` event; emit our own.
  try {
    window.dispatchEvent(new Event("darl:auth-changed"));
  } catch {
    // ignore
  }
}

export function isAuthRejectedStatus(status) {
  return status === 401 || status === 403;
}

export function handleAuthRejected(resOrStatus, { redirectTo = "/log-in" } = {}) {
  const status = typeof resOrStatus === "number" ? resOrStatus : resOrStatus?.status;
  if (!isAuthRejectedStatus(status)) return false;

  clearStoredAuth();
  if (redirectTo) window.location.href = redirectTo;
  return true;
}
