import dayjs from "dayjs";
import { db, sql } from "..";

class ArticlesController {
    async getAll({
        search,
        page,
        perPage,
        sortBy,
        sortDirection,
        startDate,
        endDate,
    }: {
        search?: string,
        page?: number,
        perPage?: number,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
        startDate?: string,
        endDate?: string,
    }) {
        let countQuery = db
            .selectFrom('articles')

        if (search) {
            countQuery = countQuery.where((eb) => eb('articles.title', 'like', `%${search}%`))
        }

        if (startDate) {
            countQuery = countQuery.where((eb) => eb('articles.publish_date', '>=', dayjs(startDate).startOf('day').toDate()))
        }

        if (endDate) {
            countQuery = countQuery.where((eb) => eb('articles.publish_date', '>=', dayjs(endDate).startOf('day').toDate()))
        }

        const countResult = await countQuery
            .select([db.fn.count('articles.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('articles')

        if (search) {
            query = query.where((eb) => eb('articles.title', 'like', `%${search}%`))
        }

        if (startDate) {
            query = query.where((eb) => eb('articles.publish_date', '>=', dayjs(startDate).startOf('day').toDate()))
        }

        if (endDate) {
            query = query.where((eb) => eb('articles.publish_date', '>=', dayjs(endDate).startOf('day').toDate()))
        }

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('articles.created_at', sortDirection)
        }

        if (sortBy === 'publish_date') {
            query = query.orderBy('articles.publish_date', sortDirection)
        }

        if (sortBy === 'start_date') {
            query = query.orderBy('articles.start_date', sortDirection)
        }

        const rows = await query
            .select([
                'id',
                'cover',
                'title',
                'subtitle',
                'content',
                'publish_date',
                'start_date',
                'end_date',
                'slug',
                sql<any>`(
                    SELECT json_agg(json_build_object('id', article_tags.id, 'name', article_tags.name))
                    FROM article_tags
                    WHERE article_tags.id = ANY(articles.tag_ids)
                )`.as('tags')
            ])
            .execute()

        return {
            rows,
            total,
        }
    }
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('articles')
            .where('id', '=', id)
            .select([
                'id',
                'cover',
                'title',
                'subtitle',
                'content',
                'publish_date',
                'start_date',
                'end_date',
                'slug',
                sql<any>`(
                    SELECT json_agg(json_build_object('id', article_tags.id, 'name', article_tags.name))
                    FROM article_tags
                    WHERE article_tags.id = ANY(articles.tag_ids)
                )`.as('tags')
            ])
            .executeTakeFirst()
        return row
    }
    async getBySlug({ slug }: { slug: string }) {
        const row = await db.selectFrom('articles')
            .where('slug', '=', slug)
            .select([
                'id',
                'cover',
                'title',
                'subtitle',
                'content',
                'publish_date',
                'start_date',
                'end_date',
                'slug',
                sql<any>`(
                    SELECT json_agg(json_build_object('id', article_tags.id, 'name', article_tags.name))
                    FROM article_tags
                    WHERE article_tags.id = ANY(articles.tag_ids)
                )`.as('tags')
            ])
            .executeTakeFirst()
        return row
    }
    async create({
        title,
        publish_date,
        cover,
        subtitle,
        content,
        start_date,
        end_date,
        tag_ids,
    }: {
        title: string,
        publish_date: string,
        cover?: string,
        subtitle?: string,
        content?: string,
        start_date?: string,
        end_date?: string,
        tag_ids?: number[],
    }) {
        const values: any = {
            title,
            slug: `article${dayjs(publish_date).format('YYYYMMDDHHmmss')}`,
            // publish_date: dayjs(publish_date).toDate(),
            publish_date,
        }
        if (cover !== undefined) {
            values.cover = cover
        }
        if (subtitle !== undefined) {
            values.subtitle = subtitle
        }
        if (content !== undefined) {
            values.content = content
        }
        if (start_date !== undefined && dayjs(start_date).isValid()) {
            values.start_date = dayjs(start_date).toDate()
        }
        if (end_date !== undefined && dayjs(end_date).isValid()) {
            values.end_date = dayjs(end_date).toDate()
        }
        if (tag_ids !== undefined) {
            values.tag_ids = tag_ids
        }
        const row = await db.insertInto('articles')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        return row
    }
    async update({
        id,
        title,
        publish_date,
        cover,
        subtitle,
        content,
        start_date,
        end_date,
        tag_ids,
    }: {
        id: number,
        title?: string,
        publish_date?: string,
        cover?: string,
        subtitle?: string,
        content?: string,
        start_date?: string,
        end_date?: string,
        tag_ids?: number[],
    }) {
        let query = db.updateTable('articles')
            .where('id', '=', id)

        if (title !== undefined) {
            query = query.set('title', title)
        }
        if (publish_date !== undefined) {
            query = query.set('publish_date', dayjs(publish_date).startOf('day').toDate())
        }
        if (cover !== undefined) {
            query = query.set('cover', cover)
        }
        if (subtitle !== undefined) {
            query = query.set('subtitle', subtitle)
        }
        if (content !== undefined) {
            query = query.set('content', content)
        }
        if (start_date !== undefined && dayjs(start_date).isValid()) {
            query = query.set('start_date', dayjs(start_date).startOf('day').toDate())
        }
        if (end_date !== undefined && dayjs(end_date).isValid()) {
            query = query.set('end_date', dayjs(end_date).startOf('day').toDate())
        }
        if (tag_ids !== undefined) {
            query = query.set('tag_ids', tag_ids)
        }

        const rows = await query.execute()

        return rows
    }
    async remove({ id }: { id: number }) {
        const row = await db.deleteFrom('articles')
            .where('id', '=', id)
            .executeTakeFirst()
        return true
    }
}

export default ArticlesController
