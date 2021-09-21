import axios from "axios";
import { Page } from "./type";

type ApiClientKey = { databaseId: string; token: string };

interface IApiClient<Label extends string, Data extends Page.DataType<Label>> {
  post: (page: Page.Page<Label, Data>) => Promise<any>;
}

class ApiClient<Label extends string, Data extends Page.DataType<Label>>
  implements IApiClient<Label, Data>
{
  private databaseId: string;
  private headers = {};
  private labelDisplayMap: Page.Property.LabelDisplayMap<Label>;

  constructor(
    key: ApiClientKey,
    labelDisplayMap: Page.Property.LabelDisplayMap<Label>
  ) {
    this.databaseId = key.databaseId;
    this.headers = {
      Authorization: `Bearer ${key.token}`,
      "Notion-Version": "2021-05-13",
      "Content-Type": "application/json",
    };
    this.labelDisplayMap = labelDisplayMap;
  }

  async fetchAll(fetchCondition: Page.Fetch.Params<Label, Data>) {
    const getFilter = (formula: Page.Filter.FilterPage<Label, Data>) => ({
      property: this.labelDisplayMap[formula.property as Label],
      [formula.type]: {
        [formula.condition]: formula.value,
      },
    });

    const filter =
      fetchCondition.filter === undefined
        ? {}
        : { filter: getFilter(fetchCondition.filter) };

    const getSorts = (sorts: Page.Sort.SortPage<Label>) =>
      sorts.map(({ property, direction }) => ({
        ...(Page.Sort.isTimestamp(property)
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
  labelDisplayMap: Page.Property.LabelDisplayMap<Label>
) => new ApiClient<Label, Data>(key, labelDisplayMap);
