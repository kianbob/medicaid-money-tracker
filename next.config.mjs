/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '/providers/[npi]': [
        './public/data/code-providers/**',
        './public/data/ml-scores-colab/**',
      ],
    },
  },
};

export default nextConfig;
