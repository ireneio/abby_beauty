import { ColumnType, Generated } from "kysely";

export default interface Trial {
  id: Generated<number>,
  slug: ColumnType<string, string | undefined, undefined>,
  title: ColumnType<string, string, string | undefined>,
  title_short: ColumnType<string, string, string | undefined>,
  subtitle?: ColumnType<string, string | undefined, string | undefined>,
  content?: ColumnType<string, string | undefined, string | undefined>,
  price_discount: ColumnType<number, number, number | undefined>,
  price_original: ColumnType<number, number, number | undefined>,
  order: ColumnType<number, number | undefined, number | undefined>,
  order_home_page: ColumnType<number, number | undefined, number | undefined>,
  display_on_home_page: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  hidden: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
