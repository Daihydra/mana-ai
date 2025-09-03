/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // This policy is a good starting point. It allows resources from your own domain,
            // and specifically adds Google Fonts to the allowlist for styles and fonts.
            value: [
              "default-src 'self'",
              // Allows loading scripts from your own domain. 'unsafe-eval' and 'unsafe-inline' are often
              // needed for development and for some libraries to work correctly.
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              // Allows loading styles from your own domain, inline styles, and Google Fonts.
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Allows loading font files from Google Fonts.
              "font-src 'self' https://fonts.gstatic.com",
              // Allows loading images from your own domain and data URLs.
              "img-src 'self' data:",
              "connect-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

