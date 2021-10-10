module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'prismjs',
      {
        languages: ['json', 'java', 'yaml', 'properties']
      },
    ],
  ],
}
