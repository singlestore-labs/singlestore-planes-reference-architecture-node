module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'comma-dangle': ['warn', 'never'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'padded-blocks': 'off',
    'space-before-function-paren': ['warn', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }]
  }
};
