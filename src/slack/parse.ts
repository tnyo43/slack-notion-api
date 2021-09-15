import { env } from "../constants/env";
import { debug } from "../libs/debug";

type ParsedMessage =
  | {
      type: "invalid";
    }
  | {
      type: "request";
      key: string;
      value: string;
    };

const invalid: ParsedMessage = { type: "invalid" };

export const parse = (message: string): ParsedMessage => {
  const words = message
    .split(" ")
    .filter(
      (word) =>
        word !== "" && !env.SLACK_KEY_WORD.some((keyword) => word === keyword)
    );

  debug("text", "log", [message, words]);

  if (words.length === 0) {
    return invalid;
  }

  const [key, ...value] = words;
  return {
    type: "request",
    key,
    value: value.join(" "),
  };
};
