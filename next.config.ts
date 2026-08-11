import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // Reserved-area image uploads are sent as multipart form data through
      // Server Actions; raise the cap well above the 1MB default.
      bodySizeLimit: "16mb",
    },
  },
};

export default nextConfig;
