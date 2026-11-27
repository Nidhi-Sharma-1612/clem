import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 85],
    remotePatterns: [
      // Suite photos live in the Hostaway account (124190) that powers the PMS.
      { protocol: "https", hostname: "hostaway-platform.s3.us-west-2.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "bookingenginecdn.hostaway.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
