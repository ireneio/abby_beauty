import { db } from "..";

class ArticleTagsController {
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
            .selectFrom('article_tags')

        if (search) {
            countQuery = countQuery.where((eb) => eb('article_tags.name', 'like', `%${search}%`))
        }

        const countResult = await countQuery
            .select([db.fn.count('article_tags.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('article_tags')

        if (search) {
            query = query.where((eb) => eb('article_tags.name', 'like', `%${search}%`))
        }

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('article_tags.created_at', sortDirection)
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
        const row = await db.selectFrom('article_tags')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()
        return row
    }
    async create({
        name,
    }: {
        name: string,
    }) {
        const values: any = {
            name,
        }
        const row = await db.insertInto('article_tags')
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
        let query = db.updateTable('article_tags')
            .where('id', '=', id)

        if (name !== undefined) {
            query = query.set('name', name)
        }

        const rows = await query.execute()

        return rows
    }
}

export default ArticleTagsController
