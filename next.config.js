/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent webpack errors
  webpack: (config, { isServer }) => {
    // Fix for webpack runtime errors
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  
  // Experimental features for stability
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Prevent build errors
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Optimize images
  images: {
    domains: [],
    unoptimized: true,
  },
  
  // Prevent memory issues
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Increase body size limit for large video uploads
  serverRuntimeConfig: {
    api: {
      bodyParser: {
        sizeLimit: '2gb',
      },
      responseLimit: false,
    },
  },
};

module.exports = nextConfig; 