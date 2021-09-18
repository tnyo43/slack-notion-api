import dotenv from "dotenv";
dotenv.config();

const split = (words: string | undefined) =>
  words === undefined ? [] : words.split(" ").filter((word) => word !== "");

const envSlack = {
  SLACK_TEAM_ID: process.env.SLACK_TEAM_ID || "",
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID || "",
  SLACK_TARGET_USER_IDS: split(process.env.SLACK_TARGET_IDS),
  SLACK_KEY_WORD: split(process.env.SLACK_KEY_WORD),
};

const envNotion = {
  NOTION_INTEGRATION_INTERNAL_TOKEN:
    process.env.NOTION_INTEGRATION_INTERNAL_TOKEN || "",
  NOTION_TEST_DB_ID: process.env.NOTION_TEST_DB_ID || "",
};

export const env = {
  DEBUG_MODE: process.env.DEBUG_MODE === "true",
  ...envSlack,
  ...envNotion,
};
