"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/utils/types";
import { addToCart } from "@/utils/cart";
import { getProducts } from "@/utils/api";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getProducts();
        const products: Product[] = res.data?.products ?? [];
        setList(products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = (p: Product) => {
    addToCart(p, 1);
    alert(`${p.name} به سبد اضافه شد `);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6"> لیست محصولات</h1>

      {loading ? (
        <p className="text-center">در حال بارگذاری...</p>
      ) : list.length === 0 ? (
        <p className="text-center text-gray-500">هیچ محصولی موجود نیست.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((p) => (
            <div key={p._id ?? p.id2 ?? p.name} className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p>قیمت: {p.price} تومان</p>
              <button
                onClick={() => handleAdd(p)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                افزودن به سبد
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
