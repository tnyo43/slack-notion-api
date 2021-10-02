import { env } from '~/constants/env';

type DebugType = 'log' | 'error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = (key: string, type: DebugType, content: any) => {
  if (env.DEBUG_MODE) {
    const print = type === 'log' ? console.log : console.error;
    print(key, content);
  }
};
