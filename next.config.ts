import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 for the hero portrait: the current source is small (776px), so re-encoding at 75 visibly softens it.
    qualities: [75, 90],
  },
};

export default nextConfig;
