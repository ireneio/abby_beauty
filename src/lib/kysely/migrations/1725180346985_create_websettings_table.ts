import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.createTable('web_settings')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('logo_square', 'varchar', (col) => col.defaultTo(''))
		.addColumn('logo_rect', 'varchar', (col) => col.defaultTo(''))
		.addColumn('company_email', 'varchar', (col) => col.defaultTo(''))
		.addColumn('company_phone', 'varchar', (col) => col.defaultTo(''))
		.addColumn('company_address', 'varchar', (col) => col.defaultTo(''))
		.addColumn('company_lineid', 'varchar', (col) => col.defaultTo(''))
		.addColumn('copyright_text', 'varchar', (col) => col.defaultTo(''))
		.addColumn('info_about_us', 'varchar', (col) => col.defaultTo(''))
		.addColumn('info_hint', 'varchar', (col) => col.defaultTo(''))
		.addColumn('website_title', 'varchar', (col) => col.defaultTo(''))
		.addColumn('website_description', 'varchar', (col) => col.defaultTo(''))
		.addColumn('site_name', 'varchar', (col) => col.defaultTo(''))
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.dropTable('web_settings')
}
