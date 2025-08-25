"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "@/components/utils/api";
import { error } from "console";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
  });

  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      console.log(res.data);
      setProducts(res.data.data.products);
    } catch (err) {
      console.error(" خطا در گرفتن محصولات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

 
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: 0, stock: 0 });
    setShowModal(true);
  };

  
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
    setShowModal(true);
  };


  const handleSave = async () => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      console.error(" خطا در ذخیره محصول:", err);
    }
  };

  
  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error(" خطا در حذف محصول:", err);
    }
  };
  console.log(products)
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">مدیریت محصولات</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={openAddModal}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          افزودن محصول
        </button>
      </div>

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Brand</th>
            <th className="border px-4 py-2">Images</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Subcategory</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {products&& products?.length >0 &&products?.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">{product.stock}</td>
              <td className="border px-4 py-2">{(product as any).brand}</td>
              <td className="border px-4 py-2">
                {(product as any).images?.map((url: string, index: number) => (
                  <img key={index} src={url} alt={product.name} className="h-16 mx-1 inline-block" />
                  
                ))}
              </td>
              <td className="border px-4 py-2">{(product as any).category}</td>
              <td className="border px-4 py-2">{(product as any).subcategory}</td>
              <td className="border px-4 py-2">{(product as any).description}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={9} className="border px-4 py-2 text-center">
                No products found.
              </td>
            </tr>
            
          )}
        </tbody>
        </table>
      )}

      
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
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
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
