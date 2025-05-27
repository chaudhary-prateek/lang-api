// release.config.js
module.exports = {
    repositoryUrl: "https://github.com/chaudhary-prateek/lang-api",
    branches: ["main"],
    plugins: [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/github",
      "@semantic-release/git"
    ]
  };