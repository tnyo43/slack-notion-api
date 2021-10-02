/* eslint-disable camelcase */
export type SlackMessage = {
  team_id: string;
  channel_id: string;
  user_id: string;
  text: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidSlackMessage = (message: any): message is SlackMessage =>
  !!message &&
  typeof message.team_id === 'string' &&
  typeof message.channel_id === 'string' &&
  typeof message.user_id === 'string' &&
  typeof message.text === 'string';
