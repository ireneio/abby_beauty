import { ColumnType, Generated } from "kysely";

export default interface Classes {
  id: Generated<number>,
  name: string,
  image_cover: string,
  minutes: number,
  available_for_reservation: boolean,
  hidden: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  // You can specify a different type for each operation (select, insert and
  // update) using the `ColumnType<SelectType, InsertType, UpdateType>`
  // wrapper. Here we define a column `created_at` that is selected as
  // a `Date`, can optionally be provided as a `string` in inserts and
  // can never be updated:
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
