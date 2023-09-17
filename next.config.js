/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: "REPLACE_WITH_API_KEY",
  },
};

module.exports = nextConfig;
