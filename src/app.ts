import { VercelRequest, VercelResponse } from "@vercel/node";
import { debug } from "./libs/debug";
import { isFromTarget } from "./slack/isFromTarget";
import { post } from "./slack/post";
import { isValidSlackMessage } from "./slack/type";

const judgeAndPost = (body: any) =>
  isValidSlackMessage(body) && isFromTarget(body) ? post(body.text) : undefined;

export default (req: VercelRequest, res: VercelResponse) => {
  const body = req.body;
  debug("req.body", "log", body);

  const result = judgeAndPost(body);
  if (result === undefined) return;
  res.send({ text: result });
};
