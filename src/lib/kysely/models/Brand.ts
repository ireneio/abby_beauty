import { ColumnType, Generated } from "kysely";

export default interface Brand {
  id: Generated<number>,
  image: ColumnType<string, string, string | undefined>,
  title: ColumnType<string, string, string | undefined>,
  order: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
