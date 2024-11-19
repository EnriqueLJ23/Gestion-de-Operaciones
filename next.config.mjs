/** @type {import('next').NextConfig} */
const nextConfig = {  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/incidencias',
        permanent: true,
      },
    ]
  },
  output: "standalone",
};

export default nextConfig;
