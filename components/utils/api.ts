import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE,
});

// اضافه کردن توکن اتوماتیک
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 👇 تعریف تایپ Product
export interface Product {
  _id?: string;   // برای MongoDB
  id?: string;    // برای مواقع دیگه
  name: string;
  price: number;
  stock: number;
  description: string;
}

// -------------------------
// محصولات
// -------------------------
export const getProducts = () => api.get("/api/products");
export const getProduct = (id: string) => api.get(`/api/products/${id}`);
export const addProduct = (product: Product) =>
  api.post("/api/products", product);
export const updateProduct = (id: string, product: Product) =>
  api.patch(`/api/products/${id}`, product);
export const deleteProduct = (id: string) => api.delete(`/api/products/${id}`);

// -------------------------
// سفارش‌ها
// -------------------------
export const getOrders = () => api.get("/api/orders");
export const addOrder = (order: any) => api.post("/api/orders", order);
export const updateOrder = (id: string, order: any) =>
  api.patch(`/api/orders/${id}`, order);

// -------------------------
// احراز هویت
// -------------------------
export const loginUser = (data: { username: string; password: string }) =>
  api.post("/api/auth/login", data);

export const signupUser = (data: any) => api.post("/api/auth/signup", data);
