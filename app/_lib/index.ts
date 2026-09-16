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

/** Debug-friendly stringification — FormData doesn't log usefully as-is (File entries especially). */
function describeBody(body: RequestInit["body"]): unknown {
  if (body instanceof FormData) {
    const entries: Record<string, unknown> = {};
    for (const [key, value] of body.entries()) {
      entries[key] = value instanceof File ? `File(${value.name}, ${value.size}b, ${value.type})` : value;
    }
    return entries;
  }
  return body ?? "(no body)";
}

async function baseRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  let response: Response;
  const method = options.method ?? "GET";
  const isFormData = options.body instanceof FormData;

  // TEMP DEBUG — remove once the BE PUT /applications/{id}/save contract
  // (multipart/form-data, flat fields — see SaveDraftRequest in _types) is
  // confirmed stable end-to-end. See docs/justin-backend-alignment-briefing.md.
  console.log(`[apiRequest] → ${method} ${endpoint}`, describeBody(options.body));

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        // A FormData body must NOT get an explicit Content-Type — fetch sets
        // multipart/form-data with the correct boundary itself; overriding
        // it here (even to the same value) drops the boundary and the BE
        // form binder gets nothing.
        ...(isFormData ? {} : {"Content-Type": "application/json"}),
        ...(options.headers || {}),
      },
      // Every call here is form-wizard state — never cache.
      cache: "no-store",
    });
  } catch (err) {
    console.log(`[apiRequest] ✘ ${method} ${endpoint} — fetch threw`, err);
    // Network failure (backend down, DNS, etc.) — no response to parse.
    return {
      error: "Could not reach the server. Check your connection and try again.",
      errorCode: "INTERNAL_ERROR",
      status: 0,
    };
  }

  const data = await response.json().catch(() => null);
  console.log(`[apiRequest] ← ${response.status} ${method} ${endpoint}`, data);

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

    // multipart/form-data PUT — only /applications/{draftId}/save needs this.
    putForm: <T>(endpoint: string, formData: FormData) =>
      baseRequest<T>(endpoint, {method: "PUT", body: formData}),

    delete: <T>(endpoint: string) => baseRequest<T>(endpoint, {method: "DELETE"}),
  },
);
