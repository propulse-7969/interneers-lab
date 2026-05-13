module.exports = {
  extends: [
    "react-app", // Or your existing ESLint config
    "react-app/jest", // Jest-specific linting rules
    // eslint-config-prettier: turns off ESLint rules that fight Prettier (keep this).
    "prettier",
  ],
  // eslint-plugin-prettier is disabled so formatting is not reported as ESLint errors.
  // Use the Prettier CLI or editor “Format Document” instead.
  rules: {},
};
