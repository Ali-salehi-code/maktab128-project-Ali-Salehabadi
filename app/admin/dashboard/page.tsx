import ProductList from "@/components/admin/ProductList";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 gap-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">مدیریت محصولات</h1>
      <ProductList />
    </div>
  );
}



