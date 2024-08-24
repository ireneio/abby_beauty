import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.createTable('trials')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('title', 'varchar', (col) => col.notNull())
		.addColumn('title_short', 'varchar', (col) => col.notNull())
		.addColumn('slug', 'varchar', (col) => {
			return col
				.unique()
				.notNull()
		})
		.addColumn('subtitle', 'varchar')
		.addColumn('content', 'varchar')
		.addColumn('order', 'integer', col => col.defaultTo(0))
		.addColumn('hidden', 'boolean', (col) => col.defaultTo(false))
		.addColumn('created_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.addColumn('updated_at', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute()

	await db.schema.createTable('trials_reservations')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar')
		.addColumn('email', 'varchar')
		.addColumn('phone', 'varchar')
		.addColumn('line_id', 'varchar')
		.addColumn('date', 'date')
		.addColumn('time_of_day', 'varchar')
		.addColumn('know_us_list', sql`text[]`)
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
	await db.schema.dropTable('trials')
}
