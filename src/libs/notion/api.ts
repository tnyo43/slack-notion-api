import axios from "axios";

export const post = async (databaseId: string, notionToken: string) =>
  await axios({
    method: "post",
    url: `https://api.notion.com/v1/pages`,
    headers: {
      Authorization: `Bearer ${notionToken}`,
      "Notion-Version": "2021-05-13",
      "Content-Type": "application/json",
    },
    data: {
      parent: { database_id: databaseId },
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
  });
