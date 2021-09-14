import { VercelRequest, VercelResponse } from "@vercel/node";

const urlVerificationType = "url_verification";

export default (req: VercelRequest, res: VercelResponse) => {
  if (req.body.type === urlVerificationType) {
    res.send({
      text: "Hello SlackApp!",
      challenge: req.body.challenge,
    });
  }
  res.send({
    text: "Hello World!",
  });
};
