/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('movies', function (table) {
    table.increments('id').primary();
    table.string('title').notNullable();
  });
}

exports.down = function (knex) {
  return knex.schema.dropTable('movies');
};
