"use client";

import { useEffect, useState } from "react";

import { loadCart as getCart, inc, dec, setQty } from "@/components/utils/cart";
import type { CartItem } from "@/components/utils/cart";

export default function MyCart() {
  const [items, setItems] = useState<CartItem[]>([]);


  const pid = (p: CartItem["product"]) => p._id ?? p.id ?? "";

  useEffect(() => {
    setItems(getCart());
  }, []);

  const handleInc = (id: string) => {
    setItems([...inc(id, 1)]);
  };

  const handleDec = (id: string) => {
    setItems([...dec(id, 1)]);
  };

  const handleChangeQty = (id: string, qty: number) => {
   
    const safe = Math.max(0, Number(qty) || 0);
    setItems([...setQty(id, safe)]);
  };

  const total = items.reduce(
    (sum, it) => sum + (Number(it.product.price) || 0) * (Number(it.qty) || 0),
    0
  );

  return (
    <div className="p-6 mt-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">🛒 سبد خرید شما</h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">سبد خرید شما خالی است…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it, index) => {
              const p = it.product;
              const id = pid(p) || String(index);

              return (
                <div
                  key={`${id}-${index}`}
                  className="border rounded-xl shadow-lg p-4 flex flex-col justify-between bg-white hover:shadow-2xl transition"
                >
                  <div>
                    <h2 className="text-lg font-semibold mb-2">{p.name}</h2>
                    <p className="text-gray-700 mb-1">قیمت: {p.price} تومان</p>
                    <p className="text-gray-500 mb-1">موجودی: {p.stock}</p>
                    {p.description ? (
                      <p className="text-gray-500 mb-3 line-clamp-2">
                        {p.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => handleDec(id)}
                        aria-label="کاهش تعداد"
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min={0}
                        step={1}
                        className="w-20 text-center border rounded"
                        value={it.qty}
                        onChange={(e) =>
                          handleChangeQty(id, Number(e.currentTarget.value))
                        }
                      />

                      <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => handleInc(id)}
                        aria-label="افزایش تعداد"
                      >
                        +
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-green-600">
                      جمع جزء: {(Number(p.price) || 0) * (Number(it.qty) || 0)} تومان
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
            <p className="text-xl font-semibold">
              جمع کل: <span className="text-green-600">{total}</span> تومان
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                ادامه خرید
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                ثبت سفارش
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
