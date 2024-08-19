import { ColumnType, Generated } from "kysely";

export default interface ProductType {
  id: Generated<number>,
  name: string,
  image_cover: ColumnType<string, string | undefined, string | undefined>,
  description: ColumnType<string, string | undefined, string | undefined>,
  order: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
