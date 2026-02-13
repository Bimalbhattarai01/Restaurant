import type { NextConfig } from "next";

const cloudinaryHostnames = Array.from(
  new Set(
    [
      "res.cloudinary.com",
      process.env.CLOUDINARY_HOSTNAME,
      process.env.NEXT_PUBLIC_CLOUDINARY_HOSTNAME,
    ].filter((value): value is string => Boolean(value && value.trim()))
  )
);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: cloudinaryHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
