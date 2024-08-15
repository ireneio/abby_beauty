import { createKysely } from '@vercel/postgres-kysely'
import ProductType from './models/ProductType'
import Admin from './models/Admin'
import Classes from './models/Classes'

// Keys of this interface are table names.
export interface Database {
  product_types: ProductType,
  admin: Admin,
  classes: Classes,
}

export const db = createKysely<Database>({
  connectionString: "postgres://default:qI3WkjC9uxTZ@ep-blue-unit-a1pbnu7c-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require",
})
export { sql } from 'kysely'
