// release.config.js
module.exports = {
    branches: ['main'],
    REPO_URL: ['https://github.com/chaudhary-prateek/lang-api.git']
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/changelog',
      '@semantic-release/npm',
      '@semantic-release/github',
      '@semantic-release/git'
    ]
  };
  