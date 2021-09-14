const envSlack = {
  SLACK_TEAM_ID: process.env.SLACK_TEAM_ID || "",
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID || "",
  SLACK_TARGET_USER_IDS: (process.env.SLACK_TARGET_IDS || "")
    .split(" ")
    .filter((id) => id !== ""),
};

export const env = {
  DEBUG_MODE: process.env.DEBUG_MODE === "true",
  ...envSlack,
};
