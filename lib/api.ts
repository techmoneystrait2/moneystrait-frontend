export interface User {
  id: string;
  name: string;
  email: string;
  hasPassword?: boolean;
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
    // The fields the server refused, when it refused the form.
    readonly fields: string[] = [],
  ) {
    super(message);
  }
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Full name',
  email: 'Email',
  password: 'Password',
  currentPassword: 'Current password',
  code: 'Code',
};

// Every call goes through /api on this origin; next.config.ts forwards it to the backend.
export async function api<T>(path: string, body?: object, method = body ? 'POST' : 'GET'): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Something went wrong. Try again.', data.fields);
  return data as T;
}

export function errorMessage(err: unknown): string {
  if (!(err instanceof ApiError)) return 'Something went wrong. Try again.';
  const labels = err.fields.map((field) => FIELD_LABELS[field]).filter(Boolean);
  return labels.length ? `Check these: ${labels.join(', ')}.` : err.message;
}
