/**
 * @import {FlatXoConfig} from 'xo'
 */

/** @type {FlatXoConfig} */
const xoConfig = [
  {
    name: 'default',
    prettier: 'compat',
    rules: {
      // Conflicts with Prettier, which removes the parentheses.
      '@stylistic/no-mixed-operators': 'off',
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-line-alignment': 'off',
      'jsdoc/informative-docs': 'off',
      'jsdoc/require-asterisk-prefix': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-object-spread': 'off',
      'regexp/sort-character-class-elements': 'off',
      'regexp/use-ignore-case': 'off',
      'require-unicode-regexp': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      // Wrong for replacer functions.
      'unicorn/no-unsafe-string-replacement': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prefer-code-point': 'off',
      'unicorn/prefer-simple-condition-first': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/prefer-unicode-code-point-escapes': 'off',
      'unicorn/require-array-sort-compare': 'off',
      'unicorn/single-line-block-comment-style': 'off'
    },
    space: true
  },
  // Wrong.
  {ignores: ['**/*.md']},
  {
    files: ['package.json'],
    rules: {
      'package-json/consistent-path-prefix': 'off',
      'package-json/prefer-exports': 'off',
      'package-json/require-engines': 'off',
      'package-json/sort-files': 'off',
      'package-json/sort-properties': 'off'
    }
  }
]

export default xoConfig
