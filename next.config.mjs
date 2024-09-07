/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    return [
      {
        source: '/socket.io/:path*',
        destination: `${socketUrl}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
