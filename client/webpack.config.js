const Dotenv = require('dotenv-webpack');

module.exports = {
  // Other webpack configurations...
  plugins: [
    new Dotenv({
      path: '../server/.env',
    }),
    // Other plugins...
  ],
};
