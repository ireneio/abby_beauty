import { ColumnType, Generated } from "kysely";

export default interface JoinUs {
  id: Generated<number>,
  image: ColumnType<string, string, string | undefined>,
  content: ColumnType<string, string, string | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
