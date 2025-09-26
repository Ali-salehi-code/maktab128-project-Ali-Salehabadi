"use client";

import ProductList from "@/components/admin/ProductList";
import OrderList from "@/components/admin/OrderList";

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-8">پنل مدیریت</h1>

      {/* 📌 مدیریت محصولات */}
      <section>
        <ProductList />
      </section>

      {/* 📌 مدیریت سفارش‌ها */}
      <section>
        <OrderList />
      </section>
    </div>
  );
}
