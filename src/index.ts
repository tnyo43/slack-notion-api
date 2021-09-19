import { env } from "./constants/env";
import { debug } from "./libs/debug";
import { getApiClient } from "./libs/notion/api";
import { Page } from "./libs/notion/type";

const main = async () => {
  const apiClient = getApiClient<
    "hoge" | "bar",
    { hoge: Page.Select<"a" | "b" | "c">; bar: Page.RichText }
  >({
    databaseId: env.NOTION_TEST_DB_ID,
    token: env.NOTION_INTEGRATION_INTERNAL_TOKEN,
  });
  try {
    const result = await apiClient.post({
      title: Page.title("Name", "タイトル"),
      hoge: Page.select("a"),
      bar: Page.richText("bar"),
    });
    console.log(result.status);
  } catch (error: any) {
    debug("post", "error", error.response.data);
  }
};

main();
