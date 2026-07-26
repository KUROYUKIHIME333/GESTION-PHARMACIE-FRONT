/**
 * Options étendues pour les requêtes fetch, en plus des options natives RequestInit.
 */
interface FetchOptions extends RequestInit {
  /**
   * Si true, ne vérifie pas l'authentification (pas de redirection 401).
   * Utile pour les endpoints publics comme le login.
   */
  skipAuth?: boolean;
}

/**
 * Classe d'erreur personnalisée pour les réponses API.
 * Enrichit Error avec le status HTTP et les données de réponse.
 */
class ApiError extends Error {
  /** Code de statut HTTP (ex: 401, 404, 500) */
  status: number;
  /** Données de l'erreur retournées par le serveur (body JSON) */
  data: unknown;

  /**
   * @param message Message d'erreur lisible
   * @param status Code HTTP de la réponse
   * @param data Données additionnelles du serveur (optionnel)
   */
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Fonction fetch générique avec gestion d'erreurs standardisée.
 * Gère automatiquement les cookies d'authentification (credentials: include).
 *
 * @param endpoint URL complète de l'endpoint (déjà préfixée par API_BASE_URL côté appelant)
 * @param options Options fetch + skipAuth
 * @param hasContent Si true, ajoute le header Content-Type: application/json
 * @returns Les données JSON parsées, ou null pour 204 No Content
 * @throws ApiError si la réponse n'est pas OK (status >= 400)
 */
export async function fetchApi(
  endpoint: string,
  options: FetchOptions = {},
  hasContent: boolean = true
): Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { skipAuth, ...fetchOptions } = options;

  const url = `${endpoint}`;

  const headerContent = hasContent ? { "Content-Type": "application/json" } : undefined;

  const headers: Record<string, string> = {
    ...headerContent,
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Le cookie est automatiquement envoyé avec credentials: 'include'
  // Permet l'authentification par session côté serveur (HttpOnly cookie)
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  // Si 401, l'utilisateur n'est pas authentifié
  // Décommenter pour gérer la redirection vers login côté client
  // if (response.status === 401) {
  //   throw new ApiError("Session expirée. Veuillez vous reconnecter.", 401);
  // }

  // Si la réponse n'est pas OK (status 4xx ou 5xx)
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

  // Pour les réponses 204 No Content (DELETE réussi, etc.)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

//  HELPERS HTTP — Méthodes courantes pré-configurées

/**
 * Collection de méthodes HTTP simplifiées.
 * Chaque helper pré-configure la méthode et le body (pour POST/PUT).
 */
export const api = {
  /**
   * Requête GET.
   * @param endpoint URL de l'endpoint
   * @param options Options additionnelles (headers, skipAuth, etc.)
   */
  get: (endpoint: string, options?: FetchOptions) =>
    fetchApi(endpoint, { ...options, method: "GET" }),

  /**
   * Requête POST avec body JSON.
   * @param endpoint URL de l'endpoint
   * @param data Payload à sérialiser en JSON
   * @param options Options additionnelles
   */
  post: (endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchApi(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * Requête PUT avec body JSON.
   * @param endpoint URL de l'endpoint
   * @param data Payload à sérialiser en JSON
   * @param options Options additionnelles
   */
  put: (endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchApi(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /**
   * Requête DELETE sans body.
   * @param endpoint URL de l'endpoint
   */
  delete: (endpoint: string) =>
    fetchApi(endpoint, { method: "DELETE" }, false),
};