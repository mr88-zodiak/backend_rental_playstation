/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("sewa", (table) => {
    table.increments("id").primary();

    // Buat kolomnya dulu, baru pasang foreign key
    table.integer("id_user").unsigned().notNullable();
    table.foreign("id_user").references("id").inTable("users").onDelete("CASCADE");
    table.integer("id_product").unsigned().notNullable();
    table.foreign("id_product").references("id").inTable("products").onDelete("CASCADE");

    table.string("status");
    table.datetime("tgl_sewa");
    table.datetime("tgl_kembali");
    table.decimal("total", 14, 2).notNullable();
    table.decimal("denda", 14, 2).defaultTo(0);

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("sewa");
};
