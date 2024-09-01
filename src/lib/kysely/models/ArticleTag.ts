import { ColumnType, Generated } from "kysely";

export interface ArticleTag {
    id: Generated<number>;
    name: ColumnType<string, string, string | undefined>,
    created_at: ColumnType<Date, string | undefined, never>,
    updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
