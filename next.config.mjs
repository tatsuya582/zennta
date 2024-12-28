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
  images: {
    domains: [
      "avatars.githubusercontent.com", // GitHubのアバター画像
      "lh3.googleusercontent.com", // Googleのアバター画像
      "pbs.twimg.com", // Twitterのアバター画像
    ],
  },
  experimental: {
    testProxy: true,
  },
};

export default nextConfig;
