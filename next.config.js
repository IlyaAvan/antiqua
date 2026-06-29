const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    { urlPattern: /^https:\/\/.*\.(js|css|woff2?)$/, handler: "CacheFirst", options: { cacheName: "static", expiration: { maxAgeSeconds: 86400*30 } } },
    { urlPattern: /\/api\/appraise/, handler: "NetworkOnly" },
    { urlPattern: /\/journal\/.*/, handler: "StaleWhileRevalidate", options: { cacheName: "journal", expiration: { maxEntries: 30 } } },
    { urlPattern: /^https:\/\/fonts\.gstatic\.com/, handler: "CacheFirst", options: { cacheName: "fonts", expiration: { maxAgeSeconds: 86400*365 } } },
  ],
});
module.exports = withPWA({ reactStrictMode: true });
