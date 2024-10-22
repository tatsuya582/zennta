/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 5000,
        aggregateTimeout: 5000,
      };
    }
    return config;
  },
};

export default nextConfig;
