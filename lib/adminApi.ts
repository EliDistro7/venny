import { AdminProperty, LoginResponse } from "@/types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOKEN_COOKIE = "admin_token";

// --- Cookie helpers -------------------------------------------------

export function setAuthToken(token: string) {
  const maxAgeSeconds = 60 * 60 * 24 * 7;
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

// --- Error class ----------------------------------------------------

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// --- Core request helper (JSON / non-upload) ------------------------

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

// --- XHR upload helper with progress --------------------------------

export type UploadProgressCallback = (percent: number) => void;

// Total time allowed for the entire request (upload + server processing + R2).
// 3 minutes is generous enough for large videos while still surfacing real hangs.
const UPLOAD_TIMEOUT_MS = 3 * 60 * 1000;


// --- Auth -----------------------------------------------------------

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// --- Properties -----------------------------------------------------

export async function fetchProperties(): Promise<AdminProperty[]> {
  return request<AdminProperty[]>("/api/properties");
}

export async function fetchProperty(id: string): Promise<AdminProperty> {
  return request<AdminProperty>(`/api/properties/${id}`);
}

// Replace uploadWithProgress entirely.
// onProgress is gone — the form will estimate progress itself based on elapsed time.

export interface PresignRequest {
  name: string;
  type: string;       // MIME
  category: "image" | "video";
}
export interface PresignResult {
  url: string;
  key: string;
  publicUrl: string;
}

export async function getPresignedUrls(files: PresignRequest[]): Promise<PresignResult[]> {
  return request<PresignResult[]>("/api/properties/presign", {
    method: "POST",
    body: JSON.stringify({ files }),
  });
}

// Upload one file directly to R2 via presigned URL, with real progress
export function uploadToR2Direct(
  presignedUrl: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl);
    // Do NOT set Content-Type — it must match what was signed.
    // Since we no longer lock ContentType in the signature, omit it entirely.

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new ApiError(`R2 upload failed (${xhr.status})`, xhr.status));
    });
    xhr.addEventListener("error", () => reject(new ApiError("Network error during upload", 0)));
    xhr.addEventListener("timeout", () => reject(new ApiError("Upload timed out", 0)));
    xhr.timeout = 10 * 60 * 1000;
    xhr.send(file);
  });
}

function uploadWithProgress<T>(
  method: "POST" | "PUT",
  path: string,
  body: FormData,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const token = getAuthToken();

    xhr.open(method, `${API_URL}${path}`);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.timeout = UPLOAD_TIMEOUT_MS;

    xhr.addEventListener("load", () => {
      let data: unknown = {};
      try { data = JSON.parse(xhr.responseText); } catch { }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as T);
      } else {
        const msg =
          data && typeof data === "object" && "message" in data
            ? (data as { message: string }).message
            : "Request failed";
        reject(new ApiError(msg, xhr.status));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new ApiError("Network error — check your connection and try again", 0)));
    xhr.addEventListener("timeout", () =>
      reject(new ApiError("Request timed out — the server took too long to respond", 0)));
    xhr.addEventListener("abort", () =>
      reject(new ApiError("Upload cancelled", 0)));

    xhr.send(body);
  });
}

// Update signatures — drop onProgress param
export async function createProperty(formData: FormData): Promise<AdminProperty> {
  return uploadWithProgress<AdminProperty>("POST", "/api/properties", formData);
}

export async function updateProperty(
  id: string,
  formData: FormData,
): Promise<AdminProperty> {
  return uploadWithProgress<AdminProperty>("PUT", `/api/properties/${id}`, formData);
}


export async function deleteProperty(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/properties/${id}`, {
    method: "DELETE",
  });
}