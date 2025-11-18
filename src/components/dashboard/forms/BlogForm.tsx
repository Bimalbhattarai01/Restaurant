"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import CustomToast from "@/components/dashboard/feedback/CustomToast";

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

  const handleRemoveImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImage(null);
    setPersistedImage("");
    setPreview("");
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
    const toastId = toast.loading(mode === "edit" ? "Updating blog..." : "Adding blog...");

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
          <CustomToast id={t.id} message={`Blog ${mode === "edit" ? "updated" : "added"} successfully`} type="success" buttonLabel="OK" />
        ));

        if (mode === "create") {
          resetForm();
        }

        onSuccess?.();
      } else {
        toast.custom((t) => (
          <CustomToast
            id={t.id}
            message={data.message || "Failed to save blog"}
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
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[36px] font-extrabold text-[#2E2E2E]">
          {mode === "edit" ? "Edit" : "Add"} <span className="text-[#BF1E2E] font-greatvibes text-[42px]">Blog</span>
        </h1>
        {mode === "edit" && onCancel && (
          <button type="button" className="text-sm text-gray-500 hover:text-gray-800" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Sub Heading</label>
            <input
              type="text"
              value={formData.subHeading}
              onChange={(e) => handleChange("subHeading", e.target.value)}
              placeholder="Sub Heading"
              className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
            />
            <p className="text-xs text-gray-500 mt-1">Shown above the main blog title.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Heading</label>
            <input
              type="text"
              value={formData.heading}
              onChange={(e) => handleChange("heading", e.target.value)}
              placeholder="Main Heading"
              className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
            />
            <p className="text-xs text-gray-500 mt-1">Displayed prominently on the blog card.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Write the story..."
            className="w-full border border-gray-300 rounded-md p-3 focus:border-[#BF1E2E]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Cover Image</label>
          <div className="border border-gray-200 bg-[#F9FBFD] rounded-md p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-[140px] h-[140px] rounded-md overflow-hidden bg-white shadow-inner flex items-center justify-center">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Blog preview" className="object-cover w-full h-full" />
                ) : (
                  <ImageIcon size={40} className="text-gray-300" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md border border-dashed border-gray-400 text-sm font-semibold cursor-pointer text-gray-700 hover:border-[#BF1E2E] hover:text-[#BF1E2E] transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  Choose File
                </label>
                <p className="text-xs text-gray-500">{fileName}</p>
                {(image || persistedImage) && (
                  <button type="button" className="text-xs text-red-500 underline" onClick={handleRemoveImage}>
                    Remove Image
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400">Recommended size 1200x800px. JPG or PNG, max 2MB.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#BF1E2E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a81828] transition disabled:opacity-60"
          >
            {mode === "edit" ? "Update Blog" : "Add Blog"} <ChevronRight size={20} />
          </button>

          {mode === "edit" && onCancel && (
            <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-800">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
