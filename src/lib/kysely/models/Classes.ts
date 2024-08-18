import { ColumnType, Generated } from "kysely";

export default interface Classes {
  id: Generated<number>,
  name: string,
  image_cover: string,
  minutes: number,
  available_for_reservation: boolean,
  hidden: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  class_type_id: ColumnType<number, number | undefined, number | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
