import { db } from ".."

class ProductsController {
    async getAllClient(
        params?: {
            product_type_id?: number
        }
    ) {
        let productsQuery = db.selectFrom('products')
            .leftJoin('product_types', 'products.product_type_id', 'product_types.id')
        
        console.log(params);
        
        if (params) {
            if (params.product_type_id) {
                productsQuery = productsQuery.where('products.product_type_id', '=', Number(params.product_type_id))
            }
        }
            
        const products = await productsQuery
            .where('hidden', '!=', true)
            .select([
                'products.id',
                'products.name_en',
                'products.name_zh',
                'products.created_at',
                'products.features',
                'products.ingredients',
                'products.size',
                'products.sku',
                'products.target_users',
                'products.usage',
                'product_types.id as product_type_id',
                'product_types.name as product_type_name',
                'products.hidden'
            ])
            .orderBy('created_at', 'desc')
            .execute()        

        const productImagesQuery = db.selectFrom('product_images')
            .leftJoin('products', 'products.id', 'product_images.product_id')
            .select([
                'products.id as product_id',
                'product_images.id as id',
                'product_images.url',
                'product_images.order',
            ])
            .orderBy('id', 'desc')
            .orderBy('order', 'asc')

        const productImages = await productImagesQuery.execute()

        return products.map((product) => {
            return {
                ...product,
                images: productImages.filter((image) => image.product_id === product.id)
            }
        })
    }
    async getAll() {
        const productsQuery = db.selectFrom('products')
            .leftJoin('product_types', 'products.product_type_id', 'product_types.id')
            
        const products = await productsQuery
            .select([
                'products.id',
                'products.name_en',
                'products.name_zh',
                'products.created_at',
                'products.features',
                'products.ingredients',
                'products.size',
                'products.sku',
                'products.target_users',
                'products.usage',
                'product_types.id as product_type_id',
                'product_types.name as product_type_name',
                'products.hidden'
            ])
            .orderBy('created_at', 'desc')
            .execute()

        console.log('products', products);
        

        const productImagesQuery = db.selectFrom('product_images')
            .leftJoin('products', 'products.id', 'product_images.product_id')
            .select([
                'products.id as product_id',
                'product_images.id as id',
                'product_images.url',
                'product_images.order',
            ])
            .orderBy('id', 'desc')
            .orderBy('order', 'asc')

        const productImages = await productImagesQuery.execute()

        return products.map((product) => {
            return {
                ...product,
                images: productImages.filter((image) => image.product_id === product.id)
            }
        })
    }
    async getByIdClient({ id }: { id: number }) {
        const productsQuery = db.selectFrom('products')
            .leftJoin('product_types', 'products.product_type_id', 'product_types.id')
            .where('products.id', '=', id)
            .where('products.hidden', '!=', true)
            .select([
                'products.id',
                'products.name_en',
                'products.name_zh',
                'products.created_at',
                'products.features',
                'products.ingredients',
                'products.size',
                'products.sku',
                'products.target_users',
                'products.usage',
                'product_types.id as product_type_id',
                'product_types.name as product_type_name',
                'products.hidden'
            ])
            .orderBy('created_at', 'desc')

        const products = await productsQuery.execute()
            
        const productImagesQuery = db.selectFrom('product_images')
            .leftJoin('products', 'products.id', 'product_images.product_id')
            .select([
                'products.id as product_id',
                'product_images.id as id',
                'product_images.url',
                'product_images.order',
            ])
            .orderBy('id', 'desc')
            .orderBy('order', 'asc')

        const productImages = await productImagesQuery.execute()

        return products.map((product) => {
            return {
                ...product,
                images: productImages.filter((image) => image.product_id === product.id)
            }
        })
    }
    async getById({ id }: { id: number }) {
        const productsQuery = db.selectFrom('products')
            .leftJoin('product_types', 'products.product_type_id', 'product_types.id')
            .where('products.id', '=', id)
            .select([
                'products.id',
                'products.name_en',
                'products.name_zh',
                'products.created_at',
                'products.features',
                'products.ingredients',
                'products.size',
                'products.sku',
                'products.target_users',
                'products.usage',
                'product_types.id as product_type_id',
                'product_types.name as product_type_name',
                'products.hidden'
            ])
            .orderBy('created_at', 'desc')

        const products = await productsQuery.execute()
            
        const productImagesQuery = db.selectFrom('product_images')
            .leftJoin('products', 'products.id', 'product_images.product_id')
            .select([
                'products.id as product_id',
                'product_images.id as id',
                'product_images.url',
                'product_images.order',
            ])
            .orderBy('id', 'desc')
            .orderBy('order', 'asc')

        const productImages = await productImagesQuery.execute()

        return products.map((product) => {
            return {
                ...product,
                images: productImages.filter((image) => image.product_id === product.id)
            }
        })
    }
    async create({
        name_en,
        name_zh,
        size,
        sku,
        usage,
        ingredients,
        features,
        target_users,
        product_type_id,
        images,
        hidden,
    }: {
        name_en?: string,
        name_zh: string,
        size: string,
        sku: string,
        usage: string,
        ingredients: string,
        features: string,
        target_users: string,
        product_type_id?: number,
        images: { url: string, order: number }[],
        hidden?: boolean,
    }) {
        const values: any = {
            name_zh,
            size,
            sku,
            usage,
            ingredients,
            features,
            target_users,
        }
            
        if (name_en !== undefined) {
            values.name_en = name_en
        }

        if (product_type_id !== undefined) {
            values.product_type_id = Number(product_type_id)
        }

        if (hidden !== undefined) {
            values.hidden = hidden
        }

        const query = db.insertInto('products')
            .values(values)
            .returning('id')

        const row = await query.executeTakeFirst()

        if (row?.id) {
            await db.insertInto('product_images')
                .values(images.map((v) => ({
                    product_id: row.id,
                    url: v.url,
                    order: v.order,
                })))
                .execute()
        }

        return row
    }
    async update({
        id,
        name_en,
        name_zh,
        size,
        sku,
        usage,
        ingredients,
        features,
        target_users,
        product_type_id,
        images,
        hidden,
    }: {
        id: number,
        name_en?: string,
        name_zh?: string,
        size?: string,
        sku?: string,
        usage?: string,
        ingredients?: string,
        features?: string,
        target_users?: string,
        product_type_id?: number,
        images: { url: string, order: number }[],
        hidden?: boolean,
    }) {
        let query = db.updateTable('products')
            .where('id', '=', id)

        if (name_en !== undefined) {
            query = query.set('name_en', name_en)
        }

        if (name_zh !== undefined) {
            query = query.set('name_zh', name_zh)
        }

        if (size !== undefined) {
            query = query.set('size', size)
        }

        if (sku !== undefined) {
            query = query.set('sku', sku)
        }

        if (usage !== undefined) {
            query = query.set('usage', usage)
        }

        if (ingredients !== undefined) {
            query = query.set('ingredients', ingredients)
        }

        if (features !== undefined) {
            query = query.set('features', features)
        }

        if (target_users !== undefined) {
            query = query.set('target_users', target_users)
        }

        if (product_type_id !== undefined) {
            query = query.set('product_type_id', Number(product_type_id))
        }

        if (hidden !== undefined) {
            query = query.set('hidden', hidden)
        }
        
        const rows = await query.execute()

        if (images) {
            await db.deleteFrom('product_images')
                .where('product_id', '=', id)
                .execute()

            if (images.length > 0) {
                await db.insertInto('product_images')
                    .values(images.map((v) => ({
                        product_id: id,
                        url: v.url,
                        order: v.order,
                    })))
                    .execute()
            }
        }

        return true
    }
}

export default ProductsController
