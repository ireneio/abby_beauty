import { ColumnType, Generated } from "kysely";

export default interface Product {
  id: Generated<number>,
  name_en: ColumnType<string, string | undefined, string | undefined>,
  name_zh: string,
  size: string,
  sku: string,
  usage: string,
  ingredients: string,
  features: string,
  target_users: string,
  product_type_id: ColumnType<number, number | undefined, number | undefined>,
  hidden: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  order: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
