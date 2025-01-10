import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
      'ufs.sh',
      'img.clerk.com',
      'subdomain',
      'files.stripe.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ufs.sh', // Matches all subdomains of ufs.sh
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
