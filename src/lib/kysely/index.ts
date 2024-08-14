import { createKysely } from '@vercel/postgres-kysely'

// Keys of this interface are table names.
export interface Database {
}

export const db = createKysely<Database>()
export { sql } from 'kysely'
