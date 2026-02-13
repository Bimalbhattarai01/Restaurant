"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import ActionButton from "@/components/dashboard/actions/ActionButton";
import ConfirmDialog from "@/components/dashboard/feedback/ConfirmDialog";
import CustomToast from "@/components/dashboard/feedback/CustomToast";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface MenuItem {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
}

interface MenuRowProps {
  item: MenuItem;
  onDelete?: (id: string) => void;
}

export default function MenuRow({ item, onDelete }: MenuRowProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter(); // 👈 Initialize router

  const rawImageSrc = useMemo(() => item.image || item.images?.[0] || "/placeholder.jpg", [item.image, item.images]);
  const imageSrc = rawImageSrc.startsWith("blob:") ? "/placeholder.jpg" : rawImageSrc;
  const isRemoteImage = imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

  const handleDeleteConfirmed = async () => {
    setShowConfirm(false);
    const toastId = toast.loading("Deleting...");

    try {
      const res = await fetch(`/api/menu/${item._id}`, { method: "DELETE" });
      const data = await res.json();

      toast.dismiss(toastId);

      if (data.success) {
        toast.custom((t) => (
          <CustomToast
            id={t.id}
            message="Menu deleted successfully!"
            buttonLabel="UNDO"
            onButtonClick={() => console.log("Undo clicked")}
            type="success"
          />
        ));
        onDelete?.(item._id);
      } else {
        toast.custom((t) => (
          <CustomToast
            id={t.id}
            message={data.message || "Failed to delete menu"}
            buttonLabel="RETRY"
            onButtonClick={() => handleDeleteConfirmed()}
            type="error"
          />
        ));
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.custom((t) => <CustomToast id={t.id} message="Something went wrong!" type="error" />);
    }
  };
  const editPath = `/dashboard/menu/edit/${item._id}`;

  return (
    <>
      {/* Confirmation Popup */}
      <ConfirmDialog
        open={showConfirm}
        title="Delete Menu?"
        message={`Are you sure you want to delete "${item.name}"?`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Table Row */}
      <div className="grid grid-cols-[40px_70px_1fr_100px_100px_150px] items-center gap-4 py-3 border-b border-gray-100 text-sm text-gray-700">
        <p>{item.id}</p>

        <div className="w-[60px] h-[60px] overflow-hidden rounded-md shadow-sm">
          <Image
            src={imageSrc}
            alt={item.name}
            width={60}
            height={60}
            className="object-cover w-full h-full"
            unoptimized={isRemoteImage}
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              target.src = "/placeholder.jpg";
            }}
          />
        </div>

        <div className="flex flex-col">
          <p className="font-semibold">{item.name}</p>
          <p className="text-xs text-gray-500 leading-tight line-clamp-2">{item.description}</p>
        </div>

        <p className="font-semibold">Rs. {item.price}</p>
        <p>{item.category}</p>

        <div className="flex gap-2">
          <ActionButton
            icon={Pencil}
            label="Edit"
            color="green"
            onMouseEnter={() => router.prefetch(editPath)}
            onClick={() => router.push(editPath)}
          />

          <ActionButton icon={Trash2} label="Delete" color="red" onClick={() => setShowConfirm(true)} />
        </div>
      </div>
    </>
  );
}
