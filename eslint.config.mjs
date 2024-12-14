import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin'; // Correct import for TypeScript ESLint plugin
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier'; // Make sure to include the TypeScript parser

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly'
      },
      parser: tsparser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      semi: ['error', 'always'],
      'no-process-env': 'off',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^(ignoredExport|NODE_ENV||LogsTypes|LogsServices)$',
          "argsIgnorePattern": "^_",
        },
      ],

    },
  },
  pluginJs.configs.recommended,
  pluginJs.configs.recommended,
];
