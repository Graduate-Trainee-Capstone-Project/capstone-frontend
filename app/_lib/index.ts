import "server-only";
import type {ApiErrorCode, ApiResult} from "@/app/_types";

/**
 * Server-only base URL. Deliberately NOT prefixed with NEXT_PUBLIC_ — this fetch
 * only ever runs inside a Server Action, so the .NET API's real address never
 * needs to (and must not) ship into the client bundle.
 */
const API_URL = process.env.API_URL;

if (!API_URL && process.env.NODE_ENV !== "production") {
  // Loud in dev, doesn't crash the build.
  console.warn("[apiRequest] API_URL is not set — requests will fail.");
}

type Body = object | undefined;

async function baseRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      // Every call here is form-wizard state — never cache.
      cache: "no-store",
    });
  } catch {
    // Network failure (backend down, DNS, etc.) — no response to parse.
    return {
      error: "Could not reach the server. Check your connection and try again.",
      errorCode: "INTERNAL_ERROR",
      status: 0,
    };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage: string =
      data?.message ??
      data?.details ??
      data?.error?.message ??
      `Request failed with status ${response.status}`;
    const errorCode: ApiErrorCode | undefined = data?.error?.code;
    const errorField: string | undefined = data?.error?.field;

    return {error: errorMessage, errorCode, errorField, status: response.status};
  }

  return {data: data as T, status: response.status};
}

export const apiRequest = Object.assign(
  // apiRequest(endpoint, options) — escape hatch, e.g. custom headers/methods
  baseRequest,
  {
    get: <T>(endpoint: string) => baseRequest<T>(endpoint),

    post: <T>(endpoint: string, body?: Body) =>
      baseRequest<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(body ?? {}),
      }),

    put: <T>(endpoint: string, body?: Body) =>
      baseRequest<T>(endpoint, {
        method: "PUT",
        body: JSON.stringify(body ?? {}),
      }),

    delete: <T>(endpoint: string) => baseRequest<T>(endpoint, {method: "DELETE"}),
  },
);
