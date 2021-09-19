export namespace Page {
  export type Number = { type: "number"; value: number };
  export type RichText = { type: "rich_text"; content: string };
  export type Select<T extends string> = { type: "select"; option: T };
  export type Type = Number | RichText | Select<string>;
  export type DataType<Label extends string> = { [key in Label]?: Type };

  export type Title = Omit<RichText, "type"> & { type: "title" };

  export type Page<
    Label extends string,
    Data extends DataType<Label> = DataType<Label>
  > = Partial<Data & { title: Title }>;

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
