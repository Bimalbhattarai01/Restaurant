"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import CustomToast from "@/components/dashboard/feedback/CustomToast";

const MAX_IMAGES = 4;

type AddMenuFormProps = {
  onMenuCreated?: () => void;
};

export default function AddMenuForm({ onMenuCreated }: AddMenuFormProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const previewsRef = useRef<string[]>([]);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  useEffect(
    () => () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const resetForm = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setPreviews([]);
    setFormData({ name: "", price: "", category: "", description: "" });
  };

  const handleImageSelection = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);

    if (selectedImages.length + files.length > MAX_IMAGES) {
      toast.custom((t) => (
        <CustomToast
          id={t.id}
          message={`You can upload up to ${MAX_IMAGES} images.`}
          type="error"
          buttonLabel="OK"
          onButtonClick={() => toast.dismiss(t.id)}
        />
      ));
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...urls]);
  };

  const removeImageAt = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== index));
    setPreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || selectedImages.length === 0) {
      toast.custom((t) => (
        <CustomToast id={t.id} message="Please fill all required fields." type="error" buttonLabel="OK" />
      ));
      return;
    }

    const toastId = toast.loading("Uploading menu...");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("price", formData.price);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      selectedImages.forEach((file) => payload.append("images", file));

      const res = await fetch("/api/menu/upload", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (data.success) {
        // ✅ Success Toast
        toast.custom((t) => (
          <CustomToast
            id={t.id}
            message="Menu added successfully!"
            type="success"
            buttonLabel="VIEW"
            onButtonClick={() => console.log("View Menu clicked")}
          />
        ));

        // Reset form
        resetForm();
        onMenuCreated?.();
      } else {
        // ⚠️ Duplicate or API error
        toast.custom((t) => (
          <CustomToast
            id={t.id}
            message={data.message || "This menu already exists."}
            type="error"
            buttonLabel="CLOSE"
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
        Add <span className="text-[#BF1E2E] font-greatvibes text-[42px]">Menu</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Food Item Name</label>
          <input
            type="text"
            placeholder="Food Item Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
          />
          <p className="text-xs text-gray-500 mt-1">Item name must be entered how it wants to be displayed.</p>
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Dish Price</label>
            <input
              type="number"
              placeholder="Item Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
            />
            <p className="text-xs text-gray-500 mt-1">Actual Price of Item.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Choose one</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
            >
              <option value="">Dinning Option</option>
              <option value="Brunch">Brunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">Upload Images (up to {MAX_IMAGES})</label>
          <div className="border border-gray-200 bg-[#F9FBFD] rounded-md p-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              {previews.length === 0 && (
                <div className="w-[90px] h-[90px] bg-gray-100 flex items-center justify-center rounded-md">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
              )}
              {previews.map((preview, index) => (
                <div key={preview} className="relative w-[100px] h-[100px] rounded-md overflow-hidden shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt={`preview-${index + 1}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(index)}
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:bg-white"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="bg-[#BF1E2E] text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-[#A61A28]">
                Choose Files
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) => handleImageSelection(e.target.files)}
                />
              </label>
              <p className="text-sm mt-1 text-gray-600">
                {selectedImages.length > 0 ? `${selectedImages.length} file(s) selected` : "No files chosen"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Please upload square images, size less than 100KB</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            placeholder="Short Description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:border-[#BF1E2E]"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="flex items-center gap-2 bg-[#BF1E2E] hover:bg-[#A61A28] text-white font-semibold px-6 py-3 rounded-md shadow-md transition"
        >
          Add Menu <ChevronRight size={20} />
        </button>
      </form>
    </div>
  );
}
