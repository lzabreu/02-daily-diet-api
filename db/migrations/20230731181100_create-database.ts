/* eslint-disable prettier/prettier */
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('email').notNullable().unique()
    table.text('password').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.text('date').notNullable()
    table.text('time').notNullable()
    table.boolean('diet').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.text('user_id').references('id').inTable('users').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users')
  await knex.schema.dropTableIfExists('meals')
}
