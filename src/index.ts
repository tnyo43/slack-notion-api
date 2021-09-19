import { apiCliet } from "./apis";
import { debug } from "./libs/debug";

const main = async () => {
  try {
    await apiCliet.postProblem({
      title: "こんにちは",
      hardness: 2,
    });
  } catch (error: any) {
    debug("post", "error", error.response.data);
  }
};

main();
