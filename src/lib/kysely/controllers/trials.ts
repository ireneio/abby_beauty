import { db } from ".."

class TrialsController {
    async getAll() {
        const rows = await db.selectFrom('trials')
            .where('hidden', '!=', true)
            .select([
                'id',
                'slug',
                'title_short',
            ])
            .orderBy('order', 'asc')
            .execute()

        return rows
    }
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('trials')
            .where('hidden', '!=', true)
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()

        return row
    }
    async getBySlug({ slug }: { slug: string }) {
        const row = await db.selectFrom('trials')
            .where('hidden', '!=', true)
            .where('slug', '=', slug)
            .selectAll()
            .executeTakeFirst()

        return row
    }
    async create({
       title,
       title_short,
       slug,
       content,
       subtitle,
       order = 0
    }: {
        title: string,
        title_short: string,
        slug: string,
        content?: string
        subtitle?: string
        order?: number,
    }) {
        const values: any = {
            title,
            title_short,
            slug,
            order,
        }
        if (subtitle !== undefined) {
            values.subtitle = subtitle
        }
        if (content !== undefined) {
            values.content = content
        }
        const row = await db.insertInto('trials')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        return row
    }

    async update({
        id,
        title,
        title_short,
        subtitle,
        slug,
        content,
        order = 0,
     }: {
        id: number
        title: string,
        title_short: string,
        slug?: string,
        subtitle?: string,
        content?: string,
        order?: number,
     }) {
        const values: any = {
            title,
            title_short,
            order,
        }
        if (slug !== undefined) {
            values.slug = slug
        }
        if (subtitle !== undefined) {
            values.subtitle = subtitle
        }
        if (content !== undefined) {
            values.content = content
        }
         const row = await db.updateTable('trials')
            .where('id', '=', id)
            .set(values)
            .returning('id')
            .executeTakeFirst()
         
         return row
     }
     async remove({ id }: { id: number }) {
        const row = await db.updateTable('trials')
            .where('id', '=', id)
            .set('hidden',  true)
            .returning('id')
            .executeTakeFirst()
        
        return row
     }
}

export default TrialsController
