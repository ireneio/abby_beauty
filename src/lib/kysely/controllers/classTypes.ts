import { db } from ".."

class ClassTypesController {
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
        let countQuery = db
            .selectFrom('class_types')

        if (search) {
            countQuery = countQuery.where((eb) => eb('class_types.name', 'like', `%${search}%`))
        }

        const countResult = await countQuery
            .select([db.fn.count('class_types.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('class_types')

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (search) {
            query = query.where((eb) => eb('class_types.name', 'like', `%${search}%`))
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('class_types.created_at', sortDirection)
        }

        if (sortBy === 'order') {
            query = query.orderBy('class_types.order', sortDirection)
        }

        const rows = await query
            .selectAll()
            .execute()
        return {
            classTypes: rows,
            total,
        }
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
    async bulkUpdateOrders({ items }: { items: { id: number; order: number }[] }) {
        await Promise.all(items.map(item =>
          db.updateTable('class_types')
            .set({
              order: item.order,
            })
            .where('id', '=', item.id)
            .execute()
        ));
    }
}

export default ClassTypesController
