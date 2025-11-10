"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast";

export interface BlogData {
  _id?: string;
  subHeading: string;
  heading: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BlogFormProps {
  mode?: "create" | "edit";
  blog?: BlogData | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultForm = {
  subHeading: "",
  heading: "",
  description: "",
};

export default function BlogForm({ mode = "create", blog, onSuccess, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState(() => ({
    ...defaultForm,
    subHeading: blog?.subHeading || "",
    heading: blog?.heading || "",
    description: blog?.description || "",
  }));
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(blog?.image || "");
  const [persistedImage, setPersistedImage] = useState(blog?.image || "");
  const [loading, setLoading] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setFormData({
      ...defaultForm,
      subHeading: blog?.subHeading || "",
      heading: blog?.heading || "",
      description: blog?.description || "",
    });
    setImage(null);
    setPersistedImage(blog?.image || "");
    setPreview(blog?.image || "");

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, [blog, mode]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleChange = (field: keyof typeof defaultForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file?: File | null) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (file) {
      const nextPreview = URL.createObjectURL(file);
      setImage(file);
      setPreview(nextPreview);
      objectUrlRef.current = nextPreview;
    } else {
      setImage(null);
      setPreview(persistedImage || "");
    }
  };

  const resetForm = () => {
    setFormData({ ...defaultForm });
    setPersistedImage("");
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subHeading.trim() || !formData.heading.trim() || !formData.description.trim()) {
      toast.custom((t) => <CustomToast id={t.id} message="All fields are required" type="error" buttonLabel="OK" />);
      return;
    }

    if (!image && !persistedImage) {
      toast.custom((t) => <CustomToast id={t.id} message="Please select an image" type="error" buttonLabel="OK" />);
      return;
    }

    setLoading(true);
    const toastId = toast.loading(mode === "edit" ? "Updating vlog..." : "Adding vlog...");

    try {
      const payload = new FormData();
      payload.append("subHeading", formData.subHeading.trim());
      payload.append("heading", formData.heading.trim());
      payload.append("description", formData.description.trim());

      if (image) {
        payload.append("image", image);
      } else if (persistedImage) {
        payload.append("existingImage", persistedImage);
      }

      const res = await fetch(mode === "edit" && blog?._id ? `/api/blog/${blog._id}` : "/api/blog", {
        method: mode === "edit" ? "PUT" : "POST",
        body: payload,
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (data.success) {
        toast.custom((t) => (
          <CustomToast id={t.id} message={`Vlog ${mode === "edit" ? "updated" : "added"} successfully`} type="success" buttonLabel="OK" />
        ));

        if (mode === "create") {
          resetForm();
        }

        onSuccess?.();
      } else {
        toast.custom((t) => (
          <CustomToast
            id={t.id}
            message={data.message || "Failed to save vlog"}
            type="error"
            buttonLabel="RETRY"
            onButtonClick={() => handleSubmit(e)}
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.custom((t) => <CustomToast id={t.id} message="Something went wrong" type="error" />);
    } finally {
      setLoading(false);
    }
  };

  const fileName = useMemo(() => {
    if (image) return image.name;
    if (persistedImage) return persistedImage.split("/").pop();
    return "No File Chosen";
  }, [image, persistedImage]);

  return (
    <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[36px] font-extrabold text-[#2E2E2E]">
          Add <span className="text-[#BF1E2E] font-greatvibes text-[42px]">Vlog</span>
        </h1>
        {mode === "edit" && onCancel && (
          <button type="button" className="text-sm text-gray-500 hover:text-gray-800" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-semibold mb-2">Sub Heading Description</label>
          <input
            type="text"
            value={formData.subHeading}
            onChange={(e) => handleChange("subHeading", e.target.value)}
            placeholder="Sub Heading"
            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#BF1E2E]"
          />
          <p className="text-xs text-gray-500 mt-2">Sub Heading of Vlog</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Heading</label>
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => handleChange("heading", e.target.value)}
            placeholder="Heading"
            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#BF1E2E]"
          />
          <p className="text-xs text-gray-500 mt-2">Heading of Vlog</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Paragraph"
            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#BF1E2E]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Cover Image</label>
          <div className="flex items-center gap-4 border border-gray-200 bg-[#F9FBFD] rounded-2xl p-5">
            <div className="w-[90px] h-[90px] bg-white border border-dashed border-gray-300 flex items-center justify-center rounded-xl overflow-hidden">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="vlog preview" className="object-cover w-full h-full" />
              ) : (
                <ImageIcon size={36} className="text-gray-400" />
              )}
            </div>
            <div>
              <label className="bg-white border border-[#BF1E2E] text-[#BF1E2E] px-5 py-2 rounded-lg text-sm cursor-pointer hover:bg-[#BF1E2E] hover:text-white transition">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                />
              </label>
              <p className="text-sm mt-1 text-gray-600">{fileName}</p>
              <p className="text-xs text-gray-400 mt-1">Please upload square image, size less than 100KB</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 bg-[#BF1E2E] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-[#A81826] transition disabled:opacity-50"
          >
            {mode === "edit" ? "Update Vlog" : "Add Vlog"}
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight size={18} />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
