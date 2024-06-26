/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // ignoreBuildErrors: true,
  // experimental: {
  //   optimizePackageImports: ["devicons-react"],
  // },
};

module.exports = nextConfig;
