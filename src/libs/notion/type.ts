export namespace Page {
  export namespace Property {
    export type Number = { type: "number"; value: number | undefined };
    export type RichText = { type: "rich_text"; content: string | undefined };
    export type Select<T extends string> = {
      type: "select";
      option: T | undefined;
    };
    export type Type<T extends string = string> = Number | RichText | Select<T>;
    export type Title = Omit<RichText, "type"> & { type: "title" };

    export type LabelDisplayMap<Label extends string> = {
      [key in Label | "title"]: string;
    };
  }

  export type DataType<Label extends string> = {
    [key in Label]: Property.Type;
  };

  export type Page<
    Label extends string,
    Data extends DataType<Label> = DataType<Label>
  > = Partial<Data & { title: Property.Title }>;

  export namespace Filter {
    type NumberCondition =
      | "equals"
      | "does_not_equal"
      | "greater_than"
      | "less_than"
      | "greater_than_or_equal_to"
      | "less_than_or_equal_to";
    type TextCondition =
      | "equals"
      | "does_not_equal"
      | "contains"
      | "does_not_contain"
      | "starts_with"
      | "ends_with";

    // https://github.com/microsoft/TypeScript/issues/38646#issuecomment-700829042
    type FilterByType<
      Data extends { [key in string]?: { type: string } },
      KeyWord extends string
    > = {
      [K in keyof Data as Data[K] extends { type: KeyWord }
        ? K
        : never]: Data[K];
    };

    export type FilterPage<
      Label extends string,
      Data extends DataType<Label>
    > =
      | {
          type: "number";
          property: keyof FilterByType<Data, "number">;
          condition: NumberCondition;
          value: number;
        }
      | {
          type: "text";
          property: "title" | keyof FilterByType<Data, "rich_text">;
          condition: TextCondition;
          value: string;
        };
  }

  export namespace Sort {
    type Direction = "ascending" | "descending";
    type Timestamp = "created_time" | "last_edited_time";

    export const isTimestamp = (text: string): text is Timestamp =>
      text === "created_time" || text === "last_edited_time";

    export type SortPage<Label extends string> = {
      property: Label | Timestamp;
      direction: Direction;
    }[];
  }

  export namespace Fetch {
    export type Params<Label extends string, Data extends DataType<Label>> = {
      filter?: Filter.FilterPage<Label, Data>;
      sort?: Sort.SortPage<Label>;
    };
  }

  export const number = (value: number): Property.Number => ({
    type: "number",
    value,
  });
  export const richText = (content: string): Property.RichText => ({
    type: "rich_text",
    content,
  });
  export const select = <T extends string>(option: T): Property.Select<T> => ({
    type: "select",
    option,
  });
  export const title = (content: string): Property.Title => ({
    ...richText(content),
    type: "title",
  });

  const numberOf = (number: Property.Number) => ({
    number: number.value,
  });
  const richTextOf = (richText: Property.RichText) => ({
    rich_text: [
      {
        text: {
          content: richText.content,
        },
      },
    ],
  });
  const selectOf = (select: Property.Select<string>) => ({
    select: {
      name: select.option,
    },
  });
  const titleOf = (title: Property.Title | undefined, displayName: string) =>
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
    keyDisplayMap: Property.LabelDisplayMap<Label>
  ) => {
    const convert = (
      displayName: string,
      property: Property.Type | undefined
    ) => {
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
