import { env } from "./constants/env";
import { post } from "./libs/notion/api";

const main = async () => {
  await post(env.NOTION_TEST_DB_ID, env.NOTION_INTEGRATION_INTERNAL_TOKEN);
  console.log("Hello World");
};

main();
