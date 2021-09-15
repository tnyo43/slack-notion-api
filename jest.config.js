module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/src/testConfig/setup.ts"],
  testRegex: "((\\.|/)(test|spec))\\.ts$",
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/e2e",
  ],
};
