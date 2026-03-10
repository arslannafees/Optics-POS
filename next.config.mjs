/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        // 'unsafe-eval' is required by recharts and other charting libs that use new Function()
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com data:",
                            "img-src 'self' data: blob:",
                            "connect-src 'self'",
                            "worker-src 'self' blob:",
                        ].join('; '),
                    },
                ],
            },
        ];
    },

    // Prevent Next.js from bundling native server-only modules
    serverExternalPackages: ['better-sqlite3'],

    // Enable compression
    compress: true,

    // Optimize images
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },

    // Experimental optimizations
    experimental: {
        optimizePackageImports: [
            'recharts',
            'lucide-react',
            '@radix-ui/react-icons',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-avatar',
            '@radix-ui/react-label',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            'date-fns',
            '@tanstack/react-table',
        ],
    },

    // Production optimizations
    productionBrowserSourceMaps: false,

    // Reduce powered-by header
    poweredByHeader: false,
};

export default nextConfig;
