import { API_BASE_URL } from "./constants";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function fetchApi(
  endpoint: string,
  options: FetchOptions = {}
): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { skipAuth, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Le cookie est automatiquement envoyé avec credentials: 'include'
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  // Si 401, l'utilisateur n'est pas authentifié
  // if (response.status === 401) {
  //   throw new ApiError("Session expirée. Veuillez vous reconnecter.", 401);
  // }

  // Si la réponse n'est pas OK
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    const message = errorData?.message || `Erreur ${response.status}`;
    throw new ApiError(message, response.status, errorData);
  }

  // Pour les réponses 204 (No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Helpers pour les méthodes HTTP courantes
export const api = {
  get: (endpoint: string, options?: FetchOptions) =>
    fetchApi(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchApi(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchApi(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (endpoint: string, options?: FetchOptions) =>
    fetchApi(endpoint, { ...options, method: "DELETE" }),
};
