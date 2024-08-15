import type { Kysely } from 'kysely'
import bcrypt from 'bcrypt'

export async function seed(db: Kysely<any>): Promise<void> {
	// seed code goes here...
	// note: this function is mandatory. you must implement this function.
	const password = '1234'
	const hashedPassword = await bcrypt.hash(password, 10)

	await db.insertInto('admin')
	.values([
		{
			username: 'admin',
			password: hashedPassword,
		}
	])
	.execute()
}
