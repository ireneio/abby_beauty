import { db } from ".."

class TrialsController {
    async getAllClient() {
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
            .selectFrom('trials')

        if (search) {
            countQuery = countQuery.where((eb) => eb('trials.title_short', 'like', `%${search}%`))
        }

        const countResult = await countQuery
            .select([db.fn.count('trials.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('trials')

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (search) {
            query = query.where((eb) => eb('trials.title_short', 'like', `%${search}%`))
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('trials.created_at', sortDirection)
        }

        if (sortBy === 'order') {
            query = query.orderBy('trials.order', sortDirection)
        }

        if (sortBy === 'order_home_page') {
            query = query.orderBy('trials.order_home_page', sortDirection)
        }

        const rows = await query
            .select([
                'id',
                'slug',
                'title_short',
                'hidden',
                'display_on_home_page',
            ])
            .execute()

        const imagesQuery = db.selectFrom('trial_images')
            .leftJoin('trials', 'trials.id', 'trial_images.trial_id')
            .select([
                'trials.id as trial_id',
                'trial_images.id as id',
                'trial_images.url',
                'trial_images.order',
            ])
            .orderBy('trial_images.order', 'asc')

        const images = await imagesQuery.execute()

        return {
            trials: rows.map((row) => {
                return {
                    ...row,
                    images: images
                        .filter((img) => img.trial_id === row.id)
                        .map((img) => {
                            return {
                                id: img.id,
                                url: img.url,
                                order: img.order,
                            }
                        }),
                }
            }),
            total,
        }
    }
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('trials')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()

        if (row?.id) {
            const imagesQuery = db.selectFrom('trial_images')
                .leftJoin('trials', 'trials.id', 'trial_images.trial_id')
                .where('trial_id', '=', row.id)
                .select([
                    'trials.id as trial_id',
                    'trial_images.id as id',
                    'trial_images.url',
                    'trial_images.order',
                ])
                .orderBy('trial_images.order', 'asc')
    
            const images = await imagesQuery.execute()

            return {
                ...row,
                images,
            }
        }

        return {
            ...row,
            images: []
        }
    }
    async getBySlug({ slug }: { slug: string }) {
        const row = await db.selectFrom('trials')
            .where('hidden', '!=', true)
            .where('slug', '=', slug)
            .selectAll()
            .executeTakeFirst()

        if (row?.id) {
            const imagesQuery = db.selectFrom('trial_images')
                .leftJoin('trials', 'trials.id', 'trial_images.trial_id')
                .where('trial_id', '=', row.id)
                .select([
                    'trials.id as trial_id',
                    'trial_images.id as id',
                    'trial_images.url',
                    'trial_images.order',
                ])
                .orderBy('trial_images.order', 'asc')
    
            const images = await imagesQuery.execute()

            return {
                ...row,
                images,
            }
        }

        return {
            ...row,
            images: []
        }
    }
    async getBySlugServerSide({ slug }: { slug: string }) {
        const row = await db.selectFrom('trials')
            .where('hidden', '!=', true)
            .where('slug', '=', slug)
            .select([
                'title',
                'title_short',
                'subtitle',
            ])
            .executeTakeFirst()

        return row
    }
    async create({
       title,
       title_short,
       slug,
       content,
       subtitle,
       order = 0,
       images,
       price_discount,
       price_original,
    }: {
        title: string,
        title_short: string,
        slug: string,
        content?: string
        subtitle?: string
        order?: number,
        images: { url: string, order: number }[],
        price_discount: number,
        price_original: number,
    }) {
        const values: any = {
            title,
            title_short,
            slug,
            order,
            price_discount,
            price_original,
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

        if (row?.id) {
            await db.insertInto('trial_images')
                .values(images.map((v) => ({
                    trial_id: row.id,
                    url: v.url,
                    order: v.order,
                })))
                .execute()
        }
        
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
        images,
        price_discount,
        price_original,
        hidden,
     }: {
        id: number
        title?: string,
        title_short?: string,
        slug?: string,
        subtitle?: string,
        content?: string,
        order?: number,
        images?: { url: string, order: number }[],
        price_discount: number,
        price_original: number,
        hidden?: number;
     }) {
        const values: any = {}
        if (title !== undefined) {
            values.title = title
        }
        if (title_short !== undefined) {
            values.title_short = title_short
        }
        if (order !== undefined) {
            values.order = order
        }
        if (price_discount !== undefined) {
            values.price_discount = price_discount
        }
        if (price_original !== undefined) {
            values.price_original = price_original
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
        if (hidden !== undefined) {
            values.hidden = hidden
        }
         const row = await db.updateTable('trials')
            .where('id', '=', id)
            .set(values)
            .returning('id')
            .executeTakeFirst()

        if (row?.id && images) {
            await db.deleteFrom('trial_images')
                .where('trial_id', '=', id)
                .execute()

            if (images.length > 0) {
                await db.insertInto('trial_images')
                    .values(images.map((v) => ({
                        trial_id: id,
                        url: v.url,
                        order: v.order,
                    })))
                    .execute()
            }
        }
         
         return row
     }
     async remove({ id }: { id: number }) {
        const row = await db.deleteFrom('trials')
            .where('id', '=', id)
            .executeTakeFirst()
        
        return true
    }
    async bulkUpdateOrders({ items }: { items: { id: number; order: number }[] }) {
        await Promise.all(items.map(item =>
          db.updateTable('trials')
            .set({
              order: item.order,
            })
            .where('id', '=', item.id)
            .execute()
        ));
    }
    async updateDisplayOnHomePage({ id, display_on_home_page }: { id: number, display_on_home_page: boolean }) {        
        const row = await db.updateTable('trials')
            .set('display_on_home_page', display_on_home_page)
            .where('id', '=', id)
            .executeTakeFirst()
        return true
    }
    async bulkUpdateOrdersHomePage({ items }: { items: { id: number; order: number }[] }) {
        await Promise.all(items.map(item =>
          db.updateTable('trials')
            .set({
              order_home_page: item.order,
            })
            .where('id', '=', item.id)
            .execute()
        ));
    }
}

export default TrialsController
