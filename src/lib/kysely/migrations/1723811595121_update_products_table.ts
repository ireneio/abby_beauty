import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema
		.alterTable('products')
		.dropColumn('price')
		.dropColumn('ingredient')
		.dropColumn('description')
		.addColumn('features', 'varchar')
		.addColumn('target_users', 'varchar')
		.execute()
	
	await db.schema.createTable('product_ingredients')
		.addColumn('text', 'varchar')
		.addColumn('product_id', 'serial')
		.addForeignKeyConstraint('product_id_fk', ['product_id'], 'products', ['id'])
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema.dropTable('products').execute()
	await db.schema.dropTable('product_ingredients').execute()
}
