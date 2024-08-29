import { ColumnType, Generated } from "kysely";

export default interface Trial {
  id: Generated<number>,
  slug: ColumnType<string, string | undefined, undefined>,
  title: string,
  title_short: string,
  subtitle?: ColumnType<string, string | undefined, string | undefined>,
  content?: ColumnType<string, string | undefined, string | undefined>,
  price_discount: number,
  price: number,
  order: ColumnType<number, number | undefined, number | undefined>,
  hidden?: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
