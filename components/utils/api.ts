import axios from "axios";

const API_BASE = "http://localhost:8000"; 

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};


const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getProducts = () => api.get<Product[]>("/api/products");

export const addProduct = (product: Omit<Product, "id">) =>
  api.post("/products", product);

export const addProductsBulk = (products: Omit<Product, "id">[]) =>
  api.post("/products/bulk", products);

export const updateProduct = (id: number, product: Omit<Product, "id">) =>
  api.put(`/products/${id}`, product);

export const deleteProduct = (id: number) => api.delete(`/products/${id}`);
