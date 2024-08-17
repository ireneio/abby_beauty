import { ColumnType } from "kysely";

export default interface Admin {
    username: string;
    password: string;
    created_at: ColumnType<Date, string | undefined, never>,
    updated_at: ColumnType<Date, string | undefined, string | undefined>,
}