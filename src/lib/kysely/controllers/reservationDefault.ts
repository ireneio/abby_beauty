import { db } from ".."

class ReservationDefaultController {
    async getByOwnerId(owner_id: number) {
        const reservation_default_daysofweek = await db.selectFrom('reservation_default_daysofweek')
            .where('owner_id', '=', owner_id)
            .selectAll()
            .execute()

        const reservation_default_time = await db.selectFrom('reservation_default_time')
            .where('owner_id', '=', owner_id)
            .selectAll()
            .execute()
        
        return {
            reservation_default_daysofweek,
            reservation_default_time,
        }
    }
    async update({
        available_classes, available_days_of_week, available_time, owner_id
    }: {
        available_classes: number[],
        available_days_of_week: string[],
        available_time: { start: string, end: string }[],
        owner_id: number,
    }) {
        await db.updateTable('classes')
            .set('available_for_reservation', true)
            .where('classes.id', 'in', available_classes)
            .execute()

        await db.updateTable('classes')
            .set('available_for_reservation', false)
            .where('classes.id', 'not in', available_classes)
            .execute()

        await db.deleteFrom('reservation_default_daysofweek')
            .where('owner_id', '=', owner_id)
            .execute()

        await db.insertInto('reservation_default_daysofweek')
            .values(available_days_of_week.map((v) => {
                return {
                    owner_id,
                    day: v,
                }
            }))
            .execute()

        await db.deleteFrom('reservation_default_time')
            .where('owner_id', '=', owner_id)
            .execute()

        const availableTimeList = available_time.reduce<string[]>((a, c) => {
            a = [...a, c.start, c.end]
            return a
        }, [])

        await db.insertInto('reservation_default_time')
            .values(availableTimeList.map((v) => {
                return {
                    owner_id,
                    time: v,
                }
            }))
            .execute()

        return true
    }
}

export default ReservationDefaultController
