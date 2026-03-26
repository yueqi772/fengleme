module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' }, modules: false }],
    ['@babel/preset-typescript', { allExtensions: false }],
  ],
  overrides: [
    {
      test: /\.[jt]sx$/,
      presets: [
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    },
  ],
};
