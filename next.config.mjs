/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: 'handsome-husky-406.convex.cloud',
          },
        ],
      }, 
};

export default nextConfig;
