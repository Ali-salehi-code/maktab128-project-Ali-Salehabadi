"use client";

import { useEffect, useState } from "react";
import { getOrders, addOrder, updateOrder } from "@/utils/api";
import type { Order, Product } from "@/utils/types";

type OrderForm = Omit<Order, "_id" | "id">;

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState<OrderForm>({
    user: "",
    items: [],
    total: 0,
    status: "pending",
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      const list: Order[] =
        res?.data?.orders ??
        res?.data?.data?.orders ??
        res?.data?.data ??
        res?.data ??
        [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("خطا در گرفتن سفارش‌ها:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await updateOrder(editing._id || (editing as any).id, form);
      } else {
        await addOrder(form);
      }
      setEditing(null);
      setForm({ user: "", items: [], total: 0, status: "pending" });
      loadOrders();
    } catch (err) {
      console.error("خطا در ذخیره سفارش:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مدیریت سفارش‌ها</h1>

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری…</p>
      ) : (
        <table className="w-full border border-gray-300 rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">کاربر</th>
              <th className="px-4 py-2 border">مجموع</th>
              <th className="px-4 py-2 border">وضعیت</th>
              <th className="px-4 py-2 border">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={(o as any)._id || (o as any).id}>
                <td className="px-4 py-2 border">{o.user}</td>
                <td className="px-4 py-2 border">{o.total}</td>
                <td className="px-4 py-2 border">{o.status}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="px-3 py-1 rounded border"
                    onClick={() => {
                      setEditing(o);
                      setForm({
                        user: o.user,
                        items: o.items as Product[],
                        total: o.total,
                        status: o.status,
                      });
                    }}
                  >
                    ویرایش
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                  سفارشی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{editing ? "ویرایش سفارش" : "افزودن سفارش"}</h2>

        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="کاربر"
          value={form.user}
          onChange={(e) => setForm((f) => ({ ...f, user: e.target.value }))}
        />
        <input
          type="number"
          className="border rounded p-2 w-full"
          placeholder="مجموع"
          value={form.total}
          onChange={(e) => setForm((f) => ({ ...f, total: Number(e.target.value) || 0 }))}
        />
        <select
          className="border rounded p-2 w-full"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Order["status"] }))}
        >
          <option value="pending">pending</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
        </select>

        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 rounded bg-black text-white">
            ذخیره
          </button>
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({ user: "", items: [], total: 0, status: "pending" });
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
