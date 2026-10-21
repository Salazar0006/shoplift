// Smart URL resolver: guarantees no duplicate `/api/products` or missing paths
const resolveEndpoint = () => {
  const envUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const clean = envUrl.trim().replace(/\/+$/, "");
  if (clean.endsWith("/api/products")) return clean;
  if (clean.endsWith("/api")) return `${clean}/products`;
  return `${clean}/api/products`;
};

const BASE_URL = resolveEndpoint();

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const getProducts = async () => {
  const res = await fetch(BASE_URL);
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : data.data || [];
};

export const createProduct = async (product) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await handleResponse(res);
  return data.data || data;
};

export const updateProduct = async (id, product) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await handleResponse(res);
  return data.data || data;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
};
