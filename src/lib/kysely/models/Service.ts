import { ColumnType, Generated } from "kysely";

export default interface Service {
  id: Generated<number>,
  image: ColumnType<string, string, string | undefined>,
  title: ColumnType<string, string, string | undefined>,
  content: ColumnType<string, string, string | undefined>,
  url: ColumnType<string, string | undefined, string | undefined>,
  url_open_type: ColumnType<string, string | undefined, string | undefined>,
  order: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
