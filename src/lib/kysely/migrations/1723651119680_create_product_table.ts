import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await db.schema
    .createTable('products')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name_en', 'varchar')
	.addColumn('name_zh', 'varchar')
	.addColumn('price', 'varchar')
	.addColumn('size', 'varchar')
	.addColumn('sku', 'varchar')

	.addColumn('usage', 'varchar')
	.addColumn('ingredient', 'varchar')
	.addColumn('description', 'varchar')
	
    .addColumn('image_cover', 'varchar')
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
	await db.schema.dropTable('products').execute()
}
