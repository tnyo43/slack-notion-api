import { VercelRequest, VercelResponse } from "@vercel/node";
import { debug } from "./libs/debug";
import { isFromTarget } from "./slack/isFromTarget";
import { parse } from "./slack/parse";
import { isValidSlackMessage } from "./slack/type";

const judgeAndParse = (body: any) =>
  isValidSlackMessage(body) && isFromTarget(body)
    ? parse(body.text)
    : undefined;

export default (req: VercelRequest, res: VercelResponse) => {
  const body = req.body;
  debug("req.body", "log", body);

  const result = judgeAndParse(body);
  if (result === undefined) return;

  res.send({
    text: JSON.stringify(result),
  });
};
