"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/components/utils/api";
import type { Product } from "@/components/utils/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();

      
      const list: Product[] =
        res?.data?.data?.products ||
        res?.data?.data ||
        res?.data ||
        [];

      if (Array.isArray(list)) {
        setProducts(list);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("❌ خطا در گرفتن محصولات:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  
  const addToCart = (product: Product) => {
    console.log("🛒 افزودن به سبد خرید:", product);
   
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🛍️ فروشگاه</h1>

      {loading ? (
        <p className="text-center text-gray-500">...در حال بارگذاری</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p, index) => {
            const key = p.id ?? p._id ?? index; 
            return (
              <div
                key={key}
                className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                <h2 className="font-bold text-lg mb-2">{p.name}</h2>
                <p className="text-gray-700 mb-1">💲 قیمت: {p.price} تومان</p>
                <p className="text-gray-500 mb-1">📦 موجودی: {p.stock}</p>
                <p className="text-gray-500 mb-4">
                  {p.description || "بدون توضیحات"}
                </p>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-auto"
                >
                  افزودن به سبد خرید 🛒
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
