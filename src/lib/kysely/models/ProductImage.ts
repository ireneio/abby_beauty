import { ColumnType, Generated } from "kysely";

export default interface ProductImage {
  id: Generated<number>,
  product_id: number,
  url: string,
  order: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
