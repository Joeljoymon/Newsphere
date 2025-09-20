const API_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(API_URL + path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let err = {};
    try { err = await res.json(); } catch {}
    throw new Error(err.message || "API Error");
  }

  return res.json();
}

export default {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};
