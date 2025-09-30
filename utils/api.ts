
import axios from "axios";
import type { Product, Order } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
});


api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


export const getProducts = () => api.get("/api/products");
export const getProduct = (id: string) => api.get(`/api/products/${id}`);
export const addProduct = (product: Product) =>
  api.post("/api/products", product);
export const updateProduct = (id: string, product: Product) =>
  api.put(`/api/products/${id}`, product);
export const deleteProduct = (id: string) => api.delete(`/api/products/${id}`);

export const getOrders = () => api.get("/api/orders");
export const addOrder = (order: Order) => api.post("/api/orders", order);
export const updateOrder = (id: string, order: Order) =>
  api.put(`/api/orders/${id}`, order);

export const loginUser = (data: { username: string; password: string }) =>
  api.post("/api/login", data);
