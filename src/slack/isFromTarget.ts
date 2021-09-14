import { env } from "src/constants/env";
import { SlackMessage } from "./type";

export const isFromTarget = (message: SlackMessage) =>
  message.team_id === env.SLACK_TEAM_ID &&
  message.channel_id === env.SLACK_CHANNEL_ID &&
  env.SLACK_TARGET_USER_IDS.some((id) => id === message.user_id);
