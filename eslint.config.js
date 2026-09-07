import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const restrictedMiddlewareImports = {
  base: [
    '@/middleware/tools/**',
    '@/middleware/windows/**',
    'src/middleware/tools/**',
    'src/middleware/windows/**',
  ],
  windows: [
    '@/middleware/tools/**',
    '@/middleware/base/**',
    'src/middleware/tools/**',
    'src/middleware/base/**',
  ],
  tools: [
    '@/middleware/windows/**',
    '@/middleware/base/**',
    'src/middleware/windows/**',
    'src/middleware/base/**',
  ],
};

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-restricted-imports': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'no-empty': 'off',
      // 'no-unused-vars': [
      //   'error',
      //   {
      //     varsIgnorePattern: '^[A-Z_]',
      //     argsIgnorePattern: '^_',
      //   },
      // ],
    },
  },

  {
  files: ['**/*.meta.ts'],
  rules: {
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 1,
        },
        ObjectPattern: {
          multiline: true,
        },
        ImportDeclaration: 'never',
        ExportDeclaration: 'never',
      },
    ],

    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
  },
},
  // base → base only
  {
    files: ['src/middleware/base/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: restrictedMiddlewareImports.base,
        },
      ],
    },
  },

  // // windows → windows only
  {
    files: ['src/middleware/windows/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: restrictedMiddlewareImports.windows,
        },
      ],
    },
  },

  // // tools → tools only
  {
    files: ['src/middleware/tools/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: restrictedMiddlewareImports.tools,
        },
      ],
    },
  },

  // // Discovery services are the controlled entry points.
  // {
  //   files: [
  //     'src/toolDiscovery.ts',
  //     'src/windowDiscovery.ts',
  //   ],
  //   rules: {
  //     'no-restricted-imports': 'off',
  //   },
  // },
]);
