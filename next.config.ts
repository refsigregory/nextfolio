import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Don't let `next dev` write AGENTS.md when it's run by an AI coding tool.
  agentRules: false,
};

export default nextConfig;
