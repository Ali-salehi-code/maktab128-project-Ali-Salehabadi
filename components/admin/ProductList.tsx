"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/components/utils/api";

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  images: string[];
  category: string;
  subcategory: string;
  description: string;
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
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [brand, setBrand] = useState(product?.brand || "");
  const [images, setImages] = useState(product?.images.join(",") || "");
  const [category, setCategory] = useState(product?.category || "");
  const [subcategory, setSubcategory] = useState(product?.subcategory || "");
  const [description, setDescription] = useState(product?.description || "");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setQuantity(product.quantity);
      setBrand(product.brand);
      setImages(product.images.join(","));
      setCategory(product.category);
      setSubcategory(product.subcategory);
      setDescription(product.description);
    } else {
      setName("");
      setPrice(0);
      setQuantity(0);
      setBrand("");
      setImages("");
      setCategory("");
      setSubcategory("");
      setDescription("");
    }
  }, [product]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name || price <= 0 || quantity < 0) {
      toast.error("لطفاً فیلدهای ضروری را درست پر کنید");
      return;
    }
    onSave({
      name,
      price,
      quantity,
      brand,
      images: images.split(",").map((img) => img.trim()),
      category,
      subcategory,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-auto max-h-[90vh]">
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
            placeholder="تعداد"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <input
            className="border p-2 rounded"
            placeholder="برند"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="آدرس تصاویر (کاما جدا شده)"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="دسته‌بندی"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="زیر دسته‌بندی"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          />
          <textarea
            className="border p-2 rounded"
            placeholder="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            بستن
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
            {product ? "ویرایش" : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // useEffect(() => {
  //   loadProducts();
  // }, []);

  // const loadProducts = async () => {
  //   try {
  //     const response = await getProducts();
  //     const data = Array.isArray(response.data) ? response.data : response;
  //     setProducts(data);
  //   } catch (error) {
  //     toast.error("خطا در دریافت محصولات");
  //     console.error(error);
  //   }
  // };

  // const handleSave = async (productData: Omit<Product, "id">) => {
  //   try {
  //     if (editingProduct) {
  //       await updateProduct(editingProduct.id, productData);
  //       toast.success("محصول ویرایش شد");
  //       setEditingProduct(undefined);
  //     } else {
  //       await addProduct(productData);
  //       toast.success("محصول اضافه شد");
  //     }
  //     loadProducts();
  //   } catch (error) {
  //     toast.error("خطا در ذخیره محصول");
  //     console.error(error);
  //   }
  // };

  // const handleDelete = async (id: number) => {
  //   if (!confirm("آیا مطمئن هستید می‌خواهید حذف کنید؟")) return;
  //   try {
  //     await deleteProduct(id);
  //     toast.success("محصول حذف شد");
  //     loadProducts();
  //   } catch (error) {
  //     toast.error("خطا در حذف محصول");
  //     console.error(error);
  //   }
  // };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">لیست محصولات</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          افزودن محصول
        </button>
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border-b">نام</th>
              <th className="p-2 border-b">قیمت</th>
              <th className="p-2 border-b">تعداد</th>
              <th className="p-2 border-b">برند</th>
              <th className="p-2 border-b">دسته‌بندی</th>
              <th className="p-2 border-b">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-2 border-b">{p.name}</td>
                <td className="p-2 border-b">{p.price}</td>
                <td className="p-2 border-b">{p.quantity}</td>
                <td className="p-2 border-b">{p.brand}</td>
                <td className="p-2 border-b">{p.category}</td>
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
                    // onClick={() => handleDelete(p.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
        }}
        onSave={handleSave}
        product={editingProduct}
      /> */}
    </div>
  );
}
