/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.localhost'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
}

export default nextConfig
