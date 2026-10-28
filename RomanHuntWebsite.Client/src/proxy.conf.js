const { env } = require('process');

const target = 'https://localhost:57529';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api"
    ],
    target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive' // Good practice for .NET SPA proxies
    }
  }
]

module.exports = PROXY_CONFIG;
