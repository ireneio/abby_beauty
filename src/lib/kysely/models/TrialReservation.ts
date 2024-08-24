import { ColumnType, Generated } from "kysely";

export default interface TrialReservation {
  id: Generated<number>,
  name: string,
  email: string,
  phone: string,
  line_id?: ColumnType<string, string | undefined, string | undefined>,
  date: ColumnType<Date, string, string>,
  time_of_day: ColumnType<string, string, string>,
  know_us_list: ColumnType<string[], string[], string[] | undefined>
  marked?: ColumnType<boolean, never, boolean | undefined>,
  remark?: ColumnType<string, never, string | undefined>,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
