import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.createTable('banners')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('image_mobile', 'varchar')
		.addColumn('image_desktop', 'varchar')
		.addColumn('url', 'varchar')
		.addColumn('url_open_type', 'varchar')
		.addColumn('order', 'integer', (col) => col.defaultTo(0))
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.dropTable('banners')
}