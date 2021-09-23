export namespace _Page {
  export namespace _Property {
    export type _Number = { type: "number"; value: number | undefined };
    export type _RichText = { type: "rich_text"; content: string | undefined };
    export type _Select<T extends string> = {
      type: "select";
      option: T | undefined;
    };
    export type _Type<T extends string = string> =
      | _Number
      | _RichText
      | _Select<T>;
    export type _Title = Omit<_RichText, "type"> & { type: "title" };

    export const _number = (value: number): _Number => ({
      type: "number",
      value,
    });
    export const _richText = (content: string): _RichText => ({
      type: "rich_text",
      content,
    });
    export const _select = <T extends string>(option: T): _Select<T> => ({
      type: "select",
      option,
    });
    export const _title = (content: string): _Title => ({
      ..._richText(content),
      type: "title",
    });

    export const _numberOf = (number: _Number) => ({
      number: number.value,
    });
    export const _richTextOf = (richText: _RichText) => ({
      rich_text: [
        {
          text: {
            content: richText.content,
          },
        },
      ],
    });
    export const _selectOf = (select: _Select<string>) => ({
      select: {
        name: select.option,
      },
    });
    export const _titleOf = (title: _Title | undefined, displayName: string) =>
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

    export type _LabelDisplayMap<Label extends string> = {
      [key in Label | "title"]: string;
    };
  }

  export namespace _Data {
    export type _DataType<Label extends string> = {
      [key in Label]: _Property._Type;
    };

    export type _Page<
      Label extends string,
      Data extends _DataType<Label> = _DataType<Label>
    > = Data & { title: _Property._Title };
  }

  export namespace _Filter {
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
    export type _FilteredKeyObjectKeyValue<
      ObjectKey extends string,
      KeyWord extends string,
      Data extends { [key in string]?: { [key in ObjectKey]: string } }
    > = keyof {
      [K in keyof Data as Data[K] extends { [key in ObjectKey]: KeyWord }
        ? K
        : never]: Data[K];
    };

    export type _Param<
      Label extends string,
      Data extends _Data._DataType<Label>
    > =
      | {
          type: "number";
          property: _FilteredKeyObjectKeyValue<"type", "number", Data>;
          condition: NumberCondition;
          value: number;
        }
      | {
          type: "text";
          property:
            | "title"
            | _FilteredKeyObjectKeyValue<"type", "rich_text", Data>;
          condition: TextCondition;
          value: string;
        };
  }

  export namespace _Sort {
    type Direction = "ascending" | "descending";
    type Timestamp = "created_time" | "last_edited_time";

    export const _isTimestamp = (text: string): text is Timestamp =>
      text === "created_time" || text === "last_edited_time";

    export type _Params<Label extends string> = {
      property: Label | Timestamp;
      direction: Direction;
    }[];
  }

  export namespace _Fetch {
    export type _Params<
      Label extends string,
      Data extends _Data._DataType<Label>
    > = {
      filter?: _Filter._Param<Label, Data>;
      sort?: _Sort._Params<Label>;
    };
  }

  export const _notionPageApiObjectOf = <
    Label extends string,
    Data extends _Data._DataType<Label>
  >(
    page: Partial<_Data._Page<Label, Data>>,
    keyDisplayMap: _Property._LabelDisplayMap<Label>
  ) => {
    const convert = (
      displayName: string,
      property: _Property._Type | undefined
    ) => {
      if (property === undefined) return {};
      const obj =
        property.type === "number"
          ? _Property._numberOf(property)
          : property.type === "rich_text"
          ? _Property._richTextOf(property)
          : _Property._selectOf(property);
      return {
        [displayName]: obj,
      };
    };

    const { title, ...data } = page;
    return {
      ..._Property._titleOf(title, keyDisplayMap.title),
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

// usecase で import するのはここから下

export namespace Page {
  export namespace Property {
    export type Number = _Page._Property._Number;
    export type RichText = _Page._Property._RichText;
    export type Select<Option extends string> = _Page._Property._Select<Option>;

    export const number = _Page._Property._number;
    export const richText = _Page._Property._richText;
    export const select = _Page._Property._select;
    export const title = _Page._Property._title;

    export type LabelDisplayMap<Label extends string> =
      _Page._Property._LabelDisplayMap<Label>;
  }

  export type Data<Label extends string> = _Page._Data._DataType<Label>;

  export type DataWithTitle<
    Label extends string,
    Data extends _Page._Data._DataType<Label> = _Page._Data._DataType<Label>
  > = _Page._Data._Page<Label, Data>;

  export type FilterParam<
    Label extends string,
    Data extends _Page._Data._DataType<Label>
  > = _Page._Filter._Param<Label, Data>;

  export const isTimestamp = _Page._Sort._isTimestamp;
  export type SortParams<Label extends string> = _Page._Sort._Params<Label>;

  export type FetchParams<
    Label extends string,
    Data extends _Page._Data._DataType<Label>
  > = _Page._Fetch._Params<Label, Data>;

  export const notionPageApiObjectOf = _Page._notionPageApiObjectOf;
}
