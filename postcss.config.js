const path = require("path")

module.exports = {
  plugins: {
    "postcss-import": {
      path: [ path.resolve(__dirname, "src") ]
    },
    "postcss-mixins": {},
    "postcss-custom-properties": {},
    "postcss-custom-media": {},
    "postcss-apply": {},
    "postcss-nesting": {},
    "postcss-flexbugs-fixes": {},
    "postcss-sorting": {},
    "autoprefixer": {
      browsers: [
        "ie >= 11",
        "last 2 Edge versions",
        "last 2 Firefox versions",
        "last 2 Chrome versions",
        "last 2 Safari versions",
        "last 2 Opera versions",
        "last 2 iOS versions",
        "last 2 ChromeAndroid versions"
      ]
    },
  }
}
