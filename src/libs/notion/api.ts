import axios from "axios";
import { Page } from "./type";

type ApiClientKey = { databaseId: string; token: string };

interface IApiClient<
  Label extends string,
  Data extends Page.Data<Label>,
  SelectKeyOption extends {
    property: Page.Property.SelectObjectKey<Data>;
    option: string;
  }[]
> {
  post: (page: Page.DataWithTitle<Label, Data>) => Promise<any>;
  fetchAll: (fetchCondition: {
    filter?: Page.FilterParam<Label, Data, SelectKeyOption>;
    sort?: Page.SortParams<Label>;
  }) => any;
}

class ApiClient<
  Label extends string,
  Data extends Page.Data<Label>,
  SelectKeyOption extends {
    property: Page.Property.SelectObjectKey<Data>;
    option: string;
  }[]
> implements IApiClient<Label, Data, SelectKeyOption>
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
    filter?: Page.FilterParam<Label, Data, SelectKeyOption>;
    sort?: Page.SortParams<Label>;
  }) {
    const getFilter = (
      param: Page.FilterParam<Label, Data, SelectKeyOption>
    ) => ({
      property: param.property,
      [param.type]: {
        [param.condition]: param.type === "select" ? param.option : param.value,
      },
    });

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

    return axios.post(
      `https://api.notion.com/v1/databases/${this.databaseId}/query`,
      {
        ...filter,
        ...sorts,
      },
      { headers: this.headers }
    );
  }

  async post(page: Partial<Page.DataWithTitle<Label, Data>>) {
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
  Data extends Page.Data<Label>,
  SelectKeyOption extends {
    property: Page.Property.SelectObjectKey<Data>;
    option: string;
  }[] = []
>(
  key: ApiClientKey,
  labelDisplayMap: Page.Property.LabelDisplayMap<Label>
) => new ApiClient<Label, Data, SelectKeyOption>(key, labelDisplayMap);
