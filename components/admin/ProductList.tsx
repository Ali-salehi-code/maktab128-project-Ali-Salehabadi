"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  images: string[];
  category: string;
  subcategory: string;
  description: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState({
    name: "",
    brand: "",
    category: "",
  });

  const [formData, setFormData] = useState<Omit<Product, "_id">>({
    name: "",
    price: 0,
    quantity: 0,
    brand: "",
    images: [],
    category: "",
    subcategory: "",
    description: "",
  });

  const loadProducts = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/products", {
        params: { page: pageNumber, per_page: perPage, ...filters },
      });

      setProducts(res.data?.data?.products ?? []);
      setTotalPages(res.data?.total_pages ?? 1);
      setPage(res.data?.page ?? pageNumber);
    } catch (err) {
      console.error(" Error loading products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
    
  }, [filters]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      quantity: 0,
      brand: "",
      images: [],
      category: "",
      subcategory: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      brand: product.brand,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      description: product.description,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await axios.put(
          `http://127.0.0.1:8000/api/products/${editingProduct._id}`,
          formData
        );
      } else {
        await axios.post("http://127.0.0.1:8000/api/products", formData);
      }
      setShowModal(false);
      loadProducts(page);
    } catch (err) {
      console.error(" Error saving product", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      loadProducts(page);
    } catch (err) {
      console.error(" Error deleting product", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4"> مدیریت محصولات</h1>

     
      <div className="flex gap-2 mb-4">
        <input
          placeholder="نام محصول"
          className="border p-1 rounded"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="برند"
          className="border p-1 rounded"
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
        />
        <input
          placeholder="دسته‌بندی"
          className="border p-1 rounded"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
        <button
          onClick={openAddModal}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          افزودن محصول
        </button>
      </div>

      
      {loading ? (
        <p> در حال بارگذاری...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">نام</th>
              <th className="border px-2 py-1">قیمت</th>
              <th className="border px-2 py-1">موجودی</th>
              <th className="border px-2 py-1">برند</th>
              <th className="border px-2 py-1">تصاویر</th>
              <th className="border px-2 py-1">دسته‌بندی</th>
              <th className="border px-2 py-1">زیر دسته</th>
              <th className="border px-2 py-1">توضیحات</th>
              <th className="border px-2 py-1">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                   محصولی وجود ندارد
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1">{p.price}</td>
                  <td className="border px-2 py-1">{p.quantity}</td>
                  <td className="border px-2 py-1">{p.brand}</td>
                  <td className="border px-2 py-1">
                    {p.images?.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border px-2 py-1">{p.category}</td>
                  <td className="border px-2 py-1">{p.subcategory}</td>
                  <td className="border px-2 py-1">{p.description}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => loadProducts(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          قبلی
        </button>
        <span>
          صفحه {page} از {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => loadProducts(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          بعدی
        </button>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-lg font-bold mb-2">
              {editingProduct ? "ویرایش محصول" : "افزودن محصول"}
            </h2>
            <div className="flex flex-col gap-2">
              <input
                placeholder="نام"
                className="border p-1 rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="قیمت"
                className="border p-1 rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
              <input
                type="number"
                placeholder="موجودی"
                className="border p-1 rounded"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
              />
              <input
                placeholder="برند"
                className="border p-1 rounded"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
              <input
                placeholder="تصاویر (لینک، جداشده با ,)"
                className="border p-1 rounded"
                value={formData.images.join(",")}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value.split(",") })
                }
              />
              <input
                placeholder="دسته‌بندی"
                className="border p-1 rounded"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
              <input
                placeholder="زیر دسته"
                className="border p-1 rounded"
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
              />
              <textarea
                placeholder="توضیحات"
                className="border p-1 rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
