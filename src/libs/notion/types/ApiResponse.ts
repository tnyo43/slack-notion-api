type PageSerializer = {
  object: 'page';
  id: string;
  created_time: string;
  last_edited_time: string;
  url: string;
  cover: string;
  icon: string;
  parent: {
    type: 'database_id';
    database_id: string;
  };
  archived: boolean;
  properties: {
    [K in string]?:
      | { id: string; type: 'number'; number: number }
      | { id: string; type: 'rich_text'; rich_text: { plain_text: string }[] }
      | { id: string; type: 'select'; select: { id: string; name: string } }
      | { id: 'title'; type: 'title'; title: { plain_text: string }[] };
  };
};

export namespace ApiResponse {
  export type FetchPage = { results: PageSerializer[] };
}
