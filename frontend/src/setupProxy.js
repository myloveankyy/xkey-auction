const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for all API requests
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
    })
  );

  // --- NEW: Proxy specifically for the uploads folder ---
  // This tells React to forward any request that starts with /uploads
  // to your backend server on port 5001.
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
    })
  );
};