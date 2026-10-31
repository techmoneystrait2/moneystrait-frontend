export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Admin {
  id: string;
  username: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

export interface Customer extends User {
  signIn: 'Google' | 'Password' | 'None';
  createdAt: string;
  updatedAt: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

// Every call goes through /api on this origin; next.config.ts forwards it to the backend.
export async function api<T>(path: string, body?: object, method = body ? 'POST' : 'GET'): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Something went wrong. Try again.');
  return data as T;
}

export function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Something went wrong. Try again.';
}
