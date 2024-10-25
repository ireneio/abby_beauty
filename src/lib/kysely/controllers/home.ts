import { db } from ".."

class HomeController {
    async getData() {
        const banners = await db.selectFrom('banners')
            .orderBy('order', 'asc')
            .select([
                'id',
                'image_desktop',
                'image_mobile',
                'url',
                'url_open_type',
                'order',
            ])
            .execute()

        const services = await db.selectFrom('services')
            .orderBy('order', 'asc')
            .select([
                'id',
                'image',
                'title',
                'content',
                'url',
                'url_open_type',
                'order'
            ])
            .execute()

        const trials = await db.selectFrom('trials')
            .where('display_on_home_page', '=', true)
            .orderBy('order_home_page', 'asc')
            .select([
                'id',
                'title_short',
                'price_discount',
                'price_original',
                'order',
                'slug',
            ])
            .execute()

            const trialImages = await db.selectFrom('trial_images')
                .where('order', '=', 0)
                .select([
                    'trial_id',
                    'url'
                ])
                .execute()

        const customer_comments = await db.selectFrom('customer_comments')
            .orderBy('order', 'asc')
            .select([
                'id',
                'avatar',
                'customer_name',
                'content',
                'stars',
                'order',
            ])
            .execute()

        const brands = await db.selectFrom('brands')
            .orderBy('order', 'asc')
            .select([
                'id',
                'title',
                'image',
                'order'
            ])
            .execute()

        // const joinus = await db.selectFrom('joinus')
        //     .where('id', '=', 1)
        //     .select([
        //         'image',
        //         'content'
        //     ])
        //     .executeTakeFirst()

        const aboutus = await db.selectFrom('aboutus')
            .where('id', '=', 1)
            .select([
                'image',
                'content'
            ])
            .executeTakeFirst()

        return {
            banners,
            services,
            trials: trials.map((trial) => {
                return {
                    ...trial,
                    image: trialImages.find((image) => image.trial_id === trial.id)?.url ?? ''
                }
            }),
            customer_comments,
            brands,
            // joinus,
            aboutus,
        }
    }
}

export default HomeController