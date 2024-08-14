import { createKysely } from '@vercel/postgres-kysely'
import ProductType from './models/ProductType'

// Keys of this interface are table names.
export interface Database {
  product_type: ProductType,
}

export const db = createKysely<Database>()
export { sql } from 'kysely'
