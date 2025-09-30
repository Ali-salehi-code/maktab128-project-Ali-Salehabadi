"use client";

import { useEffect, useState } from "react";
import { getCart, setQty, inc, dec } from "@/utils/cart";
import type { CartItem, Product } from "@/utils/types";


const idof = (p: Product): string => p?._id ?? p.id2 ?? p.name ?? "";

export default function MyCart() {
  const [items, setItems] = useState<CartItem[]>([]);

 
  useEffect(() => {
    setItems(getCart());
  }, []);

  
  const handleInc = (id: string) => {
    const updated = inc(id, 1);
    setItems([...updated]);
  };

  
  const handleDec = (id: string) => {
    const updated = dec(id, 1);
    setItems([...updated]);
  };

 
  const handleChangeQty = (id: string, qtyRaw: number) => {
    const qty = Number.isFinite(qtyRaw) ? Math.max(0, Math.floor(Number(qtyRaw))) : 0;
    let updated = setQty(id, qty);

    if (qty === 0) {
      updated = updated.filter((it) => idof(it.product) !== id);
    }

    setItems([...updated]);
  };

 
  const total = items.reduce((sum, it) => {
    const price = Number((it.product as Product)?.price) || 0;
    return sum + price * (it.qty as number || 0);
  }, 0);

  return (
    <div className="p-6 mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">سبد خرید شما</h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">سبد خرید شما خالی است.</p>
      ) : (
        <div>
          {items.map((it) => (
            <div key={idof(it.product)} className="flex justify-between items-center border-b py-2">
              <span>{(it.product as Product).name}</span>
              <div className="flex gap-2">
                <button onClick={() => handleDec(idof(it.product))} className="px-2 bg-red-400 text-white rounded">-</button>
                <input
                  type="number"
                  value={it.qty}
                  onChange={(e) => handleChangeQty(idof(it.product), Number(e.target.value))}
                  className="w-12 text-center border rounded"
                />
                <button onClick={() => handleInc(idof(it.product))} className="px-2 bg-green-400 text-white rounded">+</button>
              </div>
              <span>{Number((it.product as Product).price) * it.qty} تومان</span>
            </div>
          ))}

          <div className="text-right font-bold mt-4">جمع کل: {total} تومان</div>
        </div>
      )}
    </div>
  );
}
