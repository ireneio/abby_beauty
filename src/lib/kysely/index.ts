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
import PagePrivate from './models/PagePrivate'
import Trial from './models/Trial'
import TrialReservation from './models/TrialReservation'
import TrialImage from './models/TrialImage'
import Banner from './models/Banner'
import Service from './models/Service'
import CustomerComment from './models/CustomerComment'
import Brand from './models/Brand'
import JoinUs from './models/JoinUs'

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
  pages_private: PagePrivate,
  trials: Trial,
  trials_reservations: TrialReservation,
  trial_images: TrialImage,
  banners: Banner,
  services: Service,
  customer_comments: CustomerComment,
  brands: Brand,
  joinus: JoinUs,
}

export const db = createKysely<Database>({
  connectionString: process.env.POSTGRES_URL
})

export { sql } from 'kysely'
