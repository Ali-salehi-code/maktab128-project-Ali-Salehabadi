import axios from "axios";

const API_BASE = "http://localhost:8000"; 

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};


export const getProducts = () =>
  axios.get<Product[]>(`${API_BASE}/products`);


export const addProduct = (product: Omit<Product, "id">) =>
  axios.post(`${API_BASE}/products`, product);


export const addProductsBulk = (products: Omit<Product, "id">[]) =>
  axios.post(`${API_BASE}/products/bulk`, products);

export const updateProduct = (id: number, product: Omit<Product, "id">) =>
  axios.put(`${API_BASE}/products/${id}`, product);


export const deleteProduct = (id: number) =>
  axios.delete(`${API_BASE}/products/${id}`);
