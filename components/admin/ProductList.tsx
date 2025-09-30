"use client";

import { useEffect, useState } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/utils/api";
import type { Product } from "@/utils/types";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "_id" | "id2">>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
  } as any);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      const list: Product[] =
        res?.data?.products ??
        res?.data?.data?.products ??
        res?.data?.data ??
        res?.data ??
        [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("خطا در دریافت محصولات:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        const id = (editing as any)._id ?? (editing as any).id2 ?? (editing as any).id;
        await updateProduct(id, form);
      } else {
        await addProduct(form as any);
      }
      setEditing(null);
      setForm({ name: "", price: 0, stock: 0, description: "" } as any);
      loadProducts();
    } catch (err) {
      console.error("خطا در ذخیره محصول:", err);
    }
  };

  const handleDelete = async (p: Product) => {
    try {
      const id = (p as any)._id ?? (p as any).id2 ?? (p as any).id;
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("خطا در حذف محصول:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مدیریت محصولات</h1>

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری…</p>
      ) : (
        <table className="w-full border border-gray-300 rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">نام</th>
              <th className="px-4 py-2 border">قیمت</th>
              <th className="px-4 py-2 border">موجودی</th>
              <th className="px-4 py-2 border">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={(p as any)._id ?? (p as any).id2 ?? (p as any).id}>
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.price}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border space-x-2 space-x-reverse">
                  <button
                    className="px-3 py-1 rounded border"
                    onClick={() => {
                      setEditing(p);
                      setForm({
                        name: p.name,
                        price: Number(p.price) || 0,
                        stock: Number(p.stock) || 0,
                        description: p.description || "",
                      } as any);
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    className="px-3 py-1 rounded border text-red-600"
                    onClick={() => handleDelete(p)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                  محصولی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{editing ? "ویرایش محصول" : "افزودن محصول"}</h2>

        <input
          className="border rounded p-2 w-full"
          placeholder="نام"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          className="border rounded p-2 w-full"
          placeholder="قیمت"
          type="number"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
        />
        <input
          className="border rounded p-2 w-full"
          placeholder="موجودی"
          type="number"
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))}
        />
        <textarea
          className="border rounded p-2 w-full"
          placeholder="توضیحات"
          value={(form as any).description || ""}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value } as any))}
        />

        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 rounded bg-black text-white">
            ذخیره
          </button>
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({ name: "", price: 0, stock: 0, description: "" } as any);
              }}
              className="px-4 py-2 rounded border"
            >
              انصراف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
