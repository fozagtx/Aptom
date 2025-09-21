import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  disable: process.env.NODE_ENV === "development",
});

// Your Next config is automatically typed!
export default withPWA({
  // Remove static export for development
  // output: "export", // Only use for production builds
  // distDir: "./dist", // Only use for production builds
  basePath: process.env.NEXT_PUBLIC_BASE_PATH, // Sets the base path to `/some-base-path`.
});
