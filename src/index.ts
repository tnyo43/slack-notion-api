import { apiCliet } from "./apis";
import { debug } from "./utils/debug";

const main = async () => {
  try {
    const result = await apiCliet.fetchProblems({
      keyword: "洗濯物",
      stressLevel: 2,
    });
    result.results.forEach((r) => console.log(JSON.stringify(r.properties)));
  } catch (error: any) {
    debug("post", "error", error);
  }
};

main();
