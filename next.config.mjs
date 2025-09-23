// Disable PWA for development to avoid conflicts
export default {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  outputFileTracingRoot: process.cwd(),

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};
