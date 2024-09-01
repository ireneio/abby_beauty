import { ColumnType, Generated } from "kysely";

export default interface Article {
    id: Generated<number>;
    cover: ColumnType<string, string | undefined, string | undefined>,
    title: ColumnType<string, string, string | undefined>,
    subtitle: ColumnType<string, string | undefined, string | undefined>,
    content: ColumnType<string, string | undefined, string | undefined>,
    publish_date: ColumnType<Date, Date, Date | undefined>,
    start_date: ColumnType<Date, Date | undefined, Date | undefined>,
    end_date: ColumnType<Date, Date | undefined, Date | undefined>,
    slug: ColumnType<string, string | undefined, never>,
    tag_ids: ColumnType<number[], number[] | undefined, number[] | undefined>,
    created_at: ColumnType<Date, string | undefined, never>,
    updated_at: ColumnType<Date, string | undefined, string | undefined>,
}