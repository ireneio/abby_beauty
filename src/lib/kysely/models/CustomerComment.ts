import { ColumnType, Generated } from "kysely";

export default interface CustomerComment {
  id: Generated<number>,
  avatar: ColumnType<string, string, string | undefined>,
  customer_name: ColumnType<string, string, string | undefined>,
  content: ColumnType<string, string | undefined, string | undefined>,
  stars: ColumnType<number, number | undefined, number | undefined>,
  order: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
