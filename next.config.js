const withLess = require("next-with-less");

module.exports = withLess({
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "primary-color": "#231F20",
        "text-color": "#666666",
        "font-family": "Poppins"
      },
      javascriptEnabled: true
    },
  },
});