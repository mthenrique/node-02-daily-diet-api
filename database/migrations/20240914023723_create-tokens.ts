import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tokens', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.text('token').notNullable()
    table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('expired_at').notNullable()
    table.dateTime('revoked_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tokens')
}

