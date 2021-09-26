import axios from "axios";
import { ApiResponse } from "./types/ApiResponse";
import { Page } from "./types/Page";

type ApiClientKey = { databaseId: string; token: string };

interface IApiClient<Label extends string, Data extends Page.Data<Label>> {
  post: (page: Page.DataWithTitle<Label, Data>) => Promise<any>;
  fetchAll: (fetchCondition: {
    filter?: Page.FilterParam<Label, Data>;
    sort?: Page.SortParams<Label>;
  }) => Promise<any>;
}

class ApiClient<Label extends string, Data extends Page.Data<Label>>
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

  async fetchAll(fetchCondition: {
    filter?: Page.FilterParam<Label, Data>;
    sort?: Page.SortParams<Label>;
  }) {
    const getFilter = (param: Page.FilterParam<Label, Data>): any =>
      param.type === "binop"
        ? {
            [param.op]: param.terms.map(getFilter),
          }
        : {
            property: this.labelDisplayMap[param.property],
            [param.type]: {
              [param.condition]: param.value,
            },
          };

    const filter =
      fetchCondition.filter === undefined
        ? {}
        : { filter: getFilter(fetchCondition.filter) };

    const getSorts = (sorts: Page.SortParams<Label>) =>
      sorts.map(({ property, direction }) => ({
        ...(Page.isTimestamp(property)
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

    const x = await axios.post<ApiResponse.FetchPage>(
      `https://api.notion.com/v1/databases/${this.databaseId}/query`,
      {
        ...filter,
        ...sorts,
      },
      { headers: this.headers }
    );

    return x.data;
  }

  async post(page: Partial<Page.DataWithTitle<Label, Data>>) {
    return axios.post<void>(
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
  Data extends Page.Data<Label>
>(
  key: ApiClientKey,
  labelDisplayMap: Page.Property.LabelDisplayMap<Label>
) => new ApiClient<Label, Data>(key, labelDisplayMap);
