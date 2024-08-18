import { createKysely } from '@vercel/postgres-kysely'
import ProductType from './models/ProductType'
import Admin from './models/Admin'
import Classes from './models/Classes'
import ReservationDefaultDaysOfWeek from './models/ReservationDefaultDaysOfWeek'
import ReservationDefaultTime from './models/ReservationDefaultTime'
import ReservationAvailability from './models/ReservationAvailability'
import ReservationRecord from './models/ReservationRecord'
import ProductImage from './models/ProductImage'
import Product from './models/Product'
import Page from './models/Page'
import ClassType from './models/ClassType'

// Keys of this interface are table names.
export interface Database {
  product_types: ProductType,
  admin: Admin,
  classes: Classes,
  reservation_default_daysofweek: ReservationDefaultDaysOfWeek,
  reservation_default_time: ReservationDefaultTime,
  reservation_availability: ReservationAvailability,
  reservation_record: ReservationRecord,
  product_images: ProductImage,
  products: Product,
  pages: Page,
  class_types: ClassType,
}

export const db = createKysely<Database>({
  connectionString: "postgres://default:qI3WkjC9uxTZ@ep-blue-unit-a1pbnu7c-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require",
})
export { sql } from 'kysely'
