"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/components/utils/api";
import { Product } from "@/components/utils/types";

// تابع کمکی برای گرفتن شناسه
const getId = (p: any): string => p?.id || p?._id || "";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
  });

  // گرفتن لیست محصولات
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      const productsArray = res.data?.products || res.data?.data || res.data;
      setProducts(productsArray);
    } catch (err) {
      console.error("❌ خطا در گرفتن محصولات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ذخیره محصول
  const handleSave = async () => {
    try {
      if (editingProduct) {
        const productId = getId(editingProduct);
        if (!productId) {
          console.error("❌ محصول شناسه ندارد");
          return;
        }
        await updateProduct(productId, formData);
      } else {
        await addProduct(formData);
      }
      setEditingProduct(null);
      setFormData({ name: "", price: 0, stock: 0, description: "" });
      loadProducts();
    } catch (err) {
      console.error("❌ خطا در ذخیره محصول:", err);
    }
  };

  // باز کردن فرم ویرایش
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
    });
  };

  // حذف محصول
  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("❌ خطا در حذف محصول:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">مدیریت محصولات</h1>

      {loading ? (
        <p className="text-center text-gray-500">...در حال بارگذاری</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border">نام</th>
              <th className="px-4 py-2 border">قیمت</th>
              <th className="px-4 py-2 border">موجودی</th>
              <th className="px-4 py-2 border">توضیحات</th>
              <th className="px-4 py-2 border">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={getId(p)}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.price}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border">{p.description}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(getId(p))}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? "ویرایش محصول" : "افزودن محصول"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="نام محصول"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="قیمت"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="موجودی"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: Number(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="توضیحات"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}
