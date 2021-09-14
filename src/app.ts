import { VercelRequest, VercelResponse } from "@vercel/node";
import { debug } from "./libs/debug";
import { isFromTarget } from "./slack/isFromTarget";
import { isValidSlackMessage } from "./slack/type";

export default (req: VercelRequest, res: VercelResponse) => {
  debug("req.body", "log", req.body);
  const isValid = isValidSlackMessage(req.body) && isFromTarget(req.body);
  debug("is valid request", "log", isValid);

  if (!isValid) return;

  res.send({
    text: "Hello World!",
  });
};
