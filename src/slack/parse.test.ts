import { parse } from "./parse";

const key = `key`;

describe("slack.parse", () => {
  test("parse できる", () => {
    expect(parse(`${key} hoge huga`)).toStrictEqual({
      type: "request",
      key: "hoge",
      value: "huga",
    });
  });

  test("key だけで中身がないと invalid になる", () => {
    expect(parse(`${key}`)).toStrictEqual({
      type: "invalid",
    });
  });
});
