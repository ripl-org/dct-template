// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    /** @type {import('next').NextConfig} */
    return {
      ...nextConfig,
      output: 'standalone',
      async rewrites() {
        return [
          {
            // Solves CORS issue in local development
            source: '/data-dct/:path*',
            destination: `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/data-dct/:path*`,
          },
        ];
      },
    };
  }

  return withBundleAnalyzer(nextConfig);
};
