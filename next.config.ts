/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["image.tmdb.org"], // ✅ allow TMDB images
    formats: ["image/avif", "image/webp"], // modern formats
  },
};

export default nextConfig;
