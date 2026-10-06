import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ["@quiz-builder/shared"],
  turbopack: {
    root: path.resolve(frontendDir, ".."),
  },
};

export default nextConfig;
