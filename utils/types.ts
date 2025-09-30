export interface Product {
  _id?: string;
  id2?: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Order {
  _id?: string;
  id2?: string;
  user: string;
  items: Product[];
  total: number;
  status: "pending" | "shipped" | "delivered";
}
