/**
 * Utility functions for auth token inspection, expiration checks, and session management.
 */

export interface DecodedJwtPayload {
  exp?: number;
  iat?: number;
  organizationId?: string;
  sessionId?: string;
  sub?: string;
  accountType?: string;
  [key: string]: unknown;
}

/**
 * Parses JWT token payload safely in the browser without requiring external dependencies.
 */
export function parseJwt(token: string): DecodedJwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as DecodedJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns token expiration time in milliseconds, or null if token is absent/invalid.
 */
export function getTokenExpirationTime(token?: string | null): number | null {
  const currentToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
  if (!currentToken || currentToken === "undefined" || currentToken === "null") {
    return null;
  }
  const payload = parseJwt(currentToken);
  if (!payload || typeof payload.exp !== "number") {
    return null;
  }
  return payload.exp * 1000;
}

/**
 * Returns true if the token is absent, unparseable, or expired.
 */
export function isTokenExpired(token?: string | null, bufferSeconds = 0): boolean {
  const expMs = getTokenExpirationTime(token);
  if (!expMs) return true;
  return Date.now() + bufferSeconds * 1000 >= expMs;
}

/**
 * Returns remaining time until token expiration in milliseconds.
 */
export function getRemainingTokenTime(token?: string | null): number {
  const expMs = getTokenExpirationTime(token);
  if (!expMs) return 0;
  return Math.max(0, expMs - Date.now());
}

/**
 * Identifies public and auth routes where token expiration shouldn't force a redirect.
 */
export function isPublicRoute(pathname: string): boolean {
  if (!pathname || pathname === "/" || pathname === "/landingPage") {
    return true;
  }
  const publicPrefixes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/setup-password",
    "/otp-verification",
    "/employee/login",
    "/checkout",
  ];
  return publicPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

let isRedirecting = false;

/**
 * Clears all authentication tokens and reloads the browser to the login page.
 */
export function logoutAndRedirectToLogin(reason = "expired"): void {
  if (typeof window === "undefined" || isRedirecting) return;

  isRedirecting = true;
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  } catch (e) {
    console.error("Failed to clear auth storage:", e);
  }

  const currentPath = window.location.pathname;
  if (!isPublicRoute(currentPath)) {
    const isEmployeePortal = currentPath.startsWith("/employee");
    const basePath = isEmployeePortal ? "/employee/login" : "/login";
    const query = reason === "no_token" || reason === "manual_signout" ? "" : "?expired=true";
    window.location.href = `${basePath}${query}`;
  } else {
    isRedirecting = false;
  }
}
