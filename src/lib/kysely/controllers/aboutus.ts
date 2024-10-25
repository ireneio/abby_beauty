import { db } from "..";

class AboutUsController {
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('aboutus')
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
        let query = db.updateTable('aboutus')
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

export default AboutUsController
