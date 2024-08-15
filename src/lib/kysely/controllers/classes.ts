import { db } from "@/lib/kysely"

class ClassesController {
    async getAll() {
        const rows = await db.selectFrom('classes')
            .where('classes.hidden', '!=', true)
            .orderBy('created_at', 'desc')
            .selectAll()
            .execute()
        return rows
    }

    async getById(id: string) {
        const rows = await db.selectFrom('classes')
            .where('classes.hidden', '!=', true)
            .where('classes.id', '=', id)
            .selectAll()
            .execute()

        return rows
    }

    async update(id: string, params: any) {
        const { name, minutes, image_cover, available_for_reservation } = params
        const rows = await db.updateTable('classes')
            .set({
                name: name ?? '',
                minutes: minutes ? parseInt(minutes) : 0,
                image_cover: image_cover ?? '',
                available_for_reservation: available_for_reservation ?? false,
            })
            .where('classes.id', '=', id)
            .execute()
        return rows
    }

    async create(params: any) {
        const { name, minutes, image_cover, available_for_reservation } = params
        const rows = await db.insertInto('classes')
            .values([
                {
                    name: name ?? '',
                    minutes: minutes ? parseInt(minutes) : 0,
                    image_cover: image_cover ?? '',
                    available_for_reservation: available_for_reservation ?? false,
                }
            ])
            .returningAll()
            .execute()
        return rows
    }

    async hide(id: string) {
        const rows = await db.updateTable('classes')
            .set({ hidden: true })
            .where('classes.id', '=', id)
            .execute()
        return rows
    }
}

export default ClassesController
