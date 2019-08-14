module.exports = {
  extends: ["eslint:recommended", "react-app", "plugin:prettier/recommended", "prettier/@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
    "flowtype",
    "jsx-a11y",
    "react",
    "react-hooks"
  ]
};
