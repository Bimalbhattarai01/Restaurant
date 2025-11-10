"use client";

import { useState } from "react";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast";

interface EditMenuFormProps {
  menu: {
    _id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image?: string;
    images?: string[];
  };
  onSuccess?: () => void; // To refresh or close modal after update
}

export default function EditMenuForm({ menu, onSuccess }: EditMenuFormProps) {
  const [formData, setFormData] = useState({
    name: menu.name,
    price: menu.price.toString(),
    category: menu.category,
    description: menu.description,
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(menu.image || menu.images?.[0] || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Updating menu...");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      if (image) payload.append("image", image);

      const res = await fetch(`/api/menu/${menu._id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          description: formData.description,
          image: preview, // send current image path if not changed
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (data.success) {
        toast.custom((t) => (
          <CustomToast
            id={t.id}
            message="Menu updated successfully!"
            buttonLabel="CLOSE"
            onButtonClick={() => toast.dismiss(t.id)}
            type="success"
          />
        ));

        onSuccess?.(); // trigger refresh or close modal
      } else {
        toast.custom((t) => (
          <CustomToast
            id={t.id}
            message={data.message || "Failed to update menu."}
            buttonLabel="RETRY"
            onButtonClick={() => handleSubmit(e)}
            type="error"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.custom((t) => <CustomToast id={t.id} message="Something went wrong!" type="error" />);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <h1 className="text-[36px] font-extrabold text-[#2E2E2E] mb-8">
        Edit <span className="text-[#BF1E2E] font-greatvibes text-[42px]">Menu</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Food Item Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
          />
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Dish Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
            >
              <option value="">Select Category</option>
              <option value="Brunch">Brunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">Upload Image</label>
          <div className="flex items-center gap-4 border border-gray-200 bg-[#F9FBFD] rounded-md p-4">
            <div className="w-[80px] h-[80px] bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
              {preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="menu preview" className="object-cover w-full h-full" />
                </>
              ) : (
                <ImageIcon size={32} className="text-gray-400" />
              )}
            </div>
            <div>
              <label className="bg-[#BF1E2E] text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-[#A61A28]">
                Change File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
              <p className="text-sm mt-1 text-gray-600">{image ? image.name : "Current image used"}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:border-[#BF1E2E]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="flex items-center gap-2 bg-[#BF1E2E] hover:bg-[#A61A28] text-white font-semibold px-6 py-3 rounded-md shadow-md transition"
        >
          Update Menu <ChevronRight size={20} />
        </button>
      </form>
    </div>
  );
}
