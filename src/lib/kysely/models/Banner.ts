import { ColumnType, Generated } from "kysely";

export default interface Banner {
  id: Generated<number>,
  image_mobile: ColumnType<string, string, string | undefined>,
  image_desktop: ColumnType<string, string, string | undefined>,
  url: ColumnType<string, string | undefined, string | undefined>,
  url_open_type: ColumnType<string, string | undefined, string | undefined>,
  order: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
