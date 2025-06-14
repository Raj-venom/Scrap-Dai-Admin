import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, 
  },
  images: {
    domains: ['res.cloudinary.com', "static.vecteezy.com"]
  }
};

export default nextConfig;
