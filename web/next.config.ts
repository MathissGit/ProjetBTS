const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path',
        destination: 'http://api.brasseriets.great-site.net/public/api/:path*',
      },
    ];
  },
};

export default nextConfig;