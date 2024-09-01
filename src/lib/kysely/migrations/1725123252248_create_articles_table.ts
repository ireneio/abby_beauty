import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.createTable('articles')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('cover', 'varchar')
		.addColumn('title', 'varchar')
		.addColumn('subtitle', 'varchar')
		.addColumn('content', 'varchar')
		.addColumn('publish_date', 'date', (col) => col.notNull())
		.addColumn('start_date', 'date')
		.addColumn('end_date', 'date')
		.addColumn('slug', 'varchar')
		.addColumn('tag_ids', sql`integer[]`)
		.execute()

	await db.schema.createTable('article_tags')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.dropTable('articles')
	await db.schema.dropTable('article_tags')
}
