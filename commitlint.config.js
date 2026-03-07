/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Types autorisés
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'refactor',
        'test',
        'style',
        'perf',
        'revert',
        'ci',
        'build',
      ],
    ],
    // Scope obligatoire (ex: feat(ui): ...)
    'scope-empty': [1, 'never'],
    // Pas de contrainte sur la casse du sujet (pour le français)
    'subject-case': [0],
    // Longueur max du header
    'header-max-length': [2, 'always', 100],
  },
};

module.exports = config;
