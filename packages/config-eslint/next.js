const base = require('./index.js');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  extends: [...(base.extends ?? []), 'next/core-web-vitals', 'plugin:react-hooks/recommended'],
  rules: {
    ...base.rules,
    // Hooks React
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // Lien interne Next.js via <Link>, pas <a>
    '@next/next/no-html-link-for-pages': 'error',
  },
};
