import {
	PostgresDialect,
} from 'kysely'
import { defineConfig } from 'kysely-ctl'
import { Pool } from 'pg'

export default defineConfig({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: "postgres://default:qI3WkjC9uxTZ@ep-blue-unit-a1pbnu7c-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require",
		}),
	}),
	migrations: {
		migrationFolder: "src/lib/kysely/migrations",
	},
	plugins: [],
	seeds: {
		seedFolder: "src/lib/kysely/seeds",
	}
})
