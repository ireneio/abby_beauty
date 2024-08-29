import { db } from "..";
import bcrypt from 'bcrypt'

class AdminsController {
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
            .selectFrom('admin')

        if (search) {
            countQuery = countQuery.where((eb) => eb('admin.username', 'like', `%${search}%`))
        }

        const countResult = await countQuery
            .select([db.fn.count('admin.id').as('total')])
            .executeTakeFirst();

        const total = Number(countResult?.total) ?? 0;

        let query = db.selectFrom('admin')

        if (page !== undefined && perPage !== undefined) {
            const offset = (Number(page) - 1) * Number(perPage)
            const limit = Number(perPage)
            
            query = query.offset(offset)
            query = query.limit(limit)
        }

        if (search) {
            query = query.where((eb) => eb('admin.username', 'like', `%${search}%`))
        }

        if (sortBy === 'created_at') {
            query = query.orderBy('admin.created_at', sortDirection)
        }

        const rows = await query
            .select([
                'id',
                'username',
                'permission',
                'created_at',
                'updated_at',
            ])
            .execute()

        return {
            rows,
            total,
        }
    }
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('admin')
            .where('id', '=', id)
            .select([
                'id',
                'username',
                'created_at',
                'updated_at',
            ])
            .executeTakeFirst()

        return row
    }
    async create({
        username,
        password,
    }: {
        username: string,
        password: string,
    }) {
        const row = await db.insertInto('admin')
            .values({
                username,
                password: await bcrypt.hash(password, 10)
            })
            .returning('id')
            .executeTakeFirst()

        return row
    }

    async updateWithoutOldPassword({
        id,
        password,
    }: {
        id: number,
        username: string,
        password: string,
    }) {
        const row = await db.updateTable('admin')
            .where('id', '=', id)
            .set({
                password: await bcrypt.hash(password, 10)
            })
            .returning('id')
            .executeTakeFirst()
        
        return row
    }

    async update({
        id,
        old_password,
        password,
    }: {
        id: number,
        username: string,
        old_password: string,
        password: string,
    }) {
        const user = await db.selectFrom('admin')
            .where('id', '=', id)
            .select([
                'password'
            ])
            .executeTakeFirst()
        if (user) {
            const userPassword = user.password
            const isPwMatch = await bcrypt.compare(old_password, userPassword)
            if (isPwMatch) {
                const row = await db.updateTable('admin')
                    .where('id', '=', id)
                    .set({
                        password: await bcrypt.hash(password, 10)
                    })
                    .returning('id')
                    .executeTakeFirst()
        
                return row
            }
        }
        throw new Error('old password does not match')
    }
    async remove({ id }: { id: number }) {        
        const row = await db.deleteFrom('admin')
            .where('id', '=', id)
            .executeTakeFirst()
        return true
    }
}

export default AdminsController
