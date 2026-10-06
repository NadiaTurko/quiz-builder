import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));
const isGitHubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/quiz-builder" : undefined,
  assetPrefix: isGitHubPages ? "/quiz-builder" : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@quiz-builder/shared"],
  turbopack: {
    root: path.resolve(frontendDir, ".."),
  },
};

export default nextConfig;
