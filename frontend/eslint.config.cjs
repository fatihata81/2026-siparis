const hooks = require("eslint-plugin-react-hooks");

module.exports = [{
  files: ["src/**/*.{js,jsx}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  plugins: { "react-hooks": hooks },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-nested-ternary": "error",
  },
}];