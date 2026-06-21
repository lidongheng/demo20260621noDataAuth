module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "prettier"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  ignorePatterns: ["dist/", "node_modules/"],
  rules: {
    "no-nested-ternary": "error",
  },
};
