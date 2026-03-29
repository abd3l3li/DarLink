export function normalizeStay(raw) {
  if (!raw) return null;

  const id = raw.id;
  const city = raw.city ?? raw.location ?? "";
  const type = raw.type ?? raw.roomType ?? "";
  const price = raw.price ?? raw.pricePerNight ?? null;
  const avSlots =
    raw.avSlots ??
    raw.availableSlots ??
    (typeof raw.avSlots === "number" ? raw.avSlots : null);

  const photos = Array.isArray(raw.photos)
    ? raw.photos
    : raw.photoUrl
      ? [raw.photoUrl]
      : [];

  const included = Array.isArray(raw.included) ? raw.included : [];
  const expectations = Array.isArray(raw.expectations) ? raw.expectations : [];
  const details = raw.details ?? raw.description ?? "";

  const owner = raw.owner
    ? {
        id: raw.owner.id ?? raw.hostId ?? null,
        name: raw.owner.name ?? raw.hostUsername ?? "",
        image: raw.owner.image ?? raw.hostAvatarUrl ?? "",
      }
    : {
        id: raw.hostId ?? null,
        name: raw.hostUsername ?? "",
        image: raw.hostAvatarUrl ?? "",
      };

  return {
    ...raw,
    id,
    city,
    type,
    price,
    avSlots,
    photos,
    included,
    expectations,
    details,
    owner,
  };
}

export function normalizeStays(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeStay).filter(Boolean);
}

export function getDisplaySlots(stay) {
  const slots = stay?.avSlots;
  if (typeof slots === "number") return slots;
  if (slots == null) return 1; // keep legacy stays visible
  return Number(slots) || 0;
}
