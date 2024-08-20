import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.createTable('pages_private')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('title', 'varchar', (col) => col.notNull())
		.addColumn('slug', 'varchar', (col) => {
			return col
				.unique()
				.notNull()
		})
		.addColumn('content', 'varchar')
		.addColumn('allow_access', 'boolean', (col) => col.defaultTo(true))
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn('updated_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
}
