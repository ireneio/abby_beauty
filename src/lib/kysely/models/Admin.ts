import { ColumnType, Generated } from "kysely";

export default interface Admin {
    id: Generated<number>;
    username: string;
    password: string;
    permission: ColumnType<Date, string[] | undefined, string[] | undefined>,
    created_at: ColumnType<Date, string | undefined, never>,
    updated_at: ColumnType<Date, string | undefined, string | undefined>,
}