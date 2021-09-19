import { getApiClient } from "../../libs/notion";
import { env } from "../../constants/env";
import { Page } from "../../libs/notion/type";

type Label = "hardness";

type LabelOfHardness = "😗" | "😭😭😭" | "🤢🤢🤢🤢🤢";
type DataType = { hardness: Page.Select<LabelOfHardness> };
type PageType = DataType & { title: Page.Title };

const labelDisplayMap: Page.LabelDisplayMap<Label> = {
  title: "Name",
  hardness: "hoge",
};

const apiClient = getApiClient<Label, PageType>(
  {
    databaseId: env.NOTION_PROBLEM_DB_ID,
    token: env.NOTION_INTEGRATION_INTERNAL_TOKEN,
  },
  labelDisplayMap
);

const hardnessOfNumber = (
  x: 1 | 2 | 3 | undefined
): LabelOfHardness | undefined =>
  x === 1 ? "😗" : x === 2 ? "😭😭😭" : x === 3 ? "🤢🤢🤢🤢🤢" : undefined;

export namespace ProblemParams {
  export type PostProblem = {
    title: string;
    hardness: 1 | 2 | 3 | undefined;
  };
}

export const problemsApiClient = {
  postProblem: async (params: ProblemParams.PostProblem) => {
    const hardness = hardnessOfNumber(params.hardness);
    return await apiClient.post({
      title: Page.title(params.title),
      hardness:
        hardness === undefined
          ? undefined
          : Page.select<LabelOfHardness>(hardness),
    });
  },
};
