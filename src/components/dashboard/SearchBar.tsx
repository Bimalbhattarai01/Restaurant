"use client";
import { useMemo, useState } from "react";
import { Search, Bell, MessageSquareText } from "lucide-react";

type SearchBarProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export default function SearchBar({ value, placeholder = "Search...", onChange }: SearchBarProps) {
  const isControlled = useMemo(() => value !== undefined, [value]);
  const [internalValue, setInternalValue] = useState("");

  const displayValue = isControlled ? value! : internalValue;

  const handleChange = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Search Box */}
      <div className="flex items-center bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md">
        <div className="bg-[#BF1E2E] p-3 flex items-center justify-center rounded-l-xl">
          <Search className="text-white w-5 h-5" strokeWidth={2.5} />
        </div>

        <input
          type="text"
          value={displayValue}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 text-[#7C6F6F] placeholder-[#7C6F6F] text-[15px] outline-none bg-transparent"
        />
      </div>

      {/* Notification Buttons */}
      <div className="flex items-center gap-3 ml-4">
        <button className="bg-[#BF1E2E] w-[45px] h-[45px] flex items-center justify-center rounded-[8px] shadow-md hover:scale-105 transition-all duration-200">
          <MessageSquareText size={22} className="text-white" strokeWidth={2.2} />
        </button>

        <button className="bg-[#C64A53] w-[45px] h-[45px] flex items-center justify-center rounded-[8px] shadow-md hover:scale-105 transition-all duration-200">
          <Bell size={22} className="text-white" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
