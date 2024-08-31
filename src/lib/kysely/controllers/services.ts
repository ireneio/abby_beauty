import { db } from "..";

class ServicesController {
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
            .selectFrom('services')

        if (search) {
            countQuery = countQuery.where((eb) => eb('services.title', 'like', `%${search}%`))
        }

        const countResult = await countQuery
            .select([db.fn.count('services.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('services')

        if (search) {
            query = query.where((eb) => eb('services.title', 'like', `%${search}%`))
        }

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('services.created_at', sortDirection)
        }

        if (sortBy === 'order') {
            query = query.orderBy('services.order', sortDirection)
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
        const row = await db.selectFrom('services')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()
        return row
    }
    async create({
        image,
        title,
        content,
        url,
        url_open_type,
    }: {
        image: string,
        title: string,
        content: string,
        url?: string,
        url_open_type?: string,
    }) {
        const values: any = {
            image,
            title,
            content,
        }
        if (url !== undefined) {
            values.url = url
        }
        if (url_open_type !== undefined) {
            values.url_open_type = url_open_type
        }
        const row = await db.insertInto('services')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        return row
    }
    async update({
        id,
        image,
        title,
        content,
        url,
        url_open_type,
    }: {
        id: number,
        image?: string,
        title?: string,
        content?: string,
        url?: string,
        url_open_type?: string,
    }) {
        let query = db.updateTable('services')
            .where('id', '=', id)

        if (image !== undefined) {
            query = query.set('image', image)
        }

        if (title !== undefined) {
            query = query.set('title', title)
        }

        if (content !== undefined) {
            query = query.set('content', content)
        }

        if (url !== undefined) {
            query = query.set('url', url)
        }

        if (url_open_type !== undefined) {
            query = query.set('url_open_type', url_open_type)
        }

        const rows = await query.execute()

        return rows
    }
    async remove({ id }: { id: number }) {
        const row = await db.deleteFrom('services')
            .where('id', '=', id)
            .executeTakeFirst()
        return true
    }
    async bulkUpdateOrders({ items }: { items: { id: number; order: number }[] }) {
        await Promise.all(items.map(item =>
          db.updateTable('services')
            .set({
              order: item.order,
            })
            .where('id', '=', item.id)
            .execute()
        ));
    }
}

export default ServicesController
