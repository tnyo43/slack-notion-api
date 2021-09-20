import { getApiClient } from "../../libs/notion";
import { env } from "../../constants/env";
import { Page } from "../../libs/notion/type";

type Label = "stressLevel";

type LabelOfstressLevel = "😗" | "😭😭😭" | "🤢🤢🤢🤢🤢";
type DataType = { stressLevel: Page.Select<LabelOfstressLevel> };
type PageType = DataType & { title: Page.Title };

const labelDisplayMap: Page.LabelDisplayMap<Label> = {
  title: "Name",
  stressLevel: "つらさ度合",
};

const apiClient = getApiClient<Label, PageType>(
  {
    databaseId: env.NOTION_PROBLEM_DB_ID,
    token: env.NOTION_INTEGRATION_INTERNAL_TOKEN,
  },
  labelDisplayMap
);

const stressLevelOfNumber = (
  x: 1 | 2 | 3 | undefined
): LabelOfstressLevel | undefined =>
  x === 1 ? "😗" : x === 2 ? "😭😭😭" : x === 3 ? "🤢🤢🤢🤢🤢" : undefined;

export namespace ProblemParams {
  export type FetchProblems = {
    keyword?: string;
  };
  export type PostProblem = {
    title: string;
    stressLevel: 1 | 2 | 3 | undefined;
  };
}

export const problemsApiClient = {
  fetchProblems: async (params: ProblemParams.FetchProblems) => {
    return await apiClient.fetchAll({
      filter: params.keyword
        ? {
            type: "text",
            property: "title",
            condition: "contains",
            value: params.keyword,
          }
        : undefined,
      sort: [
        {
          property: "stressLevel",
          direction: "descending",
        },
        {
          property: "created_time",
          direction: "descending",
        },
      ],
    });
  },

  postProblem: async (params: ProblemParams.PostProblem) => {
    const stressLevel = stressLevelOfNumber(params.stressLevel);
    return await apiClient.post({
      title: Page.title(params.title),
      stressLevel:
        stressLevel === undefined
          ? undefined
          : Page.select<LabelOfstressLevel>(stressLevel),
    });
  },
};
