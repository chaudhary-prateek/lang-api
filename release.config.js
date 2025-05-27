module.exports = {
    repositoryUrl: "https://github.com/chaudhary-prateek/lang-api", // ✅ your actual repo URL
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
  