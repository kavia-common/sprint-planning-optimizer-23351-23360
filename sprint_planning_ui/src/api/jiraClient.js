//
// PUBLIC_INTERFACE
/**
 * Jira API client with centralized auth and request utilities.
 * Reads environment variables at build time and provides sensible fallbacks.
 *
 * Env vars (set via .env in React build):
 * - REACT_APP_JIRA_BASE_URL
 * - REACT_APP_JIRA_EMAIL
 * - REACT_APP_JIRA_API_TOKEN
 * - REACT_APP_JIRA_DEFAULT_PROJECT_KEY (optional)
 *
 * Note: Do not hardcode secrets. Use placeholders in .env and replace locally.
 */

const env = {
  baseURL:
    process.env.REACT_APP_JIRA_BASE_URL ||
    process.env.JIRA_BASE_URL || // fallback if user uses non-prefixed accidentally
    "https://your-domain.atlassian.net",
  email:
    process.env.REACT_APP_JIRA_EMAIL ||
    process.env.JIRA_EMAIL ||
    "your-email@example.com",
  token:
    process.env.REACT_APP_JIRA_API_TOKEN ||
    process.env.JIRA_API_TOKEN ||
    "your-api-token",
  defaultProjectKey:
    process.env.REACT_APP_JIRA_DEFAULT_PROJECT_KEY ||
    process.env.JIRA_DEFAULT_PROJECT_KEY ||
    "",
};

/**
 * Build Authorization header for Jira using Basic auth with email:token
 */
function buildAuthHeader(email, token) {
  const creds = `${email}:${token}`;
  // window.btoa may throw on unicode, but email/token are ascii; still guard.
  let encoded = "";
  try {
    encoded = typeof btoa === "function" ? btoa(creds) : Buffer.from(creds).toString("base64");
  } catch (e) {
    // Fallback if running in environments without btoa
    // eslint-disable-next-line no-undef
    encoded = Buffer.from(creds).toString("base64");
  }
  return `Basic ${encoded}`;
}

/**
 * Low-level request helper with standard headers and error handling.
 * Returns { ok, status, data, error }
 */
async function request(path, { method = "GET", params, body, headers } = {}) {
  const base = env.baseURL?.replace(/\/+$/, "");
  if (!base) {
    return { ok: false, status: 0, data: null, error: new Error("Jira base URL is not configured") };
  }

  // Construct URL with params
  const url = new URL(`${base}${path.startsWith("/") ? "" : "/"}${path}`);
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.append(k, v);
    });
  }

  const authHeader = buildAuthHeader(env.email, env.token);
  const finalHeaders = {
    "Authorization": authHeader,
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...headers,
  };

  try {
    const res = await fetch(url.toString(), {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json().catch(() => null) : await res.text();

    if (!res.ok) {
      const error = new Error((payload && payload.errorMessages?.join(", ")) || res.statusText || "Jira request failed");
      error.status = res.status;
      error.payload = payload;
      return { ok: false, status: res.status, data: payload, error };
    }

    return { ok: true, status: res.status, data: payload, error: null };
  } catch (err) {
    return { ok: false, status: 0, data: null, error: err };
  }
}

/** Get effective Jira-related environment configuration (non-secret display) */
// PUBLIC_INTERFACE
export function getJiraEnv() {
  /** Returns effective Jira-related environment configuration (non-secret display) */
  return {
    baseURL: env.baseURL,
    email: env.email ? `${env.email}` : "",
    defaultProjectKey: env.defaultProjectKey || "",
    hasAuth: Boolean(env.email && env.token),
    oauth: {
      clientId: process.env.REACT_APP_JIRA_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.REACT_APP_JIRA_OAUTH_CLIENT_SECRET ? "set" : "",
      redirectUri: process.env.REACT_APP_JIRA_OAUTH_REDIRECT_URI || "",
    }
  };
}

// PUBLIC_INTERFACE
export function jiraGet(path, params) {
  /** Perform GET request to Jira REST API */
  return request(path, { method: "GET", params });
}

// PUBLIC_INTERFACE
export function jiraPost(path, body) {
  /** Perform POST request to Jira REST API */
  return request(path, { method: "POST", body });
}

/** Perform PUT request to Jira REST API */
// PUBLIC_INTERFACE
export function jiraPut(path, body) {
  /** Perform PUT request to Jira REST API */
  return request(path, { method: "PUT", body });
}

// PUBLIC_INTERFACE
export async function authenticateOAuth() {
  /**
   * Placeholder for Jira OAuth authentication flow.
   * In a frontend-only app, a backend should handle the client secret securely.
   * This function documents intended usage and returns a not-implemented result.
   */
  const clientId = process.env.REACT_APP_JIRA_OAUTH_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_JIRA_OAUTH_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return { ok: false, data: null, error: new Error("OAuth not configured. Set REACT_APP_JIRA_OAUTH_CLIENT_ID and REACT_APP_JIRA_OAUTH_REDIRECT_URI.") };
  }
  // Normally, redirect to Atlassian auth endpoint
  // https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=...&scope=read%3Ajira-user&redirect_uri=...&state=xyz&response_type=code&prompt=consent
  return { ok: false, data: null, error: new Error("OAuth flow not implemented in frontend; use backend to handle token exchange securely.") };
}
