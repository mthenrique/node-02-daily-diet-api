import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('is_on_diet').notNullable()
    table.dateTime('meal_date').notNullable()
    table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('deleted_at')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

