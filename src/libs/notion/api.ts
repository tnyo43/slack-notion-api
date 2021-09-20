import axios from "axios";
import { isTimestamp, Page } from "./type";

type ApiClientKey = { databaseId: string; token: string };

interface IApiClient<Label extends string, Data extends Page.DataType<Label>> {
  post: (page: Page.Page<Label, Data>) => Promise<any>;
}

class ApiClient<Label extends string, Data extends Page.DataType<Label>>
  implements IApiClient<Label, Data>
{
  private databaseId: string;
  private headers = {};
  private labelDisplayMap: Page.LabelDisplayMap<Label>;

  constructor(key: ApiClientKey, labelDisplayMap: Page.LabelDisplayMap<Label>) {
    this.databaseId = key.databaseId;
    this.headers = {
      Authorization: `Bearer ${key.token}`,
      "Notion-Version": "2021-05-13",
      "Content-Type": "application/json",
    };
    this.labelDisplayMap = labelDisplayMap;
  }

  async fetchAll(fetchCondition: Page.FetchParams<Label, Data>) {
    const getFilter = (formula: Page.Filter<Label, Data>) => ({
      property: formula.property,
      [formula.type]: {
        [formula.condition]: formula.value,
      },
    });

    const filter =
      fetchCondition.filter === undefined
        ? {}
        : { filter: getFilter(fetchCondition.filter) };

    const getSorts = (sorts: Page.SortPage<Label>) =>
      sorts.map(({ property, direction }) => ({
        ...(isTimestamp(property)
          ? {
              timestamp: property,
            }
          : {
              property: this.labelDisplayMap[property],
            }),
        direction,
      }));

    const sorts =
      fetchCondition.sort === undefined
        ? {}
        : { sorts: getSorts(fetchCondition.sort) };

    console.log(filter, sorts);

    return axios.post(
      `https://api.notion.com/v1/databases/${this.databaseId}/query`,
      {
        ...filter,
        ...sorts,
      },
      { headers: this.headers }
    );
  }

  async post(page: Page.Page<Label, Data>) {
    return axios.post<any>(
      "https://api.notion.com/v1/pages",
      {
        parent: { database_id: this.databaseId },
        properties: Page.notionPageApiObjectOf(page, this.labelDisplayMap),
      },
      { headers: this.headers }
    );
  }
}

export const getApiClient = <
  Label extends string,
  Data extends Page.DataType<Label>
>(
  key: ApiClientKey,
  labelDisplayMap: Page.LabelDisplayMap<Label>
) => new ApiClient<Label, Data>(key, labelDisplayMap);
