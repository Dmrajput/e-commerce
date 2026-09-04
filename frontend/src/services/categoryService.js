import api from "./api";

export async function getCategories({ includeInactive = false } = {}) {
  const params = includeInactive ? { all: "true" } : {};
  const response = await api.get("/categories", { params });
  return response.data;
}

export async function getCategoryById(id) {
  const response = await api.get(`/categories/${id}`);
  return response.data;
}

export async function createCategory(payload) {
  const response = await api.post("/categories", payload);
  return response.data;
}

export async function updateCategory(id, payload) {
  const response = await api.put(`/categories/${id}`, payload);
  return response.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
}