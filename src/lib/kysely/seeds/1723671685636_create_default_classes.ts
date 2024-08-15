import type { Kysely } from 'kysely'

export async function seed(db: Kysely<any>): Promise<void> {
	// seed code goes here...
	// note: this function is mandatory. you must implement this function.

	await db.insertInto('classes')
	.values([
		{
			name: '課程1',
			image_cover: 'https://www.fast-spa.com.tw/archive/image//01-WF.png',
			available_for_reservation: true,
		},
		{
			name: '課程2',
			image_cover: 'https://www.fast-spa.com.tw/archive/image//01-WF.png',
			available_for_reservation: true,
		},
		{
			name: '課程3',
			image_cover: 'https://www.fast-spa.com.tw/archive/image//01-WF.png',
			available_for_reservation: true,
		},
		{
			name: '課程4',
			image_cover: 'https://www.fast-spa.com.tw/archive/image//01-WF.png',
			available_for_reservation: true,
		},
		{
			name: '課程5',
			image_cover: 'https://www.fast-spa.com.tw/archive/image//01-WF.png',
			available_for_reservation: true,
		}
	])
	.execute()
}
