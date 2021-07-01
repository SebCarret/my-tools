const withLess = require("next-with-less");

module.exports = withLess({
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "primary-color": "#23B5D3",
        "success-color": "#0CCA4A",
        "error-color": "#DB2B39",
        "text-color": "#4C5F6B",
        "font-family": "Montserrat"
      },
      javascriptEnabled: true
    },
  },
});