const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";

export function useApi() {
  const { session } = useSession();

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const headers = {
      Accept: "application/json",
      ...options.headers,
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (session.value?.token) {
      headers.Authorization = `Bearer ${session.value.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        signal: controller.signal,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      });

      if (response.status === 204) {
        return null;
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.status || "Не удалось выполнить запрос.");
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Сервер API не ответил вовремя.");
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  function apiPath(path, params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        query.set(key, value);
      }
    });

    const suffix = query.toString();
    return suffix ? `${path}?${suffix}` : path;
  }

  return {
    request,
    apiPath,
  };
}
