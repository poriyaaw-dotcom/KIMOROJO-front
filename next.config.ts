import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow both localhost and 127.0.0.1 to prevent WebSocket HMR blocking in dev
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  
  // Your existing performance and Tailwind Turbopack configurations
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;