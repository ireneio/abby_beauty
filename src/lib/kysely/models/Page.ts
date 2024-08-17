import { ColumnType, Generated } from "kysely";

export default interface Page {
  id: Generated<number>,
  slug: string,
  title: string,
  content: string,
  allow_access: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
