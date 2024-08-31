import { db } from "..";

class BrandsController {
    async getAll({
        search,
        page,
        perPage,
        sortBy,
        sortDirection,
    }: {
        search?: string,
        page?: number,
        perPage?: number,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
    }) {
        let countQuery = db
            .selectFrom('brands')

        if (search) {
            countQuery = countQuery.where((eb) => eb('brands.title', 'like', `%${search}%`))
        }

        const countResult = await countQuery
            .select([db.fn.count('brands.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('brands')

        if (search) {
            query = query.where((eb) => eb('brands.title', 'like', `%${search}%`))
        }

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('brands.created_at', sortDirection)
        }

        if (sortBy === 'order') {
            query = query.orderBy('brands.order', sortDirection)
        }

        const rows = await query
            .selectAll()
            .execute()
        return {
            rows,
            total,
        }
    }
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('brands')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()
        return row
    }
    async create({
        image,
        title,
    }: {
        image: string,
        title: string,
    }) {
        const values: any = {
            image,
            title,
        }
        const row = await db.insertInto('brands')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        return row
    }
    async update({
        id,
        image,
        title,
    }: {
        id: number,
        image?: string,
        title?: string,
    }) {
        let query = db.updateTable('brands')
            .where('id', '=', id)

        if (image !== undefined) {
            query = query.set('image', image)
        }
        if (title !== undefined) {
            query = query.set('title', title)
        }

        const rows = await query.execute()

        return rows
    }
    async remove({ id }: { id: number }) {
        const row = await db.deleteFrom('brands')
            .where('id', '=', id)
            .executeTakeFirst()
        return true
    }
    async bulkUpdateOrders({ items }: { items: { id: number; order: number }[] }) {
        await Promise.all(items.map(item =>
          db.updateTable('brands')
            .set({
              order: item.order,
            })
            .where('id', '=', item.id)
            .execute()
        ));
    }
}

export default BrandsController
