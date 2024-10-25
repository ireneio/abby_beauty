import { db } from ".."

class PagesController {
    async getAll(params?: {
        allow_access?: boolean,
    }) {
        const query = db.selectFrom('pages')
        if (params) {
            const { allow_access } = params
            if (allow_access !== undefined) {
                query.where('allow_access', '=', allow_access)
            }
        }
        const rows = await query
            .select([
                'id',
                'title',
                'slug',
                'allow_access',
                'created_at'
            ])
            .execute()

        return rows
    }
    async getBySlug({
        slug,
        allow_access,
    }: {
        slug: string,
        allow_access?: boolean,
    }) {
        const query = db.selectFrom('pages')
        if (allow_access !== undefined) {
            query.where('allow_access', '=', allow_access)
        }
        const row = await query
            .where('slug', '=', slug)
            .selectAll()
            .executeTakeFirst()

        return row
    }
    async getById({
        id,
        allow_access,
    }: {
        id: number,
        allow_access?: boolean,
    }) {
        const query = db.selectFrom('pages')
        if (allow_access !== undefined) {
            query.where('allow_access', '=', allow_access)
        }
        const row = await query
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()

        return row
    }
    async create({
        title,
        slug,
        content
    }: {
        title: string,
        slug: string,
        content: string
    }) {
        const row = await db.insertInto('pages')
            .values([
                {
                    title,
                    slug,
                    content,
                }
            ])
            .returning('id')
            .executeTakeFirst()
        return row
    }
    async update({
        id,
        title,
        slug,
        content
    }: {
        id: number,
        slug?: string,
        title?: string,
        content?: string
    }) {
        let query = db.updateTable('pages')

        if (slug !== undefined) {
            query = query.set('slug', slug)
        }

        if (title !== undefined) {
            query = query.set('title', title)
        }
         
        if (content !== undefined) {
            query = query.set('content', content)
        }

        const row = await query
            .where('id', '=', id)
            .returning('id')
            .executeTakeFirst()

        return row
    }
}

export default PagesController