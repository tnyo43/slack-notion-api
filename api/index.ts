import { VercelRequest, VercelResponse } from "@vercel/node";
import { debug } from "../src/libs/debug";
import { isFromTarget } from "../src/slack/isFromTarget";
import { isValidSlackMessage } from "../src/slack/type";

export default (req: VercelRequest, res: VercelResponse) => {
  debug("req.body", "log", req.body);
  const isValid = isValidSlackMessage(req.body) && isFromTarget(req.body);
  debug("is valid request", "log", isValid);

  if (!isValid) return;

  res.send({
    text: "Hello World!",
  });
};
