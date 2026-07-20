/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Allow merchant sites to iframe the shared chat UI (same components as landing).
        // Prefer CSP only — do not set X-Frame-Options (invalid values can block framing).
        source: '/embed',
        headers: [{ key: 'Content-Security-Policy', value: 'frame-ancestors *' }],
      },
      {
        source: '/embed/:path*',
        headers: [{ key: 'Content-Security-Policy', value: 'frame-ancestors *' }],
      },
    ];
  },
};

export default nextConfig;
