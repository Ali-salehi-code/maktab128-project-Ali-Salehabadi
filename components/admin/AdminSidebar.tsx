// components/admin/AdminSidebar.tsx
import Link from "next/link";

export function AdminSidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/admin/dashboard/products" className="block p-2 hover:bg-gray-100">
              مدیریت محصولات
            </Link>
          </li>
          <li>
            <Link href="/admin/dashboard/orders" className="block p-2 hover:bg-gray-100">
              مدیریت سفارشات
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}