import type { Kysely } from 'kysely'

export async function seed(db: Kysely<any>): Promise<void> {
	// seed code goes here...
	// note: this function is mandatory. you must implement this function.
	await db.insertInto('web_settings')
		.values({
			logo_square: '',
			logo_rect: '',
			company_email: '',
			company_phone: '',
			company_address: '',
			company_lineid: '',
			copyright_text: '',
			info_about_us: '',
			info_hint: '',
			website_title: '',
			website_description: '',
			site_name: '',
		})
		.execute()
}
