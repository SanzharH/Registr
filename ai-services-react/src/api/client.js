import { formatError } from "../utils/errors.js";

export function createApiClient(baseUrl, token) {
  const normalizedBase = baseUrl.replace(/\/$/, "");

  async function request(path, options = {}) {
    const response = await fetch(`${normalizedBase}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        "X-API-TOKEN": token,
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("json") ? await response.json() : await response.text();

    if (!response.ok) {
      const error = new Error("Request failed");
      error.status = response.status;
      error.payload = payload;
      error.message = formatError(error);
      throw error;
    }

    return payload;
  }

  return {
    baseUrl: normalizedBase,
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
    form: (path, formData) => request(path, { method: "POST", body: formData }),
  };
}
