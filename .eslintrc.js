module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  // add your custom rules here
  rules: {
    "indent": [2, 2],
    "comma-spacing": ["error", { before: false, after: true }],
    "space-before-function-paren": [
      "error",
      { anonymous: "always", named: "never", asyncArrow: "always" }
    ],
    "no-console": ["off"],
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  "overrides": [
    {
      "files": ["build/*"],
      "rules": {
        "space-before-function-paren": ["off"],
        "comma-spacing": ["off"]
      }
    }
  ],
};
