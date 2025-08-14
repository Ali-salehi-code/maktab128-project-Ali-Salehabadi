"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id">) => void;
  product?: Product;
}) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
    } else {
      setName("");
      setPrice(0);
      setStock(0);
    }
  }, [product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">{product ? "ویرایش محصول" : "افزودن محصول"}</h2>
        <div className="flex flex-col gap-3">
          <input
            className="border p-2 rounded"
            placeholder="نام محصول"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="قیمت"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="موجودی"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
              بستن
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {
                if (!name || price <= 0 || stock < 0) {
                  toast.error("لطفاً همه فیلدها را درست پر کنید");
                  return;
                }
                onSave({ name, price, stock });
                onClose();
              }}
            >
              ذخیره
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "محصول ۱", price: 1000, stock: 5 },
    { id: 2, name: "محصول ۲", price: 2000, stock: 10 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleSave = (productData: Omit<Product, "id">) => {
    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...productData } : p
      );
      setProducts(updated);
      toast.success("محصول ویرایش شد");
      setEditingProduct(undefined);
    } else {
      const newProduct = { ...productData, id: Date.now() };
      setProducts([...products, newProduct]);
      toast.success("محصول اضافه شد");
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
    setProducts(products.filter((p) => p.id !== id));
    toast.success("محصول حذف شد");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">لیست محصولات</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          افزودن محصول
        </button>
      </div>
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b">نام محصول</th>
            <th className="p-2 border-b">قیمت</th>
            <th className="p-2 border-b">موجودی</th>
            <th className="p-2 border-b">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border-b">{p.name}</td>
              <td className="p-2 border-b">{p.price}</td>
              <td className="p-2 border-b">{p.stock}</td>
              <td className="p-2 border-b flex gap-2">
                <button
                  className="px-2 py-1 bg-yellow-400 text-white rounded"
                  onClick={() => {
                    setEditingProduct(p);
                    setIsModalOpen(true);
                  }}
                >
                  ویرایش
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(p.id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}
