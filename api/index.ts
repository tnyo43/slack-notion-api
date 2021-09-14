import { VercelRequest, VercelResponse } from "@vercel/node";

export default (req: VercelRequest, res: VercelResponse) => {
  console.log(req);
  res.send({
    text: "Hello SlackApp!",
    challenge: req.body.challenge,
  });
};
