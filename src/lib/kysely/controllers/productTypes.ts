import { db } from ".."

class ProductTypesController {
    async getAll() {
        const rows = await db.selectFrom('product_types')
            .selectAll()
            .execute()
        return rows
    }
    async getById({ id }: { id: number }) {
        const rows = await db.selectFrom('product_types')
            .where('id', '=', id)
            .selectAll()
            .execute()
        return rows
    }
    async create({
        name,
        image_cover
    }: {
        name: string,
        image_cover?: string,
    }) {
        const values: any = {
            name
        }
        if (image_cover !== undefined) {
            values.image_cover = image_cover
        }
        const row = await db.insertInto('product_types')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        return row
    }
    async update({
        id,
        name,
        image_cover
    }: {
        id: number,
        name?: string,
        image_cover?: string,
    }) {
        let query = db.updateTable('product_types')
            .where('id', '=', id)

        if (name !== undefined) {
            query = query.set('name', name)
        }

        if (image_cover !== undefined) {
            query = query.set('image_cover', image_cover)
        }

        const rows = await query.execute()

        return rows
    }
}

export default ProductTypesController
