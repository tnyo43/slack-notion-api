import { getApiClient } from '~/libs/notion';
import { env } from '~/constants/env';
import { Page } from '~/libs/notion/types/Page';

type Label = 'stressLevel';

type LabelOfstressLevel = 'π' | 'π­π­π­' | 'π€’π€’π€’π€’π€’';
type Data = {
  stressLevel: Page.Property.Select<LabelOfstressLevel>;
};
type PageType = Page.DataWithTitle<Label, Data>;

const labelDisplayMap: Page.Property.LabelDisplayMap<Label> = {
  title: 'Name',
  stressLevel: 'γ€γγεΊ¦ε',
};

const apiClient = getApiClient<Label, PageType>(
  {
    databaseId: env.NOTION_PROBLEM_DB_ID,
    token: env.NOTION_INTEGRATION_INTERNAL_TOKEN,
  },
  labelDisplayMap
);

const stressLevelOfNumber = (x: 1 | 2 | 3 | undefined): LabelOfstressLevel | undefined =>
  x === 1 ? 'π' : x === 2 ? 'π­π­π­' : x === 3 ? 'π€’π€’π€’π€’π€’' : undefined;

export namespace ProblemParams {
  export type FetchProblems = {
    keyword?: string;
    stressLevel?: 1 | 2 | 3;
  };
  export type PostProblem = {
    title: string;
    stressLevel: 1 | 2 | 3 | undefined;
  };
}

export const problemsApiClient = {
  fetchProblems: async (params: ProblemParams.FetchProblems) => {
    return await apiClient.fetchAll({
      filter: Page.or([
        params.keyword
          ? {
              type: 'text',
              property: 'title',
              condition: 'contains',
              value: params.keyword,
            }
          : null,
        stressLevelOfNumber(params.stressLevel)
          ? {
              type: 'select',
              property: 'stressLevel',
              condition: 'equals',
              value: stressLevelOfNumber(params.stressLevel),
            }
          : null,
      ]),
      sort: [
        {
          property: 'stressLevel',
          direction: 'descending',
        },
        {
          property: 'created_time',
          direction: 'descending',
        },
      ],
    });
  },

  postProblem: async (params: ProblemParams.PostProblem) => {
    const stressLevel = stressLevelOfNumber(params.stressLevel);
    return await apiClient.post({
      title: Page.Property.title(params.title),
      stressLevel: stressLevel === undefined ? undefined : Page.Property.select<LabelOfstressLevel>(stressLevel),
    });
  },
};
