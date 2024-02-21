const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Your API endpoints prefix
    createProxyMiddleware({
      target: 'http://localhost:8080', // Your server address
      changeOrigin: true,
    })
  );
};
