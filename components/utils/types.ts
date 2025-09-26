
export interface Product {
  _id?: string;        
  id?: string;        
  name: string;
  price: number;
  stock: number;
  description?: string;
}

export interface Order {
  id?: string;
  _id?: string;
  user: string;
  items: Product[];
  total: number;
  status: "pending" | "shipped" | "delivered";
}