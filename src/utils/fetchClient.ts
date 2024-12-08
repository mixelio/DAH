const BASE_URL = "https://dah-production-f4c2.up.railway.app/api/";

// To have autocompletion and avoid mistypes
type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

function request<T>(
  url: string,
  method: RequestMethod = "GET",
  data: unknown = null, // we can send any data to the server
  token: string | null = null
): Promise<T> {
  const options: RequestInit = { method };
  const headers: HeadersInit = {
    "Content-Type": "application/json; charset=UTF-8",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  options.headers = headers;

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
  }

  // Execute the fetch request immediately without delay
  return fetch(BASE_URL + url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}

export const client = {
  get: <T>(url: string, token?: string) => request<T>(url, "GET", null, token),
  post: <T>(url: string, data: unknown, token?: string) => request<T>(url, "POST", data, token),
  patch: <T>(url: string, data: unknown, token?: string) => request<T>(url, "PATCH", data, token),
  put: <T>(url: string, data: unknown, token?: string) => request<T>(url, "PUT", data, token),
  delete: (url: string) => request(url, "DELETE"),
};
