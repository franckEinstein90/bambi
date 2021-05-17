const path = require('path');

module.exports = {
  mode : 'development', 
  entry: './src/client/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js/lib')
  },
};
