import { db } from "..";

class JoinUsController {
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('joinus')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()
        return row
    }
    async update({
        id,
        image,
        content,
    }: {
        id: number,
        image?: string,
        content?: string,
    }) {
        let query = db.updateTable('joinus')
            .where('id', '=', id)

        if (image !== undefined) {
            query = query.set('image', image)
        }
        if (content !== undefined) {
            query = query.set('content', content)
        }

        const rows = await query.execute()

        return rows
    }
}

export default JoinUsController
