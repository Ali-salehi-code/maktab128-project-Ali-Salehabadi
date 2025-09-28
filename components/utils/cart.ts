import type { Product } from "@/components/utils/types";

export interface CartItem {
  product: Product;
  qty: number;
}

const CART_KEY = "cart";


export const getPid = (p: Product): string => p._id ?? p.id ?? "";


const safeGet = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};


const safeSet = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};


export const loadCart = (): CartItem[] => safeGet();


export const addToCart = (product: Product, qty = 1): CartItem[] => {
  const items = safeGet();
  const id = getPid(product);
  const idx = items.findIndex(it => getPid(it.product) === id);

  if (idx >= 0) {
    items[idx].qty += qty;
  } else {
    items.push({
      product,
      qty: qty > 0 ? qty : 1,
    });
  }

  safeSet(items);
  return items;
};


export const setQty = (idOrProduct: string | Product, qty: number): CartItem[] => {
  const id = typeof idOrProduct === "string" ? idOrProduct : getPid(idOrProduct);
  const items = safeGet();
  const idx = items.findIndex(it => getPid(it.product) === id);

  if (idx >= 0) {
    items[idx].qty = Math.max(1, qty);
  }

  safeSet(items);
  return items;
};


const changeBy = (idOrProduct: string | Product, delta: number): CartItem[] => {
  const id = typeof idOrProduct === "string" ? idOrProduct : getPid(idOrProduct);
  const items = safeGet();
  const idx = items.findIndex(it => getPid(it.product) === id);

  if (idx >= 0) {
    items[idx].qty = Math.max(1, (items[idx].qty || 1) + delta);
  }

  safeSet(items);
  return items;
};

export const inc = (idOrProduct: string | Product, delta = 1) =>
  changeBy(idOrProduct, delta);

export const dec = (idOrProduct: string | Product, delta = 1) =>
  changeBy(idOrProduct, -Math.abs(delta));
