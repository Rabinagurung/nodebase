import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
      return [
        {
          source: "/", 
          destination: "/workflows", 
          //if you have other Next.js project in machine setting to true will make the root page to worklflows too.
          permanent: false
        }
      ]
  }
};

export default nextConfig;
