import { db } from ".."

class ClassTypesController {
    async getAll() {
        const rows = await db.selectFrom('class_types')
            .orderBy('order', 'asc')
            .selectAll()
            .execute()
        return rows
    }
    async getById({ id }: { id: number }) {
        const rows = await db.selectFrom('class_types')
            .where('id', '=', id)
            .selectAll()
            .execute()
        return rows
    }
    async create({
        name,
    }: {
        name: string,
    }) {
        const values: any = {
            name
        }
        const row = await db.insertInto('class_types')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        return row
    }
    async update({
        id,
        name,
    }: {
        id: number,
        name?: string,
    }) {
        let query = db.updateTable('class_types')
            .where('id', '=', id)

        if (name !== undefined) {
            query = query.set('name', name)
        }

        const rows = await query.execute()

        return rows
    }
}

export default ClassTypesController
