import dayjs from "dayjs"
import { db, sql } from ".."

class ReservationController {
    async getList({
        startDate,
        endDate,
        page,
        perPage,
        email,
        phone,
        assignee_id,
        class_id,
    }: {
        startDate: string,
        endDate: string,
        page?: number,
        perPage?: number,
        email?: string,
        phone?: string,
        assignee_id?: number,
        class_id?: number,
    }) {
        const _startDate = dayjs(startDate).startOf('day').toDate()
        const _endDate = dayjs(endDate).endOf('day').toDate()
        const query = db.selectFrom('reservation_record')
            .where((eb) => {
                const query = eb.and([
                    eb('date', '>=', _startDate),
                    eb('date', '<=', _endDate),
                ]);
        
                if (assignee_id !== undefined) {
                    query.and('assignee_id', '=', assignee_id);
                }

                if (class_id !== undefined) {
                    query.and('class_id', '=', class_id);
                }

                if (email !== undefined) {
                    query.and('email', '=', email);
                }

                if (phone !== undefined) {
                    query.and('phone', '=', phone);
                }
        
                return query;
            })
            .orderBy('date', 'asc')
            .selectAll()
        
        if (page !== undefined && perPage !== undefined) {
            const offset = (page - 1) * perPage
            const limit = offset + perPage
            query.offset(offset)
            query.limit(limit)
        }

        const rows = await query.execute()

        return rows
    }

    async create({
        name,
        email,
        phone,
        memo,
        class_id,
        date,
        assignee_id
    }: {
        name: string,
        email: string,
        phone?: string,
        memo?: string,
        class_id: number,
        date: string,
        assignee_id: number,
    }) {
        const _date = dayjs(date).toDate()

        const _dateToYYMMDD = dayjs(date).format('YYYY-MM-DD')

        const existingRecords = await db.selectFrom('reservation_record')
            .leftJoin('classes', 'classes.id', 'reservation_record.class_id')    
            .where('classes.id', '=', class_id)
            .where('reservation_record.assignee_id', '=', assignee_id)
            .where(sql`DATE(reservation_record.date)`, '=', _dateToYYMMDD)
            .select([
                'classes.name as class_name',
                'classes.minutes as class_length',
                'reservation_record.date as class_date'
            ])
            .execute()

        if (existingRecords.length > 0) {
            const hasExistingReservations = existingRecords
                .reduce((a: { start: Date, end: Date }[], c) => {
                    if (c.class_length) {
                        const end = dayjs(c.class_date).add(c.class_length, 'minutes').toDate()
                        a = [...a, { start: c.class_date, end }]
                    }
                    return a
                }, [])
                .filter((v) => {
                    return dayjs(v.start).isSame(dayjs(_date)) ||
                        dayjs(v.start).isBefore(dayjs(_date)) ||
                        dayjs(v.end).isSame(dayjs(_date)) ||
                        dayjs(v.end).isAfter(dayjs(_date))
                })
                .length > 0
            if (hasExistingReservations) {
                return false
            }
        }

        const rows = await db.insertInto('reservation_record')
            .values([
                {
                    name,
                    email,
                    phone,
                    memo,
                    class_id,
                    date: _date,
                    assignee_id,
                }
            ])
            .execute()
        return true
    }

    async update(id: number, {
        name,
        email,
        phone,
        memo,
        date,
        class_id,
        assignee_id,
    }: {
        name?: string,
        email?: string,
        phone?: string,
        memo?: string,
        date?: string,
        class_id?: number,
        assignee_id: number,
    }) {
        const query = db.updateTable('reservation_record')
            .where('id', '=', id)
        
        if (name !== undefined) {
            query.set('name', name)
        }
        if (email !== undefined) {
            query.set('email', email)
        }
        if (phone !== undefined) {
            query.set('phone', phone)
        }
        if (memo !== undefined) {
            query.set('memo', memo)
        }
        if (date !== undefined) {
            const _date = dayjs(date).toDate()
            query.set('date', _date)
        }
        if (class_id !== undefined) {
            query.set('class_id', class_id)
        }
        if (assignee_id !== undefined) {
            query.set('assignee_id', assignee_id)
        }

        const rows = await query.execute()

        return rows
    }

    async cancel(id: number) {
        const rows = await db.updateTable('reservation_record')
            .set('canceled', true)
            .where('id', '=', id)
            .execute()
        return rows
    }
}

export default ReservationController
