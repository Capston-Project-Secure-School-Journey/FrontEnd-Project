module.exports = {
  env: {
    node: true,
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ["@whoj"],
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
};
