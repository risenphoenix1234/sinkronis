// lib/format.ts

export function getInitials(fullName?: string | null): string {
  if (!fullName) return "—";
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function formatMoney(amount?: number | null, currency?: string | null): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function resourceName(
  resource?: { name?: string } | Record<string, unknown> | null
): string {
  if (
    resource &&
    typeof resource === "object" &&
    "name" in resource &&
    typeof resource.name === "string"
  ) {
    return resource.name;
  }
  return "—";
}