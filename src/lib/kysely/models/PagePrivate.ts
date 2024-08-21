import { ColumnType, Generated } from "kysely";

export default interface PagePrivate {
  id: Generated<number>,
  slug: string,
  title: string,
  content: string,
  allow_access: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  order: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
