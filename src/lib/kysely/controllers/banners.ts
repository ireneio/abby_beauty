import { db } from "..";

class BannersController {
    async getAll({
        page,
        perPage,
        sortBy,
        sortDirection,
    }: {
        page?: number,
        perPage?: number,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
    }) {
        let countQuery = db
            .selectFrom('banners')

        const countResult = await countQuery
            .select([db.fn.count('banners.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('banners')

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('banners.created_at', sortDirection)
        }

        if (sortBy === 'order') {
            query = query.orderBy('banners.order', sortDirection)
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
        const row = await db.selectFrom('banners')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()
        return row
    }
    async create({
        image_mobile,
        image_desktop,
        url,
        url_open_type,
    }: {
        image_mobile: string,
        image_desktop: string,
        url?: string,
        url_open_type?: string,
    }) {
        const values: any = {
            image_mobile,
            image_desktop,
        }
        if (url !== undefined) {
            values.url = url
        }
        if (url_open_type !== undefined) {
            values.url_open_type = url_open_type
        }
        const row = await db.insertInto('banners')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        return row
    }
    async update({
        id,
        image_mobile,
        image_desktop,
        url,
        url_open_type,
    }: {
        id: number,
        image_mobile?: string,
        image_desktop?: string,
        url?: string,
        url_open_type?: string,
    }) {
        let query = db.updateTable('banners')
            .where('id', '=', id)

        if (image_mobile !== undefined) {
            query = query.set('image_mobile', image_mobile)
        }

        if (image_desktop !== undefined) {
            query = query.set('image_desktop', image_desktop)
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
        const row = await db.deleteFrom('banners')
            .where('id', '=', id)
            .executeTakeFirst()
        return true
    }
    async bulkUpdateOrders({ items }: { items: { id: number; order: number }[] }) {
        await Promise.all(items.map(item =>
          db.updateTable('banners')
            .set({
              order: item.order,
            })
            .where('id', '=', item.id)
            .execute()
        ));
    }
}

export default BannersController