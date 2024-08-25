import { db } from ".."

class ProductTypesController {
    async getAllClient() {
        const rows = await db.selectFrom('product_types')
            .select([
                'id',
                'created_at',
                'name',
                'image_cover',
            ])
            .orderBy('order', 'asc')
            .execute()
        return rows
    }
    async getAll({
        page,
        perPage,
        sortBy,
        sortDirection,
        search,
    }: {
        page?: number,
        perPage?: number,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
        search?: string
    }) {
        // Base query for counting total records
        let countQuery = db
            .selectFrom('product_types')

        if (search) {
            countQuery = countQuery.where((eb) => eb('product_types.name', 'like', `%${search}%`))
        }

        const countResult = await countQuery
            .select([db.fn.count('product_types.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('product_types')

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (search) {
            query = query.where((eb) => eb('product_types.name', 'like', `%${search}%`))
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('product_types.created_at', sortDirection)
        }

        if (sortBy === 'order') {
            query = query.orderBy('product_types.order', sortDirection)
        }

        const rows = await query
            .select([
                'id',
                'created_at',
                'name',
                'image_cover',
                'order',
            ])
            .execute()
        return {
            productTypes: rows,
            total,
        }
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
        image_cover,
        description,
    }: {
        name: string,
        image_cover?: string,
        description?: string,
    }) {
        const values: any = {
            name
        }
        if (image_cover !== undefined) {
            values.image_cover = image_cover
        }
        if (description !== undefined) {
            values.description = description
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
        image_cover,
        description,
    }: {
        id: number,
        name?: string,
        image_cover?: string,
        description?: string
    }) {
        let query = db.updateTable('product_types')
            .where('id', '=', id)

        if (name !== undefined) {
            query = query.set('name', name)
        }

        if (image_cover !== undefined) {
            query = query.set('image_cover', image_cover)
        }

        if (description !== undefined) {
            query = query.set('description', description)
        }

        const rows = await query.execute()

        return rows
    }
    async bulkUpdateOrders({ items }: { items: { id: number; order: number }[] }) {
        await Promise.all(items.map(item =>
          db.updateTable('product_types')
            .set({
              order: item.order,
            })
            .where('id', '=', item.id)
            .execute()
        ));
    }
}

export default ProductTypesController
