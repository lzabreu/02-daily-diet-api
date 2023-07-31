import { env } from './env'
import { knex as setupKnex, Knex } from 'knex'

export const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations/',
  },
}

export const knex = setupKnex(knexConfig)
