/**
 * src/lib/auth.ts
 * Handles token retrieval and in-memory caching.
 */

const BASE = "http://4.224.186.213/evaluation-service";

const CREDENTIALS = {
  email:        "chandramuke.s2022@vitstudent.ac.in",
  name:         "chandramuke s",
  rollNo:       "22mid0163",
  accessCode:   "SfFuWg",
  clientID:     "a98931c2-ebdd-4346-a37a-a7557ce6bda7",
  clientSecret: "ytrfvDYgzZRHkyUS",
};

let _cachedToken: string | null = null;
let _tokenExpiry: number | null = null;

export async function getAuthToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60s buffer)
  if (_cachedToken && _tokenExpiry && now < _tokenExpiry - 60) {
    return _cachedToken;
  }

  // Try sessionStorage on client side
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("auth_token");
    const expiry = sessionStorage.getItem("auth_token_expiry");
    if (stored && expiry && now < parseInt(expiry) - 60) {
      _cachedToken = stored;
      _tokenExpiry = parseInt(expiry);
      return stored;
    }
  }

  return fetchNewToken();
}

async function fetchNewToken(): Promise<string> {
  const res = await fetch(`${BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(CREDENTIALS),
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    throw new Error(`Auth failed: ${res.status}`);
  }

  _cachedToken = data.access_token as string;
  _tokenExpiry = data.expires_in as number;

  if (typeof window !== "undefined") {
    sessionStorage.setItem("auth_token", _cachedToken);
    sessionStorage.setItem("auth_token_expiry", String(_tokenExpiry));
  }

  return _cachedToken;
}

export function clearToken(): void {
  _cachedToken = null;
  _tokenExpiry = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token_expiry");
  }
}
