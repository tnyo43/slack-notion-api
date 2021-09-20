import { getApiClient } from "../../libs/notion";
import { env } from "../../constants/env";
import { Page } from "../../libs/notion/type";
import axios from "axios";

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
    return axios.post(
      `https://api.notion.com/v1/databases/${env.NOTION_PROBLEM_DB_ID}/query`,
      {
        filter: {
          and: [
            ...(params.keyword
              ? [
                  {
                    property: "Name",
                    text: {
                      contains: params.keyword,
                    },
                  },
                ]
              : []),
          ],
        },
        sorts: [
          {
            property: "つらさ度合",
            direction: "descending",
          },
          {
            timestamp: "created_time",
            direction: "descending",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${env.NOTION_INTEGRATION_INTERNAL_TOKEN}`,
          "Notion-Version": "2021-05-13",
          "Content-Type": "application/json",
        },
      }
    );
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
