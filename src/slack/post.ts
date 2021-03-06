import { env } from '~/constants/env';
import { debug } from '~/utils/debug';
import { problemKeyword, problemMessageHandler } from '~/notion/domains/problem';

const defaultInvalidMessage = `次のキーワードを入力してください "${problemKeyword}"`;

export const post = async (message: string): Promise<string> => {
  const words = message
    .split(' ')
    .filter((word) => word !== '' && !env.SLACK_KEY_WORD.some((keyword) => word === keyword));

  debug('text', 'log', [message, words]);

  if (words.length === 0) {
    return defaultInvalidMessage;
  }

  for (const handler of [problemMessageHandler]) {
    const message = handler.parse(words);
    if (message === undefined) continue;
    if (message.type === 'invalid') return message.content;
    const result = await handler.action(message);
    return result;
  }

  return defaultInvalidMessage;
};
