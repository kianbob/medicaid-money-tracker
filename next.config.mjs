/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.openmedicaid.org' }],
        destination: 'https://openmedicaid.org/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
