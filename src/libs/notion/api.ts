import axios from "axios";

type ApiClientKey = { databaseId: string; token: string };

interface IApiClient {
  post: () => Promise<any>;
}

class ApiClient implements IApiClient {
  private databaseId: string;
  private token: string;

  constructor(key: ApiClientKey) {
    this.databaseId = key.databaseId;
    this.token = key.token;
  }

  async post() {
    return axios.post<any>(
      "https://api.notion.com/v1/pages",
      {
        parent: { database_id: this.databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: "連休の予定",
                },
              },
            ],
          },
        },
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

class ApiClientFactory {
  private static apis = new Map<string, ApiClient>();

  static getApiClientInstance(key: ApiClientKey) {
    const keyText = key.databaseId + key.token; // Hash のような役割

    const client = ApiClientFactory.apis.get(keyText);
    if (client) return client;

    const newClient = new ApiClient(key);
    ApiClientFactory.apis.set(keyText, newClient);
    return newClient;
  }
}

export const getApiClient = ApiClientFactory.getApiClientInstance;
