import { env } from "./constants/env";
import { debug } from "./libs/debug";
import { getApiClient } from "./libs/notion/api";

const main = async () => {
  try {
    const result = await getApiClient({
      databaseId: env.NOTION_TEST_DB_ID,
      token: env.NOTION_INTEGRATION_INTERNAL_TOKEN,
    }).post();
    console.log(result.status);
  } catch (error: any) {
    debug("post", "error", error.response.data);
  }
};

main();
