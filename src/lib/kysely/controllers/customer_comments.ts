import { db } from "..";

class CustomerCommentsController {
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
            .selectFrom('customer_comments')

        if (search) {
            countQuery = countQuery.where((eb) => eb.or([
                eb('customer_comments.customer_name', 'like', `%${search}%`),
                eb('customer_comments.content', 'like', `%${search}%`)
            ]))
        }

        const countResult = await countQuery
            .select([db.fn.count('customer_comments.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('customer_comments')

        if (search) {
            query = query.where((eb) => eb.or([
                eb('customer_comments.customer_name', 'like', `%${search}%`),
                eb('customer_comments.content', 'like', `%${search}%`)
            ]))
        }

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('customer_comments.created_at', sortDirection)
        }

        if (sortBy === 'order') {
            query = query.orderBy('customer_comments.order', sortDirection)
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
        const row = await db.selectFrom('customer_comments')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()
        return row
    }
    async create({
        avatar,
        customer_name,
        content,
        stars,
    }: {
        avatar: string,
        customer_name: string,
        content: string,
        stars: number
    }) {
        const values: any = {
            avatar,
            customer_name,
            content,
            stars,
        }
        const row = await db.insertInto('customer_comments')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        return row
    }
    async update({
        id,
        avatar,
        customer_name,
        content,
        stars,
    }: {
        id: number,
        avatar?: string,
        customer_name?: string,
        content?: string,
        stars?: number;
    }) {
        let query = db.updateTable('customer_comments')
            .where('id', '=', id)

        if (avatar !== undefined) {
            query = query.set('avatar', avatar)
        }

        if (customer_name !== undefined) {
            query = query.set('customer_name', customer_name)
        }

        if (content !== undefined) {
            query = query.set('content', content)
        }

        if (stars !== undefined) {
            query = query.set('stars', stars)
        }

        const rows = await query.execute()

        return rows
    }
    async remove({ id }: { id: number }) {
        const row = await db.deleteFrom('customer_comments')
            .where('id', '=', id)
            .executeTakeFirst()
        return true
    }
    async bulkUpdateOrders({ items }: { items: { id: number; order: number }[] }) {
        await Promise.all(items.map(item =>
          db.updateTable('customer_comments')
            .set({
              order: item.order,
            })
            .where('id', '=', item.id)
            .execute()
        ));
    }
}

export default CustomerCommentsController
