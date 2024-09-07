/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
