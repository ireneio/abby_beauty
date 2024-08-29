/** @type {import('next').NextConfig} */

const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['winop3gdaoox7usg.public.blob.vercel-storage.com']
  },
  webpack: (config) => {
    if (config.optimization.splitChunks) {
      config.optimization.splitChunks.cacheGroups = {
        ...(config.optimization.splitChunks.cacheGroups || {}),
        adminPages: {
          test: /[\\/]pages[\\/]admin[\\/]/,
          name: 'admin',
          chunks: 'all',
          enforce: true,
        },
        adminComponents: {
          test: /[\\/]components[\\/]admin[\\/]/,
          name: 'admin-components',
          chunks: 'all',
          enforce: true,
        },
        clientComponents: {
          test: /[\\/]components[\\/]client[\\/]/,
          name: 'client-components',
          chunks: 'all',
          enforce: true,
        },
      }
    }
    return config
  }
};

export default withBundleAnalyzer(nextConfig);
