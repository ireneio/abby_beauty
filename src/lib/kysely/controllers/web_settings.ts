import { db } from "..";

class WebSettingsController {
    async getById({ id }: { id: number }) {
        const row = await db.selectFrom('web_settings')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()
        return row
    }
    async update({
        id,
        logo_square,
        logo_rect,
        company_email,
        company_phone,
        company_address,
        company_lineid,
        copyright_text,
        info_about_us,
        info_hint,
        website_title,
        site_name,
        website_description,
    }: {
        id: number,
        logo_square?: string,
        logo_rect?: string,
        company_email?: string,
        company_phone?: string,
        company_address?: string,
        company_lineid?: string,
        copyright_text?: string,
        info_about_us?: string,
        info_hint?: string,
        website_title?: string,
        site_name?: string,
        website_description?: string,
    }) {
        let query = db.updateTable('web_settings')
            .where('id', '=', id)

        if (logo_square !== undefined) {
            query = query.set('logo_square', logo_square)
        }
        if (logo_rect !== undefined) {
            query = query.set('logo_rect', logo_rect)
        }
        if (company_email !== undefined) {
            query = query.set('company_email', company_email)
        }
        if (company_phone !== undefined) {
            query = query.set('company_phone', company_phone)
        }
        if (company_address !== undefined) {
            query = query.set('company_address', company_address)
        }
        if (company_lineid !== undefined) {
            query = query.set('company_lineid', company_lineid)
        }
        if (copyright_text !== undefined) {
            query = query.set('copyright_text', copyright_text)
        }
        if (info_about_us !== undefined) {
            query = query.set('info_about_us', info_about_us)
        }
        if (info_hint !== undefined) {
            query = query.set('info_hint', info_hint)
        }
        if (website_title !== undefined) {
            query = query.set('website_title', website_title)
        }
        if (site_name !== undefined) {
            query = query.set('site_name', site_name)
        }
        if (website_description !== undefined) {
            query = query.set('website_description', website_description)
        }

        const rows = await query.execute()

        return rows
    }
}

export default WebSettingsController
