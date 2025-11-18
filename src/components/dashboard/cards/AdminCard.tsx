import Image from "next/image";

interface AdminCardProps {
  name?: string;
  role?: string;
  message?: string;
  image?: string;
  bgImage?: string;
  width?: string;
  height?: string;
}

export default function AdminCard({
  name = "Admin",
  role = "Current User",
  message = "Have a great day ahead..",
  image = "/assets/landing/illustrations/admin.svg",
  bgImage = "/assets/landing/illustrations/food4.svg",
  width = "w-full",
  height = "h-[130px]",
}: AdminCardProps) {
  return (
    <div
      className={`relative ${width} ${height} rounded-lg overflow-hidden shadow-md bg-gradient-to-r from-[#BF1E2E] to-[#c73344] text-white flex items-center justify-between p-4`}
    >
      <div className="absolute inset-0 opacity-80">
        <Image src={bgImage} alt="Background texture" fill className="object-cover object-center" />
      </div>

      <div className="relative flex flex-col justify-center z-10">
        <p className="text-[14px] font-medium opacity-90">{role}</p>
        <h2 className="text-[22px] font-bold leading-tight">{name}</h2>
        <p className="text-[13px] opacity-90 mt-4">{message}</p>
      </div>

      <div className="absolute bottom-0 right-2 h-full flex items-end justify-center z-10">
        <Image src={image} alt="Admin Illustration" width={110} height={110} className="object-contain" />
      </div>
    </div>
  );
}
