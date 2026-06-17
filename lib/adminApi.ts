import { AdminProperty, LoginResponse } from "@/types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOKEN_COOKIE = "admin_token";

// --- Cookie helpers -------------------------------------------------
// The token is kept in a plain (non-httpOnly) cookie so that both the
// Next.js middleware (route gating) and client-side fetch calls
// (Authorization header) can read it. Fine for an internal admin panel;
// for stronger hardening later, move auth to an httpOnly cookie behind
// a Next.js API route proxy.

export function setAuthToken(token: string) {
  const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days, matches default JWT_EXPIRES_IN
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearAuthToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

// --- Core request helper --------------------------------------------

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData) && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || "Request failed", res.status);
  }

  return data as T;
}

// --- Auth --------------------------------------------------------------

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// --- Properties ----------------------------------------------------------

export async function fetchProperties(): Promise<AdminProperty[]> {
  return request<AdminProperty[]>("/api/properties");
}

export async function fetchProperty(id: string): Promise<AdminProperty> {
  return request<AdminProperty>(`/api/properties/${id}`);
}

export async function createProperty(formData: FormData): Promise<AdminProperty> {
  return request<AdminProperty>("/api/properties", {
    method: "POST",
    body: formData,
  });
}

export async function updateProperty(id: string, formData: FormData): Promise<AdminProperty> {
  return request<AdminProperty>(`/api/properties/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteProperty(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/properties/${id}`, {
    method: "DELETE",
  });
}

export { ApiError };
