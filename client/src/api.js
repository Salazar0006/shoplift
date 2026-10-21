// Smart URL resolver: supports direct backend URL and Vite proxy fallback
const resolvePrimaryUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    const clean = envUrl.trim().replace(/\/+$/, "");
    if (clean.endsWith("/api/products")) return clean;
    if (clean.endsWith("/api")) return `${clean}/products`;
    return `${clean}/api/products`;
  }
  // Default to relative path so Vite dev server proxy seamlessly handles requests
  return "/api/products";
};

let activeBaseUrl = resolvePrimaryUrl();

async function smartFetch(subPath = "", options = {}) {
  const primaryUrl = `${activeBaseUrl}${subPath}`;
  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (err) {
    // If fetch failed (e.g. CORS, browser network policy, or port mapping),
    // automatically try alternate endpoint (Vite proxy vs direct port 5000)
    const alternativeBase = activeBaseUrl.startsWith("http")
      ? "/api/products"
      : "http://localhost:5000/api/products";

    if (alternativeBase !== activeBaseUrl) {
      try {
        const altUrl = `${alternativeBase}${subPath}`;
        const retryRes = await fetch(altUrl, options);
        activeBaseUrl = alternativeBase;
        return retryRes;
      } catch {
        // If alternate also failed, throw original error
      }
    }
    throw err;
  }
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const getProducts = async () => {
  const res = await smartFetch("");
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : data.data || [];
};

export const createProduct = async (product) => {
  const res = await smartFetch("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await handleResponse(res);
  return data.data || data;
};

export const updateProduct = async (id, product) => {
  const res = await smartFetch(`/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await handleResponse(res);
  return data.data || data;
};

export const deleteProduct = async (id) => {
  const res = await smartFetch(`/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
};
