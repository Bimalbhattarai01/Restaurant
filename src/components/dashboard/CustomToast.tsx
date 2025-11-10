"use client";

import { X } from "lucide-react";
import { toast } from "react-hot-toast";

interface CustomToastProps {
  id: string;
  message: string;
  type?: "success" | "error";
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function CustomToast({ id, message, type = "success", buttonLabel, onButtonClick }: CustomToastProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-center justify-between w-full max-w-md rounded-2xl px-4 py-3 shadow-md border animate-fadeIn ${
        isSuccess ? "bg-green-50 border-green-400 text-green-700" : "bg-red-50 border-red-400 text-red-700"
      }`}
    >
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-6 h-6 rounded-md ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
        >
          {isSuccess ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="white"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="white"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <p className="font-medium">{message}</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 ml-4">
        {buttonLabel && (
          <button
            onClick={() => {
              onButtonClick?.();
              toast.dismiss(id);
            }}
            className={`font-semibold text-sm hover:underline ${isSuccess ? "text-green-700" : "text-red-700"}`}
          >
            {buttonLabel}
          </button>
        )}

        <button
          onClick={() => toast.dismiss(id)}
          className={`transition ${
            isSuccess ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"
          }`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
