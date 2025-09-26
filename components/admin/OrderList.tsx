"use client";

import { useEffect, useState } from "react";
import { getOrders, addOrder, updateOrder } from "@/components/utils/api";
import { Order } from "@/components/utils/types";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<Omit<Order, "id" | "_id">>({
    user: "",
    items: [],
    total: 0,
    status: "pending",
  });

  // گرفتن سفارش‌ها
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      const ordersArray = res.data.data?.orders || res.data.data || res.data;
      setOrders(ordersArray);
    } catch (err) {
      console.error("❌ خطا در گرفتن سفارش‌ها:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ذخیره یا ویرایش سفارش
  const handleSave = async () => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id || editingOrder._id!, formData);
      } else {
        await addOrder(formData);
      }
      setEditingOrder(null);
      setFormData({ user: "", items: [], total: 0, status: "pending" });
      loadOrders();
    } catch (err) {
      console.error("❌ خطا در ذخیره سفارش:", err);
    }
  };

  return (
    <div className="p-6 mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">مدیریت سفارش‌ها</h1>

      {loading ? (
        <p className="text-center text-gray-500">...در حال بارگذاری</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">کاربر</th>
              <th className="px-4 py-2 border">مجموع</th>
              <th className="px-4 py-2 border">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id || o._id}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2 border">{o.user}</td>
                <td className="px-4 py-2 border">{o.total}</td>
                <td className="px-4 py-2 border">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* فرم افزودن سفارش */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">افزودن سفارش</h2>
        <input
          type="text"
          placeholder="کاربر"
          value={formData.user}
          onChange={(e) => setFormData({ ...formData, user: e.target.value })}
          className="border px-3 py-2 w-full mb-2 rounded"
        />
        <input
          type="number"
          placeholder="مجموع"
          value={formData.total}
          onChange={(e) =>
            setFormData({ ...formData, total: Number(e.target.value) })
          }
          className="border px-3 py-2 w-full mb-2 rounded"
        />
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as Order["status"] })
          }
          className="border px-3 py-2 w-full mb-2 rounded"
        >
          <option value="pending">در انتظار</option>
          <option value="shipped">ارسال شده</option>
          <option value="delivered">تحویل داده شده</option>
        </select>
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          ذخیره
        </button>
      </div>
    </div>
  );
}
