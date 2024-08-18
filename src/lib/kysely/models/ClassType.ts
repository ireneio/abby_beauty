import { ColumnType, Generated } from "kysely";

export default interface ClassType {
  id: Generated<number>,
  name: string,
  created_at: ColumnType<Date, string | undefined, never>,
  updated_at: ColumnType<Date, string | undefined, string | undefined>,
}
