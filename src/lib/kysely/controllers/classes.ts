import { db } from "@/lib/kysely"

class ClassesController {
    async getAllClient() {
        const rows = await db.selectFrom('classes')
            .leftJoin('class_types', 'classes.class_type_id', 'class_types.id')
            .where('classes.hidden', '!=', true)
            .orderBy('class_types.order', 'asc')
            .orderBy('classes.order', 'asc')
            .select([
                'classes.id as id',
                'classes.name as name',
                'classes.minutes as minutes',
                'classes.image_cover as image_cover',
                'classes.available_for_reservation as available_for_reservation',
                'class_types.id as class_type_id',
                'class_types.name as class_type_name',
                'classes.created_at as created_at',
                'classes.updated_at as updated_at',
            ])
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
        let countQuery = db
            .selectFrom('classes')

        if (search) {
            countQuery = countQuery.where((eb) => eb('classes.name', 'like', `%${search}%`))
        }

        const countResult = await countQuery
            .select([db.fn.count('classes.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('classes')
            .leftJoin('class_types', 'classes.class_type_id', 'class_types.id')
            .where('classes.hidden', '!=', true)

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (search) {
            query = query.where((eb) => eb('classes.name', 'like', `%${search}%`))
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('classes.created_at', sortDirection)
        }

        if (sortBy === 'order') {
            query = query.orderBy('classes.order', sortDirection)
        }

        const rows = await query
            .where('classes.hidden', '!=', true)
            // .orderBy('class_types.order', 'asc')
            // .orderBy('classes.order', 'asc')
            .select([
                'classes.id as id',
                'classes.name as name',
                'classes.minutes as minutes',
                'classes.image_cover as image_cover',
                'classes.available_for_reservation as available_for_reservation',
                'class_types.id as class_type_id',
                'class_types.name as class_type_name',
                'classes.created_at as created_at',
                'classes.updated_at as updated_at',
            ])
            .execute()
            
        return {
            classes: rows,
            total,
        }
    }

    async getById(id: number) {
        const rows = await db.selectFrom('classes')
            .leftJoin('class_types', 'classes.class_type_id', 'class_types.id')
            .where('classes.hidden', '!=', true)
            .where('classes.id', '=', id)
            .select([
                'classes.id as id',
                'classes.name as name',
                'classes.minutes as minutes',
                'classes.image_cover as image_cover',
                'classes.available_for_reservation as available_for_reservation',
                'class_types.id as class_type_id',
                'class_types.name as class_type_name',
                'classes.created_at as created_at',
                'classes.updated_at as updated_at',
            ])
            .execute()

        return rows
    }

    async update(id: number, params: any) {
        const { name, minutes, image_cover, available_for_reservation, class_type_id } = params
        const rows = await db.updateTable('classes')
            .set({
                name: name ?? '',
                minutes: minutes ? parseInt(minutes) : 0,
                image_cover: image_cover ?? '',
                available_for_reservation: available_for_reservation ?? false,
                class_type_id: class_type_id ? Number(class_type_id) : undefined,
            })
            .where('classes.id', '=', id)
            .execute()
        return rows
    }

    async create(params: any) {
        const { name, minutes, image_cover, available_for_reservation, class_type_id } = params
        const rows = await db.insertInto('classes')
            .values([
                {
                    name: name ?? '',
                    minutes: minutes ? parseInt(minutes) : 0,
                    image_cover: image_cover ?? '',
                    available_for_reservation: available_for_reservation ?? false,
                    class_type_id: class_type_id ? Number(class_type_id) : undefined,
                }
            ])
            .returningAll()
            .execute()
        return rows
    }

    async hide(id: number) {
        const rows = await db.updateTable('classes')
            .set({ hidden: true })
            .where('classes.id', '=', id)
            .execute()
        return rows
    }
}

export default ClassesController
