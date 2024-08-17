import dayjs from "dayjs"
import { db } from ".."

class ReservationAvailabilityController {
    async getByOwnerId({ owner_id, date }: { owner_id: number, date: string }) {
        const _date = dayjs(date).toDate()
        const rows = await db.selectFrom('reservation_availability')
            .where('owner_id', '=', owner_id)
            .where('date', '=', _date)
            .selectAll()
            .execute()

        return rows
    }

    async update({ time_list, date, owner_id }: { time_list: string[], date: string, owner_id: number }) {
        const _date = dayjs(date).toDate()
        await db.deleteFrom('reservation_availability')
            .where('owner_id', '=', owner_id)
            .where('date', '=', _date)
            .execute()

        const values = time_list.map((v) => {
            return {
                date: _date,
                owner_id,
                time: v,
            }
        })        

        const rows = await db.insertInto('reservation_availability')
            .values(values)
            .execute()
                
        return rows
        
    }
}

export default ReservationAvailabilityController