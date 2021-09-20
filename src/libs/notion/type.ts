type Timestamp = "created_time" | "last_edited_time";
type Direction = "ascending" | "descending";
export const isTimestamp = (text: string): text is Timestamp =>
  text === "created_time" || text === "last_edited_time";

export namespace Page {
  export type Number = { type: "number"; value: number | undefined };
  export type RichText = { type: "rich_text"; content: string | undefined };
  export type Select<T extends string> = {
    type: "select";
    option: T | undefined;
  };
  export type Type<T extends string = string> = Number | RichText | Select<T>;
  export type DataType<Label extends string> = {
    [key in Label]: Type;
  };

  export type Title = Omit<RichText, "type"> & { type: "title" };

  export type Page<
    Label extends string,
    Data extends DataType<Label> = DataType<Label>
  > = Partial<Data & { title: Title }>;

  type NumberCondition =
    | "equals"
    | "does_not_equal"
    | "greater_than"
    | "less_than"
    | "greater_than_or_equal_to"
    | "less_than_or_equal_to";
  type SelectCondition = "equals" | "does_not_equal";
  type TextCondition =
    | "equals"
    | "does_not_equal"
    | "contains"
    | "does_not_contain"
    | "starts_with"
    | "ends_with";
  type NumberFilter<Label extends string> = {
    type: "number";
    property: Label;
    condition: NumberCondition;
    value: number;
  };
  type SelectFilter<
    Label extends string,
    Data extends { [key in Label]?: { type: "select"; option: string } }
  > = {
    type: "select";
    property: Label;
    condition: SelectCondition;
    value: Data[Label] extends { option: infer Option } ? Option : never;
  };
  type TextFilter<Label extends string> = {
    type: "text";
    property: Label;
    condition: TextCondition;
    value: string;
  };

  // https://github.com/microsoft/TypeScript/issues/38646#issuecomment-700829042
  type FilterByType<
    Data extends { [key in string]?: { type: string } },
    KeyWord extends string
  > = {
    [K in keyof Data as Data[K] extends { type: KeyWord } ? K : never]: Data[K];
  };

  export type Filter<
    Label extends string,
    Data extends DataType<Label>,
    _SeletcData = FilterByType<Data, "select">
  > =
    | NumberFilter<keyof FilterByType<Data, "number">>
    | SelectFilter<keyof _SeletcData, _SeletcData>
    | TextFilter<keyof FilterByType<Data, "rich_text"> | "title">;

  export type SortPage<Label extends string> = {
    property: Label | Timestamp;
    direction: Direction;
  }[];

  export type FetchParams<
    Label extends string,
    Data extends DataType<Label>
  > = {
    filter?: Filter<Label, Data>;
    sort?: SortPage<Label>;
  };

  export type LabelDisplayMap<Label extends string> = {
    [key in Label | "title"]: string;
  };

  export const number = (value: number): Number => ({
    type: "number",
    value,
  });
  export const richText = (content: string): RichText => ({
    type: "rich_text",
    content,
  });
  export const select = <T extends string>(option: T): Select<T> => ({
    type: "select",
    option,
  });
  export const title = (content: string): Title => ({
    ...richText(content),
    type: "title",
  });

  const numberOf = (number: Page.Number) => ({
    number: number.value,
  });
  const richTextOf = (richText: Page.RichText) => ({
    rich_text: [
      {
        text: {
          content: richText.content,
        },
      },
    ],
  });
  const selectOf = (select: Page.Select<string>) => ({
    select: {
      name: select.option,
    },
  });
  const titleOf = (title: Page.Title | undefined, displayName: string) =>
    title
      ? {
          [displayName]: {
            title: [
              {
                text: {
                  content: title.content,
                },
              },
            ],
          },
        }
      : {};

  export const notionPageApiObjectOf = <
    Label extends string,
    Data extends Page.DataType<Label>
  >(
    page: Page.Page<Label, Data>,
    keyDisplayMap: LabelDisplayMap<Label>
  ) => {
    const convert = (displayName: string, property: Page.Type | undefined) => {
      if (property === undefined) return {};
      const obj =
        property.type === "number"
          ? numberOf(property)
          : property.type === "rich_text"
          ? richTextOf(property)
          : selectOf(property);
      return {
        [displayName]: obj,
      };
    };

    const { title, ...data } = page;
    return {
      ...titleOf(title, keyDisplayMap.title),
      ...(Object.keys(data) as Label[]).reduce(
        (acc, key) => ({
          ...acc,
          ...convert(keyDisplayMap[key], data[key]),
        }),
        {}
      ),
    };
  };
}
