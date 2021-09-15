import { VercelRequest, VercelResponse } from "@vercel/node";
import { debug } from "./libs/debug";
import { isFromTarget } from "./slack/isFromTarget";
import { parse } from "./slack/parse";
import { isValidSlackMessage } from "./slack/type";

export default (req: VercelRequest, res: VercelResponse) => {
  const body = req.body;
  debug("req.body", "log", body);
  const isValid = isValidSlackMessage(body) && isFromTarget(body);

  if (!isValid) return;

  const result = parse(body.text);
  res.send({
    text: JSON.stringify(result),
  });
};
