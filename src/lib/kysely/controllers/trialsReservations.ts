import { sendTrialsReservationEmail } from "@/lib/resend/sendEmail"
import { db } from ".."

class TrialsReservationsController {
    async getAll() {
        const rows = await db.selectFrom('trials_reservations')
            .select([
                'id',
                'name',
                'email',
                'phone',
                'line_id',
                'date',
                'time_of_day',
                'know_us_list',
                'marked',
            ])
            .orderBy('created_at', 'desc')
            .execute()

        return rows
    }
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('trials_reservations')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()

        return row
    }
    async create({
       name,
       email,
       phone,
       line_id,
       date,
       time_of_day,
       know_us_list,
    }: {
        name: string,
        email: string,
        phone: string,
        date: string,
        time_of_day: string,
        know_us_list?: string[]
        line_id?: string
    }) {
        const values: any = {
            name,
            email,
            phone,
            date,
            time_of_day
        }
        if (line_id !== undefined) {
            values.line_id = line_id
        }
        if (know_us_list !== undefined) {
            values.know_us_list = know_us_list
        }
        const row = await db.insertInto('trials_reservations')
            .values(values)
            .returning('id')
            .executeTakeFirst()
        
        try {
            await sendTrialsReservationEmail({
                to: 'keiko15678@gmail.com'
            })
        } catch (e) {
            console.log(e);
        }
        
        return row
    }

    async update({
        id,
        name,
        email,
        phone,
        line_id,
        date,
        time_of_day,
        know_us_list,
        marked,
        remark,
     }: {
        id: number,
        name: string,
        email: string,
        phone: string,
        date: string,
        time_of_day: string,
        know_us_list?: string[]
        line_id?: string
        marked?: boolean
        remark?: string
     }) {
        const values: any = {
            name,
            email,
            phone,
            date,
            time_of_day
        }
        if (line_id !== undefined) {
            values.line_id = line_id
        }
        if (know_us_list !== undefined) {
            values.know_us_list = know_us_list
        }
        if (marked !== undefined) {
            values.marked = marked
        }
        if (remark !== undefined) {
            values.remark = remark
        }
         const row = await db.updateTable('trials_reservations')
            .where('id', '=', id)
            .set(values)
            .returning('id')
            .executeTakeFirst()
         
         return row
     }
}

export default TrialsReservationsController
