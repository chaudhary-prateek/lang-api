//// release.config.js
//module.exports = {
//    repositoryUrl: "https://github.com/chaudhary-prateek/lang-api",
//    branches: ["main"],
//    plugins: [
//      "@semantic-release/commit-analyzer",
//      "@semantic-release/release-notes-generator",
//      "@semantic-release/changelog",
//      "@semantic-release/npm",
//      "@semantic-release/github",
//      "@semantic-release/git"
//    ]
//  };

  module.exports = {
    branches: ['main'],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      '@semantic-release/changelog',
      [
        '@semantic-release/git',
        {
          assets: ['CHANGELOG.md', 'package.json'],
          message: 'chore(release): ${nextRelease.version} [skip ci]',
        },
      ],
      '@semantic-release/github',
    ],
  };
  