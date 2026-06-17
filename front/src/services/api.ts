import type { LinkResolveResponse, ShortLink } from "../types/link";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type CreateLinkPayload = {
  original_url: string;
  custom_slug?: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Nao foi possivel completar a operacao.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function createLink(payload: CreateLinkPayload): Promise<ShortLink> {
  return request<ShortLink>("/api/links", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listLinks(): Promise<ShortLink[]> {
  return request<ShortLink[]>("/api/links");
}

export function resolveLink(slug: string): Promise<LinkResolveResponse> {
  return request<LinkResolveResponse>(`/api/links/${slug}/resolve`);
}
