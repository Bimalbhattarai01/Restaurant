import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  color: "red" | "green";
  onClick?: () => void;
}

export default function ActionButton({ icon: Icon, label, color, onClick }: ActionButtonProps) {
  const colorClass =
    color === "red" ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-green-100 text-green-600 hover:bg-green-200";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition ${colorClass}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
