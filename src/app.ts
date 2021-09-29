import { VercelRequest, VercelResponse } from '@vercel/node';
import { debug } from './utils/debug';
import { isFromTarget } from './slack/isFromTarget';
import { post } from './slack/post';
import { isValidSlackMessage } from './slack/type';

const judgeAndPost = async (body: any) =>
  isValidSlackMessage(body) && isFromTarget(body) ? await post(body.text) : undefined;

export default async (req: VercelRequest, res: VercelResponse) => {
  const body = req.body;
  debug('req.body', 'log', body);

  const result = await judgeAndPost(body);
  if (result === undefined) return;
  res.send({ text: result });
};
