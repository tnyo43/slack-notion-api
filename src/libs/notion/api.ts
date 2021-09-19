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
  private token: string;
  private labelDisplayMap: Page.LabelDisplayMap<Label>;

  constructor(key: ApiClientKey, labelDisplayMap: Page.LabelDisplayMap<Label>) {
    this.databaseId = key.databaseId;
    this.token = key.token;
    this.labelDisplayMap = labelDisplayMap;
  }

  async post(page: Page.Page<Label, Data>) {
    console.log(
      JSON.stringify({
        parent: { database_id: this.databaseId },
        properties: Page.notionPageApiObjectOf(page, this.labelDisplayMap),
      })
    );
    return axios.post<any>(
      "https://api.notion.com/v1/pages",
      {
        parent: { database_id: this.databaseId },
        properties: Page.notionPageApiObjectOf(page, this.labelDisplayMap),
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Notion-Version": "2021-05-13",
          "Content-Type": "application/json",
        },
      }
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
