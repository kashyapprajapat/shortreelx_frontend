/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverActions: {
        bodySizeLimit: "10mb", // Increase the limit (default is 1MB)
      },
    },
  };
  
  export default nextConfig;