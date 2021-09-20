import { apiCliet } from "./apis";
import { debug } from "./libs/debug";

const main = async () => {
  try {
    const result = await apiCliet.fetchProblems({ keyword: "洗濯物" });
    (
      result.data.results as {
        created_time: string;
        properties: {};
      }[]
    ).forEach((result) =>
      console.log(JSON.stringify(result.properties), result.created_time)
    );
  } catch (error: any) {
    debug("post", "error", error.response.data);
  }
};

main();
