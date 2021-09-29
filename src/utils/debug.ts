import { env } from '../constants/env';

type DebugType = 'log' | 'error';

export const debug = (key: string, type: DebugType, content: any) => {
  if (env.DEBUG_MODE) {
    const print = type === 'log' ? console.log : console.error;
    print(key, content);
  }
};
