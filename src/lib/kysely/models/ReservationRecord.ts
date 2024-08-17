import { ColumnType, Generated } from "kysely";

export default interface ReservationRecord {
  id: Generated<number>,
  name: string,
  email: string,
  phone?: ColumnType<string, string | undefined, string | undefined>,
  memo?: ColumnType<string, string | undefined, string | undefined>,
  class_id: number,
  date: Date,
  assignee_id: number,
  canceled?: ColumnType<boolean, boolean | undefined, boolean | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
